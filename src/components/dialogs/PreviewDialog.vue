<script setup lang="ts">
/**
 * 预览对话框 - 手机样式预览
 * 设计原则：真实的手机外观、流畅的交互体验
 */
import { ref, computed, onMounted, watch } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { ElDialog, ElMessage } from 'element-plus'
import { useClipboard } from '@vueuse/core'
import PageRenderer from '@/components/renderer/PageRenderer.vue'
import QRCode from 'qrcode'

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

// 缩放比例
const scale = ref(1)

// 缩放控制
function handleZoomIn() {
  if (scale.value < 1.5) {
    scale.value = Math.min(scale.value + 0.1, 1.5)
  }
}

function handleZoomOut() {
  if (scale.value > 0.5) {
    scale.value = Math.max(scale.value - 0.1, 0.5)
  }
}

function handleResetZoom() {
  scale.value = 1
}

// 手机容器样式
const phoneContainerStyle = computed(() => ({
  transform: `scale(${scale.value})`,
}))

// 二维码相关
const qrcodeDataUrl = ref('')

// 生成预览URL
const previewUrl = computed(() => {
  const baseUrl = window.location.origin
  // 这里可以根据实际需求生成预览路径
  // 例如：/preview?page=xxx 或者使用完整的预览页面路径
  return `${baseUrl}/preview`
})

