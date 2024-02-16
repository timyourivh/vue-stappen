<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  duration: number
  start?: boolean
}>()

const start = computed(() => props.start ?? false)
const progress = ref(0);
let startTime = 0;

const startProgress = () => {
  startTime = Date.now();
  animateProgressBar();
};

watch(start, (value) => {
  if (value === true) {
    startProgress()
  }
})

const animateProgressBar = () => {
  const updateProgress = () => {
    const elapsedTime = Date.now() - startTime;
    progress.value = Math.min(100, (elapsedTime / props.duration) * 100);

    if (progress.value < 100) {
      requestAnimationFrame(updateProgress);
    }
  };

  requestAnimationFrame(updateProgress);
};

defineExpose({
  start: startProgress
})
</script>

<template>
  <div class="relative">
    <transition name="fade">
      <progress v-if="progress < 100" class="progress progress-primary absolute"  :value="progress" max="100" />
      <progress v-else-if="progress >= 100" class="progress absolute" value="100" max="100" />
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
