import express from "express";
import cors from "cors";
import Joi from "joi";
import { sneakers } from "./data/sneakers.js";

const app = express();

app.use(cors());
app.use(express.json());

// ------------------ VALIDATION SCHEMA ------------------
const sneakerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  brand: Joi.string().min(2).required(),
  price: Joi.number().min(1).required(),
  condition: Joi.string().min(2).required(),
  release_year: Joi.number().min(1900).required(),
  image: Joi.string().min(2).required(),
});

// ------------------ GET ROUTE ------------------
app.get("/api/sneakers", (req, res) => {
  res.json(sneakers);
});

// ------------------ POST ROUTE ------------------
app.post("/api/sneakers", (req, res) => {
  const { error } = sneakerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const newSneaker = {
    id: sneakers.length + 1,
    ...req.body,
  };

  sneakers.push(newSneaker);

  res.json({ success: true, sneaker: newSneaker });
});

// ------------------ START SERVER ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
