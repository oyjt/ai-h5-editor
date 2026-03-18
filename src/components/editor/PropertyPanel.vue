<script setup lang="ts">
/**
 * 属性配置面板 - 配置选中组件的属性和样式
 */
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { getComponentConfig } from '@/config/components'
import { ElEmpty, ElButton } from 'element-plus'
import FormItem from './FormItem.vue'

const editorStore = useEditorStore()

// 选中的组件
const selectedComponent = computed(() => editorStore.selectedComponent)

// 组件配置
const componentConfig = computed(() => {
  if (!selectedComponent.value) {
    return null
  }
  return getComponentConfig(selectedComponent.value.type)
})

// 更新属性
function updateProp(key: string, value: any) {
  if (!selectedComponent.value) {
    return
  }
  editorStore.updateComponentProps(selectedComponent.value.id, {
    [key]: value,
  })
}

// 更新样式
function updateStyle(key: string, value: any) {
  if (!selectedComponent.value) {
    return
  }
  editorStore.updateComponentStyles(selectedComponent.value.id, {
    [key]: value,
  })
}

// 删除组件
function handleDelete() {
  if (!selectedComponent.value) {
    return
  }
  editorStore.deleteComponent(selectedComponent.value.id)
}
</script>

<template>
  <div class="w-320px h-full bg-white border-l border-l-solid border-l-#e4e7ed flex flex-col">
    <div class="px-20px py-16px border-b border-b-solid border-b-#e4e7ed">
      <h3 class="m-0 text-16px font-600 color-#303133">
        属性配置
      </h3>
    </div>

    <div class="flex-1 overflow-y-auto p-20px">
      <ElEmpty v-if="!selectedComponent" description="请选择一个组件" />

      <div v-else class="flex flex-col gap-24px">
        <!-- 基本信息 -->
        <div class="border-b border-b-solid border-b-#e4e7ed pb-20px last:border-b-none">
          <h4 class="m-0 mb-16px text-14px font-600 color-#303133">
            基本信息
          </h4>
          <div class="mb-12px">
            <label class="block mb-6px text-13px color-#606266">组件类型</label>
            <div class="px-12px py-8px bg-#f5f7fa rounded-4px text-13px color-#303133 font-mono break-all">
              {{ componentConfig?.name || selectedComponent.type }}
            </div>
          </div>
          <div class="mb-12px">
            <label class="block mb-6px text-13px color-#606266">组件 ID</label>
            <div class="px-12px py-8px bg-#f5f7fa rounded-4px text-13px color-#303133 font-mono break-all">
              {{ selectedComponent.id }}
            </div>
          </div>
        </div>

        <!-- 属性配置 -->
        <div v-if="componentConfig?.propSchema.length" class="border-b border-b-solid border-b-#e4e7ed pb-20px last:border-b-none">
          <h4 class="m-0 mb-16px text-14px font-600 color-#303133">
            属性配置
          </h4>
          <FormItem
            v-for="propSchema in componentConfig.propSchema"
            :key="propSchema.key"
            :schema="propSchema"
            :model-value="selectedComponent.props[propSchema.key]"
            @update:model-value="updateProp(propSchema.key, $event)"
          />
        </div>

        <!-- 样式配置 -->
        <div class="border-b border-b-solid border-b-#e4e7ed pb-20px last:border-b-none">
          <h4 class="m-0 mb-16px text-14px font-600 color-#303133">
            样式配置
          </h4>

          <!-- 内边距 -->
          <div class="mb-16px">
            <label class="block mb-8px text-13px font-500 color-#606266">内边距</label>
            <el-input
              :model-value="selectedComponent.styles.padding || ''"
              placeholder="如：8px 16px"
              @update:model-value="updateStyle('padding', $event)"
            />
          </div>

          <!-- 外边距 -->
          <div class="mb-16px">
            <label class="block mb-8px text-13px font-500 color-#606266">外边距</label>
            <el-input
              :model-value="selectedComponent.styles.margin || ''"
              placeholder="如：8px 16px"
              @update:model-value="updateStyle('margin', $event)"
            />
          </div>

          <!-- 背景色 -->
          <div class="mb-16px">
            <label class="block mb-8px text-13px font-500 color-#606266">背景色</label>
            <el-color-picker
              class="w-full!"
              :model-value="selectedComponent.styles.backgroundColor || ''"
              show-alpha
              @update:model-value="updateStyle('backgroundColor', $event)"
            />
          </div>

          <!-- 圆角 -->
          <div class="mb-16px">
            <label class="block mb-8px text-13px font-500 color-#606266">圆角</label>
            <el-input
              :model-value="selectedComponent.styles.borderRadius || ''"
              placeholder="如：4px"
              @update:model-value="updateStyle('borderRadius', $event)"
            />
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="border-b border-b-solid border-b-#e4e7ed pb-20px last:border-b-none">
          <ElButton type="danger" plain block @click="handleDelete">
            <i class="i-tabler-trash" />
            删除组件
          </ElButton>
        </div>
      </div>
    </div>
  </div>
</template>
