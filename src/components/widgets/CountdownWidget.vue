<script setup lang="ts">
/**
 * 倒计时组件 Widget
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'

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
  color: '#f56c6c',
})

const timeLeft = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
})

let timer: number | null = null

function updateCountdown() {
  const now = Date.now()
  const end = new Date(props.endTime).getTime()
  const diff = Math.max(0, end - now)

  if (diff === 0 && timer) {
    clearInterval(timer)
    timer = null
  }

  timeLeft.value = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

const displayText = computed(() => {
  const { days, hours, minutes, seconds } = timeLeft.value
  const pad = (n: number) => String(n).padStart(2, '0')

  switch (props.format) {
    case 'DD:HH:mm:ss':
      return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    case 'HH:mm:ss':
      return `${pad(hours + days * 24)}:${pad(minutes)}:${pad(seconds)}`
    case 'mm:ss':
      return `${pad(minutes + hours * 60 + days * 24 * 60)}:${pad(seconds)}`
    default:
      return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }
})

onMounted(() => {
  updateCountdown()
  timer = window.setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="countdown-widget" :style="{ fontSize, color }">
    {{ displayText }}
  </div>
</template>

<style scoped>
.countdown-widget {
  font-weight: 600;
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
}
</style>
