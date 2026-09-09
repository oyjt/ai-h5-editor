<script setup lang="ts">
/**
 * 组件渲染器 - 根据 ComponentSchema 动态渲染组件
 */
import { computed } from 'vue'
import type { ComponentSchema } from '@/types/schema'
import { getComponentConfig } from '@/config/component-registry'
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

const componentConfig = computed(() => getComponentConfig(props.schema.type))
const mergedStyles = computed(() => ({ ...props.schema.styles }))
const isSelected = computed(() => props.isEditing && props.selectedId === props.schema.id)
const isHovered = computed(() => props.isEditing && props.hoveredId === props.schema.id && !isSelected.value)

function handleClick(e: Event) {
  if (props.isEditing) {
    e.stopPropagation()
    emit('select', props.schema.id)
  }
}

function handleMouseEnter() {
  if (props.isEditing) emit('hover', props.schema.id)
}

function handleMouseLeave() {
  if (props.isEditing) emit('hover', null)
}

function handleMoveUp(e: Event) {
  e.stopPropagation()
  editorStore.moveComponentUp(props.schema.id)
  ElMessage.success('组件已上移')
}

function handleMoveDown(e: Event) {
  e.stopPropagation()
  editorStore.moveComponentDown(props.schema.id)
  ElMessage.success('组件已下移')
}

function handleDelete(e: Event) {
  e.stopPropagation()
  editorStore.deleteComponent(props.schema.id)
  ElMessage.success('组件已删除')
}
</script>

<template>
  <div
    class="component-renderer"
    :class="{ 'is-selected': isSelected, 'is-hovered': isHovered }"
    :style="mergedStyles"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div v-if="isEditing" class="component-drag-handle" title="拖拽排序">
      <i class="i-tabler-grip-vertical" />
    </div>

    <div v-if="isSelected" class="component-toolbar">
      <el-button-group size="small">
        <el-button title="上移" @click="handleMoveUp"><i class="i-tabler-arrow-up" /></el-button>
        <el-button title="下移" @click="handleMoveDown"><i class="i-tabler-arrow-down" /></el-button>
        <el-button type="danger" title="删除" @click="handleDelete"><i class="i-tabler-trash" /></el-button>
      </el-button-group>
    </div>

    <component :is="componentConfig?.component" v-if="componentConfig" v-bind="schema.props" />

    <div v-else class="unknown-component">未知组件类型: {{ schema.type }}</div>

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
.component-renderer { position: relative; transition: all 0.2s ease; }
.component-renderer.is-hovered { outline: 2px dashed #409eff; outline-offset: -2px; }
.component-renderer.is-selected { outline: 2px solid #409eff; outline-offset: -2px; background-color: rgba(64, 158, 255, 0.05); }
.component-drag-handle { position:absolute; top:4px; left:4px; z-index:999; background:white; border-radius:4px; box-shadow:0 2px 8px rgba(0,0,0,.15); padding:4px 6px; cursor:move; opacity:0; transition:opacity .2s; display:flex; align-items:center; justify-content:center; }
.component-renderer:hover .component-drag-handle { opacity:1; }
.component-drag-handle i { font-size:16px; color:#606266; }
.component-drag-handle:hover { background:#f5f7fa; }
.component-toolbar { position:absolute; top:4px; right:4px; z-index:1000; background:white; border-radius:4px; box-shadow:0 2px 8px rgba(0,0,0,.15); padding:4px; }
.component-toolbar :deep(.el-button) { padding:4px 8px; }
.component-toolbar :deep(.el-button i) { font-size:16px; }
.unknown-component { padding:20px; background:#f5f7fa; border:2px dashed #dcdfe6; border-radius:4px; text-align:center; color:#909399; font-size:14px; }
</style>
