<script setup lang="ts">
import { computed, onMounted, ref, useSlots, type RendererNode } from 'vue';
import VueStap from './VueStap.vue';

const props = defineProps<{
  step?: string
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

const getSteps = (list: RendererNode[]) => {
  const steps: RendererNode[] = []

  list.forEach(element => {
    if (element.type === VueStap) {
      steps.push(element)
      return 
    } else if (element.children) {
      getSteps(element.children)
    }
  });

  return steps
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

const next = () => {
  if (stepComponents.value[currentStepIndex.value + 1]) {
    currentStepIndex.value++
  }
}
const previous = () => {  
  if (stepComponents.value[currentStepIndex.value - 1]) {
    currentStepIndex.value--
  }
}

const headerProps = (stepComponent: RendererNode, index: number) => {
  const active = stepComponent === currentStepComponent.value

  return {
    active,
    index,
    number: index + 1,
  }
}
</script>

<template>
  <div>
    <div v-for="(stepComponent, index) in stepComponents" :key="stepComponent.props.id">
      <component :is="stepComponent.children.header" v-bind="headerProps(stepComponent, index)" v-if="stepComponent.children?.header" />
      <slot v-else v-bind="headerProps(stepComponent, index)" name="header-item">
        Step {{ index + 1 }}
      </slot>
    </div>
  </div>
  <div>
    <div>
      <component :is="currentStepComponent.children.default"></component>
    </div>
    <div>
      <div>
        <button @click="previous">Previous</button>
        <button @click="next">Next</button>
      </div>
    </div>
  </div>
</template>