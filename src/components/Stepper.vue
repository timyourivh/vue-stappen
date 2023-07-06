<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import startCase from 'lodash.startcase'

interface Step {
  /**
   * Step ID, if set it overwrites the id inherited form the step key.
   */
  id?: string

  /**
   * Option to determine if the step should be shown/hidden altogether.
   *
   * @default true
   * */
  show?: boolean

  /**
   * Option for disabling the step. If true the step will be visible
   * but inacessible
   *
   * @default false
   */
  disabled?: boolean

  /**
   * Option for disallowing navigation by header.
   */
  navigable?: boolean

  /**
   * Optional title, if not set it will use the step key converted
   * to start case.
   */
  title?: string

  /**
   * A boolean that defaults for false but will become true once the
   * stepper has been on the step.
   */
  visited?: boolean

  /**
   * Callback when entering a step.
   * @param stepEvent Step event.
   * @returns {boolean|null|Promise} (expected) Boolean (or promise) which determines if the stepper hould continue or not depending on true/false respectively or null which would be the same as true.
   */
  onEnter?: (stepEvent: StepEvent) => EventReturnValue

  /**
   * Callback when leaving a step.
   * @param stepEvent Step event.
   * @returns {boolean|null|Promise} (expected) Boolean (or promise) which determines if the stepper hould continue or not depending on true/false respectively or null which would be the same as true.
   */
  onLeave?: (stepEvent: StepEvent) => EventReturnValue
}

interface StepEvent {
  currentStep: Step // Current step.
  sourceStep: Step // Origin/Destination step.
  direction: number | null // A number that indicates what direction we're going and how many steps were taken. Null means one of the steps doesn't exist.
}

type EventReturnValue = boolean | void | Promise<boolean> | Promise<void>

type InternalStep = Step & {
  /**
   * Inherit these props but require ID for internal use.
   */
  id: NonNullable<Step['id']>
  show: NonNullable<Step['show']>
  disabled: NonNullable<Step['disabled']>
  navigable: NonNullable<Step['navigable']>
  visited: NonNullable<Step['visited']>

  /**
   * The step number, can't be overwritten this is for display and
   * navigational purposes. It will change depending on where the
   * step is located.
   */
  number: number

  /**
   * A flag that indicates when busy during a callback.
   */
  processing: boolean
}

const props = withDefaults(
  defineProps<{
    steps: { [stepName: string]: Step }
    headerClass?: string
    restricted?: string | boolean
    modelValue?: null | string
  }>(),
  {
    restricted: false,
  }
)

/**
 * Setup property variables.
 */
const headerClass = props.headerClass || 'vue-stappen-header'
const modelValue = computed(() => props.modelValue)

/**
 * This is the bootstrapper for the steps. It turns the property object into an
 * array and normalizes it. This is where I set defaults.
 */
const steps = computed<Array<InternalStep>>(() => {
  return Object.entries(props.steps)
    .map(([key, step]) => {
      if (!step.id) step.id = key

      step.show = step.show ?? true
      step.disabled = step.disabled ?? false
      step.navigable = step.navigable ?? !props.restricted
      step.visited = step.visited ?? false

      if (!step.title) step.title = startCase(step.id)

      return step as InternalStep
    })
    .filter((step) => step.show) // Filter out hidden steps.
    .map((step, index) => {
      step.number = index + 1
      step.processing = false
      return step
    }) as InternalStep[]
})

/**
 * A helper method to get the index of a step based on it's id.
 * @param id Step id of the step you want the index for.
 */
const getStepIndexById = (id: string): number => {
  return steps.value.findIndex((step: Step) => step.id === id)
}

/**
 * This is a helper method that computes the direction and number of steps between two given steps.
 * @param currentStepId id of the step we are moving from.
 * @param destinationStepId id of the step we're moving to.
 */
const computeDirection = (
  currentStepId: string,
  destinationStepId: string
): null | number => {
  const currentIndex = getStepIndexById(currentStepId)
  const destinationIndex = getStepIndexById(destinationStepId)

  if (currentIndex === -1 || destinationIndex === -1) {
    // Either currentStep or destination is not found in the array.
    return null
  } else {
    // Return direction and steps taken.
    return destinationIndex - currentIndex
  }
}

/**
 * A helper method for constructing the event that is passed to the step events
 * @param currentStep The current step.
 * @param sourceStep The Origin/Destination step.
 */
const constructStepEvent = (currentStep, sourceStep): StepEvent => {
  return {
    currentStep,
    sourceStep,
    direction: computeDirection(currentStep?.id, sourceStep?.id),
  }
}

const setVisitInitialStep = (index: number) => {
  steps.value[index].visited = true
  return index
}

/**
 * Define a current index which will be the one truth on what step we are.
 * Default will be modelValue step found by Id or zero.
 */
const stepIndex = ref<number>(
  props.modelValue
    ? setVisitInitialStep(getStepIndexById(props.modelValue))
    : setVisitInitialStep(0)
)

