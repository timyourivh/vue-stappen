<script setup lang="ts">
import DefaultStepper from '@/components/DefaultStepper.vue';
import { Step } from '@/components/export';
import { reactive, ref } from 'vue';

const history = ref<string[]>([])
const step = ref<string>()

const form = reactive({
  test1: '',
  test2: '',
  test3: '',
  test4: '',
})
</script>

<template>
  <div class="card bg-base-200 shadow-xl p-6">
    <div>
      Form Submit
    </div>

    <div class="text-sm breadcrumbs">
      <ul>
        <li><RouterLink to="/playground">Playground</RouterLink></li> 
        <li>Form Submit</li> 
      </ul>
    </div>
  </div>

  <div class="card bg-base-200 shadow-xl p-6">
    <DefaultStepper ref="stepper" v-model="step" :history="history">
      <Step id="step1" title="Name">
        <input v-model="form.test1" type="text" placeholder="Name" class="input input-bordered input-primary w-full max-w-xs" required />
      </Step>

      <Step id="step2" title="Email">
        <input v-model="form.test2" type="email" placeholder="Email" class="input input-bordered input-primary w-full max-w-xs" required />
      </Step>

      <Step id="step3" title="Password">
        <input v-model="form.test3" type="password" placeholder="Password" class="input input-bordered input-primary w-full max-w-xs" min="8" required />
      </Step>

      <Step id="step4" title="Summary">
        <template #default>
          Body step 4
        </template>
      </Step>
    </DefaultStepper>
  </div>


  <div class="card bg-base-200 shadow-xl p-6">
    <small>
      This example demonstrates how you can trigger a form submit to progress though the stepper.
    </small>
    <!-- <div class="divider" /> -->
    <!-- <div class="flex justify-center">
      <div class="w-1/3">
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Progressive</span> 
            <input v-model="progressive" type="checkbox" class="checkbox checkbox-primary" />
          </label>
        </div>
        <div class="flex mb-2 gap-2">
          <button class="btn btn-neutral flex-1 " @click="clearHistory">Clear history</button>
          <button class="btn btn-neutral flex-1 " @click="history.push('step3')">Add step 3 to history</button>
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
          <ul class="max-h-16 overflow-auto list-disc pl-3">
            <li v-for="(item, index) in Array(...history).reverse()" :key="index" class="text-sm">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div> -->
  </div>
</template>