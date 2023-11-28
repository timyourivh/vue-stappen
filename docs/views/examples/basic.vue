<script setup lang="ts">
import Stepper from '../../components/custom-stepper.vue'
import Step from '@/components/stepper/step.vue'
</script>

<template>
  <div class="flex justify-center w-full">
    <Stepper class="w-2/3">
      <Step id="step1" name="Step 1">
        Step 1
      </Step>
      <Step id="step2" name="Step 2">
        Step 2
      </Step>
      <Step id="step3" name="Step 3">
        Step 3
      </Step>
      <Step id="step4" name="Overview">
        Finished!
      </Step>
    </Stepper>
  </div>
</template>