<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import startCase from 'lodash.startcase'
import Superchain from 'superchain'

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
   * @param context Step event.
   * @returns {boolean|null|Promise} (expected) Boolean (or promise) which determines if the stepper hould continue or not depending on true/false respectively or null which would be the same as true.
   */
  onEnter?: (context: StepEventContext) => EventReturnValue

  /**
   * Callback when leaving a step.
   * @param context Step event.
   * @returns {boolean|null|Promise} (expected) Boolean (or promise) which determines if the stepper hould continue or not depending on true/false respectively or null which would be the same as true.
   */
  onLeave?: (context: StepEventContext) => EventReturnValue

  /**
   * Callback when moving to the next step.
   * @param context Step event.
   * @returns {boolean|null|Promise} (expected) Boolean (or promise) which determines if the stepper hould continue or not depending on true/false respectively or null which would be the same as true.
   */
  onNext?: (context: StepEventContext) => EventReturnValue

  /**
   * Callback when moving to the previous step.
   * @param context Step event.
   * @returns {boolean|null|Promise} (expected) Boolean (or promise) which determines if the stepper hould continue or not depending on true/false respectively or null which would be the same as true.
   */
  onPrevious?: (context: StepEventContext) => EventReturnValue

  /**
   * Callback when moving forward.
   * @param context Step event.
   * @returns {boolean|null|Promise} (expected) Boolean (or promise) which determines if the stepper hould continue or not depending on true/false respectively or null which would be the same as true.
   */
  onForward?: (context: StepEventContext) => EventReturnValue

  /**
   * Callback when moving backward.
   * @param context Step event.
   * @returns {boolean|null|Promise} (expected) Boolean (or promise) which determines if the stepper hould continue or not depending on true/false respectively or null which would be the same as true.
   */
  onBackward?: (context: StepEventContext) => EventReturnValue
}

interface StepEventContext {
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
const currentStep = computed<InternalStep>(() => {
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
const nextStep = computed<InternalStep | null>(() => {
  return steps.value[stepIndex.value + 1] ?? null
})
const previousStep = computed<InternalStep | null>(() => {
  return steps.value[stepIndex.value - 1] ?? null
})

/**
 * Method to navigate stepper to given index.
 * @param index Index of the step you want to navigate to.
 * @param force Override to force navigation if navigable is false.
 * @param direction Override for direction, used by next and previous to allow for onNext and onPrevious callback when source step doesn't exist. If null it will be computed.
 */
const navigateToIndex = async (
  index: number,
  force = false,
  direction?: number
) => {
  // Construct the chain.
  const chain = new Superchain()

  // Define contextual current and source steps.
  const currentStep = steps.value[stepIndex.value]
  const sourceStep = steps.value[index]

  // Define the context that will be passed to EVERY event.
  const context: StepEventContext = {
    currentStep,
    sourceStep,
    direction: direction ?? computeDirection(currentStep?.id, sourceStep?.id),
  }

  // Check if source step even exists and if it is navigable.
  chain.add((context: StepEventContext, next) => {
    if (sourceStep && (sourceStep.navigable || force)) next()
    // If the source step doesn't exist, check if it's the last step and emit event if so.
    else if (index + 1 > steps.value.length) emit('finish', context)
  })

  // Guard when leaving step.
  chain.add((context: StepEventContext, next) =>
    handleCallback(currentStep, context, next, 'onLeave')
  )

  // Directional callbacks from step.
  if (context.direction) {
    // Guard very next step.
    if (context.direction === 1) {
      chain.add((context: StepEventContext, next) => {
        handleCallback(currentStep, context, next, 'onNext')
        emit('next', context)
      })
    }

    // Guard any step forward.
    if (context.direction >= 1) {
      chain.add((context: StepEventContext, next) => {
        handleCallback(currentStep, context, next, 'onForward')
        emit('forward', context)
      })
    }

    // Guard immediately preceding step.
    if (context.direction === -1) {
      chain.add((context: StepEventContext, next) => {
        handleCallback(currentStep, context, next, 'onPrevious')
        emit('previous', context)
      })
    }

    // Guard any step backward.
    if (context.direction <= -1) {
      chain.add((context: StepEventContext, next) => {
        handleCallback(currentStep, context, next, 'onBackward')
        emit('backward', context)
      })
    }
  }

  // Guard source step.
  chain.add((context: StepEventContext, next) =>
    handleCallback(sourceStep, context, next, 'onEnter')
  )

  // Performing the move.
  chain.final((context: StepEventContext) => {
    steps.value[index].visited = true
    stepIndex.value = index
    emit('change', context)
    currentStepId.value = sourceStep.id
  })

  // Run the chain.
  chain.run(context)
}

/**
 * A method that calls a callback by name on a step if it exists.
 *
 * @param step The step the event should be called on.
 * @param context The context that will be passed to the event.
 * @param next Callback for passing the middleware.
 * @param callbackName Name of the callback.
 */
const handleCallback = async (
  step: InternalStep,
  context: StepEventContext,
  next: () => void,
  callbackName: string
) => {
  if (step[callbackName]) {
    step.processing = true

    let callbackResult = false
    try {
      callbackResult = await step[callbackName](context)
    } catch (error) {
      callbackResult = false
    }

    step.processing = false

    if (callbackResult !== false) {
      next()
    }
  } else {
    next()
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
const next = (stepSize = 1) => {
  navigateToIndex(stepIndex.value + stepSize, true, stepSize)
}

/**
 * Method to naviagate to the next previous step.
 */
const previous = (stepSize = 1) => {
  navigateToIndex(stepIndex.value - stepSize, true, -stepSize)
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

const emit = defineEmits([
  'next',
  'forward',
  'backward',
  'previous',
  'change',
  'finish',
  'update:modelValue',
])
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
        <button
          @click="previous()"
          :disabled="currentStep.processing || previousStep?.processing"
        >
          previous
        </button>
        <button
          @click="next()"
          :disabled="currentStep.processing || nextStep?.processing"
        >
          next
        </button>
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
