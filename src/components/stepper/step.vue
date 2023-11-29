<script setup lang="ts">
defineOptions({
  name: 'VueStap'
})

defineProps({
  id: {
    type: [String, Number],
    required: true
  },
  processing: {
    type: Boolean,
    default: false
  },
  onMove: {
    type: Function,
    default: () => true
  },
  onAdvance: {
    type: Function,
    default: () => true
  },
  onReverse: {
    type: Function,
    default: () => true
  }
})
</script>

<template>
  <div>
    <slot name="header" />
    <slot />
  </div>
</template>
