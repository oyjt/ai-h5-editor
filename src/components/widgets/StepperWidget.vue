<script setup lang="ts">
/**
 * 步进器组件 Widget
 */
import { ref, watch } from 'vue'
import { Stepper as VanStepper } from 'vant'

interface Props {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  disableInput?: boolean
  showInput?: boolean
  buttonSize?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 1,
  min: 1,
  max: 99999,
  step: 1,
  disabled: false,
  disableInput: false,
  showInput: true,
  buttonSize: '28px',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'change': [value: number]
}>()

const currentValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  currentValue.value = val
})

function handleChange(val: number | string) {
  const num = Number(val)
  emit('update:modelValue', num)
  emit('change', num)
}
</script>

<template>
  <VanStepper
    v-model="currentValue"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :disable-input="disableInput"
    :show-input="showInput"
    :button-size="buttonSize"
    @change="handleChange"
  />
</template>

<style scoped>
</style>
