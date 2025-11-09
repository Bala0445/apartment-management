import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  apartmentName: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Bill", billSchema);
