<script setup lang="ts">
import { reactive } from "vue";
import Stepper from "../components/Stepper.vue";

const steps = reactive({
  step1: {},
  step2: {},
});
</script>

<template>
  <main>
    <Stepper :steps="steps">
      <template #step1>
        <div>This is step 1</div>
      </template>
      <template #step2>
        <div>This is step 2</div>
      </template>
    </Stepper>
  </main>
</template>
