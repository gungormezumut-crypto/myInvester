<script setup>
import { ref } from 'vue'
const isOpen = ref(false);

const url = window.location.pathname;
console.log(url);
</script>

<template>
<div 
  class="group absolute flex flex-col pt-6 pb-15 z-20 px-4 
  transition-[width] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]
  gap-y-4 top-0 left-0 h-full overflow-hidden
  bg-[linear-gradient(180deg,rgba(31,184,92,0.7)0%,rgba(173,159,26,0.7)84%)]"
  :class="isOpen ? 'w-50' : 'w-[85px]'">

  <!-- Toggle Button -->
  <div  class="navItem bg-white/25 p-3 rounded-lg hover:scale-[1.07] transition-all duration-150 cursor-pointer flex items-center gap-3 w-full" @click="isOpen = !isOpen">
    <img v-if="!isOpen" src="../img/back.png" class="block transform rotate-180 shrink-0 min-w-[30px]" height="30" width="30">
    <img v-if="isOpen"  src="../img/back.png"  class="block shrink-0 min-w-[30px]" height="30" width="30">
    <div 
      class="whitespace-nowrap uppercase text-lg font-bold text-white
      transition-opacity duration-[150ms]"
      :class="isOpen ? 'opacity-100 delay-[200ms]' : 'opacity-0 delay-[0ms]'">
      KÜÇÜLT
    </div>
  </div>

  <!-- Anasayfa -->
  <div :class="url == '/' ? '!bg-green-600/50' : '' " class="navItem bg-white/25 p-3 rounded-lg hover:scale-[1.07] transition-all duration-150 cursor-pointer flex items-center gap-3 w-full">
    <img src="../img/growth.png" class="block shrink-0 min-w-[30px]" height="30" width="30">
    <div 
      class="whitespace-nowrap uppercase text-lg font-bold text-white
      transition-opacity duration-[150ms]"
      :class="isOpen ? 'opacity-100 delay-[200ms]' : 'opacity-0 delay-[0ms]'">
      ANASAYFA
    </div>
  </div>

  <div class="absolute bottom-6 navItem bg-white/25 p-3 rounded-lg hover:scale-[1.07] transition-all duration-150 cursor-pointer flex items-center gap-3 w-[calc(100%-32px)]">
  <img src="../img/letter-u.png" class="block shrink-0 min-w-[30px]" height="30" width="30">
      <div 
      class="whitespace-nowrap uppercase text-[10px] font-bold text-white
      transition-opacity duration-[150ms]"
      :class="isOpen ? 'opacity-100 delay-[200ms]' : 'opacity-0 delay-[0ms]'">
      Created By <br> Umut Güngör
    </div>
  </div>

</div>
</template>