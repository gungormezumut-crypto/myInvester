import express from "express";
import axios from "axios";
import cron from "node-cron";
import cors from "cors";
import dotenv from "dotenv";
import Rate from "./models/rate.js";
import mongoose from "mongoose";

console.log(mongoose.connection === Rate.db); // true mu false mu?

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



// API'den veri çek
async function getLatestRates() {
  try {
    const res = await axios.get(
      "https://openexchangerates.org/api/latest.json",
      {
        params: { app_id: process.env.APP_ID }
      }
    );

    return res.data;
  } catch (err) {
    console.error("API ERROR:", err.message);
    return null;
  }
}

// TRY'ye çevir
function convertToTRY(data) {
  const rates = data.rates;
  const tryRate = rates["TRY"];

  const result = {};

  for (const [symbol, rateToUSD] of Object.entries(rates)) {
    result[symbol] = symbol === "TRY" ? 1 : tryRate / rateToUSD;
  }

  return result;
}

// CRON
cron.schedule("0 * * * *", async () => {
  console.log("Saatlik veri çekiliyor:", new Date());

  const latest = await getLatestRates();
  if (!latest) return;

  const converted = convertToTRY(latest);

  await Rate.create({ rates: converted });

  console.log("DB kaydedildi");
});

// ROUTES
function requireDB(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Veritabanı bağlantısı henüz hazır değil" });
  }
  next();
}

// Route'lara ekle
app.get("/latest", requireDB, async (req, res) => {
  try {
    const data = await Rate.findOne().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/history", requireDB, async (req, res) => {
  try {
    const data = await Rate.find().sort({ createdAt: -1 }).limit(24);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 KRİTİK FIX
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Mongo bağlandı ✅");

    app.listen(process.env.PORT || 3000, () => {
      console.log("Server çalışıyor 🚀");
    });

  } catch (err) {
    console.error("Mongo bağlantı hatası ❌", err);
  }
}

startServer();

