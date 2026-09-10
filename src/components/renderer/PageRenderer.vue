<script setup lang="ts">
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

const globalStyles = computed(() => props.schema.globalStyles || {})
const componentsList = computed({
  get: () => props.schema.components,
  set: value => emit('updateOrder', value),
})
const hasFixedBottom = computed(() => props.schema.components.some(comp => (
  (comp.type === 'actionbar' && comp.props?.placeholder)
  || (comp.type === 'tabbar' && comp.props?.fixed)
)))
const pageStyles = computed(() => {
  const styles = { ...globalStyles.value }
  if (hasFixedBottom.value) styles.paddingBottom = '60px'
  return styles
})
</script>

<template>
  <div class="page-renderer" :style="pageStyles">
    <VueDraggable
      v-if="isEditing"
      v-model="componentsList"
      :animation="180"
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

    <div v-if="schema.components.length === 0 && isEditing" class="empty-page">
      <i class="i-tabler-layout-grid" />
      <p>拖拽组件到这里开始设计</p>
    </div>
  </div>
</template>

<style scoped>
.page-renderer{width:100%;background:#fff;display:flex;flex-direction:column;box-sizing:border-box;min-height:100%;position:relative}.page-renderer :deep(.van-action-bar),.page-renderer :deep(.van-tabbar){position:absolute!important}.draggable-container{min-height:400px;width:100%;flex:1;display:flex;flex-direction:column}.empty-page{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:400px;color:#909399;pointer-events:none;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:0}.empty-page i{font-size:52px;margin-bottom:13px;opacity:.42}.empty-page p{font-size:12px;margin:0}.component-ghost{opacity:.35!important;background:#eef6ff!important;outline:2px dashed #2684ff!important;outline-offset:-2px}.component-chosen{cursor:grabbing}.component-drag{opacity:.82!important;box-shadow:0 10px 28px rgba(35,73,122,.18)}
</style>
