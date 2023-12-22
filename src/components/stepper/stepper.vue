<script setup lang="ts">
import { computed, ref, useSlots, type RendererNode, watch } from 'vue'
import camelCase from 'lodash.camelcase'
import { useRefHistory } from '@vueuse/core'
import StepComponent from './step.vue'
import scrollIntoView from 'scroll-into-view-if-needed'

defineOptions({
  name: 'VueStappen'
})

export interface GuardParams<T={}> {
  direction: number
  step: T
  target: T | null
}

interface StepperGuards {
  onMove?: (params: GuardParams) => boolean
  onAdvance?: (params: GuardParams) => boolean
  onReverse?: (params: GuardParams) => boolean
}

interface StepGuards {
  onMove?: (params: GuardParams) => boolean
  onAdvance?: (params: GuardParams) => boolean
  onReverse?: (params: GuardParams) => boolean
}

type Guards = StepperGuards & StepGuards

interface Props extends StepperGuards {
  modelValue?: object
  allowDirectNavigation?: boolean
  headerClass?: string | object | Array<any>
  processing?: boolean
  maxStepSize?: number
  undoOnPrevious?: boolean
  progressive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  allowDirectNavigation: true,
  headerClass: '',
  processing: false,
  maxStepSize: undefined,
  undoOnPrevious: false,
  progressive: false
})

const emit = defineEmits([
  'update:modelValue',
  'update:processing',
])

const slots = useSlots()

const steps = computed(() => {
  const depth = 3
  let currentLevel = 0

  const _steps: RendererNode[] = []

  const searchRecursive = (items: RendererNode[]) => {
    for (const item of items) {
      if (item.type === StepComponent) {
        _steps.push(item)
      }

      if (
        item.children &&
        Array.isArray(item.children) &&
        item.children.length > 0 &&
        currentLevel <= depth
      ) {
        currentLevel++
        searchRecursive(item.children)
      }
    }
  }

  searchRecursive(slots.default ? slots.default() : [])

  if (_steps.length < 1) {
    throw new Error('Unable to render stepper, at least 1 step required!')
  }

  return _steps.map((step, key) => {
    step.props = Object.fromEntries(
      Object.entries({
        name: `Step ${key + 1}`,
        ...step.props
      }).map(([k, v]) => [camelCase(k), v])
    )
    return step
  })
})

const _processing = ref(false)

watch(_processing, (value) => {  
  emit('update:processing', value)
})

const currentId = ref<string>(steps.value[0].props.id)
const idHistorty = useRefHistory(currentId)
const currentStep = computed<RendererNode>(() => {
  let _currentStep = steps.value.find(({ props }) => props.id === currentId.value)

  if (!_currentStep) {
    idHistorty.undo()
    _currentStep = steps.value[0]
  }

  emit('update:modelValue', _currentStep.props)
  
  return _currentStep
})

const checkGuard = async (name: keyof Guards, params: GuardParams) => {
  let continues = true

  _processing.value = true

  // If guard exists on stepper, check it
  if (props[name] && typeof props[name] === 'function') {
    try {
      const result = await props[name]?.(params)

      continues = result === undefined || !!result
    } catch (error) {
      console.error(`Error in stepper guard "${name}": ` + error)
    }
  }

  // If guard exists on step itself, check it
  if (currentStep.value.props[name] && typeof currentStep.value.props[name] === 'function') {
    try {
      const result = await currentStep.value.props[name]?.()

      continues = result === undefined || !!result
    } catch (error) {
      console.error(`Error in step "${currentStep.value.props.id}" guard "${name}": ` + error)
    }
  }

  _processing.value = false

  return continues
}

function calculateTargetDirection(
  currentStep: RendererNode,
  targetStep?: RendererNode
): number {
  return targetStep ? steps.value.indexOf(targetStep) - steps.value.indexOf(currentStep) : 0;
}

const toStep = async (targetStep: RendererNode | undefined, direction: number|null = null) => {
  // Void action if stepper is still processing 
  if (_processing.value === true) {
    return
  }

  const params: GuardParams = {
    direction: direction || calculateTargetDirection(currentStep.value, targetStep),
    step: currentStep.value.props,
    target: targetStep?.props ?? null
  }

  if (!(await checkGuard('onMove', params))) {
    return;
  }

  // Void action if step doesn't exist
  if (!targetStep || (props.maxStepSize !== undefined && Math.abs(props.maxStepSize) < Math.abs(params.direction) )) {
    return
  }

  // Directional middleware
  if (
    (params.direction && params.direction >= 1 && !(await checkGuard('onAdvance', params))) ||
    (params.direction && params.direction <= -1 && !(await checkGuard('onReverse', params)))
  ) {
    return
  }

  // Actual move
  currentId.value = targetStep.props.id

  // Scroll step header into view if not in view
  const headerElement = document.getElementById(`header-${currentStep.value.props.id}`)
  const headerContainer = document.getElementById('header-containter')
  if (headerElement && headerContainer) {
    scrollIntoView(headerElement, {
      block: 'nearest',
      inline: params.direction ? (params.direction < 0 ? 'start' : 'end') : 'center',
      behavior: 'smooth',
      scrollMode: 'if-needed',
      boundary: headerContainer
    })
  }
}

const next = () => {
  toStep(steps.value[steps.value.indexOf(currentStep.value) + 1], 1)
}
const previous = () => {
  if (props.undoOnPrevious === true) {
    idHistorty.undo()
    return
  }

  toStep(steps.value[steps.value.indexOf(currentStep.value) - 1], -1)
}
const navigateTo = (stepId: string) => {
  if (!props.allowDirectNavigation) {
    return;
  }

  const step = steps.value.find(({ props }) => props.id === stepId)

  if (!step) {
    throw new Error(`Error trying to navigate to step "${stepId}": A step with this id does not exist.`)
  }

  toStep(step)
}

const navigation = {
  next,
  previous,
}

const isVisited = (step: RendererNode) => !!idHistorty.history.value.find(({ snapshot }) => snapshot === step.props.id)
const isInrange = (step: RendererNode) => props.maxStepSize || props.maxStepSize === 0 ? Math.abs(calculateTargetDirection(currentStep.value, step)) <= Math.abs(props.maxStepSize) : true
</script>

<template>
  <div>
    <ol id="header-containter" style="display: flex; overflow: auto" :class="headerClass">
      <li v-for="(step, index) in steps" :id="`header-${step.props.id}`" :key="index">
        <slot
          name="header"
          v-bind="{
            current: step.props.id === currentId,
            processing: step.props.id === currentId && _processing,
            visited: progressive ? (calculateTargetDirection(currentStep, step) < 0) : isVisited(step),
            step: step.props,
            number: steps.indexOf(step) + 1,
            callback: () => navigateTo(step.props.id),
            available: isInrange(step) && !processing,
            distanceFromCurrent: calculateTargetDirection(currentStep, step),
          }"
        >
          <div @click="toStep(step.props.id)">
            {{ step.props.name }}
          </div>
        </slot>
      </li>
    </ol>

    <!-- Stepper content -->
    <div>
      <component :is="currentStep.children.default" />
    </div>

    <slot name="navigation" :methods="navigation" :processing="processing">
      <slot name="previous" :methods="navigation" :processing="processing">
        <button :disabled="processing" @click="previous">
          Previous
        </button>
      </slot>
      <slot name="next" :methods="navigation" :processing="processing">
        <button :disabled="processing" @click="next">
          Next
        </button>
      </slot>
    </slot>
  </div>
</template>
