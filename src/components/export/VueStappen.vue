<script setup lang="ts">
import { computed, ref, useSlots, type RendererNode, onMounted, nextTick, watch } from 'vue'
import VueStap from './VueStap.vue'
import kebabCase from 'lodash.kebabcase'

export type Guard = () => boolean|Promise<boolean>

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

const checkStepperGuard = async (guardKey: keyof Guards): Promise<boolean> => {
  const guard = getGuard(props, guardKey)

  if (guard === undefined) {
    return true
  }

  processing.value = true
  const result = await guard()
  processing.value = false

  return result
}

const checkStepGuard = async (step: RendererNode, guardKey: keyof Guards): Promise<boolean> => {  
  const guard = getGuard(step.props, guardKey)  

  if (guard === undefined) {
    return true
  }
  
  // Call component events from here  
  step.props['onUpdate:processing'](true)
  const result = await guard()
  step.props['onUpdate:processing'](false)

  return result
}

const moveToIndex = async (index: number) => {
  // Void if stepper or step is still processing  
  if (currentStepComponent.value.props.processing || processing.value) {
    return
  }

  if (!await checkStepperGuard('onMove')) {
    return
  }

  if (!await checkStepGuard(currentStepComponent.value, 'onMove')) {
    return
  }
  
  // Void if next step doesn't exist
  if (!stepComponents.value[index]) {
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
    <div :class="stepClass">
      <component :is="currentStepComponent.children.default" v-if="currentStepComponent?.children"></component>
    </div>
    <div>
      <slot name="navigation" v-bind="{ previous, next, nextStep: stepComponents[currentStepIndex + 1] ?? false, previousStep: stepComponents[currentStepIndex - 1] ?? false }">
        <button @click="previous">Previous</button>
        <button @click="next">Next</button>
      </slot>
    </div>
  </div>
</template>