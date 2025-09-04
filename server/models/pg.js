import mongoose from "mongoose";

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
  photos: [String],
  videos: [String],
  reviews: [
    {
      student: String,
      comment: String,
      rating: Number,
    },
  ],
});

const PG = mongoose.model("PG", pgSchema);
export default PG;
