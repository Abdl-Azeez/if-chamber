import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  image: { type: String }, // Base64-encoded image
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
