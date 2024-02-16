<script setup lang="ts">
//
</script>

<template>
  <div class="card bg-base-200 shadow-xl p-6">
    <div>
      Index
    </div>
    <div class="text-sm breadcrumbs">
      <ul>
        <li>Playground</li> 
      </ul>
    </div>

    <div class="divider" /> 

    <ul class="list-disc ml-3">
      <li><RouterLink to="/playground/unstyled" class="link">Unstyled</RouterLink></li>
      <li><RouterLink to="/playground/basic" class="link">Basic</RouterLink></li>
    </ul>
  </div>
</template>