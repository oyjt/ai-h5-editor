<script setup lang="ts">
/**
 * 气泡弹出框组件 Widget
 */
import { ref } from 'vue'
import { Popover as VanPopover } from 'vant'

interface Props {
  content?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'click' | 'manual'
  theme?: 'light' | 'dark'
  childText?: string
}

const props = withDefaults(defineProps<Props>(), {
  content: '这是一段提示内容',
  placement: 'bottom',
  trigger: 'click',
  theme: 'light',
  childText: '点击',
})

const visible = ref(false)
</script>

<template>
  <VanPopover
    v-model:show="visible"
    :placement="placement"
    :theme="theme"
    :trigger="trigger"
  >
    <div class="popover-content-text">{{ content }}</div>
    <template #reference>
      <div class="popover-reference">{{ childText }}</div>
    </template>
  </VanPopover>
</template>

<style scoped>
.popover-reference {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: #f7f8fa;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #323233;
}

.popover-content-text {
  padding: 8px 12px;
  font-size: 14px;
  color: #323233;
  line-height: 1.6;
  max-width: 200px;
}
</style>
