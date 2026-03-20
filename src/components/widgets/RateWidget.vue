<script setup lang="ts">
/**
 * 评分组件 Widget
 */
import { ref, watch } from 'vue'
import { Rate as VanRate } from 'vant'

interface Props {
  modelValue?: number
  count?: number
  size?: string
  color?: string
  voidColor?: string
  allowHalf?: boolean
  readonly?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  count: 5,
  size: '20px',
  color: '#ee0a24',
  voidColor: '#c8c9cc',
  allowHalf: false,
  readonly: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'change': [value: number]
}>()

const currentValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  currentValue.value = val
})

function handleChange(val: number) {
  emit('update:modelValue', val)
  emit('change', val)
}
</script>

<template>
  <VanRate
    v-model="currentValue"
    :count="count"
    :size="size"
    :color="color"
    :void-color="voidColor"
    :allow-half="allowHalf"
    :readonly="readonly"
    :disabled="disabled"
    @change="handleChange"
  />
</template>

<style scoped>
</style>
