<script setup lang="ts">
/**
 * 公告栏组件 Widget
 */
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface Props {
  text?: string
  speed?: number
  backgroundColor?: string
  color?: string
  icon?: string
  scrollable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '这是一条公告信息',
  speed: 50,
  backgroundColor: '#fff7e6',
  color: '#ed6a0c',
  icon: 'i-tabler-volume',
  scrollable: true,
})

const noticeRef = ref<HTMLElement>()
const textRef = ref<HTMLElement>()
const offset = ref(0)
let animationId: number | null = null

const shouldScroll = computed(() => {
  if (!props.scrollable || !noticeRef.value || !textRef.value) return false
  return textRef.value.offsetWidth > noticeRef.value.offsetWidth
})

function startScroll() {
  if (!shouldScroll.value) return

  const animate = () => {
    offset.value -= 1
    if (textRef.value && Math.abs(offset.value) >= textRef.value.offsetWidth) {
      offset.value = noticeRef.value?.offsetWidth || 0
    }
    animationId = requestAnimationFrame(animate)
  }

  animationId = requestAnimationFrame(animate)
}

function stopScroll() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

onMounted(() => {
  if (props.scrollable) {
    setTimeout(startScroll, 100)
  }
})

onUnmounted(() => {
  stopScroll()
})
</script>

<template>
  <div
    ref="noticeRef"
    class="notice-widget"
    :style="{ backgroundColor, color }"
  >
    <i v-if="icon" :class="icon" class="notice-icon" />
    <div class="notice-content">
      <span
        ref="textRef"
        class="notice-text"
        :style="{ transform: scrollable ? `translateX(${offset}px)` : 'none' }"
      >
        {{ text }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.notice-widget {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 4px;
  overflow: hidden;
}

.notice-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.notice-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.notice-text {
  display: inline-block;
  white-space: nowrap;
  font-size: 14px;
}
</style>
