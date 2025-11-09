import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import apartmentRoutes from "./routes/apartmentRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import Bill from "./models/billModel.js";
import Maintenance from "./models/maintenanceModel.js";
import Apartment from "./models/apartmentModel.js";
import User from "./models/userModel.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// SSE clients
const sse = { bills: [], maintenance: [], apartments: [] };
const send = (res, data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

// SSE endpoints
app.get("/sse/bills", (req, res) => {
  res.set({ "Content-Type": "text/event-stream", "Cache-Control":"no-cache", Connection: "keep-alive" });
  res.flushHeaders();
  sse.bills.push(res);
  req.on("close", () => { sse.bills = sse.bills.filter(r => r !== res); });
});
app.get("/sse/maintenance", (req, res) => {
  res.set({ "Content-Type": "text/event-stream", "Cache-Control":"no-cache", Connection: "keep-alive" });
  res.flushHeaders();
  sse.maintenance.push(res);
  req.on("close", () => { sse.maintenance = sse.maintenance.filter(r => r !== res); });
});
app.get("/sse/apartments", (req, res) => {
  res.set({ "Content-Type": "text/event-stream", "Cache-Control":"no-cache", Connection: "keep-alive" });
  res.flushHeaders();
  sse.apartments.push(res);
  req.on("close", () => { sse.apartments = sse.apartments.filter(r => r !== res); });
});

// helper broadcasts
const broadcastBills = async () => {
  const list = await Bill.find().sort({ createdAt: -1 });
  sse.bills.forEach(r => send(r, list));
};
const broadcastMaintenance = async () => {
  const list = await Maintenance.find().sort({ createdAt: -1 });
  sse.maintenance.forEach(r => send(r, list));
};
const broadcastApartments = async () => {
  const list = await Apartment.find().sort({ createdAt: -1 });
  sse.apartments.forEach(r => send(r, list));
};

// Standard routes (we'll patch create/delete endpoints to call broadcasts)
app.use("/api/users", userRoutes);

// For apartments/bills/maintenance we will re-create small wrappers to broadcast after changes
app.get("/api/apartments", async (req, res, next) => {
  // protect could be added; for now frontend includes token
  // delegate to route
  try {
    const list = await Apartment.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { next(err); }
});
app.post("/api/apartments", async (req, res, next) => {
  try {
    const { name, floor } = req.body;
    const ap = await Apartment.create({ name, floor });
    await broadcastApartments();
    res.status(201).json(ap);
  } catch (err) { next(err); }
});

app.get("/api/bills", async (req, res, next) => {
  try {
    const list = await Bill.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { next(err); }
});
app.post("/api/bills", async (req, res, next) => {
  try {
    const { apartment, floor, rent, maintenance } = req.body;
    const b = await Bill.create({ apartment, floor, rent, maintenance });
    await broadcastBills();
    res.status(201).json(b);
  } catch (err) { next(err); }
});
app.delete("/api/bills/:id", async (req, res, next) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    await broadcastBills();
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
});

app.get("/api/maintenance", async (req, res, next) => {
  try {
    const list = await Maintenance.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { next(err); }
});
app.post("/api/maintenance", async (req, res, next) => {
  try {
    const { apartment, floor, request } = req.body;
    const m = await Maintenance.create({ apartment, floor, request });
    await broadcastMaintenance();
    res.status(201).json(m);
  } catch (err) { next(err); }
});
app.delete("/api/maintenance/:id", async (req, res, next) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id);
    await broadcastMaintenance();
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
});

// seed default tenant
const seedTenant = async () => {
  try {
    const existing = await User.findOne({ username: "tenant" });
    if (!existing) {
      await User.create({ username: "tenant", password: "tenant123" });
      console.log("Seeded tenant: tenant / tenant123");
    }
  } catch (err) { console.error("Seed error:", err.message); }
};
seedTenant();

// default home
app.get("/", (req, res) => res.send("MB Restaurant API running"));

// error handler
app.use((err, req, res, next) => {
  console.error("Error:", err?.stack || err || "Unknown");
  res.status(500).json({ message: err?.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
