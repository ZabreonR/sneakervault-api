import express from "express";
import cors from "cors";
import Joi from "joi";
import { sneakers } from "./data/sneakers.js";

const app = express();

app.use(cors());
app.use(express.json());

// ------------------ VALIDATION SCHEMA ------------------
const sneakerSchema = Joi.object({
  // allow id in the body (for updates) but don't require it
  id: Joi.number().integer().min(1).optional(),
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
  const { error, value } = sneakerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const newSneaker = {
    id: sneakers.length + 1,
    ...value,
  };

  sneakers.push(newSneaker);

  res.json({ success: true, sneaker: newSneaker });
});

// ------------------ PUT ROUTE (EDIT) ------------------
app.put("/api/sneakers/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = sneakers.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Sneaker not found" });
  }

  // validate incoming data
  const { error, value } = sneakerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // merge existing with new values, but keep id from params
  const updatedSneaker = {
    ...sneakers[index],
    ...value,
    id,
  };

  sneakers[index] = updatedSneaker;

  // 200 with updated sneaker (client updates without refresh)
  return res.status(200).json(updatedSneaker);
});

// ------------------ DELETE ROUTE ------------------
app.delete("/api/sneakers/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = sneakers.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Sneaker not found" });
  }

  sneakers.splice(index, 1);

  // 200 to indicate success
  return res.status(200).json({ success: true, message: "Sneaker deleted" });
});

// ------------------ START SERVER ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));