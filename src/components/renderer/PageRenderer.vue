<script setup lang="ts">
/**
 * 页面渲染器 - 根据 PageSchema 渲染整个页面
 */
import { computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import type { PageSchema, ComponentSchema } from '@/types/schema'
import ComponentRenderer from './ComponentRenderer.vue'

interface Props {
  schema: PageSchema
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
  selectComponent: [id: string]
  hoverComponent: [id: string | null]
  updateOrder: [components: ComponentSchema[]]
}>()

// 全局样式
const globalStyles = computed(() => {
  return props.schema.globalStyles || {}
})

// 组件列表（用于拖拽排序）
const componentsList = computed({
  get: () => props.schema.components,
  set: (value) => {
    emit('updateOrder', value)
  },
})
</script>

<template>
  <div class="page-renderer" :style="globalStyles">
    <!-- 可拖拽排序的组件列表 -->
    <VueDraggable
      v-if="isEditing"
      v-model="componentsList"
      :animation="200"
      handle=".component-drag-handle"
      ghost-class="component-ghost"
      chosen-class="component-chosen"
      drag-class="component-drag"
      :group="{ name: 'components', pull: true, put: true }"
      item-key="id"
      class="draggable-container"
    >
      <ComponentRenderer
        v-for="element in componentsList"
        :key="element.id"
        :schema="element"
        :is-editing="isEditing"
        :selected-id="selectedId"
        :hovered-id="hoveredId"
        @select="emit('selectComponent', $event)"
        @hover="emit('hoverComponent', $event)"
      />
    </VueDraggable>

    <!-- 预览模式：不可拖拽 -->
    <template v-else>
      <ComponentRenderer
        v-for="component in schema.components"
        :key="component.id"
        :schema="component"
        :is-editing="false"
        :selected-id="selectedId"
        :hovered-id="hoveredId"
        @select="emit('selectComponent', $event)"
        @hover="emit('hoverComponent', $event)"
      />
    </template>

    <!-- 空状态 -->
    <div v-if="schema.components.length === 0 && isEditing" class="empty-page">
      <i class="i-tabler-layout-grid" />
      <p>拖拽组件到这里开始设计</p>
    </div>
  </div>
</template>

<style scoped>
.page-renderer {
  width: 100%;
  min-height: 100%;
  background: #fff;
}

.draggable-container {
  min-height: 400px;
  width: 100%;
}

.empty-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #909399;
  pointer-events: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}

.empty-page i {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-page p {
  font-size: 14px;
  margin: 0;
}

/* 拖拽样式 */
:deep(.component-ghost) {
  opacity: 0.5;
  background: #f0f9ff;
  border: 2px dashed #3b82f6;
}

:deep(.component-chosen) {
  opacity: 0.8;
}

:deep(.component-drag) {
  opacity: 0.8;
  transform: rotate(2deg);
}
</style>
