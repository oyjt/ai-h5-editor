<script setup lang="ts">
/**
 * 单选框组件 Widget
 */
import { ref } from 'vue'

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
  <div class="radio-widget" :class="`radio-${direction}`">
    <label
      v-for="option in options"
      :key="option.value"
      class="radio-item"
      :class="{ 'radio-disabled': disabled }"
    >
      <input
        v-model="selectedValue"
        type="radio"
        :value="option.value"
        :disabled="disabled"
        class="radio-input"
      >
      <span class="radio-label">{{ option.label }}</span>
    </label>
  </div>
</template>

<style scoped>
.radio-widget {
  display: flex;
  gap: 16px;
}

.radio-horizontal {
  flex-direction: row;
}

.radio-vertical {
  flex-direction: column;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.radio-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.radio-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.radio-disabled .radio-input {
  cursor: not-allowed;
}

.radio-label {
  font-size: 14px;
  color: #333;
}
</style>
