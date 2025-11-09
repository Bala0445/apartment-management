import Maintenance from "../models/maintenanceModel.js";

export const getRequests = async (req, res) => {
  try {
    const requests = await Maintenance.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRequest = async (req, res) => {
  try {
    const request = new Maintenance(req.body);
    const savedRequest = await request.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id);
    res.json({ message: "Maintenance request deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
