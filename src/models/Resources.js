import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String},
  fileUrl: { type: String, required: true },
  fileSize: { type: String, required: true },
  fileType: { type: String, required: true },
  category: { type: String },
  source: {type: String},
  thumbnail: { type: String, default: null }, 
  thumbnailType: { type: String, default: null },
  hasThumbnail: { type: Boolean, default: false },
  visible: { type: Boolean, default: true }, 
}, { timestamps: true }); 

export default mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);
