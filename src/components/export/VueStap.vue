<script setup lang="ts">
defineOptions({
  name: 'VueStappenStap'
})

defineProps<{
  id: string|number
}>()
</script>

<template>
  <div>
    Step
    <slot></slot>
  </div>
</template>