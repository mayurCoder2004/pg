import express from "express";
import multer from "multer";
import PG from "../models/PG.js";
import path from "path";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("video")) {
      cb(null, "uploads/videos/");
    } else {
      cb(null, "uploads/photos/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Get all PGs
router.get("/", async (req, res) => {
  try {
    const pgs = await PG.find();
    res.json(pgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch PGs" });
  }
});

// Add new PG
router.post(
  "/",
  upload.fields([{ name: "photos" }, { name: "videos" }]),
  async (req, res) => {
    try {
      const { pgName, location, price, sharing, foodType, amenities } = req.body;

      const newPG = new PG({
        pgName,
        location,
        price: Number(price),
        sharing,
        foodType,
        amenities: amenities ? amenities.split(",").map((a) => a.trim()) : [],
        photos: req.files["photos"]
          ? req.files["photos"].map((f) => `/uploads/photos/${f.filename}`)
          : [],
        videos: req.files["videos"]
          ? req.files["videos"].map((f) => `/uploads/videos/${f.filename}`)
          : [],
      });

      await newPG.save();
      res.json({ message: "PG Added ✅", pg: newPG });
    } catch (err) {
      console.error("Error saving PG:", err);
      res.status(500).json({ error: "Failed to save PG" });
    }
  }
);

// Delete PG
router.delete("/:id", async (req, res) => {
  try {
    await PG.findByIdAndDelete(req.params.id);
    res.json({ message: "PG Deleted ❌" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete PG" });
  }
});

export default router;
