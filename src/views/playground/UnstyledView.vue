<script setup lang="ts">
import { Step, Stepper } from '@/components/export';
</script>

<template>
  <div class="card bg-base-200 shadow-xl p-6">
    <div>
      Unstyled
    </div>

    <div class="text-sm breadcrumbs">
      <ul>
        <li><RouterLink to="/playground">Playground</RouterLink></li> 
        <li>Unstyled</li> 
      </ul>
    </div>
  </div>

  <div class="card bg-base-200 shadow-xl p-6">
    <Stepper>
      <template #header-item="{ active, number }">
        <span v-if="active" v-text="'> '" />Stap {{ number }}
      </template>

      <Step id="step1">
        <template #default>
          Body step 1
        </template>
      </Step>

      <Step id="step2">
        <template #header="{ active, number }">
          <span v-if="active" v-text="'(active)'"/> Overwrite default header for {{ number }}
        </template>

        <template #default>
          Body step 2
        </template>
      </Step>

      <Step id="step3">
        <template #default>
          Body step 3
        </template>
      </Step>
    </Stepper>
  </div>
</template>