<script setup lang="ts">
import { computed, ref } from "vue";
import startCase from "lodash.startcase";

interface Step {
  /**
   * Step ID, if set it overwrites the id inherited form the step key.
   */
  id?: string;

  /**
   * Option to determine if the step should be shown/hidden altogether.
   *
   * @default true
   * */
  show?: boolean;

  /**
   * Option for disabling the step. If true the step will be visible
   * but inacessible
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Option for disallowing navigation by header.
   */
  navigable?: boolean;

  /**
   * Optional title, if not set it will use the step key converted
   * to start case.
   */
  title?: string;

  /**
   * The step number, can't be overwritten this is for display and
   * navigational purposes. It will change depending on where the
   * step is located.
   */
  number?: number;

  /**
   * Callback when entering a step.
   * @param step The current step.
   * @returns {boolean|null} (expected) Boolean which determines if the stepper hould continue or not depending on true/false respectively or null which would be the same as true.
   */
  onEnter?: (step: Step) => boolean;

  /**
   * Callback when leaving a step.
   * @param step The current step.
   * @returns {boolean|null} (expected) Boolean which determines if the stepper hould continue or not depending on true/false respectively or null which would be the same as true.
   */
  onLeave?: (step: Step) => boolean;
}

type InternalStep = Step & {
  id: NonNullable<Step['id']>;
}

const props = defineProps<{
  steps: { [stepName: string]: Step };
}>();

const steps = computed<Array<InternalStep>>(() => {
  return Object.entries(props.steps)
    .map(([key, step]) => {
      if (!step.id) step.id = key;

      step.show = step.show ?? true;
      step.disabled = step.disabled ?? false;
      step.navigable = step.navigable ?? true;

      if (!step.title) step.title = startCase(step.id);

      return step;
    })
    .filter((step) => step.show) // Filter out hidden steps.
    .map((step, index) => {
      step.number = index + 1;
      return step;
    }) as InternalStep[];
});

const stepIndex = ref<number>(0);
const currentStepNumber = computed<number>(() => {
  return stepIndex.value + 1;
});
const currentStep = computed<Step>(() => {
  return steps.value[stepIndex.value] ?? null;
});
const nextStep = computed<Step | null>(() => {
  return steps.value[stepIndex.value + 1] ?? null;
});
const previousStep = computed<Step | null>(() => {
  return steps.value[stepIndex.value - 1] ?? null;
});

/**
 * Method to navigate stepper to given index.
 * @param index Index of the step you want to navigate to.
 * @param force Override to force navigation if navigable is false.
 */
const navigateToIndex = (index: number, force = false) => {
  let continues = true;

  if (continues && steps.value[stepIndex.value]?.onLeave)
    // Check if onLeave callback exists and execute it.
    // The result of the method determines if allowed to continue.
    continues =
      steps.value[stepIndex.value]?.onLeave?.(steps.value[stepIndex.value]) !==
      false;

  if (
    continues &&
    (!steps.value[index] || // Checks if the step even exists.
      steps.value[index].disabled || // Checks if the step is diabled
      (!steps.value[index].navigable && !force)) // Check if you can navigate to step from header and without override.
  )
    continues = false;

  if (continues && steps.value[index] && steps.value[index]?.onEnter)
    // Check if onEnter callback exists on the requested index and execute it.
    // The result of the method determines if allowed to continue.
    continues = steps.value[index]?.onEnter?.(steps.value[index]) !== false;

  if (steps.value[index] && continues === true) stepIndex.value = index;
};

/**
 * Method to navigate stepper to step with given ID.
 * @param stepId The ID of the step you want to navigate to.
 * @param force Override to force navigation if navigable is false.
 */
const navigateToId = (stepId: string, force = false) => {
  navigateToIndex(
    steps.value.findIndex((step: Step) => step.id === stepId),
    force
  );
};

/**
 * Method to naviagate to the next step.
 */
const next = () => {
  navigateToIndex(stepIndex.value + 1, true);
};

/**
 * Method to naviagate to the next previous step.
 */
const previous = () => {
  navigateToIndex(stepIndex.value - 1, true);
};

defineExpose({
  next,
  previous,
  navigateToId,
});
</script>

<template>
  <div>
    <div v-if="$slots['header-item']" style="display: flex">
      <transition-group name="step-header">
        <div v-for="step in steps" :key="step.id">
          <div @click="navigateToId(step.id)">
            <slot
              name="header-item"
              :step="step"
              :active="step.number === currentStepNumber"
            />
          </div>
        </div>
      </transition-group>
    </div>
    <div v-else style="display: flex">
      <transition-group name="step-header">
        <div v-for="step in steps" :key="step.id">
          <div class="cursor-pointer" @click="navigateToId(step.id)">
            <div>Step {{ step.number }}</div>
            <div v-text="step.title" />
          </div>
        </div>
      </transition-group>
    </div>

    <transition name="step-content" mode="out-in">
      <slot
        :name="currentStep?.id ?? 'undefined'"
        :current-step="currentStep"
        :next="next"
        :previous="previous"
        :navigate-to-id="navigateToId"
        :next-step="nextStep"
        :previous-step="previousStep"
      >
        This step is not available
      </slot>
    </transition>

    <div>
      <slot
        name="footer"
        :current-step="currentStep"
        :next="next"
        :previous="previous"
        :navigate-to-id="navigateToId"
        :next-step="nextStep"
        :previous-step="previousStep"
      >
        <button @click="previous">previous</button>
        <button @click="next">next</button>
      </slot>
    </div>
  </div>
</template>

<style>
.step-content-enter-active,
.step-content-leave-active {
  transition: opacity 0.2s ease;
}

.step-content-enter-from,
.step-content-leave-to {
  opacity: 0;
}

.step-header-enter-active,
.step-header-leave-active {
  transition: all 0.4s ease;
}

.step-header-enter-from,
.step-header-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>
