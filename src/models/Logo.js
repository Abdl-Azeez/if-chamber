import mongoose from "mongoose";

const LogoSchema = new mongoose.Schema({
  image: { type: String, required: true }, // Store image in base64
  type: {
    type: String,
    enum: ["dashboard", "site"],
    required: true,
    unique: true,
  }, // Ensures only one per type
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Logo || mongoose.model("Logo", LogoSchema);
