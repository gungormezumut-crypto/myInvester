<template>
<div :class='[height , width]' class="rounded-xl shadow-[0_7px_29px_0_rgba(17,146,13,0.2)] p-3 ">
<div id="chart"></div>
</div>
</template>


<script>

import ApexCharts from 'apexcharts';
//import { hourlyRates , weeklyRates , monthlyRates ,  threeMonthRates , yearlyRates } from '../../server.js';

export default{


  
    props:['height','width','chartType'],

    data(){
        return{
        }
    },

    methods:{
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
      name: "Series 1",
      data: [45, 52, 38, 45, 19, 23, 2]
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