/**
 * Computed values.
 * These are pretty self explanatory.
 */
const currentStepNumber = computed<number>(() => {
  return stepIndex.value + 1
})
const currentStep = computed<Step>(() => {
  return steps.value[stepIndex.value]
})
const currentStepId = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
const nextStep = computed<Step | null>(() => {
  return steps.value[stepIndex.value + 1] ?? null
})
const previousStep = computed<Step | null>(() => {
  return steps.value[stepIndex.value - 1] ?? null
})

/**
 * Method to navigate stepper to given index.
 * @param index Index of the step you want to navigate to.
 * @param force Override to force navigation if navigable is false.
 */
const navigateToIndex = async (index: number, force = false) => {
  let continues = true

  if (
    continues &&
    steps.value[stepIndex.value]?.onLeave &&
    (steps.value[index]?.navigable || force)
  ) {
    steps.value[stepIndex.value].processing = true

    // Check if onLeave callback exists and execute it.
    // The result of the method determines if allowed to continue.
    try {
      continues =
        (await steps.value[stepIndex.value]?.onLeave?.(
          constructStepEvent(steps.value[stepIndex.value], steps.value[index])
        )) !== false
    } catch (error) {
      console.error(
        `Uncaught error in onLeave event on step ${
          steps.value[stepIndex.value].id
        } -`,
        error
      )
      continues = false
    }

    steps.value[stepIndex.value].processing = false
  }

  if (
    continues &&
    (!steps.value[index] || // Checks if the step even exists.
      steps.value[index].disabled || // Checks if the step is diabled
      (!steps.value[index].navigable && !force)) // Check if you can navigate to step from header and without override.
  )
    continues = false

  if (continues && steps.value[index] && steps.value[index]?.onEnter) {
    steps.value[index].processing = true

    // Check if onEnter callback exists on the requested index and execute it.
    // The result of the method determines if allowed to continue.
    try {
      continues =
        (await steps.value[index]?.onEnter?.(
          constructStepEvent(steps.value[index], steps.value[stepIndex.value])
        )) !== false
    } catch (error) {
      console.error(
        `Uncaught error in onEnter event on step ${
          steps.value[stepIndex.value].id
        } -`,
        error
      )
      continues = false
    }

    steps.value[index].processing = false
  }

  if (steps.value[index] && continues === true) {
    steps.value[index].visited = true
    stepIndex.value = index
    emit('change', currentStep.value)
    currentStepId.value = currentStep.value.id // Emits update model value
  }
}

/**
 * Method to navigate stepper to step with given ID.
 * @param stepId The ID of the step you want to navigate to.
 * @param force Override to force navigation if navigable is false.
 */
const navigateToId = (stepId: string, force = false) => {
  navigateToIndex(getStepIndexById(stepId), force)
}

/**
 * Method to naviagate to the next step.
 */
const next = () => {
  emit('next', currentStep.value)
  navigateToIndex(stepIndex.value + 1, true)
}

/**
 * Method to naviagate to the next previous step.
 */
const previous = () => {
  emit('previous', currentStep.value)
  navigateToIndex(stepIndex.value - 1, true)
}

/**
 * Watch the current step id, it is directly linked to the modelvalue.
 * Navigate when this value changes.
 */
watch(modelValue, (value) => {
  if (value && value !== currentStep.value.id) {
    navigateToId(value, true)
  }
})

onMounted(() => {
  if (!props.modelValue) {
    emit('update:modelValue', currentStep.value.id)
  }
})

/**
 * Vue defines.
 */
defineExpose({
  next,
  previous,
  navigateToId,
})
const emit = defineEmits(['next', 'previous', 'change', 'update:modelValue'])
</script>

<template>
  <div>
    <div v-if="$slots['header-item']" :class="headerClass">
      <transition-group name="step-header">
        <div v-for="step in steps" :key="step.id">
          <div
            @click="
              navigateToId(
                step.id,
                restricted === 'allow-visited' && step.visited
              )
            "
          >
            <slot
              name="header-item"
              :step="step"
              :active="step.number === currentStepNumber"
            />
          </div>
        </div>
      </transition-group>
    </div>
    <div v-else :class="headerClass">
      <transition-group name="step-header">
        <div v-for="step in steps" :key="step.id">
          <div
            class="cursor-pointer"
            @click="
              navigateToId(
                step.id,
                restricted === 'allow-visited' && step.visited
              )
            "
          >
            <div>Step {{ step.number }}</div>
            <div v-text="step.title" />
          </div>
        </div>
      </transition-group>
    </div>

    <transition name="step-content" mode="out-in">
      <slot
        :name="currentStep?.id ?? 'fallback'"
        :current-step="currentStep"
        :next="next"
        :previous="previous"
        :navigate-to-id="navigateToId"
        :next-step="nextStep"
        :previous-step="previousStep"
      >
        This step does not exist!
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

.vue-stappen-header {
  display: flex;
}

.vue-stappen-header > div,
.vue-stappen-header > div > div {
  width: 100%;
}
</style>
