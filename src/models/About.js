import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    bgColor: { type: String, default: "#92751B" }, // default brand gold
    bgImage: { type: String, default: "" }, // optional background image
  },
  mission: { type: String, default: "" },
  vision: { type: String, default: "" },
  story: {
    text: { type: String, default: "" },
    image: { type: String, default: "" }, // optional image
  },
  team: [
    {
      name: { type: String, required: true },
      role: { type: String, required: true },
      image: { type: String, default: "" }, // optional profile image
    },
  ],
  description: { type: String, default: "" }, // legacy fallback
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.About || mongoose.model("About", AboutSchema); 