<script setup lang="ts">
import { Stepper } from './export'
</script>

<template>
  <Stepper header-class="steps" step-class="border p-3 rounded-lg my-4 border-gray-200 dark:border-gray-700" v-bind="$props">
    <template #header-item="{ index, currentIndex, step, active }">
      <li
        class="step" 
        :class="{
          'step-primary': index <= currentIndex,
          'step-accent font-bold text-black dark:text-white': active
        }">
        {{ step.id }}
      </li>
    </template>

    <slot />

    <template #navigation="{ next, previous }">
      <div class="flex">
        <button class="btn btn-neutral" @click="previous">Previous</button>
        <div class="w-full"></div>
        <button class="btn btn-neutral" @click="next">Next</button>
      </div>
    </template>
  </Stepper>
</template>