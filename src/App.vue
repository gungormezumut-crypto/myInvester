<script>
  import componentNav from '@/components/navigationComponent.vue'
  import homeComponent from './components/homeComponent.vue';
  import { useRateStore } from "../rateStore";
  import { onMounted } from "vue";

 


export default{

  setup() {
    const store = useRateStore();

onMounted(async () => {
  await store.fetchAll();
});
    return { store };
  },

  components:{
 componentNav,
 homeComponent
  },

  data(){
    return{

    }
  },

}
</script>

<template>
<componentNav></componentNav>
  <div v-if="!store.loaded" class="loading">
    <div class="w-full h-full fixed top-0 left-0 flex items-center justify-center bg-white/50">
 <div class="loader">
                <div class="bar1"></div>
                <div class="bar2"></div>
                <div class="bar3"></div>
                <div class="bar4"></div>
                <div class="bar5"></div>
                <div class="bar6"></div>
                <div class="bar7"></div>
                <div class="bar8"></div>
                <div class="bar9"></div>
            </div>
    </div>
    
  </div>
  
  <homeComponent v-else></homeComponent>
</template>

<style scoped></style>
