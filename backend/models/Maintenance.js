import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema({
  tenantName: { type: String, required: true },
  request: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Maintenance", maintenanceSchema);
