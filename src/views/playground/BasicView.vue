<script setup lang="ts">
import CustomStepper from '@/components/CustomStepper.vue';
import { Step } from '@/components/export';
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
    <CustomStepper>
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
    </CustomStepper>
  </div>
</template>