<script setup lang="ts">
/**
 * 画布区域 - 显示和编辑页面内容
 */
import { ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import PageRenderer from '@/components/renderer/PageRenderer.vue'
import { getAllComponents } from '@/config/components'
import { createComponentSchema } from '@/utils/schema-generator'
import { ElMessage } from 'element-plus'

const editorStore = useEditorStore()

// 拖拽状态
const isDragOver = ref(false)
const isDragging = ref(false)

// 处理组件选择
function handleSelectComponent(id: string) {
  editorStore.selectComponent(id)
}

// 处理组件悬停
function handleHoverComponent(id: string | null) {
  editorStore.hoverComponent(id)
}

// 处理组件顺序更新
function handleUpdateOrder(components: any[]) {
  editorStore.updateComponentsOrder(components)
}

// 拖拽开始
function handleDragStart() {
  isDragging.value = true
}

// 拖拽进入
function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = true
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'copy'
  }
}

// 拖拽离开
function handleDragLeave() {
  isDragOver.value = false
}

// 拖拽结束
function handleDragEnd() {
  isDragging.value = false
  isDragOver.value = false
}

// 放置组件
function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false

  const componentType = e.dataTransfer?.getData('componentType')
  if (!componentType) {
    return
  }

  const config = getAllComponents().find(c => c.type === componentType)
  if (!config) {
    ElMessage.error('组件配置不存在')
    return
  }

  // 创建组件 Schema
  const componentSchema = createComponentSchema(
    componentType,
    { ...config.defaultProps },
    { ...config.defaultStyles },
  )

  // 添加到编辑器
  editorStore.addComponent(componentSchema)

  ElMessage.success(`已添加 ${config.name} 组件`)
}
</script>

<template>
  <div class="canvas">
    <!-- 画布容器 -->
    <div class="canvas-container">
      <div
        class="device-frame"
        :class="{ 'drag-over': isDragOver, 'dragging': isDragging }"
        @dragstart="handleDragStart"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
        @dragend="handleDragEnd"
      >
        <div class="device-screen">
          <!-- iPhone X 刘海 -->
          <div class="notch" />

          <!-- 状态栏 -->
          <div class="status-bar">
            <div class="status-left">
              <span class="time">9:41</span>
            </div>
            <div class="status-right">
              <i class="i-tabler-wifi" />
              <i class="i-tabler-battery-3" />
            </div>
          </div>

          <!-- 页面渲染区域 -->
          <div class="page-content">
            <PageRenderer
              :schema="editorStore.currentPage"
              :is-editing="true"
              :selected-id="editorStore.selectedComponentId"
              :hovered-id="editorStore.hoveredComponentId"
              @select-component="handleSelectComponent"
              @hover-component="handleHoverComponent"
              @update-order="handleUpdateOrder"
            />
          </div>

          <!-- Home 指示条 -->
          <div class="home-indicator" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.canvas {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--editor-bg-secondary);
  /* 10px 间隔的淡点网格 */
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1px, transparent 1px);
  background-size: 10px 10px;
  overflow: hidden;
  position: relative;
}

/* 画布容器 */
.canvas-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  overflow: auto;
  position: relative;
}

/* 设备框架 - iPhone X 高保真模拟 */
.device-frame {
  width: 375px;
  height: 812px;
  background: linear-gradient(145deg, #1a1a1c 0%, #2d2d30 100%);
  border-radius: 42px;
  /* 模拟真实 iPhone X 的多层阴影和边框 */
  box-shadow:
    /* 内边框高光 */
    inset 0 0 0 1px rgba(255, 255, 255, 0.1),
    /* 金属边框 */
    0 0 0 3px #3a3a3c,
    0 0 0 4px rgba(0, 0, 0, 0.3),
    /* 外层阴影 */
    0 0 0 12px rgba(0, 0, 0, 0.05),
    0 16px 48px rgba(0, 0, 0, 0.3),
    0 32px 96px rgba(0, 0, 0, 0.2);
  padding: 16px;
  /* 平滑过渡动画 */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

/* 侧边按钮 - 左侧音量键 */
.device-frame::before {
  content: '';
  position: absolute;
  left: -4px;
  top: 120px;
  width: 4px;
  height: 60px;
  background: linear-gradient(90deg, #2a2a2c 0%, #3a3a3c 100%);
  border-radius: 2px 0 0 2px;
  box-shadow:
    inset 1px 0 2px rgba(0, 0, 0, 0.5),
    -1px 0 2px rgba(0, 0, 0, 0.3);
}

/* 侧边按钮 - 右侧电源键 */
.device-frame::after {
  content: '';
  position: absolute;
  right: -4px;
  top: 140px;
  width: 4px;
  height: 80px;
  background: linear-gradient(270deg, #2a2a2c 0%, #3a3a3c 100%);
  border-radius: 0 2px 2px 0;
  box-shadow:
    inset -1px 0 2px rgba(0, 0, 0, 0.5),
    1px 0 2px rgba(0, 0, 0, 0.3);
}

.device-frame.drag-over {
  box-shadow:
    0 0 0 8px rgba(64, 158, 255, 0.1),
    0 8px 32px rgba(64, 158, 255, 0.3),
    0 16px 64px rgba(64, 158, 255, 0.2),
    0 0 0 2px var(--color-primary);
  transform: scale(1.02);
}

.device-frame.dragging {
  opacity: 0.8;
}

/* 设备屏幕 */
.device-screen {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  /* 玻璃质感 */
  box-shadow:
    inset 0 0 0 1px rgba(0, 0, 0, 0.05),
    inset 0 2px 4px rgba(0, 0, 0, 0.02);
}

/* iPhone X Notch - 刘海 */
.notch {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 209px;
  height: 30px;
  background: #000;
  border-radius: 0 0 20px 20px;
  z-index: 20;
  box-shadow:
    inset 0 -1px 3px rgba(255, 255, 255, 0.1),
    0 3px 10px rgba(0, 0, 0, 0.35);
  pointer-events: none;
}

/* 刘海内部细节 - 听筒 */
.notch::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 6px;
  background: rgba(20, 20, 25, 0.95);
  border-radius: 3px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 刘海内部细节 - 前置摄像头 */
.notch::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 30%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, rgba(30, 40, 60, 0.9) 0%, rgba(10, 15, 25, 0.95) 70%);
  border-radius: 50%;
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* 状态栏 */
.status-bar {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  padding-top: 12px;
  z-index: 19;
  pointer-events: none;
  font-size: 15px;
  font-weight: 600;
  color: #000;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  background: #fff;
}

.status-left,
.status-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-left {
  flex: 1;
}

.status-right {
  flex: 1;
  justify-content: flex-end;
  font-size: 17px;
}

.time {
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.3px;
}

/* 页面内容区域 */
.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  /* iOS 风格滚动 */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

/* Home 指示条 */
.home-indicator {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 134px;
  height: 5px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  z-index: 19;
  pointer-events: none;
}

/* 自定义滚动条样式 */
.page-content::-webkit-scrollbar {
  width: 3px;
}

.page-content::-webkit-scrollbar-track {
  background: transparent;
}

.page-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  transition: background 0.2s ease;
}

.page-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}
</style>
