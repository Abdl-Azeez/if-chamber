import mongoose from "mongoose";

const HeroSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // Base64-encoded image
  buttons: [
    {
      label: { type: String },
      link: { type: String },
      color: { type: String },
    },
  ],
  visible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Hero || mongoose.model("Hero", HeroSchema);
