<script setup lang="ts">
/**
 * 动画配置面板
 */
import { ref, computed } from 'vue'
import type { ComponentSchema } from '@/types/schema'
import { ElSelect, ElOption, ElInputNumber, ElSwitch, ElButton } from 'element-plus'

interface Props {
  component: ComponentSchema
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updateStyle: [key: string, value: any]
}>()

// 动画配置
const animationConfig = computed(() => {
  const styles = props.component.styles || {}
  return {
    animationName: styles.animationName || 'none',
    animationDuration: styles.animationDuration || '1s',
    animationDelay: styles.animationDelay || '0s',
    animationIterationCount: styles.animationIterationCount || '1',
    animationTimingFunction: styles.animationTimingFunction || 'ease',
  }
})

// 入场动画选项
const animationOptions = [
  { label: '无动画', value: 'none' },
  { label: 'Fade In (淡入)', value: 'fadeIn' },
  { label: 'Fade In Up (从下淡入)', value: 'fadeInUp' },
  { label: 'Fade In Down (从上淡入)', value: 'fadeInDown' },
  { label: 'Fade In Left (从左淡入)', value: 'fadeInLeft' },
  { label: 'Fade In Right (从右淡入)', value: 'fadeInRight' },
  { label: 'Slide In Up (从下滑入)', value: 'slideInUp' },
  { label: 'Slide In Down (从上滑入)', value: 'slideInDown' },
  { label: 'Slide In Left (从左滑入)', value: 'slideInLeft' },
  { label: 'Slide In Right (从右滑入)', value: 'slideInRight' },
  { label: 'Bounce In (弹跳进入)', value: 'bounceIn' },
  { label: 'Zoom In (放大进入)', value: 'zoomIn' },
  { label: 'Rotate In (旋转进入)', value: 'rotateIn' },
]

// 时间函数选项
const timingFunctionOptions = [
  { label: 'Ease', value: 'ease' },
  { label: 'Linear', value: 'linear' },
  { label: 'Ease In', value: 'ease-in' },
  { label: 'Ease Out', value: 'ease-out' },
  { label: 'Ease In Out', value: 'ease-in-out' },
]

// 循环次数选项
const iterationCountOptions = [
  { label: '1次', value: '1' },
  { label: '2次', value: '2' },
  { label: '3次', value: '3' },
  { label: '无限循环', value: 'infinite' },
]

// 持续时间（秒）
const duration = computed({
  get: () => parseFloat(animationConfig.value.animationDuration) || 1,
  set: (val: number) => {
    emit('updateStyle', 'animationDuration', `${val}s`)
  },
})

// 延迟时间（秒）
const delay = computed({
  get: () => parseFloat(animationConfig.value.animationDelay) || 0,
  set: (val: number) => {
    emit('updateStyle', 'animationDelay', `${val}s`)
  },
})

// 更新动画名称
function updateAnimationName(value: string) {
  if (value === 'none') {
    // 清除所有动画相关样式
    emit('updateStyle', 'animationName', '')
    emit('updateStyle', 'animationDuration', '')
    emit('updateStyle', 'animationDelay', '')
    emit('updateStyle', 'animationIterationCount', '')
    emit('updateStyle', 'animationTimingFunction', '')
  } else {
    emit('updateStyle', 'animationName', value)
  }
}

// 更新循环次数
function updateIterationCount(value: string) {
  emit('updateStyle', 'animationIterationCount', value)
}

// 更新时间函数
function updateTimingFunction(value: string) {
  emit('updateStyle', 'animationTimingFunction', value)
}

// 预览动画
function previewAnimation() {
  // 触发动画重播
  const element = document.querySelector(`[data-component-id="${props.component.id}"]`)
  if (element) {
    const htmlElement = element as HTMLElement
    htmlElement.style.animation = 'none'
    setTimeout(() => {
      htmlElement.style.animation = ''
    }, 10)
  }
}
</script>

<template>
  <div class="animation-panel">
    <div class="section">
      <h4 class="section-title">入场动画</h4>

      <div class="form-item">
        <label class="form-label">动画类型</label>
        <ElSelect
          :model-value="animationConfig.animationName"
          placeholder="选择动画效果"
          @update:model-value="updateAnimationName"
        >
          <ElOption
            v-for="option in animationOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </ElSelect>
      </div>

      <template v-if="animationConfig.animationName && animationConfig.animationName !== 'none'">
        <div class="form-item">
          <label class="form-label">持续时间 (秒)</label>
          <ElInputNumber
            v-model="duration"
            :min="0.1"
            :max="10"
            :step="0.1"
            controls-position="right"
          />
        </div>

        <div class="form-item">
          <label class="form-label">延迟时间 (秒)</label>
          <ElInputNumber
            v-model="delay"
            :min="0"
            :max="10"
            :step="0.1"
            controls-position="right"
          />
        </div>

        <div class="form-item">
          <label class="form-label">时间函数</label>
          <ElSelect
            :model-value="animationConfig.animationTimingFunction"
            @update:model-value="updateTimingFunction"
          >
            <ElOption
              v-for="option in timingFunctionOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </div>

        <div class="form-item">
          <label class="form-label">循环次数</label>
          <ElSelect
            :model-value="animationConfig.animationIterationCount"
            @update:model-value="updateIterationCount"
          >
            <ElOption
              v-for="option in iterationCountOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </div>

        <div class="form-item">
          <ElButton type="primary" plain block @click="previewAnimation">
            <i class="i-tabler-player-play mr-4px" />
            预览动画
          </ElButton>
        </div>
      </template>
    </div>

    <div class="tip">
      <i class="i-tabler-info-circle" />
      <span>提示：动画效果需要在预览模式下查看</span>
    </div>
  </div>
</template>

<style scoped>
.animation-panel {
  padding: 20px;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.form-item {
  margin-bottom: 16px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

:deep(.el-input-number) {
  width: 100%;
}

.tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--editor-bg-secondary);
  border-radius: var(--radius-button);
  font-size: 12px;
  color: var(--text-secondary);
}

.tip i {
  font-size: 16px;
  flex-shrink: 0;
}

/* 动画关键帧 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes slideInDown {
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes rotateIn {
  from {
    opacity: 0;
    transform: rotate(-200deg);
  }
  to {
    opacity: 1;
    transform: rotate(0);
  }
}
</style>
