<script setup lang="ts">
/**
 * 复选框组件 Widget
 */
import { ref } from 'vue'

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
  <div class="checkbox-widget" :class="`checkbox-${direction}`">
    <label
      v-for="option in options"
      :key="option.value"
      class="checkbox-item"
      :class="{ 'checkbox-disabled': disabled }"
    >
      <input
        v-model="selectedValues"
        type="checkbox"
        :value="option.value"
        :disabled="disabled"
        class="checkbox-input"
      >
      <span class="checkbox-label">{{ option.label }}</span>
    </label>
  </div>
</template>

<style scoped>
.checkbox-widget {
  display: flex;
  gap: 16px;
}

.checkbox-horizontal {
  flex-direction: row;
}

.checkbox-vertical {
  flex-direction: column;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.checkbox-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkbox-disabled .checkbox-input {
  cursor: not-allowed;
}

.checkbox-label {
  font-size: 14px;
  color: #333;
}
</style>
