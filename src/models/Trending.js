import mongoose from "mongoose";

const TrendingSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String, // Stored as base64
  position: Number,
  visible: { type: Boolean, default: true },
});

export default mongoose.models.Trending ||
  mongoose.model("Trending", TrendingSchema);
