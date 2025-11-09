import express from "express";
import Bill from "../models/billModel.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// list bills (both)
router.get("/", protect, async (req, res) => {
  const bills = await Bill.find().sort({ createdAt: -1 });
  res.json(bills);
});

// create bill (manager only)
router.post("/", protect, async (req, res) => {
  if (req.user.role !== "manager") return res.status(403).json({ message: "Only manager" });
  const { apartment, floor, rent, maintenance } = req.body;
  if (!apartment || floor === undefined || rent === undefined || maintenance === undefined)
    return res.status(400).json({ message: "Missing fields" });
  const bill = await Bill.create({ apartment, floor, rent, maintenance });
  res.status(201).json(bill);
});

// delete bill (manager)
router.delete("/:id", protect, async (req, res) => {
  if (req.user.role !== "manager") return res.status(403).json({ message: "Only manager" });
  await Bill.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
