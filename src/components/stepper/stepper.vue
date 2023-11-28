<script setup lang="ts">
import { computed, ref, useSlots, type RendererNode } from 'vue'
import camelCase from 'lodash.camelcase'
import { useRefHistory } from '@vueuse/core'
import Step from './step.vue'
import scrollIntoView from 'scroll-into-view-if-needed'

defineOptions({
  name: 'VueStappen'
})

interface Middlewares {
  onAdvance?: () => boolean
  onReverse?: () => boolean
  // Add any other keys as needed
}

interface Props extends Middlewares {
  modelValue?: object
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

const slots = useSlots()

const steps = computed(() => {
  const _steps: RendererNode[] = []

  const depth = 3
  let currentLevel = 0

  const searchRecursive = (items: RendererNode[]) => {
    for (const item of items) {
      if (item.type === Step) {
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
        name: `step ${key + 1}`,
        visible: true,
        ...step.props
      }).map(([k, v]) => [camelCase(k), v])
    )
    return step
  })
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

const checkGlobalGuard = async (name: keyof Middlewares) => {
  let continues = true

  if (props[name] && typeof props[name] === 'function') {
    const result = await props[name]?.()

    continues = result === undefined || !!result
  }

  if (currentStep.value.props[name] && typeof currentStep.value.props[name] === 'function') {
    const result = await currentStep.value.props[name]?.()

    continues = result === undefined || !!result
  }

  return continues
}

const toStep = async (targetStep: RendererNode | undefined) => {
  if (!targetStep) {
    return
  }

  const directon = steps.value.indexOf(targetStep) - steps.value.indexOf(currentStep.value)

  // Stepper middleware
  if (
    (directon >= 1 && !(await checkGlobalGuard('onAdvance'))) ||
    (directon <= -1 && !(await checkGlobalGuard('onReverse')))
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
      inline: directon < 0 ? 'start' : 'end',
      behavior: 'smooth', // or 'auto' for instant scrolling
      scrollMode: 'if-needed', // or 'always'
      boundary: headerContainer
    })
  }
}

const next = () => {
  toStep(steps.value[steps.value.indexOf(currentStep.value) + 1])
}
const previous = () => {
  toStep(steps.value[steps.value.indexOf(currentStep.value) - 1])
}

const navigation = {
  next,
  previous
}
</script>

<template>
  <div>
    <div id="header-containter" style="display: flex; overflow: auto">
      <div v-for="(step, index) in steps" :id="`header-${step.props.id}`" :key="index">
        <component
          :is="step.children.header"
          v-if="step.children.header"
          :step="step.props"
          :current="step.props.id === currentId"
          :visited="!!idHistorty.history.value.find(({ snapshot }) => snapshot === step.props.id)"
          :number="steps.indexOf(step) + 1"
          :callback="() => toStep(step)"
        />
        <div v-else>
          <slot
            name="header"
            :current="step.props.id === currentId"
            :visited="!!idHistorty.history.value.find(({ snapshot }) => snapshot === step.props.id)"
            :step="step.props"
            :number="steps.indexOf(step) + 1"
            :callback="() => toStep(step)"
          >
            {{ step.props.name }}
          </slot>
        </div>
      </div>
    </div>

    <!-- Stepper content -->
    <div>
      <component :is="currentStep.children.default" />
    </div>

    <slot name="navigation" :methods="navigation">
      <slot name="previous" :methods="navigation">
        <button @click="previous">
          Previous
        </button>
      </slot>
      <slot name="next" :methods="navigation">
        <button @click="next">
          Next
        </button>
      </slot>
    </slot>
  </div>
</template>
