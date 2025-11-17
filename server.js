import express from "express";
import cors from "cors";
import Joi from "joi";
import path from "path";
import { fileURLToPath } from "url";
import sneakers from "./data/sneakers.js";

const app = express();
app.use(express.json());
app.use(cors());

// Fix path for index.html on Render
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Joi validation schema
const sneakerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  price: Joi.number().min(1).required(),
  condition: Joi.string().min(2).required(),
  img_name: Joi.string().min(3).required()
});

// === ROUTES ===

// Get all sneakers
app.get("/api/sneakers", (req, res) => {
  res.json(sneakers);
});

// Get sneaker by ID
app.get("/api/sneakers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const sneaker = sneakers.find((s) => s.id === id);

  if (!sneaker) {
    return res.status(404).json({ message: "Sneaker not found" });
  }

  res.json(sneaker);
});

// POST new sneaker
app.post("/api/sneakers", (req, res) => {
  const { error, value } = sneakerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const newSneaker = {
    id: sneakers.length + 1,
    ...value
  };

  sneakers.push(newSneaker);

  res.json({
    message: "Sneaker added successfully",
    sneaker: newSneaker
  });
});

// Serve homepage for API
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// PORT for render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));