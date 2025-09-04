import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import pgRoutes from "./routes/pgRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
// Debug: Log Cloudinary env variables (remove in production)
console.log('Cloudinary ENV:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '***' : undefined
});
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/pgs", pgRoutes);
app.use("/admin", adminRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pgfinder")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
