<script setup lang="ts">
/**
 * 徽标组件 Widget
 */
import { Badge as VanBadge } from 'vant'

interface Props {
  content?: string | number
  max?: number
  dot?: boolean
  color?: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  showZero?: boolean
  childContent?: string
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  max: 99,
  dot: false,
  color: '#ee0a24',
  position: 'top-right',
  showZero: true,
  childContent: '内容',
})
</script>

<template>
  <VanBadge
    :content="dot ? undefined : content"
    :max="max"
    :dot="dot"
    :color="color"
    :position="position"
    :show-zero="showZero"
  >
    <div class="badge-child">{{ childContent }}</div>
  </VanBadge>
</template>

<style scoped>
.badge-child {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background: #f7f8fa;
  border-radius: 4px;
  font-size: 14px;
  color: #323233;
}
</style>
