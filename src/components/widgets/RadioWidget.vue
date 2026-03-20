<script setup lang="ts">
/**
 * 单选框组件 Widget
 */
import { ref } from 'vue'
import { RadioGroup as VanRadioGroup, Radio as VanRadio } from 'vant'

interface Props {
  options?: Array<{ label: string; value: string | number }>
  value?: string | number
  direction?: 'horizontal' | 'vertical'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
  ],
  value: '1',
  direction: 'horizontal',
  disabled: false,
})

const selectedValue = ref(props.value)
</script>

<template>
  <VanRadioGroup v-model="selectedValue" :direction="direction">
    <VanRadio
      v-for="option in options"
      :key="option.value"
      :name="option.value"
      :disabled="disabled"
    >
      {{ option.label }}
    </VanRadio>
  </VanRadioGroup>
</template>

<style scoped>
</style>
