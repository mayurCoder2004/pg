import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },        // Cloudinary secure URL
  public_id: { type: String, required: true },  // Cloudinary ID (for deletion)
});

const pgSchema = new mongoose.Schema({
  pgName: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  sharing: { type: String, required: true },
  foodType: {
    type: String,
    enum: ["Veg", "Non-Veg", "Veg/Non Veg"],
    required: true,
  },
  amenities: [String],
  photos: [mediaSchema], // ✅ array of objects
  videos: [mediaSchema], // ✅ array of objects
  reviews: [
    {
      student: String,
      comment: String,
      rating: Number,
    },
  ],
}, { timestamps: true }); // optional but useful

const PG = mongoose.model("PG", pgSchema);
export default PG;
