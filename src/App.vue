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
    <span>Yükleniyor...</span>
  </div>
  
  <homeComponent v-else></homeComponent>
</template>

<style scoped></style>
