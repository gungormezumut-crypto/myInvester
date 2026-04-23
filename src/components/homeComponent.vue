<template>
    <div class="pl-[130px] pr-10 py-10 w-full h-screen flex gap-5 flex-wrap">
        <currencyComponent :chartType="'area'" :height="'h-110'" :width="'w-[35%]'"></currencyComponent>
    </div>
</template>

<script>
import currencyComponent from '@/components/currencyComponent.vue';
export default{



    data(){
        return{

        }
    },

    components:{
currencyComponent,
    }
}




</script>