import mongoose from "mongoose";

const maintenanceSchema = mongoose.Schema({
  apartment: { type: String, required: true },
  floor: { type: Number, required: true },
  request: { type: String, required: true },
  status: { type: String, enum: ["Open","In Progress","Done"], default: "Open" },
  createdAt: { type: Date, default: Date.now }
});

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
export default Maintenance;
