import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  image: { type: String }, 
  visible: { type: Boolean, default: true },
  showInHero: { type: Boolean, default: false },
  source: {type: String},
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.News || mongoose.model("News", NewsSchema);
