<script setup lang="ts">
import DefaultStepper from '@/components/DefaultStepper.vue';
import TimedProgressBar from '@/components/TimedProgressBar.vue';
import { Step } from '@/components/export';
import type { GuardProps } from '@/components/export/VueStappen.vue';
import { ref } from 'vue';

const allow = ref(true)
const async = ref(false)
const time = ref(1)
const processing = ref()
const progress = ref()

// Simple example like front end validation.
const movementGuard = (...props: GuardProps[]) => {
  console.log(...props)

  return allow.value
}

// More complex example like server-side validation.
const asyncMovementGuard = async (...props: GuardProps[]) => {
  console.log(...props)

  progress.value.start()
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time.value * 1000);
  });

  return allow.value
}
</script>

<template>
  <div class="card bg-base-200 shadow-xl p-6">
    <div>
      Stepper guard
    </div>

    <div class="text-sm breadcrumbs">
      <ul>
        <li><RouterLink to="/playground">Playground</RouterLink></li> 
        <li>Stepper guard</li> 
      </ul>
    </div>
  </div>

  <div class="card bg-base-200 shadow-xl p-6">
    <DefaultStepper v-model:processing="processing" :on-move="async ? asyncMovementGuard : movementGuard">
      <Step id="step1">
        Body step 1
      </Step>

      <Step id="step2">
        Body step 2
      </Step>

      <Step id="step3">
        Body step 3
      </Step>

      <Step id="step4">
        Body step 3
      </Step>
    </DefaultStepper>
  </div>

  <div class="card bg-base-200 shadow-xl p-6">
    <small>
      A single "global" guard for the whole stepper.
    </small>
    <div class="divider" />
    <div class="flex justify-center">
      <div class="w-1/3">
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Allow movement</span> 
            <input v-model="allow" type="checkbox" class="checkbox checkbox-primary" />
          </label>
        </div>
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Async</span> 
            <div class="flex align-center gap-3">
              <template v-if="async">
                <span>Seconds</span>
                <input v-model="time" class="input input-bordered input-xs max-w-20" min="0" step="0.5" type="number">
              </template>
              <input v-model="async" type="checkbox" class="checkbox checkbox-primary" />
            </div>
          </label>
        </div>
        <div v-if="async">
          <span class="label-text">Processing</span> 
          <TimedProgressBar ref="progress" :duration="time * 1000" />
        </div>
      </div>
    </div>
  </div>
</template>