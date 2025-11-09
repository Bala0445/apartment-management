import express from "express";
import Maintenance from "../models/maintenanceModel.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// list (both)
router.get("/", protect, async (req, res) => {
  const list = await Maintenance.find().sort({ createdAt: -1 });
  res.json(list);
});

// create (tenant posts)
router.post("/", protect, async (req, res) => {
  // both tenant and manager can post but typically tenant
  const { apartment, floor, request } = req.body;
  if (!apartment || floor === undefined || !request) return res.status(400).json({ message: "Missing fields" });
  const m = await Maintenance.create({ apartment, floor, request });
  res.status(201).json(m);
});

// delete (manager)
router.delete("/:id", protect, async (req, res) => {
  if (req.user.role !== "manager") return res.status(403).json({ message: "Only manager" });
  await Maintenance.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
