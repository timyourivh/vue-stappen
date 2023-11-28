<script setup lang="ts">
defineOptions({
  name: 'VueStap'
})

defineProps({
  id: {
    type: [String, Number],
    required: true
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
    <slot name="header">
      Header
    </slot>
    <slot />
  </div>
</template>
