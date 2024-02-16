<script setup lang="ts">
import { computed, ref, useSlots, type RendererNode, onMounted, nextTick, watch } from 'vue';
import VueStap from './VueStap.vue';

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
    } else if (element.children) {
      getSteps(element.children, result)
    }
  });
  
  return result
}

const currentStepIndex = ref(0)

const stepComponents = computed(() => {
  const defaultSlot = useSlots().default

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

const currentStepComponent = computed(() => { 
  return stepComponents.value[currentStepIndex.value]
})

const checkGuard = async (guardKey: keyof Guards): Promise<boolean> => {
  const guard = props[guardKey] as Guard|undefined

  if (guard === undefined) {
    return true
  }

  processing.value = true
  const result = await guard()
  processing.value = false

  return result
}

const moveToIndex = async (index: number) => {
  // Void if step doesn't exist
  if (!stepComponents.value[index]) {
    return
  }

  if (!await checkGuard('onMove')) {
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
    
  return {
    visited: history.value.includes(stepComponent.props.id),
    step: stepComponent.props,
    active,
    index,
    currentIndex: currentStepIndex.value,
    number: index + 1,
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
      <component :is="currentStepComponent.children.default"></component>
    </div>
    <div>
      <slot name="navigation" v-bind="{ previous, next }">
        <button @click="previous">Previous</button>
        <button @click="next">Next</button>
      </slot>
    </div>
  </div>
</template>