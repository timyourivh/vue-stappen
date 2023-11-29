<script setup lang="ts">
import { reactive } from 'vue'
import Checkbox from '../../components/checkbox.vue'
import Step from '@/components/stepper/step.vue'
import Stepper from '../../components/custom-stepper.vue'

const flags = reactive({
  allowMovement: true,
  allowAdvance: true,
  allowReverse: true,
  allowAdvanceStep2: true,
})

const moveGuard = () => {
  console.log('moveGuard: ' + flags.allowMovement);
  return flags.allowMovement
}
const advanceGuard = () => {
  console.log('advanceGuard: ' + flags.allowAdvance);
  return flags.allowAdvance
}
const reverseGuard = () => {
  console.log('reverseGuard: ' + flags.allowReverse);
  return flags.allowReverse
}
const step2Guard = () => {
  console.log('step2Guard: ' + flags.allowAdvanceStep2);
  return flags.allowAdvanceStep2
}
</script>

<template>
  <div>
    <div class="flex justify-center w-full">
      <Stepper
        class="w-2/3"
        :on-move="moveGuard"
        :on-advance="advanceGuard"
        :on-reverse="reverseGuard"
      >
        <Step id="step1" name="Step 1">
          Step 1
        </Step>
        <Step id="step2" :on-advance="step2Guard" name="Step 2">
          Step 2
        </Step>
        <Step id="step3" name="Step 3">
          Step 3
        </Step>
        <Step id="finish" name="Final step">
          Finished!
        </Step>
      </Stepper>
    </div>

    <hr class="my-4">

    <div class="flex justify-center w-full">
      <div>
        <Checkbox v-model="flags.allowMovement" label="Allow movement" name="allowMovement" />
        <Checkbox v-model="flags.allowAdvance" label="Allow advance" name="allowAdvance" />
        <Checkbox v-model="flags.allowReverse" label="Allow reverse" name="allowReverse" />
        <Checkbox v-model="flags.allowAdvanceStep2" label="Allow advance on step 2" name="allowAdvanceStep2" />
      </div>
    </div>
  </div>
</template>