<script setup lang="ts">
/**
 * 组件渲染器 - 根据 ComponentSchema 动态渲染组件
 */
import { computed, h } from 'vue'
import type { ComponentSchema } from '@/types/schema'
import { getComponentConfig } from '@/config/components'
import { useEditorStore } from '@/stores/editor'
import { ElMessage } from 'element-plus'

interface Props {
  schema: ComponentSchema
  isEditing?: boolean
  selectedId?: string | null
  hoveredId?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
  selectedId: null,
  hoveredId: null,
})

const emit = defineEmits<{
  select: [id: string]
  hover: [id: string | null]
}>()

const editorStore = useEditorStore()

// 获取组件配置
const componentConfig = computed(() => {
  return getComponentConfig(props.schema.type)
})

// 合并样式
const mergedStyles = computed(() => {
  return {
    ...props.schema.styles,
  }
})

// 判断是否被选中
const isSelected = computed(() => {
  return props.isEditing && props.selectedId === props.schema.id
})

// 判断是否被悬停
const isHovered = computed(() => {
  return props.isEditing && props.hoveredId === props.schema.id && !isSelected.value
})

// 处理点击事件
function handleClick(e: Event) {
  if (props.isEditing) {
    e.stopPropagation()
    emit('select', props.schema.id)
  }
}

// 处理鼠标悬停
function handleMouseEnter() {
  if (props.isEditing) {
    emit('hover', props.schema.id)
  }
}

function handleMouseLeave() {
  if (props.isEditing) {
    emit('hover', null)
  }
}

// 处理上移
function handleMoveUp(e: Event) {
  e.stopPropagation()
  editorStore.moveComponentUp(props.schema.id)
  ElMessage.success('组件已上移')
}

// 处理下移
function handleMoveDown(e: Event) {
  e.stopPropagation()
  editorStore.moveComponentDown(props.schema.id)
  ElMessage.success('组件已下移')
}

// 处理删除
function handleDelete(e: Event) {
  e.stopPropagation()
  editorStore.deleteComponent(props.schema.id)
  ElMessage.success('组件已删除')
}
</script>

<template>
  <div
    class="component-renderer"
    :class="{
      'is-selected': isSelected,
      'is-hovered': isHovered,
    }"
    :style="mergedStyles"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 拖拽手柄 -->
    <div v-if="isEditing" class="component-drag-handle" title="拖拽排序">
      <i class="i-tabler-grip-vertical" />
    </div>

    <!-- 操作工具栏 -->
    <div v-if="isSelected" class="component-toolbar">
      <el-button-group size="small">
        <el-button @click="handleMoveUp" title="上移">
          <i class="i-tabler-arrow-up" />
        </el-button>
        <el-button @click="handleMoveDown" title="下移">
          <i class="i-tabler-arrow-down" />
        </el-button>
        <el-button type="danger" @click="handleDelete" title="删除">
          <i class="i-tabler-trash" />
        </el-button>
      </el-button-group>
    </div>

    <!-- 渲染组件 -->
    <component
      :is="componentConfig?.component"
      v-if="componentConfig"
      v-bind="schema.props"
    />

    <!-- 未知组件类型 -->
    <div v-else class="unknown-component">
      未知组件类型: {{ schema.type }}
    </div>

    <!-- 递归渲染子组件 -->
    <ComponentRenderer
      v-for="child in schema.children"
      :key="child.id"
      :schema="child"
      :is-editing="isEditing"
      :selected-id="selectedId"
      :hovered-id="hoveredId"
      @select="emit('select', $event)"
      @hover="emit('hover', $event)"
    />
  </div>
</template>

<style scoped>
.component-renderer {
  position: relative;
  transition: all 0.2s ease;
}

/* 悬停状态 - 虚线边框 */
.component-renderer.is-hovered {
  outline: 2px dashed #409eff;
  outline-offset: -2px;
}

/* 选中状态 - 实线边框 */
.component-renderer.is-selected {
  outline: 2px solid #409eff;
  outline-offset: -2px;
  background-color: rgba(64, 158, 255, 0.05);
}

/* 拖拽手柄 */
.component-drag-handle {
  position: absolute;
  top: 4px;
  left: 4px;
  z-index: 999;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 4px 6px;
  cursor: move;
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.component-renderer:hover .component-drag-handle {
  opacity: 1;
}

.component-drag-handle i {
  font-size: 16px;
  color: #606266;
}

.component-drag-handle:hover {
  background: #f5f7fa;
}

/* 操作工具栏 */
.component-toolbar {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 1000;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 4px;
}

.component-toolbar :deep(.el-button) {
  padding: 4px 8px;
}

.component-toolbar :deep(.el-button i) {
  font-size: 16px;
}

.unknown-component {
  padding: 20px;
  background: #f5f7fa;
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}
</style>
