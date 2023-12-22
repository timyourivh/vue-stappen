<script setup lang="ts">
import { reactive } from 'vue';
import Stepper from '../../components/custom-stepper.vue'
import Step from '@/components/stepper/step.vue'

const form = reactive({
  stepToggle1: true,
  stepToggle2: false,
  stepToggle3: false,
})
</script>

<template>
  <div>
    <div class="flex justify-center w-full">
      <Stepper class="w-2/3">
        <Step id="step1" name="Step 1">
          Step 1
        </Step>
        <Step v-if="form.stepToggle1" id="step2" name="Step 2">
          Step 2
        </Step>
        <Step id="step3" name="Step 3">
          Step 3
        </Step>
        <Step id="step4" name="Step 4">
          Step 4
        </Step>
        <Step v-if="form.stepToggle2" id="step5" name="Step 5">
          Step 5
        </Step>

        <div v-if="form.stepToggle3">
          <Step id="step6" name="Step 6">
            Step 6
          </Step>
          <Step id="step7" name="Step 7">
            Step 7
          </Step>
        </div>

        <Step id="step8" name="Step 8">
          Step 8
        </Step>
        <Step id="step9" name="Step 9">
          Step 9
        </Step>

        <Step id="final" name="Overview">
          Finished!
        </Step>
      </Stepper>
    </div>
  </div>

  <hr class="my-4">

  <div class="flex justify-center w-full">
    <div>
      <div>
        <div class="flex items-center mb-4">
          <input
            id="stepToggle1" 
            v-model="form.stepToggle1"
            type="checkbox"
            class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
          >
          <label for="stepToggle1" class="ms-2 text-sm font-medium text-gray-900">Step toggle 1</label>
        </div>
        <div class="flex items-center mb-4">
          <input
            id="stepToggle2" 
            v-model="form.stepToggle2"
            type="checkbox"
            class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
          >
          <label for="stepToggle2" class="ms-2 text-sm font-medium text-gray-900">Step toggle 2</label>
        </div>
        <div class="flex items-center mb-4">
          <input
            id="stepToggle3" 
            v-model="form.stepToggle3"
            type="checkbox"
            class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
          >
          <label for="stepToggle3" class="ms-2 text-sm font-medium text-gray-900">Step toggle 3 (multiple steps)</label>
        </div>
      </div>
    </div>
  </div>
</template>