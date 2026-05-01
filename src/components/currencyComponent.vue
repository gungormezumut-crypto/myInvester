<template>
<div :class='[height , width]' class="rounded-xl shadow-[0_7px_29px_0_rgba(17,146,13,0.2)] p-3 ">
<div id="chart"></div>
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


    props:['height','width','chartType'],

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
      
  console.log(this.daily);
  
          
    },

    methods:{

    },




}
</script>