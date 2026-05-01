import express from "express";
import axios from "axios";
import cron from "node-cron";
import cors from "cors";
import dotenv from "dotenv";
import Rate from "./models/rate.js";
import YearlyRate from "./models/yearlyrate.js";
import mongoose from "mongoose";
import https from "https";


dotenv.config();

function keepAlive() {
  const ping = () => {
    https.get("https://myinvester.onrender.com/latest", (res) => {
      console.log("Keep-alive ping:", res.statusCode);
    }).on("error", (err) => {
      console.log("Keep-alive error:", err.message);
    });
  };

  ping(); // hemen bir kez çalıştır
  setInterval(ping, 10 * 60 * 1000); // sonra her 10 dakikada bir
}

console.log(mongoose.connection === Rate.db); // true mu false mu?

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



//Saatlik veri
cron.schedule("0 * * * *", async () => {
  console.log("Saatlik veri çekiliyor:", new Date());

  const latest = await getLatestRates();
  if (!latest) return;

  const converted = convertToTRY(latest);

  // 24 saatten eski kayıtları sil
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await Rate.deleteMany({ createdAt: { $lt: oneDayAgo } });

  await Rate.create({ rates: converted });

  console.log("DB kaydedildi");


});



//Günlük veri
cron.schedule("1 0 * * *", async () => {
  console.log("---------------------");
  console.log("Cron Görevi Başladı: Döviz Kurları Güncelleniyor...");

  // ✅ today'i en dışa al, her iki try bloğu da erişebilsin
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ── Bölüm 1: Kurları çek ve kaydet ──────────────────────────
  try {
    const data = await getLatestRates();
    if (!data) throw new Error("API'den veri alınamadı.");

    const converted = convertToTRY(data);

    await Rate.findOneAndUpdate({}, { rates: converted }, { upsert: true });

    await YearlyRate.findOneAndUpdate(
      { date: today },
      { rates: converted },
      { upsert: true }
    );

    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - 365);
    const deletedCount = await YearlyRate.deleteMany({ date: { $lt: limitDate } });

    console.log(`Cron Başarılı: ${today.toLocaleDateString()} verisi kaydedildi.`);
    console.log(`Eski Veri Temizliği: ${deletedCount.deletedCount} adet eski kayıt silindi.`);

  } catch (err) {
    console.error("Cron hatası:", err.message);
  }

  console.log("---------------------");
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
     const data = await Rate.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/rates/:period", async (req, res) => {
  try {
    const days = { weekly: 7, monthly: 30, "monthly3": 90, yearly: 365 };
    
    // Geçersiz period gelirse hata ver
    if (!days[req.params.period]) {
      return res.status(400).json({ error: "Geçersiz periyot" });
    }

    const date = new Date();
    date.setDate(date.getDate() - days[req.params.period]);

    const data = await YearlyRate.find({ date: { $gte: date } }).sort({ date: 1 });
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




/*
/api/rates/latest     → en güncel kur
/api/rates/weekly     → son 7 gün
/api/rates/monthly    → son 30 gün
/api/rates/3monthly   → son 90 gün
/api/rates/yearly     → son 365 gün
*/

// 🔥 KRİTİK FIX
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Mongo bağlandı ✅");
    keepAlive(); 

    app.listen(process.env.PORT || 3000, () => {
      console.log("Server çalışıyor 🚀");
    });



  } catch (err) {
    console.error("Mongo bağlantı hatası ❌", err);
  }
}

startServer();


