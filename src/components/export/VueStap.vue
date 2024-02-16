<script setup lang="ts">
defineOptions({
  name: 'VueStappenStap'
})

defineProps<{
  id: string|number
}>()

defineModel<boolean>('processing', { default: false })
</script>
