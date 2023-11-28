<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    name: {
        type: [String, Number, null],
        default: () => Date.now()
    },
    label: {
        type: [String, null],
        default: null
    },

})

const emit = defineEmits([
    'update:modelValue'
])

const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

</script>

<template>
  <div class="flex items-center mb-4">
    <input
      :id="props.name"
      v-model="value"
      :name="props.name"
      type="checkbox"
      class="w-4 h-4 text-indigo-500 bg-gray-100 border-gray-300 rounded focus:ring-indigo-400 focus:ring-2"
    >
    <label
      v-if="props.label"
      :for="props.name"
      class="ms-2 text-sm font-medium text-gray-900 select-none"
      v-text="props.label"
    />
  </div>
</template>