// src/api.js


const BASE_URL = "https://myinvester.onrender.com";

export const getDaily = async () => {
  const res = await fetch(`${BASE_URL}/latest`);
  const data = await res.json();
  return data;
};

export const getRates = async (period) => {
  const res = await fetch(`${BASE_URL}/api/rates/${period}`);
  const data = await res.json();
  return data;
};


/*
/api/rates/latest     → en güncel kur
/api/rates/weekly     → son 7 gün
/api/rates/monthly    → son 30 gün
/api/rates/3monthly   → son 90 gün
/api/rates/yearly     → son 365 gün
*/
