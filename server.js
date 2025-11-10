import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { sneakers } from "./data/sneakers.js";
import { team } from "./data/team.js";

// Fix for ES module path issues
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

// === Middleware ===
app.use(cors());
app.use(express.json());

// === Serve static files from /public folder ===
app.use(express.static(path.join(__dirname, "public")));

// === API ROUTES ===

// ✅ All sneakers
app.get("/api/sneakers", (req, res) => {
  res.json(sneakers);
});

// ✅ Single sneaker by ID
app.get("/api/sneakers/:id", (req, res) => {
  const sneaker = sneakers.find((s) => s.id === parseInt(req.params.id));
  if (!sneaker) {
    return res.status(404).json({ message: "Sneaker not found" });
  }
  res.json(sneaker);
});

// ✅ All team members
app.get("/api/team", (req, res) => {
  res.json(team);
});

// ✅ Single team member by ID
app.get("/api/team/:id", (req, res) => {
  const member = team.find((m) => m.id === parseInt(req.params.id));
  if (!member) {
    return res.status(404).json({ message: "Team member not found" });
  }
  res.json(member);
});

// ✅ Root route — show API homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`✅ SneakerVault API running at: http://localhost:${PORT}`);
});