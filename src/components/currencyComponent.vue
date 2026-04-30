<template>
<div :class='[height , width]' class="rounded-xl shadow-[0_7px_29px_0_rgba(17,146,13,0.2)] p-3 ">
<div id="chart"></div>
</div>
</template>


<script>

import ApexCharts from 'apexcharts';
//import hourlyRates from '../../datasets/hourly.json' with { type: 'json' };



export default{

  hourlyRates : [],
  weeeklyRates : [],
  monthlyRates : [],
  monthly3Rates : [],
  yearlyRates : [],

    props:['height','width','chartType'],

    data(){
        return{
        }
    },

    methods:{

    getCurrencyDaily(currency){
// 1. Veriyi grupla
const grouped = hourlyRates.reduce((acc, entry) => {
  const rates = entry.rates || {};
  
  Object.entries(rates).forEach(([symbol, value]) => {
    if (!acc[symbol]) {
      acc[symbol] = [];
    }
    
    // Değeri 2 basamağa sabitleyip sayıya geri çeviriyoruz
    const fixedValue = Number(value.toFixed(2)); 
    acc[symbol].push(fixedValue);
  });
  
  return acc;
}, {});

// 2. Formatla
const indexedData = Object.entries(grouped).map(([symbol, values], index) => {
  return {
    id: index,
    name: symbol,
    rate: values // Artık dizi içindeki her rakam fixed (örn: 12.26)
  };
});

var filtereddata = indexedData.find(item => item.name === currency);
return filtereddata.rate    
},

  chartCreate(){
    if(this.chartType == 'area'){



  var options = {
  chart: {
    height: 280,
    type: "area"
  },
  dataLabels: {
    enabled: false
  },
  series: [
    {
      name: "USD",
      data: this.getCurrencyDaily("USD")
    }
  ],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 90, 100]
    }
  },
  xaxis: {
    categories: [

    ]
  }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();

            }

        }
    },

    
    mounted(){
         this.chartCreate();
          
    }


}
</script>