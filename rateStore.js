// stores/rateStore.js
import { defineStore } from "pinia";
import { getDaily, getRates } from "./api.js";

export const useRateStore = defineStore("rate", {
  state: () => ({
    daily: null,
    weekly: null,
    monthly: null,
    loaded: false,
  }),

  actions: {
    async fetchAll() {
      if (this.loaded) return; // tekrar çağırma

      const [daily, weekly, monthly ,monthly3, yearly] = await Promise.all([
        getDaily(),
        getRates("weekly"),
        getRates("monthly"),
        getRates("monthly3"),
        getRates("yearly"),
      ]);

      this.daily = daily;
      this.weekly = weekly;
      this.monthly = monthly;
      this.monthly3 = monthly3;
      this.yearly = yearly;

      this.loaded = true;
    },
  },
});