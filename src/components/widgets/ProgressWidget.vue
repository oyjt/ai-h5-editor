<script setup lang="ts">
/**
 * 进度条组件 Widget
 */
import { Progress as VanProgress } from 'vant'

interface Props {
  percentage?: number
  strokeWidth?: number
  color?: string
  showText?: boolean
  textInside?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  percentage: 50,
  strokeWidth: 8,
  color: '#1989fa',
  showText: true,
  textInside: false,
})
</script>

<template>
  <VanProgress
    :percentage="percentage"
    :stroke-width="strokeWidth"
    :color="color"
    :show-pivot="showText && textInside"
  />
</template>

<style scoped>
</style>
