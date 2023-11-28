<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';
</script>

<template>
  <!-- <div class="flex flex-col h-screen">
    <header class="col-span-full">
      <Navbar />
    </header>
  
    <main class="flex flex-1">
      <RouterView />
    </main>
  </div> -->
  <div class="flex flex-col h-screen min-h-screen">
    <header>
      <Navbar />
    </header>
  
    <main class="grow">
      <RouterView />
    </main>
  </div>
</template>