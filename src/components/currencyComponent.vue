<template>
<div :class='[height , width]' class="rounded-xl shadow-[0_7px_29px_0_rgba(17,146,13,0.2)] p-3 ">
<div id="chart"></div>
</div>
</template>


<script>

import ApexCharts from 'apexcharts';
import { getDaily, getRates } from '../../api.js'


export default{


    props:['height','width','chartType'],

    data(){
        return{
          daily: null,
        }
    },

        
    async mounted(){
       this.daily = await getDaily()  
      console.log(this.daily);
  
          
    },

    methods:{

    },




}
</script>