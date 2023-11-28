<script setup lang="ts">
import Stepper from '@/components/stepper/stepper.vue';
import { CheckIcon, PencilIcon } from '@heroicons/vue/20/solid';
</script>

<template>
  <Stepper
    v-bind="$props"
    class="border-2 p-2 rounded-md border-slate-100"
  >
    <slot />

    <template #header="{ step, current, visited, number, callback }">
      <div class="flex space-x-4 items-center p-4 cursor-pointer" style="min-width: 12rem;" @click="callback">
        <div
          class="rounded-full h-6 w-6 flex items-center justify-center"
          :class="{
            'bg-indigo-700': current,
            'bg-indigo-500': !current && visited,
            'bg-gray-600': !current
          }"
        >
          <PencilIcon v-if="current" class="text-white h-4" />
          <CheckIcon v-else-if="!current && visited" class="text-white h-5" />
          <span v-else class="text-white text-sm font-bold">{{ number }}</span>
        </div>
        <h2
          class="text-lg font-medium text-gray-800"
          v-text="step.name"
        />
      </div>
    </template>

    <template #navigation="{ methods }">
      <div class="flex justify-between">
        <button
          class="button mt-4"
          @click="methods.previous"
        >
          Previous
        </button>
      
        <button
          class="button mt-4 ml-2"
          @click="methods.next"
        >
          Next
        </button>
      </div>
    </template>
  </Stepper>
</template>
