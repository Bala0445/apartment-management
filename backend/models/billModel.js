import mongoose from "mongoose";

const billSchema = mongoose.Schema({
  apartment: { type: String, required: true }, // apartment name
  floor: { type: Number, required: true },
  rent: { type: Number, required: true },
  maintenance: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
