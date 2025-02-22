const mongoose = require("mongoose");

const TrendingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String, default: "" },
    linkTitle: { type: String, default: "" },
    position: { type: Number, required: true },
  },
  { strict: false }
);

const Trending =
  mongoose.models.Trending || mongoose.model("Trending", TrendingSchema);
export default Trending;
