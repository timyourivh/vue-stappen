<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from 'vue-router'

const routes = useRouter().getRoutes().filter((item) => {  
  return item.meta.group === 'examples'
})
</script>

<template>
  <div class="h-full grid grid-cols-8">
    <div class="bg-slate-100 p-4 col-span-1">
      <!-- Content of the left sidebar -->
      <ul>
        <RouterLink
          v-for="(item, index) in routes"
          :key="index"
          v-slot="{ isActive }"
          :to="item.path"
        >
          <li
            class="hover:text-indigo-800 capitalize"
            :class="{ 'text-indigo-500': isActive }"
          >
            {{ item.name }}
          </li>
        </RouterLink>
      </ul>
    </div>

    <div class="col-span-7 p-4">
      <RouterView />
    </div>
  </div>

  
  <!-- <div class="flex h-full">
    
  
    <div class="flex-1 p-4">
      <RouterView />
    </div>
  </div> -->
</template>