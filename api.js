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