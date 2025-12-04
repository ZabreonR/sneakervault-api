import express from "express";
import cors from "cors";
import Joi from "joi";
import mongoose from "mongoose";
import { sneakers } from "./data/sneakers.js";

const app = express();

app.use(cors());
app.use(express.json());

//MONGODB CONNECT
mongoose.connect("mongodb+srv://zabreon_db_user:AuMhU6ZDr6cT6o0Q@cluster0.gpvy0sl.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// MONGOOSE SCHEMA & MODEL
const sneakerMongoSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  condition: String,
  release_year: Number,
  image: String,
});

const SneakerModel = mongoose.model("Sneaker", sneakerMongoSchema);

// JOI VALIDATION MATCHED TO MONGO FIELDS
const sneakerJoiSchema = Joi.object({
  name: Joi.string().min(2).required(),
  brand: Joi.string().min(2).required(),
  price: Joi.number().min(1).max(5000).required(),
  condition: Joi.string().valid("New", "Like New", "Used").required(),
  release_year: Joi.number().integer().min(1900).required(),
  image: Joi.string().min(2).required(),
});

// GET ROUTE
app.get("/api/sneakers", async (req, res) => {
  try {
    const fromDB = await SneakerModel.find().lean();
    if (fromDB.length > 0) {
      return res.json(fromDB);
    }
    return res.json(sneakers);
  } catch (err) {
    console.error("Error fetching sneakers:", err);
    res.status(500).json({ message: "Server error fetching sneakers" });
  }
});

//POST (SAVE TO MONGO NOW PERSISTENT)
app.post("/api/sneakers", async (req, res) => {
  const { error, value } = sneakerJoiSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const saved = await SneakerModel.create(value);
    return res.status(200).json(saved);
  } catch (err) {
    console.error("Error saving sneaker:", err);
    res.status(500).json({ message: "Server error saving sneaker" });
  }
});

// PUT (EDIT PERSISTS TO MONGO)
app.put("/api/sneakers/:id", async (req, res) => {
  const sneakerId = req.params.id;

  const { error, value } = sneakerJoiSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const updated = await SneakerModel.findByIdAndUpdate(sneakerId, value, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Sneaker not found" });
    }
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating sneaker:", err);
    res.status(500).json({ message: "Server error updating sneaker" });
  }
});

//DELETE (ALSO PERSISTENT NOW)
app.delete("/api/sneakers/:id", async (req, res) => {
  const sneakerId = req.params.id;

  try {
    const deleted = await SneakerModel.findByIdAndDelete(sneakerId);
    if (!deleted) {
      return res.status(404).json({ message: "Sneaker not found" });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error deleting sneaker:", err);
    res.status(500).json({ message: "Server error deleting sneaker" });
  }
});

//START SERVER
const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));