// 生成二维码
async function generateQRCode() {
  try {
    const dataUrl = await QRCode.toDataURL(previewUrl.value, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
    qrcodeDataUrl.value = dataUrl
  }
  catch (error) {
    console.error('生成二维码失败:', error)
  }
}

// 监听对话框显示状态，显示时生成二维码
watch(visible, (newVal) => {
  if (newVal) {
    generateQRCode()
  }
})

// 组件挂载时生成二维码
onMounted(() => {
  if (visible.value) {
    generateQRCode()
  }
})

// 复制链接功能
const { copy, copied } = useClipboard({ source: previewUrl })

async function handleCopyUrl() {
  try {
    await copy()
    ElMessage.success('链接已复制到剪贴板')
  }
  catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}
</script>

<template>
  <ElDialog
    v-model="visible"
    width="800px"
    :close-on-click-modal="false"
    align-center
    class="preview-dialog"
  >
    <!-- 自定义标题区域 -->
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <i class="i-tabler-device-mobile text-xl text-primary" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 m-0">手机预览</h3>
            <p class="text-xs text-gray-500 m-0 mt-0.5">查看页面在移动端的效果</p>
          </div>
        </div>

        <!-- 缩放控制 -->
        <div class="zoom-controls">
          <button
            class="zoom-btn"
            :disabled="scale <= 0.5"
            @click="handleZoomOut"
          >
            <i class="i-tabler-minus" />
          </button>
          <button
            class="zoom-btn"
            @click="handleResetZoom"
          >
            <span class="zoom-text">{{ Math.round(scale * 100) }}%</span>
          </button>
          <button
            class="zoom-btn"
            :disabled="scale >= 1.5"
            @click="handleZoomIn"
          >
            <i class="i-tabler-plus" />
          </button>
        </div>
      </div>
    </template>

    <!-- 手机预览区域 -->
    <div class="preview-container">
      <!-- 左侧：手机预览 -->
      <div class="phone-wrapper" :style="phoneContainerStyle">
        <!-- 手机外壳 -->
        <div class="phone-frame">
          <!-- 刘海屏 -->
          <div class="phone-notch">
            <div class="notch-camera" />
            <div class="notch-speaker" />
          </div>

          <!-- 屏幕区域 -->
          <div class="phone-screen">
            <!-- 状态栏 -->
            <div class="phone-status-bar">
              <span class="status-time">9:41</span>
              <div class="status-icons">
                <i class="i-tabler-wifi text-xs" />
                <i class="i-tabler-battery-3 text-xs" />
              </div>
            </div>

            <!-- 内容区域 -->
            <div class="screen-content">
              <PageRenderer
                :schema="editorStore.currentPage"
                :is-editing="false"
              />
            </div>

            <!-- Home 指示器 -->
            <div class="phone-home-indicator" />
          </div>
        </div>
      </div>

      <!-- 右侧：二维码区域 -->
      <div class="qrcode-section">
        <div class="qrcode-card">
          <!-- 标题 -->
          <div class="qrcode-header">
            <i class="i-tabler-qrcode" />
            <span>扫码预览</span>
          </div>

          <!-- 二维码图片 -->
          <div class="qrcode-image-wrapper">
            <img
              v-if="qrcodeDataUrl"
              :src="qrcodeDataUrl"
              alt="预览二维码"
              class="qrcode-image"
            >
            <div v-else class="qrcode-loading">
              <i class="i-tabler-loader-2 animate-spin" />
              <span>生成中...</span>
            </div>
          </div>

          <!-- 预览链接 -->
          <div class="qrcode-url-section">
            <div class="url-label">预览链接</div>
            <div class="url-input-wrapper">
              <input
                :value="previewUrl"
                readonly
                class="url-input"
              >
              <button
                class="copy-btn"
                :class="{ copied }"
                @click="handleCopyUrl"
              >
                <i v-if="!copied" class="i-tabler-copy" />
                <i v-else class="i-tabler-check" />
              </button>
            </div>
          </div>

          <!-- 提示信息 -->
          <div class="qrcode-tips">
            <div class="tip-item">
              <i class="i-tabler-info-circle" />
              <span>使用手机扫描二维码或访问链接查看效果</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部提示 -->
    <template #footer>
      <div class="dialog-footer">
        <p class="footer-tip">
          <i class="i-tabler-info-circle" />
          提示：实际效果可能因设备而异
        </p>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped>
/* 对话框整体样式 */
.preview-dialog :deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

.preview-dialog :deep(.el-dialog__header) {
  padding: 20px 24px;
  margin: 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.preview-dialog :deep(.el-dialog__body) {
  padding: 32px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-dialog :deep(.el-dialog__footer) {
  padding: 12px 24px;
  border-top: 1px solid var(--el-border-color-lighter);
}

/* 缩放控制 */
.zoom-controls {
  display: flex;
  gap: 4px;
  align-items: center;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  padding: 4px;
}

.zoom-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-regular);
  transition: all 0.2s;
  font-size: 14px;
}

.zoom-btn:hover:not(:disabled) {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.zoom-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zoom-text {
  font-size: 12px;
  font-weight: 500;
  min-width: 42px;
  text-align: center;
}

/* 预览容器 */
.preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 20px 0;
}

.phone-wrapper {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

/* 手机外壳 */
.phone-frame {
  width: 340px;
  height: 680px;
  background: #1a1a1a;
  border-radius: 40px;
  padding: 12px;
  box-shadow:
    0 0 0 2px #2a2a2a,
    0 0 0 4px #1a1a1a,
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 8px 24px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

/* 刘海屏 */
.phone-notch {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 30px;
  background: #1a1a1a;
  border-radius: 0 0 20px 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.notch-camera {
  width: 10px;
  height: 10px;
  background: #0a0a0a;
  border-radius: 50%;
  border: 1px solid #2a2a2a;
}

.notch-speaker {
  width: 50px;
  height: 4px;
  background: #0a0a0a;
  border-radius: 2px;
}

/* 屏幕区域 */
.phone-screen {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 32px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 状态栏 */
.phone-status-bar {
  height: 44px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  font-size: 13px;
  font-weight: 600;
  color: #000;
  flex-shrink: 0;
  z-index: 10;
}

.status-time {
  letter-spacing: -0.2px;
}

.status-icons {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 内容区域 */
.screen-content {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  /* 隐藏滚动条但保持可滚动 */
  scrollbar-width: none;
  -ms-overflow-style: none;
  /* 为底部 Home 指示器留出空间 */
  padding-bottom: 20px;
}

.screen-content::-webkit-scrollbar {
  display: none;
}

/* Home 指示器 */
.phone-home-indicator {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 4px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  z-index: 10;
}

/* 底部提示 */
.dialog-footer {
  display: flex;
  justify-content: center;
}

.footer-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin: 0;
}

.footer-tip i {
  font-size: 14px;
}

/* 二维码区域 */
.qrcode-section {
  flex-shrink: 0;
}

.qrcode-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  padding: 24px;
  width: 280px;
  box-shadow: var(--el-box-shadow-light);
}

.qrcode-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.qrcode-header i {
  font-size: 20px;
  color: var(--el-color-primary);
}

.qrcode-image-wrapper {
  width: 100%;
  aspect-ratio: 1;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qrcode-image {
  width: 100%;
  height: 100%;
  display: block;
}

.qrcode-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.qrcode-loading i {
  font-size: 24px;
  color: var(--el-color-primary);
}

.qrcode-url-section {
  margin-bottom: 16px;
}

.url-label {
  font-size: 13px;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
  font-weight: 500;
}

.url-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.url-input {
  flex: 1;
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  outline: none;
  transition: all 0.2s;
  font-family: var(--el-font-family);
}

.url-input:focus {
  border-color: var(--el-color-primary);
  background: var(--el-fill-color-blank);
}

.copy-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--el-border-color);
  background: var(--el-fill-color-blank);
  border-radius: var(--el-border-radius-base);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-regular);
  transition: all 0.2s;
  flex-shrink: 0;
}

.copy-btn:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.copy-btn:active {
  transform: scale(0.95);
}

.copy-btn.copied {
  border-color: var(--el-color-success);
  color: var(--el-color-success);
  background: var(--el-color-success-light-9);
}

.copy-btn i {
  font-size: 16px;
}

.qrcode-tips {
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.tip-item i {
  color: var(--el-color-primary);
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 2px;
}

/* 响应式调整 */
@media (max-height: 800px) {
  .phone-frame {
    height: 560px;
    width: 280px;
  }

  .preview-dialog :deep(.el-dialog__body) {
    min-height: 500px;
  }

  .qrcode-card {
    padding: 24px 20px;
  }

  .qrcode-image-wrapper {
    width: 160px;
    height: 160px;
  }
}
</style>
