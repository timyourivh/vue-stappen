<script setup lang="ts">
import DefaultStepper from '@/components/DefaultStepper.vue';
import TimedProgressBar from '@/components/TimedProgressBar.vue';
import { Step } from '@/components/export';
import { reactive, ref } from 'vue';

const currentStep = ref()
const processing = ref(false)

const steps = 4

const form = {
  allow: true,
  async: false,
  time: 1,
  processing: false,
}

const generateForms = (count: number): Record<string, typeof form> => {
  const result: Record<string, typeof form> = {};

  for (let j = 0; j < count; j++) {
    result[`step${j+1}`] = { ...form }
  }

  return result;
};

const forms = reactive(generateForms(steps))

const movementGuard = () => {
  return forms[currentStep.value].allow
}

const asyncMovementGuard = async () => {  
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, forms[currentStep.value].time * 1000);
  });

  return forms[currentStep.value].allow
}
</script>

<template>
  <div class="card bg-base-200 shadow-xl p-6">
    <div>
      Step guard
    </div>

    <div class="text-sm breadcrumbs">
      <ul>
        <li><RouterLink to="/playground">Playground</RouterLink></li> 
        <li>Step guard</li> 
      </ul>
    </div>
  </div>

  <div class="card bg-base-200 shadow-xl p-6">
    <DefaultStepper v-model:processing="processing" v-model="currentStep">
      <Step 
        v-for="step in steps" 
        :id="`step${step}`" 
        :key="step" 
        v-model:processing="forms[`step${step}`].processing" 
        :on-move="forms[`step${step}`].async ? asyncMovementGuard : movementGuard"
      >
        Body step {{ step }}
      </Step>
    </DefaultStepper>
  </div>

  <div class="card bg-base-200 shadow-xl p-6">
    <small>
      A a different guard for each step.
    </small>
    <div class="divider" />
    <div class="flex justify-center">
      <template v-for="step in steps" :key="step">
        <div class="w-full">
          <div>Step {{ step }}</div>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Allow movement</span> 
              <input v-model="forms[`step${step}`].allow" type="checkbox" class="checkbox checkbox-primary" />
            </label>
          </div>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Async</span> 
              <div class="flex align-center gap-3">
                <template v-if="forms[`step${step}`].async">
                  <span>Seconds</span>
                  <input v-model="forms[`step${step}`].time" class="input input-bordered input-xs max-w-20" min="0" step="0.5" type="number">
                </template>
                <input v-model="forms[`step${step}`].async" type="checkbox" class="checkbox checkbox-primary" />
              </div>
            </label>
          </div>
          <div v-if="forms[`step${step}`].async">
            <span class="label-text">Processing</span>
            <TimedProgressBar :start="forms[`step${step}`].processing" :duration="forms[`step${step}`].time * 1000" />
          </div>
        </div>
        <div v-if="step + 1 <= steps" class="divider divider-horizontal"></div>
      </template>
    </div>
  </div>
</template>