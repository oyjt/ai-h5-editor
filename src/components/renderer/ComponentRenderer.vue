<script setup lang="ts">
import { computed } from 'vue'
import type { ComponentSchema } from '@/types/schema'
import { getComponentConfig } from '@/config/component-registry'

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

const componentConfig = computed(() => getComponentConfig(props.schema.type))
const mergedStyles = computed(() => ({ ...props.schema.styles }))
const isSelected = computed(() => props.isEditing && props.selectedId === props.schema.id)
const isHovered = computed(() => props.isEditing && props.hoveredId === props.schema.id && !isSelected.value)

function handleClick(e: Event) {
  if (!props.isEditing) return
  e.stopPropagation()
  emit('select', props.schema.id)
}
function handleMouseEnter() { if (props.isEditing) emit('hover', props.schema.id) }
function handleMouseLeave() { if (props.isEditing) emit('hover', null) }
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
    <template v-if="isSelected">
      <i v-for="n in 8" :key="n" class="resize-handle" :class="`handle-${n}`" />
    </template>

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
.component-renderer{position:relative;transition:outline-color .12s ease,box-shadow .12s ease,background-color .12s ease;isolation:isolate;cursor:default}.component-renderer.is-hovered{outline:1px dashed rgba(38,132,255,.8);outline-offset:-1px;background-color:rgba(38,132,255,.015)}.component-renderer.is-selected{outline:2px solid #2684ff;outline-offset:-2px;z-index:8;box-shadow:0 0 0 1px rgba(38,132,255,.025)}.resize-handle{position:absolute;z-index:1001;width:8px;height:8px;border:2px solid #2684ff;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(38,132,255,.2);pointer-events:none}.handle-1{left:-4px;top:-4px}.handle-2{left:50%;top:-4px;transform:translateX(-50%)}.handle-3{right:-4px;top:-4px}.handle-4{right:-4px;top:50%;transform:translateY(-50%)}.handle-5{right:-4px;bottom:-4px}.handle-6{left:50%;bottom:-4px;transform:translateX(-50%)}.handle-7{left:-4px;bottom:-4px}.handle-8{left:-4px;top:50%;transform:translateY(-50%)}.unknown-component{padding:20px;background:#f5f7fa;border:1px dashed #d5dde8;border-radius:6px;text-align:center;color:#909399;font-size:12px}
</style>
