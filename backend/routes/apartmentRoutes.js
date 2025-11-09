import express from "express";
import Apartment from "../models/apartmentModel.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// List apartments (both)
router.get("/", protect, async (req, res) => {
  const list = await Apartment.find().sort({ createdAt: -1 });
  res.json(list);
});

// Add apartment (manager only)
router.post("/", protect, async (req, res) => {
  if (req.user.role !== "manager") return res.status(403).json({ message: "Only manager" });
  const { name, floor } = req.body;
  if (!name || floor === undefined) return res.status(400).json({ message: "Missing fields" });
  const ap = await Apartment.create({ name, floor });
  res.status(201).json(ap);
});

export default router;
