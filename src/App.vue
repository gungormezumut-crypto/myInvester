<script>
  import componentNav from '@/components/navigationComponent.vue'
  import homeComponent from './components/homeComponent.vue';
export default{

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
<homeComponent></homeComponent>
</template>

<style scoped></style>
