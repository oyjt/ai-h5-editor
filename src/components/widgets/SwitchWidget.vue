<script setup lang="ts">
/**
 * 开关组件 Widget
 */
import { ref } from 'vue'
import { Switch as VanSwitch } from 'vant'

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
  activeColor: '#1989fa',
  inactiveColor: '#dcdfe6',
  disabled: false,
})

const checked = ref(props.value)
</script>

<template>
  <div class="switch-widget">
    <span v-if="inactiveText" class="switch-text">{{ inactiveText }}</span>
    <VanSwitch
      v-model="checked"
      :active-color="activeColor"
      :inactive-color="inactiveColor"
      :disabled="disabled"
    />
    <span v-if="activeText" class="switch-text">{{ activeText }}</span>
  </div>
</template>

<style scoped>
.switch-widget {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.switch-text {
  font-size: 14px;
  color: #333;
}
</style>
