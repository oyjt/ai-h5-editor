<script setup lang="ts">
/**
 * 输入框组件 Widget
 */
import { computed } from 'vue'

interface Props {
  placeholder?: string
  value?: string
  type?: 'text' | 'number' | 'password' | 'tel' | 'email'
  disabled?: boolean
  readonly?: boolean
  maxlength?: number
  clearable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入内容',
  value: '',
  type: 'text',
  disabled: false,
  readonly: false,
  clearable: false,
})

const inputClass = computed(() => ({
  'input-disabled': props.disabled,
  'input-readonly': props.readonly,
}))
</script>

<template>
  <div class="input-widget">
    <input
      :type="type"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :class="inputClass"
      class="input-field"
    >
  </div>
</template>

<style scoped>
.input-widget {
  width: 100%;
}

.input-field {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-color: #409eff;
}

.input-field::placeholder {
  color: #c0c4cc;
}

.input-disabled {
  background-color: #f5f7fa;
  color: #c0c4cc;
  cursor: not-allowed;
}

.input-readonly {
  background-color: #f5f7fa;
}
</style>
