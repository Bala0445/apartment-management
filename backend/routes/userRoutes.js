import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const router = express.Router();

const MANAGER = { username: "manager", password: "manager123", role: "manager" };

// login (manager hardcoded OR tenant from DB)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Missing credentials" });

  if (username === MANAGER.username && password === MANAGER.password) {
    const token = jwt.sign({ username: MANAGER.username, role: MANAGER.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ username: MANAGER.username, role: MANAGER.role, token });
  }

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user._id, role: "tenant" }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ _id: user._id, username: user.username, role: "tenant", token });
});

// optional register tenant (not used by hardcoded login)
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ message: "User exists" });
  const user = await User.create({ username, password });
  const token = jwt.sign({ id: user._id, role: "tenant" }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ _id: user._id, username: user.username, role: "tenant", token });
});

export default router;
