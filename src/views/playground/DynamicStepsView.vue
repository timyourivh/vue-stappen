<script setup lang="ts">
import DefaultStepper from '@/components/DefaultStepper.vue';
import { Step } from '@/components/export';
import { reactive, ref } from 'vue';

const toggles = reactive({
  toggle1: true,
  toggle2: true,
  toggle3: false,
})
const history = ref<string[]>([])
const step = ref<string>()

const clearHistory = () => {
  if (step.value) {
    history.value = [step.value]
  }
}
</script>

<template>
  <div></div>
  <div class="card bg-base-200 shadow-xl p-6">
    <div>
      Dynamic steps
    </div>

    <div class="text-sm breadcrumbs">
      <ul>
        <li><RouterLink to="/playground">Playground</RouterLink></li> 
        <li>Dynamic steps</li> 
      </ul>
    </div>
  </div>

  <div class="card bg-base-200 shadow-xl p-6">
    <DefaultStepper ref="stepper" v-model="step" :history="history">
      <Step v-if="toggles.toggle1" id="step1">
        <template #default>
          Body step 1
        </template>
      </Step>

      <Step v-if="toggles.toggle2" id="step2">
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

      <template v-if="toggles.toggle3">
        <Step id="step5">
          <template #default>
            Body step 5
          </template>
        </Step>

        <Step id="step6">
          <template #default>
            Body step 6
          </template>
        </Step>
      </template>

      <Step id="step7">
        <template #default>
          Body step 7
        </template>
      </Step>
    </DefaultStepper>
  </div>


  <div class="card bg-base-200 shadow-xl p-6">
    <small>
      This example shows different ways you can toggle steps.
    </small>
    <div class="divider" />
    <div class="flex justify-center">
      <div class="w-1/3 text-sm pr-5">
        <b>Behaviour explained:</b>
        <ul class="list-disc">
          <li>When a step is removed you will maintain the current step by id unless the step you're currently on is removed.</li>
          <li>When the current step is removed, you will be moved to the first previous found step. For <span style="opacity: 0.7;">(this)</span> example, when on step 5 <span style="opacity: 0.7;">(or 6)</span>, if these steps get removed you will be placed back to step 4. This is to prevent unwanted progress and because it feels more natural.</li>
          <li>If the step you're currently on is removed and there is no previous step, like step 1 for example. You will be placed to the first step in the stepper which would be step 2.</li>
        </ul>
      </div>
      <div class="w-1/3">
        <div class="form-control mb-2">
          <label class="label cursor-pointer">
            <span class="label-text">Toggle step 1</span> 
            <input v-model="toggles.toggle1" type="checkbox" class="toggle" :class="[toggles.toggle1 ? 'toggle-primary' : null]" />
          </label>
        </div>
        <div class="form-control mb-2">
          <label class="label cursor-pointer">
            <span class="label-text">Toggle step 2</span> 
            <input v-model="toggles.toggle2" type="checkbox" class="toggle" :class="[toggles.toggle2 ? 'toggle-primary' : null]" />
          </label>
        </div>
        <div class="form-control mb-2">
          <label class="label cursor-pointer">
            <span class="label-text">Toggle step 5 & step 6</span> 
            <input v-model="toggles.toggle3" type="checkbox" class="toggle" :class="[toggles.toggle3 ? 'toggle-primary' : null]" />
          </label>
        </div>
        <div class="flex mb-2">
          <button class="btn btn-neutral flex-1 " @click="clearHistory">Clear history</button>
        </div>
      </div>
      <div class="w-1/3">
        <!-- Spacer -->
      </div>
    </div>
  </div>
</template>