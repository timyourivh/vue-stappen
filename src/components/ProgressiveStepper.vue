<script setup lang="ts">
import { Stepper } from './export'
</script>

<template>
  <Stepper header-class="steps" step-class="border p-3 rounded-lg my-4 border-gray-200 dark:border-gray-700" v-bind="$props">
    <template #header-item="{ index, currentIndex, step, active, visit, delta }">
      <li
        class="step" 
        :class="{
          'step-primary': index <= currentIndex,
          'step-accent font-bold text-black dark:text-white': active,
          'cursor-pointer': Math.abs(delta) === 1
        }"
        @click="Math.abs(delta) === 1 ? visit() : null">
        {{ step.id }}
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