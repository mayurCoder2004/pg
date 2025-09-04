import dotenv from "dotenv";
dotenv.config();

import express from "express";
import PG from "../models/pg.js";
import multer from "multer";
import { storage, cloudinary } from "../config/cloudinaryConfig.js";

const router = express.Router();
const upload = multer({ storage });

// GET all PGs
router.get("/", async (req, res) => {
  try {
    const pgs = await PG.find();
    res.json(pgs);
  } catch (err) {
    console.error("Error fetching PGs:", err.stack || err);
    res.status(500).json({ error: "Failed to fetch PGs", details: err.message });
  }
});

// POST new PG
router.post(
  "/",
  upload.fields([{ name: "photos" }, { name: "videos" }]),
  async (req, res) => {
    try {
      const { pgName, location, price, sharing, foodType, amenities } = req.body;

      // Map photos and videos from multer-storage-cloudinary
      const photos = req.files["photos"]?.map(file => ({
        url: file.path,       // Cloudinary URL
        public_id: file.filename // Cloudinary public_id
      })) || [];

      const videos = req.files["videos"]?.map(file => ({
        url: file.path,
        public_id: file.filename
      })) || [];

      const newPG = new PG({
        pgName,
        location,
        price: Number(price),
        sharing,
        foodType,
        amenities: amenities ? amenities.split(",").map(a => a.trim()) : [],
        photos,
        videos
      });

      await newPG.save();
      res.json({ message: "PG Added ✅", pg: newPG });
    } catch (err) {
      console.error("Error saving PG:", err.stack || err);
      res.status(500).json({ error: "Failed to save PG", details: err.message });
    }
  }
);

// DELETE PG and its media from Cloudinary
router.delete("/:id", async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ error: "PG not found" });

    // Delete photos
    for (const photo of pg.photos) {
      await cloudinary.uploader.destroy(photo.public_id, { resource_type: "image" });
    }

    // Delete videos
    for (const video of pg.videos) {
      await cloudinary.uploader.destroy(video.public_id, { resource_type: "video" });
    }

    await PG.findByIdAndDelete(req.params.id);
    res.json({ message: "PG Deleted ❌" });
  } catch (err) {
    console.error("Error deleting PG:", err.stack || err);
    res.status(500).json({ error: "Failed to delete PG", details: err.message });
  }
});

export default router;
