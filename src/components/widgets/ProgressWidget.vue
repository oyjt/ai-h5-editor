<script setup lang="ts">
/**
 * 进度条组件 Widget
 */
import { computed } from 'vue'

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
  color: '#409eff',
  showText: true,
  textInside: false,
})

const progressStyle = computed(() => ({
  height: `${props.strokeWidth}px`,
}))

const barStyle = computed(() => ({
  width: `${props.percentage}%`,
  backgroundColor: props.color,
}))
</script>

<template>
  <div class="progress-widget">
    <div class="progress-bar" :style="progressStyle">
      <div class="progress-bar-inner" :style="barStyle">
        <span v-if="showText && textInside" class="progress-text-inside">
          {{ percentage }}%
        </span>
      </div>
    </div>
    <span v-if="showText && !textInside" class="progress-text">
      {{ percentage }}%
    </span>
  </div>
</template>

<style scoped>
.progress-widget {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  background-color: #ebeef5;
  border-radius: 100px;
  overflow: hidden;
}

.progress-bar-inner {
  height: 100%;
  border-radius: 100px;
  transition: width 0.6s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
}

.progress-text-inside {
  color: #fff;
  font-size: 12px;
  line-height: 1;
}

.progress-text {
  font-size: 14px;
  color: #606266;
  min-width: 50px;
  text-align: right;
}
</style>
