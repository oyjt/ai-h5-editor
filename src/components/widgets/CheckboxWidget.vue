<script setup lang="ts">
/**
 * 复选框组件 Widget
 */
import { ref } from 'vue'
import { CheckboxGroup as VanCheckboxGroup, Checkbox as VanCheckbox } from 'vant'

interface Props {
  options?: Array<{ label: string; value: string | number }>
  value?: Array<string | number>
  direction?: 'horizontal' | 'vertical'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' },
  ],
  value: () => ['1'],
  direction: 'horizontal',
  disabled: false,
})

const selectedValues = ref(props.value)
</script>

<template>
  <VanCheckboxGroup v-model="selectedValues" :direction="direction">
    <VanCheckbox
      v-for="option in options"
      :key="option.value"
      :name="option.value"
      :disabled="disabled"
    >
      {{ option.label }}
    </VanCheckbox>
  </VanCheckboxGroup>
</template>

<style scoped>
</style>
