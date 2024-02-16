<script setup lang="ts">
defineOptions({
  name: 'VueStappenStap'
})

defineProps<{
  id: string|number
}>()

const processing = defineModel<boolean>('processing', { default: false })

const setProcessing = (value: boolean): void => {
  processing.value = value
}

defineExpose([
  'setProcessing'
])
</script>
