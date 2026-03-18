<script setup lang="ts">
/**
 * 开关组件 Widget
 */
import { ref } from 'vue'

interface Props {
  value?: boolean
  activeText?: string
  inactiveText?: string
  activeColor?: string
  inactiveColor?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: false,
  activeText: '',
  inactiveText: '',
  activeColor: '#409eff',
  inactiveColor: '#dcdfe6',
  disabled: false,
})

const checked = ref(props.value)
</script>

<template>
  <div class="switch-widget" :class="{ 'switch-disabled': disabled }">
    <span v-if="inactiveText" class="switch-text">{{ inactiveText }}</span>
    <label class="switch-container">
      <input
        v-model="checked"
        type="checkbox"
        :disabled="disabled"
        class="switch-input"
      >
      <span
        class="switch-slider"
        :style="{
          backgroundColor: checked ? activeColor : inactiveColor,
        }"
      />
    </label>
    <span v-if="activeText" class="switch-text">{{ activeText }}</span>
  </div>
</template>

<style scoped>
.switch-widget {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.switch-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch-text {
  font-size: 14px;
  color: #333;
}

.switch-container {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  cursor: pointer;
}

.switch-disabled .switch-container {
  cursor: not-allowed;
}

.switch-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 24px;
  transition: 0.3s;
}

.switch-slider::before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

.switch-input:checked + .switch-slider::before {
  transform: translateX(20px);
}
</style>
