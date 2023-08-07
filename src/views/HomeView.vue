<script setup lang="ts">
import { reactive, ref } from 'vue'
import Stepper from '../components/Stepper.vue'

const onLeave = ({ currentStep, sourceStep, direction }) => {
  console.log(currentStep?.id, sourceStep?.id, direction)
  return true
}

const steps = reactive({
  step1: {
    onLeave,
  },
  step2: {
    title: 'Async example',
    navigable: true,
    onForward: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return test.value !== ''
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

const test = ref('')
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
        <small>
          <div>Processing: {{ step.processing }}</div>
          <div>Visited: {{ step.visited }}</div>
          <div>Navigable: {{ step.navigable }}</div>
        </small>
      </template>

      <template #step1>
        <div>This is step 1</div>
      </template>
      <template #step2>
        <div>
          <input type="text" v-model="test" />
        </div>
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
