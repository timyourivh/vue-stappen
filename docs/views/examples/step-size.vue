<script setup lang="ts">
import { reactive } from 'vue';
import Stepper from '../../components/custom-stepper.vue'
import Step from '@/components/stepper/step.vue'

const form = reactive({
  stepSize: 1
})
</script>

<template>
  <div>
    <div class="flex justify-center w-full">
      <Stepper class="w-2/3" :max-step-size="form.stepSize">
        <Step id="step1" name="Step 1">
          Step 1
        </Step>
        <Step id="step2" name="Step 2">
          Step 2
        </Step>
        <Step id="step3" name="Step 3">
          Step 3
        </Step>
        <Step id="step4" name="Step 4">
          Step 4
        </Step>
        <Step id="step5" name="Step 5">
          Step 5
        </Step>
        <Step id="step6" name="Step 6">
          Step 6
        </Step>
        <Step id="step7" name="Step 7">
          Step 7
        </Step>
        <Step id="step8" name="Step 8">
          Step 8
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
        <label for="stepSize" class="label">
          Max step size
        </label>
        <input
          id="stepSize"
          v-model="form.stepSize"
          class="input"
          type="number"
          step="1"
        >
      </div>
    </div>
  </div>
</template>