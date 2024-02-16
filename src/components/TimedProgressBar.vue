<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  duration: number
}>()

const progress = ref(0);
let startTime = 0;

onMounted(() => {
  startTime = Date.now();
  animateProgressBar();
});

const animateProgressBar = () => {
  const updateProgress = () => {
    const elapsedTime = Date.now() - startTime;
    progress.value = Math.min(100, (elapsedTime / props.duration));

    if (progress.value < 100) {
      requestAnimationFrame(updateProgress);
    }
  };

  requestAnimationFrame(updateProgress);
};
</script>

<template>
  <progress class="progress progress-primary" :value="progress" />
</template>
