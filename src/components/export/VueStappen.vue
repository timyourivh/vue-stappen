<script setup lang="ts">
import { computed, ref, useSlots, type RendererNode, onMounted, nextTick, watch } from 'vue'
import VueStap from './VueStap.vue'
import kebabCase from 'lodash.kebabcase'

export type GuardProps<T = {[key: string]: any}> = {
  direction: number|null,
  currentStep: T, 
  targetStep?: T
}
export type Guard = (props: GuardProps) => boolean|Promise<boolean>

interface Guards {
  onMove?: Guard
}

// Definitions
const props = defineProps<{
  headerClass?: string
  stepClass?: string
} & Guards>()

// Models
const history = defineModel<string[]>('history', { default: [] })
const modelValue = defineModel<string>({ default: null })
const processing = defineModel<boolean>('processing', { default: false })
const stepProcessing = defineModel<boolean>('stepProcessing', { default: false })

watch(modelValue, (value) => {
  const targetIndex = getIndexById(value)
  if (targetIndex !== currentStepIndex.value) {
    moveToIndex(targetIndex)
  }  
})

const getSteps = (list: RendererNode[], result: RendererNode[] = []) => {  
  list.forEach(element => {    
    if (element.type === VueStap) {      
      result.push(element)
      return 
    } else if (Array.isArray(element.children)) {
      getSteps(element.children, result)
    }
  });
  
  return result
}

const currentStepIndex = ref(0)
const defaultSlot = useSlots().default

const stepComponents = computed(() => {
  if (typeof defaultSlot !== 'function') {
    throw new Error('Unable to render stepper without steps.')
  }
  
  return getSteps(defaultSlot())
})

const getIndexById = (id: string) => {
  const step = stepComponents.value.find(({ props }) => {    
    return props.id === id
  })

  if (step) {
    return stepComponents.value.indexOf(step)
  }
  
  return -1
}

watch([stepComponents, currentStepIndex], ([newSteps, newIndex], [oldSteps, oldIndex]) => {
  if (newSteps.length !== oldSteps.length && oldSteps[oldIndex] && newSteps.find(({ props: { id } }) => id === oldSteps[oldIndex].props.id)) {
    // Maintain current step by id

    currentStepIndex.value = getIndexById(oldSteps[oldIndex].props.id)
  }

  const oldStepIds = oldSteps.map(({ props: { id }}) => id)
  const newStepIds = newSteps.map(({ props: { id }}) => id)
  const removedStepIds = oldStepIds.filter(step => !newStepIds.includes(step))

  if (oldSteps[oldIndex] && removedStepIds.includes(oldSteps[oldIndex].props.id)) {
    // If the step got removed

    const offsetIndex = newIndex - (removedStepIds.indexOf(oldSteps[oldIndex].props.id) + 1)

    if (stepComponents.value[offsetIndex]) {
      // If the index exists set to index
      currentStepIndex.value = offsetIndex
    } else {
      // Else move to first step
      currentStepIndex.value = 0
    }

    // Always add new step to history
    history.value.push(modelValue.value = currentStepComponent.value.props.id)
  }
})

const currentStepComponent = computed(() => {
  return stepComponents.value[currentStepIndex.value]
})

const getGuard = (object: Record<string, any>, key: string): Guard|undefined => {  
  if (object[key]) {
    return object[key]
  }
  return object[kebabCase(key)]
}

const calculateDirection = (source: RendererNode, target?: RendererNode) => {
  if (!target) {
    return null
  }

  return stepComponents.value.indexOf(target) - stepComponents.value.indexOf(source)
}

const checkStepperGuard = async (guardKey: keyof Guards, direction: number|null, targetStep?: RendererNode): Promise<boolean> => {
  const guard = getGuard(props, guardKey)

  if (guard === undefined) {
    return true
  }

  processing.value = true
  const result = await guard({
    direction,
    currentStep: currentStepComponent.value.props, 
    targetStep: targetStep?.props ?? null
  })
  processing.value = false

  return result
}

