<script setup lang="ts">
import { reactive, ref } from 'vue'
import Stepper from '../components/Stepper.vue'

const onLeave = ({ currentStep, sourceStep, direction }) => {
  console.log(currentStep?.id, sourceStep?.id, direction)
}

const steps = reactive({
  step1: {
    onLeave,
  },
  step2: {
    title: 'Async example',
    navigable: true,
    onLeave,
    onEnter: async () => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null)
        }, 2000)
      })
    },
  },
  step3: {
    navigable: false,
    onLeave,
  },
  final: {
    // navigable: true,
    id: 'final-step',
    onLeave,
  },
})
const currentStepId = ref()
</script>

<template>
  <main>
    <h2>Current step: {{ currentStepId }}</h2>
    <button @click="currentStepId = 'step3'">Go step 3</button>
    <Stepper :steps="steps" restricted="allow-visited" v-model="currentStepId">
      <template #header-item="{ step, active }">
        <h3>
          {{ `${active ? '>' : ''}${step.title}` }}
        </h3>
        <div>Processing: {{ step.processing }}</div>
        <div>Visited: {{ step.visited }}</div>
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
