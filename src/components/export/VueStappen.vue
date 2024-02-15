<script setup lang="ts">
import { computed, ref, useSlots, type RendererNode } from 'vue';
import VueStap from './VueStap.vue';

const props = defineProps<{
  step?: string
  headerClass?: string
  stepClass?: string
}>()

const emit = defineEmits([
  'update:step'
])

const step = computed({
  get () {
    return props.step
  },
  set (value) {
    emit('update:step', value)
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

const currentStepComponent = computed(() => { 
  return stepComponents.value[currentStepIndex.value]
})

const history = ref<string[]>([
  stepComponents.value[0].props.id
])

const moveToIndex = (index: number) => {
  // Void if step doesn't exist
  if (!stepComponents.value[index]) {
    return
  }

  // The actual move
  currentStepIndex.value = index

  // Add current step to hitory
  history.value.push(currentStepComponent.value.props.id)
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