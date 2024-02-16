<script setup lang="ts">
import DefaultStepper from '@/components/DefaultStepper.vue';
import ProgressiveStepper from '@/components/ProgressiveStepper.vue';
import { Step } from '@/components/export';
import { ref } from 'vue';

const progressive = ref(false)
const history = ref<string[]>([])
const step = ref<string>()

const clearHistory = () => {
  if (step.value) {
    history.value = [step.value]
  }
}
</script>

<template>
  <div class="card bg-base-200 shadow-xl p-6">
    <div>
      Basic
    </div>

    <div class="text-sm breadcrumbs">
      <ul>
        <li><RouterLink to="/playground">Playground</RouterLink></li> 
        <li>Basic</li> 
      </ul>
    </div>
  </div>

  <div class="card bg-base-200 shadow-xl p-6">
    <component :is="progressive ? ProgressiveStepper : DefaultStepper" ref="stepper" v-model="step" :history="history">
      <Step id="step1">
        <template #default>
          Body step 1
        </template>
      </Step>

      <Step id="step2">
        <template #default>
          Body step 2
        </template>
      </Step>

      <Step id="step3">
        <template #default>
          Body step 3
        </template>
      </Step>

      <Step id="step4">
        <template #default>
          Body step 4
        </template>
      </Step>
    </component>
  </div>

  <div class="card bg-base-200 shadow-xl p-6">
    <div class="flex justify-center">
      <div class="w-1/3">
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Progressive</span> 
            <input v-model="progressive" type="checkbox" class="checkbox checkbox-primary" />
          </label>
        </div>
        <div class="form-control mb-2">
          <button class="btn btn-neutral" @click="clearHistory">Clear history</button>
        </div>
        <div class="form-control mb-2">
          <button class="btn btn-neutral" @click="step = 'step2'">Set to step 2</button>
        </div>
        <div class="mb-2">
          <span class="label-text">Current step</span> 
          <pre v-text="step ?? 'undefined'"></pre>
        </div>
        <div>
          <span class="label-text">History</span> 
          <ul class="max-h-36 overflow-auto list-disc pl-3">
            <li v-for="(item, index) in Array(...history).reverse()" :key="index" class="text-sm">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>