const checkStepGuard = async (step: RendererNode, guardKey: keyof Guards, direction: number|null, targetStep?: RendererNode): Promise<boolean> => {  
  const guard = getGuard(step.props, guardKey)  

  if (guard === undefined) {
    return true
  }
  
  // Call component events from here  
  step.props['onUpdate:processing'](true)
  stepProcessing.value = true
  const result = await guard({
    direction,
    currentStep: currentStepComponent.value.props, 
    targetStep: targetStep?.props ?? null
  })
  step.props['onUpdate:processing'](false)
  stepProcessing.value = false

  return result
}

const formRef = ref()
const moveToIndex = async (index: number) => {
  // Check browser validation
  if (!formRef.value.checkValidity()) {
    formRef.value.reportValidity()
    return
  }

  // Void if stepper or step is still processing  
  if (currentStepComponent.value.props.processing || processing.value) {
    return
  }

  const targetStep = stepComponents.value[index]
  const direction = calculateDirection(currentStepComponent.value, targetStep)

  if (!await checkStepperGuard('onMove', direction, targetStep)) {
    return
  }

  if (!await checkStepGuard(currentStepComponent.value, 'onMove', direction, targetStep)) {
    return
  }
  
  // Void if next step doesn't exist
  if (!targetStep) {
    return
  }

  // Void if not actually moving
  if (currentStepIndex.value === index) {
    return
  }

  // The actual move
  currentStepIndex.value = index

  // Add current step to hitory
  history.value.push(modelValue.value = currentStepComponent.value.props.id)

  return
}

const next = () => {
  moveToIndex(currentStepIndex.value + 1)
}
const previous = () => {  
  moveToIndex(currentStepIndex.value - 1)
}

const headerProps = (stepComponent: RendererNode, index: number) => {
  const active = stepComponent === currentStepComponent.value
  const currentIndex = stepComponents.value.indexOf(currentStepComponent.value)
  const targetIndex = stepComponents.value.indexOf(stepComponent)
    
  return {
    visited: history.value.includes(stepComponent.props.id),
    step: stepComponent.props,
    processing: processing.value,
    active,
    index,
    currentIndex: currentStepIndex.value,
    number: index + 1,
    visit: () => moveToIndex(getIndexById(stepComponent.props.id)),
    delta: targetIndex - currentIndex
  }
}

const navigationProps = () => {
  return {
    previous,
    next,
    nextStep: stepComponents.value[currentStepIndex.value + 1] ?? false,
    previousStep: stepComponents.value[currentStepIndex.value - 1] ?? false, 
    processing: processing.value || stepProcessing.value
  }
}
onMounted(() => {
  processing.value = false
  if (modelValue.value !== null) {
    currentStepIndex.value = getIndexById(modelValue.value)
  }
  
  modelValue.value = currentStepComponent.value.props.id

  nextTick(() => {
    if (!history.value.includes(modelValue.value)) {    
      history.value.push(modelValue.value)
    }
  })
})
</script>

<template>
  <div :class="headerClass">
    <template v-for="(stepComponent, index) in stepComponents" :key="stepComponent.props.id">
      <component :is="stepComponent.children.header" v-bind="headerProps(stepComponent, index)" v-if="stepComponent.children?.header" />
      <slot v-else v-bind="headerProps(stepComponent, index)" name="header-item">
        Step {{ index + 1 }}
      </slot>
    </template>
  </div>
  <div>
    <form ref="formRef" :class="stepClass" @submit.prevent="next">
      <component :is="currentStepComponent.children.default" v-if="currentStepComponent?.children"></component>
    </form>
    <div>
      <slot name="navigation" v-bind="navigationProps()">
        <button @click="previous">Previous</button>
        <button @click="next">Next</button>
      </slot>
    </div>
  </div>
</template>