<script setup lang="ts">
import { reactive } from 'vue';
import Stepper from '../components/Stepper.vue';

const steps = reactive({
  step1: {},
  step2: {
    title: 'Async example',
    onLeave: async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    },
  },
  step3: {
    navigable: true,
  },
  final: {
    id: 'final-step',
  },
});
</script>

<template>
  <main>
    <Stepper :steps="steps" restricted="allow-visited">
      <template #header-item="{ step, active }">
        <h3>
          {{ `${active ? '>' : ''}${step.title}` }}
        </h3>
      </template>

      <template #step1>
        <div>This is step 1</div>
      </template>
      <template #step2>
        <div>This is step 2</div>
      </template>
      <template #step3>
        <div>This is step 3</div>
      </template>
      <template #final-step>
        <div>Final step</div>
      </template>
    </Stepper>
  </main>
</template>
