<script setup lang="ts">
import { reactive, ref } from 'vue'
import Checkbox from '../../components/checkbox.vue'
import Step from '@/components/stepper/step.vue'
import Stepper from '../../components/custom-stepper.vue'
import type { GuardParams } from '@/components/stepper/stepper.vue';

const form = reactive({
  time: 1
})

const allowMove = ref(true)
const processing = ref(false)

const onMove = ({ direction, target }: GuardParams<{name: string, id: string|number}>) => {  
  if (direction < 0 && !target) {
    return false
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(allowMove.value)
    }, form.time * 1000)
  })
}
</script>

<template>
  <div>
    <div class="flex justify-center w-full">
      <Stepper v-model:processing="processing" class="w-2/3" :on-move="onMove">
        <Step id="step1" name="Step 1">
          <template #header>
            TEST
          </template>
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

    <hr class="my-4">

    <div class="flex justify-center w-full">
      <div>
        <div class="mb-2 w-48">
          Stepper processing: {{ processing }}
        </div>
        <div>
          <Checkbox v-model="allowMove" label="Allow movement" name="allowMove" />
        </div>
        <div>
          <div>
            <label for="time" class="label">
              Time (seconds)
            </label>
            <input
              id="time"
              v-model="form.time"
              class="input"
              type="number"
              step="0.1"
              min="0"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>