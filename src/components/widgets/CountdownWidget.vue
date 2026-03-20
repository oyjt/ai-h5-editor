<script setup lang="ts">
/**
 * 倒计时组件 Widget
 */
import { computed } from 'vue'
import { CountDown as VanCountDown } from 'vant'

interface Props {
  endTime?: string
  format?: 'DD:HH:mm:ss' | 'HH:mm:ss' | 'mm:ss'
  fontSize?: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  format: 'DD:HH:mm:ss',
  fontSize: '24px',
  color: '#ee0a24',
})

const timeInMs = computed(() => {
  const end = new Date(props.endTime).getTime()
  const now = Date.now()
  return Math.max(0, end - now)
})

const formatMap: Record<string, string> = {
  'DD:HH:mm:ss': 'DD 天 HH 时 mm 分 ss 秒',
  'HH:mm:ss': 'HH:mm:ss',
  'mm:ss': 'mm:ss',
}
</script>

<template>
  <div class="countdown-widget" :style="{ fontSize, color }">
    <VanCountDown :time="timeInMs" :format="formatMap[format]" />
  </div>
</template>

<style scoped>
.countdown-widget {
  font-weight: 600;
}
</style>
