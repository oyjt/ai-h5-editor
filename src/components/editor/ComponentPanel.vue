<script setup lang="ts">
/**
 * 组件面板 - 显示可拖拽的组件列表（手风琴模式）
 */
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { ComponentCategory } from '@/types/component'
import { getAllComponents, getComponentsByCategory } from '@/config/components'
import { useEditorStore } from '@/stores/editor'
import { createComponentSchema } from '@/utils/schema-generator'
import { ElMessage } from 'element-plus'

const editorStore = useEditorStore()

// 组件分类（带展开状态）- 参照 Vant 组件库分类
const categories = ref([
  { id: ComponentCategory.Basic, name: '基础组件', icon: 'i-tabler-layout-grid', expanded: true },
  { id: ComponentCategory.Form, name: '表单组件', icon: 'i-tabler-forms', expanded: false },
  { id: ComponentCategory.Display, name: '展示组件', icon: 'i-tabler-photo', expanded: false },
  { id: ComponentCategory.Navigation, name: '导航组件', icon: 'i-tabler-compass', expanded: false },
  { id: ComponentCategory.Layout, name: '布局组件', icon: 'i-tabler-layout', expanded: false },
])

// 切换分类展开状态
function toggleCategory(categoryId: ComponentCategory) {
  const category = categories.value.find(c => c.id === categoryId)
  if (category) {
    category.expanded = !category.expanded
  }
}

// 获取分类下的组件列表
function getCategoryComponents(categoryId: ComponentCategory) {
  return getComponentsByCategory(categoryId)
}

// 添加组件到画布
function handleAddComponent(type: string) {
  const config = getAllComponents().find(c => c.type === type)
  if (!config) {
    ElMessage.error('组件配置不存在')
    return
  }

  // 创建组件 Schema
  const componentSchema = createComponentSchema(
    type,
    { ...config.defaultProps },
    { ...config.defaultStyles },
  )

  // 添加到编辑器
  editorStore.addComponent(componentSchema)

  ElMessage.success(`已添加 ${config.name} 组件`)
}

// 拖拽克隆：创建新组件实例
function handleClone(original: any) {
  const config = getAllComponents().find(c => c.type === original.type)
  if (!config) {
    return null
  }

  // 创建组件 Schema
  return createComponentSchema(
    original.type,
    { ...config.defaultProps },
    { ...config.defaultStyles },
  )
}
</script>

<template>
  <div class="w-280px h-full bg-[var(--editor-bg-tertiary)] border-r border-[var(--border-color)] flex flex-col">
    <!-- 头部 -->
    <div class="px-20px py-16px border-b border-[var(--border-color)]">
      <h3 class="m-0 text-16px font-600 text-[var(--text-primary)]">
        组件库
      </h3>
    </div>

    <!-- 手风琴内容 -->
    <div class="flex-1 overflow-y-auto p-16px">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="mb-8px"
      >
        <!-- 分类标题 -->
        <div
          class="flex items-center justify-between px-12px py-10px rounded-[var(--radius-panel)] cursor-pointer transition-all duration-200 hover:bg-[var(--editor-bg-secondary)]"
          :class="cat.expanded ? 'bg-blue-500/10 text-blue-400' : 'text-[var(--text-secondary)]'"
          @click="toggleCategory(cat.id)"
        >
          <div class="flex items-center gap-8px">
            <i :class="cat.icon" class="text-18px" />
            <span class="text-14px font-500">{{ cat.name }}</span>
          </div>
          <i
            class="i-tabler-chevron-down text-16px transition-transform duration-200"
            :class="cat.expanded ? 'rotate-180' : ''"
          />
        </div>

        <!-- 组件列表（展开时显示） -->
        <VueDraggable
          v-if="cat.expanded"
          :model-value="getCategoryComponents(cat.id)"
          :group="{ name: 'components', pull: 'clone', put: false }"
          :clone="handleClone"
          :sort="false"
          item-key="type"
          class="grid grid-cols-2 gap-12px mt-8px px-4px"
        >
          <div
            v-for="comp in getCategoryComponents(cat.id)"
            :key="comp.type"
            class="flex flex-col items-center gap-8px px-12px py-16px bg-[var(--editor-bg-secondary)] rounded-[var(--radius-panel)] cursor-move transition-all duration-200 hover:bg-[var(--editor-bg-primary)] hover:-translate-y-2px hover:shadow-md"
            @click="handleAddComponent(comp.type)"
          >
            <i :class="comp.icon" class="text-24px text-blue-400" />
            <span class="text-13px text-[var(--text-secondary)]">{{ comp.name }}</span>
          </div>
        </VueDraggable>
      </div>
    </div>
  </div>
</template>
