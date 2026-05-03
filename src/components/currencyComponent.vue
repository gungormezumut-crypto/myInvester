<template>
<div :class='[height , width]' class="rounded-xl shadow-[0_7px_29px_0_rgba(17,146,13,0.2)] p-3 ">
<div v-if="btns == true" class="flex gap-5 mt-3 mb-1 mx-3">
<button @click="selectedPick('yearly')"   :class="selected == 'yearly' ? '!bg-green-500/85' : ''" class="w-30 rounded-4xl text-center py-2 bg-green-500/45 text-white rounded">Yıllık</button>
<button @click="selectedPick('monthly3')" :class="selected == 'monthly3' ? '!bg-green-500/85' : ''" class="w-30 rounded-4xl text-center py-2 bg-green-500/45 text-white rounded">3 Aylık</button>
<button @click="selectedPick('monthly')"  :class="selected == 'monthly' ? '!bg-green-500/85' : ''" class="w-30 rounded-4xl text-center py-2 bg-green-500/45 text-white rounded">Aylık</button>
<button @click="selectedPick('weekly')"   :class="selected == 'weekly' ? '!bg-green-500/85' : ''" class="w-30 rounded-4xl text-center py-2 bg-green-500/45 text-white rounded">Haftalık</button>
<button @click="selectedPick('daily')"    :class="selected == 'daily' ? '!bg-green-500/85' : ''" class="w-30 rounded-4xl text-center py-2 bg-green-500/45 text-white rounded">Günlük</button>

</div> 
<div :id="chartid"></div>
</div>
</template>


<script>

import ApexCharts from 'apexcharts';
import { useRateStore } from "../../rateStore";



export default{


    setup() {
       
        const store = useRateStore();
        return { store };
      },


    props:['height','width','chartType','chartid','btns'],

    data(){
        return{
            currency: "USD",
            selected: "daily",
            chartInstance: null,
        }
    },
    
    computed: {
    daily() {
    return this.store.daily;
    },
      weekly() {
    return this.store.weekly;
    },
    monthly() {
      return this.store.monthly;
    },
    monthly3() {
      return this.store.monthly3;
    },
    yearly() {
      return this.store.yearly;
    },


    },
        
    async mounted(){

    this.selectedPick("daily");
  
          
    },

    methods:{

      addChart(date,data,chartid,type=this.chartType,cur="USD") {
        const { values, labels } = this.processChartData(date,data,cur);

          // 🔥 eski chart varsa sil
          if (this.chartInstance) {
            this.chartInstance.destroy();
          }

        const options = {
          chart: {
            type: type,
            toolbar: { show: false },
            height: '250px',
            width: '100%',
          },
          fill: {
          type: "gradient",
          gradient: {
            type: "horizontal",   // 90deg karşılığı
            colorStops: [
              { offset: 0,  color: "rgba(31,184,92,0.7)" },
              { offset: 84, color: "rgba(173,159,26,0.7)" }
            ]
          }
          },
          series: [{
            name: cur,
            data: values,
            color: "rgba(31,184,92,0.7)"
          }],
          xaxis: {
            categories: labels,
            labels: {
            
              style: {
                colors: '#5E636B',
                fontSize: '12px',
              }
            }
          },
          yaxis: {
                  labels: {
            
              style: {
                colors: '#5E636B',
                fontSize: '12px',
              }
            }
          },
          
         
        };

        this.chartInstance = new ApexCharts(document.querySelector(`#${chartid}`), options);

        this.chartInstance.render();

      },

processChartData(dateType, data, currency) {
  const lastIndex = data.length - 1;

  const shouldInclude = (item, index) => {
    if (dateType === 'yearly')   return index % 30 === 0 || index === lastIndex;
    if (dateType === 'monthly3') return index % 7 === 0  || index === lastIndex;
    return true;
  };

  const filteredData = data.filter((item, index) => shouldInclude(item, index));

  const values = filteredData.map(item =>
    Number(item.rates[currency]).toFixed(2)
  );

  const labels = filteredData.map((item) => {
    // 🔹 DAILY → createdAt
    if (dateType === 'daily') {
      const d = new Date(item.createdAt);
      const hour = d.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        hour12: false,
        timeZone: 'Europe/Istanbul'
      });
      return `${hour}:00`;
    }

    const d = new Date(item.date);

    // 🔹 WEEKLY & MONTHLY → gün + ay
    if (dateType === 'weekly' || dateType === 'monthly') {
      return d.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        timeZone: 'Europe/Istanbul'
      });
    }

    // 🔹 MONTHLY3 → haftalık (her 7. kayıt zaten filtrelendi)
    if (dateType === 'monthly3') {
      return d.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        timeZone: 'Europe/Istanbul'
      });
    }

    // 🔹 YEARLY → aylık (her 30. kayıt zaten filtrelendi)
    if (dateType === 'yearly') {
      return d.toLocaleDateString('tr-TR', {
        month: 'long',
        timeZone: 'Europe/Istanbul'
      });
    }

    return '';
  });

  return { values, labels };
},

       selectedPick(date) {
         this.selected = date;
        if (date === 'daily') {
          return this.addChart(date, this.daily, this.chartid,this.chartType, this.currency );
        } else if (date === 'weekly') {
          return this.addChart(date, this.weekly, this.chartid,this.chartType, this.currency);
       
        } else if (date === 'monthly') {
          return this.addChart(date, this.monthly, this.chartid,this.chartType, this.currency );
         
        } else if (date === 'monthly3') {
         return this.addChart(date, this.monthly3, this.chartid,this.chartType, this.currency );
      
        } else if (date === 'yearly') {
         return this.addChart(date, this.yearly, this.chartid,this.chartType, this.currency );
   
        }
  },

    },




}
</script>