<template>
<div :class='[height , width]' class="rounded-xl shadow-[0_7px_29px_0_rgba(17,146,13,0.2)] p-3 ">
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


    props:['height','width','chartType','chartid'],

    data(){
        return{

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

        const chart = new ApexCharts(document.querySelector(`#${chartid}`), options);

        chart.render();

      },

       processChartData(date,data, currency) {
    const values = data.map(item => item.rates[currency].toFixed(2));

    const labels = data.map((item, index, arr) => {

            console.log(item.createdAt);

      if (date === 'daily') {

const date = new Date(item.createdAt);
const hour = date.getHours().toString().padStart(2, '0') + ':00';

    if (index === 0) return `${hour}`;
    if (index === arr.length - 1) return `${hour}`;

    return hour;
  }else{
    const date = new Date(item.createdAt);
    const day = date.getDate().toString().padStart(2, '0');
    return day;
  }
  });

  return { values, labels };
},

       selectedPick(date) {
        if (date === 'daily') {
          return this.addChart(date, this.daily, this.chartid,this.chartType, "USD" );
        } else if (date === 'weekly') {
          //return addChart(date, this.weekly, this.chartid,this.chartType, "USD" );
          return console.log(this.weekly);
        } else if (date === 'monthly') {
          //return addChart(date, this.monthly, this.chartid,this.chartType, "USD" );
          return console.log(this.monthly);
        } else if (date === 'monthly3') {
        // return addChart(date, this.monthly3, this.chartid,this.chartType, "USD" );
          return console.log(this.monthly3);
        } else if (date === 'yearly') {
        // return addChart(date, this.yearly, this.chartid,this.chartType, "USD" );
          return console.log(this.yearly);
        }
  },

    },




}
</script>