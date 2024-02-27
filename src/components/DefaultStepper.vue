<script setup lang="ts">
import { Stepper } from './export'
</script>

<template>
  <Stepper header-class="steps" step-class="border p-3 rounded-lg my-4 border-gray-200 dark:border-gray-700" v-bind="$props">
    <template #header-item="{ visited, step, active, processing, visit }">
      <li
        class="step" 
        :class="{
          'step-primary': visited,
          'step-secondary': visited && processing || step.processing,
          'step-accent font-bold text-black dark:text-white': active && !step.processing,
          'step-secondary font-bold text-black dark:text-white': active && step.processing,
        }"
        @click="visit()">
        {{ step.title ?? step.id }}
      </li>
    </template>

    <slot />

    <template #navigation="{ next, previous, previousStep, nextStep }">
      <div class="flex">
        <button v-if="previousStep" class="btn btn-neutral" @click="previous">Previous</button>
        <div class="w-full"></div>
        <button class="btn" :class="{ 'btn-neutral': nextStep, 'btn-primary': !nextStep }" @click="next">
          {{ nextStep ? 'Next' : 'Finish' }}
        </button>
      </div>
    </template>
  </Stepper>
</template>