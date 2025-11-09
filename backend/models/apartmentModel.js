import mongoose from "mongoose";

const apartmentSchema = mongoose.Schema({
  name: { type: String, required: true },
  floor: { type: Number, required: true }
}, { timestamps: true });

const Apartment = mongoose.model("Apartment", apartmentSchema);
export default Apartment;
