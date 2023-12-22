<script setup lang="ts">
import { reactive } from 'vue';
import Stepper from '../../components/custom-stepper.vue'
import Step from '@/components/stepper/step.vue'

const form = reactive({
  undoOnPrevious: true
})
</script>

<template>
  <div>
    <div class="flex justify-center w-full">
      <Stepper class="w-2/3" :undo-on-previous="form.undoOnPrevious">
        <Step id="step1" name="Step 1">
          Step 1
        </Step>
        <Step id="step2" name="Step 2">
          Step 2
        </Step>
        <Step id="step3" name="Step 3">
          Step 3
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
            id="default-checkbox" 
            v-model="form.undoOnPrevious"
            type="checkbox"
            value=""
            class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
          >
          <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900">Undo on previous</label>
        </div>
      </div>
    </div>
  </div>
</template>