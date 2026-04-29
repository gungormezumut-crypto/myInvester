import express from "express";
import axios from "axios";
import cron from "node-cron";
import cors from "cors";
import dotenv from "dotenv";
import Rate from "./models/rate.js";
import YearlyRate from "./models/yearlyrate.js";
import mongoose from "mongoose";
import https from "https";
import fs from "fs";
import path from "path";

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

      // Güncel 24 saatlik veriyi çek
    const ratesForJson = await Rate.find({
      createdAt: { $gte: oneDayAgo }
    }).sort({ createdAt: 1 });

    // --- JSON DOSYASINA YAZMA İŞLEMİ ---
    const dir = "./datasets";
    const filePath = path.join(dir, "hourly.json");

    try {
    // Klasör kontrolü
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // writeFileSync: Dosya varsa içini tamamen boşaltır (sıfırlar) ve yeni datayı yazar.
    fs.writeFileSync(filePath, JSON.stringify(ratesForJson, null, 2), "utf-8");
      
      console.log(`✅ İşlem Başarılı: ${ratesForJson.length} kayıt hourly.json dosyasına sıfırdan yazıldı.`);
    } catch (err) {
      console.error("❌ Dosya yazılırken hata oluştu:", err);
    }


});



//Günlük veri
cron.schedule("1 0 * * *", async () => {
  console.log("---------------------");
  console.log("Cron Görevi Başladı: Döviz Kurları Güncelleniyor...");
  
  try {
    const data = await getLatestRates();
    if (!data) throw new Error("API'den veri alınamadı.");

    const converted = convertToTRY(data);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Ana modelini güncelle (En son veri için)
    await Rate.findOneAndUpdate({}, { rates: converted }, { upsert: true });

    // 2. Geçmiş (YearlyRate) modeline ekle veya güncelle
    await YearlyRate.findOneAndUpdate(
      { date: today },
      { rates: converted },
      { upsert: true }
    );

    // 3. 365 günden eski verileri temizle (Veritabanını hafif tutar)
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - 365);
    const deletedCount = await YearlyRate.deleteMany({ date: { $lt: limitDate } });

    console.log(`Cron Başarılı: ${today.toLocaleDateString()} verisi kaydedildi.`);
    console.log(`Eski Veri Temizliği: ${deletedCount.deletedCount} adet eski kayıt silindi.`);
    
  } catch (err) {
    console.error("Cron hatası:", err.message);
  }
  console.log("---------------------");

  // Filtreleme tarihleri
const periods = [
  { 
    name: "weekly", 
    date: new Date(new Date().setDate(today.getDate() - 7)) 
  },
  { 
    name: "monthly", 
    date: new Date(new Date().setMonth(today.getMonth() - 1)) 
  },
  { 
    name: "3monthly", 
    date: new Date(new Date().setMonth(today.getMonth() - 3)) 
  },
  { 
    name: "yearly", 
    date: new Date(new Date().setFullYear(today.getFullYear() - 1)) 
  }
];


 try {
  // Klasör kontrolü
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 2. Her periyot için DB'den çek ve JSON'a yaz
  for (const period of periods) {
    const data = await YearlyRate.find({
      date: { $gte: period.date }
    }).sort({ date: 1 });

    const filePath = path.join(dir, `${period.name}.json`);

    // fs.writeFileSync dosyayı her seferinde sıfırlar ve temiz veri yazar
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    
    console.log(`✅ ${period.name}.json güncellendi (${data.length} kayıt).`);
  }
} catch (error) {
  console.error("❌ JSON dosyaları yazılırken hata oluştu:", error);
}

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
    keepAlive(); 

    app.listen(process.env.PORT || 3000, () => {
      console.log("Server çalışıyor 🚀");
    });



  } catch (err) {
    console.error("Mongo bağlantı hatası ❌", err);
  }
}

startServer();


