<script setup lang="ts">
import Stepper from '../components/custom-stepper.vue'
import Step from '@/components/stepper/step.vue'
import { ref } from 'vue';

const extraSteps = ref(false)
const allowAdvance = ref(true)
const allowReverse = ref(true)
const allowAdvanceOnStep2 = ref(true)

const advanceMiddleware = () => {
  console.log('advanceMiddleware middleware ran');
  return allowAdvance.value
}
const reverseMiddleware = () => {
  console.log('reverseMiddleware middleware ran');
  return allowReverse.value
}
const step2Middleware = () => {
  console.log('step2Middleware middleware ran');
  return allowAdvanceOnStep2.value
}
const fakeFormSubmit = async () => {
  return await new Promise((resolve) => {
    console.log('start');
    
    setTimeout(() => {
      console.log('done');
      resolve(allowAdvance.value)
    }, 500)
  }) 
}

const currentStep = ref()
</script>

<template>
  <div>
    <pre v-text="{ currentStep }" />

    <div>
      <input
        id="advance"
        v-model="allowAdvance"
        type="checkbox"
      >
      <label for="advance"> Should advance</label>
    </div>
    <div>
      <input
        id="reverse"
        v-model="allowReverse"
        type="checkbox"
      >
      <label for="reverse"> Should reverse</label>
    </div>
    <div>
      <input
        id="allowAdvanceOnStep2"
        v-model="allowAdvanceOnStep2"
        type="checkbox"
      >
      <label for="allowAdvanceOnStep2"> Allow advance on step2</label>
    </div>

    <div>
      <Stepper
        v-model="currentStep"
        :on-advance="advanceMiddleware"
        :on-reverse="reverseMiddleware"
      >
        <Step
          id="step1"
          :on-advance="fakeFormSubmit"
        >
          Step 1
          <a
            href="#"
            @click.prevent="extraSteps = !extraSteps"
            v-text="'Click to toggle extra steps'"
          />
        </Step>
        
        <Step
          v-if="extraSteps"
          id="step2"
          :on-advance="step2Middleware"
        >
          TEST 2
          <a
            href="#"
            @click.prevent="extraSteps = !extraSteps"
            v-text="'Click to toggle extra steps'"
          />
        </Step>
        <Step id="step3">
          TEST 3
          <a
            href="#"
            @click.prevent="extraSteps = !extraSteps"
            v-text="'Click to toggle extra steps'"
          />
        </Step>
        
        <Step id="step4">
          TEST 4
          <a
            href="#"
            @click.prevent="extraSteps = !extraSteps"
            v-text="'Click to toggle extra steps'"
          />
        </Step>

        <template #previous="{ methods }">
          <button
            class="button"
            @click="methods.previous()"
          >
            Previous
          </button>
        </template>
        <template #next="{ methods }">
          <button
            class="button"
            @click="methods.next()"
          >
            Next
          </button>
        </template>
      </Stepper>
    </div>
  </div>
</template>