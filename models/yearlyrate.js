import mongoose from "../db.js";

const yearlyRateSchema = new mongoose.Schema(
  {
    // O günün tüm kurlarını içeren obje: { USD: 1, EUR: 0.95, ... }
    rates: { type: Object, required: true },
    // Hangi güne ait olduğu
    date: { type: Date, required: true, unique: true }
  },
  { timestamps: true }
);

export default mongoose.model("YearlyRate", yearlyRateSchema);