<script setup lang="ts">
/**
 * 发布对话框 - 重新设计版本
 * 设计原则：简约大气、清晰层次、符合 Element Plus 设计语言
 */
import { ref, computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { downloadJSON, downloadHTML } from '@/utils/export'
import {
  ElDialog,
  ElButton,
  ElInput,
  ElMessage,
  ElDivider,
} from 'element-plus'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const editorStore = useEditorStore()

// 对话框显示状态
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// 导出格式
const exportFormat = ref<'html' | 'json'>('html')

// 文件名
const filename = ref('page')

// 加载状态
const isExporting = ref(false)

// 导出文件
function handleExport() {
  try {
    isExporting.value = true
    const fullFilename = `${filename.value}.${exportFormat.value}`

    if (exportFormat.value === 'html') {
      downloadHTML(editorStore.currentPage, fullFilename)
      ElMessage.success('HTML 文件已下载')
    }
    else {
      downloadJSON(editorStore.currentPage, fullFilename)
      ElMessage.success('JSON 文件已下载')
    }
  }
  finally {
    setTimeout(() => {
      isExporting.value = false
    }, 500)
  }
}

// 格式选项配置
const formatOptions = [
  {
    value: 'html',
    label: 'HTML',
    icon: 'i-tabler-file-code',
    description: '独立运行的网页文件',
    detail: '包含完整的 HTML、CSS 和 JavaScript',
  },
  {
    value: 'json',
    label: 'JSON',
    icon: 'i-tabler-json',
    description: '编辑器配置文件',
    detail: '可重新导入编辑器继续编辑',
  },
] as const
</script>

<template>
  <ElDialog
    v-model="visible"
    width="560px"
    :close-on-click-modal="false"
    align-center
    class="publish-dialog"
  >
    <!-- 自定义标题区域 -->
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <i class="i-tabler-cloud-upload text-xl text-primary" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 m-0">发布页面</h3>
          <p class="text-xs text-gray-500 m-0 mt-0.5">导出您的设计作品</p>
        </div>
      </div>
    </template>

    <!-- 内容区域 -->
    <div class="publish-content">
      <!-- 导出格式选择 -->
      <section class="format-section">
        <div class="section-header">
          <h4 class="section-title">选择导出格式</h4>
          <p class="section-desc">根据您的使用场景选择合适的格式</p>
        </div>

        <div class="format-options">
          <div
            v-for="option in formatOptions"
            :key="option.value"
            class="format-card"
            :class="{ 'is-active': exportFormat === option.value }"
            @click="exportFormat = option.value"
          >
            <!-- 选中指示器 -->
            <div class="card-indicator">
              <div class="indicator-dot" />
            </div>

            <!-- 图标 -->
            <div class="card-icon">
              <i :class="option.icon" />
            </div>

            <!-- 内容 -->
            <div class="card-content">
              <h5 class="card-title">{{ option.label }}</h5>
              <p class="card-description">{{ option.description }}</p>
              <p class="card-detail">{{ option.detail }}</p>
            </div>
          </div>
        </div>
      </section>

      <ElDivider class="my-6" />

      <!-- 文件名输入 -->
      <section class="filename-section">
        <div class="section-header">
          <h4 class="section-title">文件名称</h4>
          <p class="section-desc">为您的文件命名</p>
        </div>

        <div class="filename-input-wrapper">
          <ElInput
            v-model="filename"
            placeholder="请输入文件名"
            size="large"
            clearable
            class="filename-input"
          >
            <template #prefix>
              <i class="i-tabler-file text-gray-400" />
            </template>
            <template #append>
              <span class="font-mono text-sm">.{{ exportFormat }}</span>
            </template>
          </ElInput>
          <p class="filename-preview">
            预览：<span class="font-mono text-primary">{{ filename || 'page' }}.{{ exportFormat }}</span>
          </p>
        </div>
      </section>
    </div>

    <!-- 底部操作区 -->
    <template #footer>
      <div class="dialog-footer">
        <ElButton
          size="large"
          @click="visible = false"
        >
          取消
        </ElButton>
        <ElButton
          type="primary"
          size="large"
          :loading="isExporting"
          :disabled="!filename.trim()"
          @click="handleExport"
        >
          <i v-if="!isExporting" class="i-tabler-download" />
          {{ isExporting ? '导出中...' : '立即下载' }}
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped>
/* 对话框整体样式 */
.publish-dialog :deep(.el-dialog__header) {
  padding: 24px 24px 20px;
  margin: 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.publish-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.publish-dialog :deep(.el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid var(--el-border-color-lighter);
}

/* 内容区域 */
.publish-content {
  min-height: 320px;
}

/* 区块标题 */
.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 4px 0;
}

.section-desc {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin: 0;
}

/* 格式选项卡片 */
.format-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.format-card {
  position: relative;
  padding: 20px 16px;
  border: 2px solid var(--el-border-color);
  border-radius: 8px;
  background: var(--el-bg-color);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.format-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--el-color-primary);
  opacity: 0;
  transition: opacity 0.2s;
}

.format-card:hover {
  border-color: var(--el-color-primary-light-5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.format-card:hover::before {
  opacity: 0.04;
}

.format-card.is-active {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.format-card.is-active::before {
  opacity: 0.06;
}

/* 选中指示器 */
.card-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 20px;
  height: 20px;
  border: 2px solid var(--el-border-color);
  border-radius: 50%;
  background: white;
  transition: all 0.2s;
  z-index: 1;
}

.format-card.is-active .card-indicator {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary);
}

.indicator-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.format-card.is-active .indicator-dot {
  transform: translate(-50%, -50%) scale(1);
}

/* 卡片图标 */
.card-icon {
  position: relative;
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  border-radius: 8px;
  background: var(--el-fill-color-light);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 1;
}

.card-icon i {
  font-size: 24px;
  color: var(--el-text-color-regular);
  transition: all 0.2s;
}

.format-card.is-active .card-icon {
  background: var(--el-color-primary);
}

.format-card.is-active .card-icon i {
  color: white;
}

/* 卡片内容 */
.card-content {
  position: relative;
  z-index: 1;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 6px 0;
}

.card-description {
  font-size: 13px;
  color: var(--el-text-color-regular);
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.card-detail {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin: 0;
  line-height: 1.4;
}

/* 文件名输入区域 */
.filename-section {
  margin-top: 0;
}

.filename-input-wrapper {
  position: relative;
}

.filename-input :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
  transition: all 0.2s;
}

.filename-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-color-primary-light-5) inset;
}

.filename-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

.filename-preview {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.filename-preview span {
  font-weight: 500;
}

/* 底部操作栏 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-footer .el-button {
  min-width: 100px;
}

/* 分割线 */
:deep(.el-divider) {
  margin: 24px 0;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .format-options {
    grid-template-columns: 1fr;
  }
}
</style>
