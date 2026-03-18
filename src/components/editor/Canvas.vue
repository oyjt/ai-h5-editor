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
    <div class="canvas-wrapper">
      <div
        class="phone-frame"
        :class="{ 'drag-over': isDragOver }"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
      >
        <div class="phone-screen">
          <!-- 页面渲染区域 -->
          <div class="page-content">
            <PageRenderer
              :schema="editorStore.currentPage"
              :is-editing="editorStore.mode === 'edit'"
              :selected-id="editorStore.selectedComponentId"
              :hovered-id="editorStore.hoveredComponentId"
              @select-component="handleSelectComponent"
              @hover-component="handleHoverComponent"
              @update-order="handleUpdateOrder"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.canvas {
  flex: 1;
  height: 100%;
  background: #f5f7fa;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.canvas-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.phone-frame {
  width: 375px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 12px;
  transition: all 0.3s;
}

.phone-frame.drag-over {
  box-shadow: 0 8px 32px rgba(64, 158, 255, 0.3);
  transform: scale(1.02);
}

.phone-screen {
  width: 100%;
  min-height: 667px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.page-content {
  width: 100%;
  min-height: 667px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 667px;
  color: #909399;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

.components-container {
  padding: 16px;
}

.component-wrapper {
  margin-bottom: 12px;
  padding: 16px;
  border: 2px dashed transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.component-wrapper:hover {
  border-color: #409eff;
  background: #ecf5ff;
}

.component-wrapper.selected {
  border-color: #409eff;
  border-style: solid;
  background: #ecf5ff;
}

.component-placeholder {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
  text-align: center;
  color: #606266;
}
</style>
