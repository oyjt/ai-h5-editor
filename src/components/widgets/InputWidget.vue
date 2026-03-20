<script setup lang="ts">
/**
 * 输入框组件 Widget
 */
import { ref } from 'vue'
import { Field as VanField } from 'vant'

interface Props {
  placeholder?: string
  value?: string
  type?: 'text' | 'number' | 'password' | 'tel' | 'digit'
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

const inputValue = ref(props.value)
</script>

<template>
  <div class="input-widget">
    <VanField
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :clearable="clearable"
    />
  </div>
</template>

<style scoped>
.input-widget {
  width: 100%;
}
</style>
