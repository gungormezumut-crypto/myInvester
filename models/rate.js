import mongoose from "../db.js"; // artık aynı instance

const rateSchema = new mongoose.Schema(
  { rates: Object },
  { timestamps: true }
);

export default mongoose.model("Rate", rateSchema);