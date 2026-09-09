<script setup lang="ts">
/**
 * 组件渲染器 - 根据 ComponentSchema 动态渲染组件
 */
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { ComponentSchema } from '@/types/schema'
import { getComponentConfig } from '@/config/component-registry'
import { useEditorStore } from '@/stores/editor'
import { createComponentSchema } from '@/utils/schema-generator'

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
  if (!props.isEditing) return
  e.stopPropagation()
  emit('select', props.schema.id)
}

function handleMouseEnter() {
  if (props.isEditing) emit('hover', props.schema.id)
}

function handleMouseLeave() {
  if (props.isEditing) emit('hover', null)
}

function handleDuplicate(e: Event) {
  e.stopPropagation()
  const clone = createComponentSchema(props.schema.type, { ...props.schema.props }, { ...props.schema.styles })
  clone.events = props.schema.events ? { ...props.schema.events } : undefined
  editorStore.addComponent(clone)
  ElMessage.success('已复制组件')
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
    :data-component-id="schema.id"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div v-if="isSelected" class="component-toolbar">
      <button title="复制" @click="handleDuplicate"><i class="i-tabler-copy" /></button>
      <button title="删除" @click="handleDelete"><i class="i-tabler-trash" /></button>
      <button title="更多"><i class="i-tabler-dots" /></button>
    </div>

    <template v-if="isSelected">
      <i v-for="n in 8" :key="n" class="resize-handle" :class="`handle-${n}`" />
    </template>

    <div v-if="isEditing" class="drag-grip" title="拖拽排序"><i class="i-tabler-grip-vertical" /></div>

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
.component-renderer{position:relative;transition:outline-color .12s ease,box-shadow .12s ease;isolation:isolate}
.component-renderer.is-hovered{outline:1px dashed #2684ff;outline-offset:-1px}
.component-renderer.is-selected{outline:2px solid #2684ff;outline-offset:-2px;z-index:8}
.component-toolbar{position:absolute;right:-2px;top:-31px;z-index:1002;height:30px;display:flex;align-items:center;background:#2684ff;border-radius:6px 6px 0 0;overflow:hidden;box-shadow:0 5px 14px rgba(38,132,255,.22)}
.component-toolbar button{width:31px;height:30px;border:0;border-right:1px solid rgba(255,255,255,.16);background:transparent;color:#fff;display:grid;place-items:center;cursor:pointer;font-size:14px}
.component-toolbar button:last-child{border-right:0}.component-toolbar button:hover{background:rgba(255,255,255,.16)}
.resize-handle{position:absolute;z-index:1001;width:8px;height:8px;border:2px solid #2684ff;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(38,132,255,.18);pointer-events:none}
.handle-1{left:-4px;top:-4px}.handle-2{left:50%;top:-4px;transform:translateX(-50%)}.handle-3{right:-4px;top:-4px}.handle-4{right:-4px;top:50%;transform:translateY(-50%)}.handle-5{right:-4px;bottom:-4px}.handle-6{left:50%;bottom:-4px;transform:translateX(-50%)}.handle-7{left:-4px;bottom:-4px}.handle-8{left:-4px;top:50%;transform:translateY(-50%)}
.drag-grip{position:absolute;left:-24px;top:50%;z-index:1000;width:20px;height:32px;transform:translateY(-50%);border:1px solid #dce6f2;border-radius:5px;background:#fff;color:#8a98aa;display:grid;place-items:center;opacity:0;box-shadow:0 3px 10px rgba(42,65,95,.08);cursor:grab;transition:opacity .12s ease}
.component-renderer:hover>.drag-grip,.component-renderer.is-selected>.drag-grip{opacity:1}.drag-grip:hover{color:#2684ff;border-color:#9cc4ff}.drag-grip i{font-size:14px}
.unknown-component{padding:20px;background:#f5f7fa;border:1px dashed #d5dde8;border-radius:6px;text-align:center;color:#909399;font-size:12px}
</style>
