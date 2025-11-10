import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { sneakers } from "./data/sneakers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000; // ✅ Use environment port first

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// === API ROUTES ===
app.get("/api/sneakers", (req, res) => {
  res.json(sneakers);
});

app.get("/api/sneakers/:id", (req, res) => {
  const sneaker = sneakers.find((s) => s.id === parseInt(req.params.id));
  if (!sneaker) return res.status(404).json({ message: "Sneaker not found" });
  res.json(sneaker);
});

// === Root route ===
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// === Start server ===
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ SneakerVault API running on port ${PORT}`);
});