<script setup lang="ts">
/**
 * 属性配置面板 - 配置选中组件的属性和样式
 */
import { ref, computed, watch, nextTick } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useEditorStore } from '@/stores/editor'
import { getComponentConfig } from '@/config/components'
import { ElEmpty, ElButton, ElTabs, ElTabPane } from 'element-plus'
import PropsPanel from './panels/PropsPanel.vue'
import StylePanel from './panels/StylePanel.vue'
import AnimationPanel from './panels/AnimationPanel.vue'
import EventPanel from './panels/EventPanel.vue'

const editorStore = useEditorStore()

// 当前激活的Tab
const activeTab = ref('props')

// 选中的组件
const selectedComponent = computed(() => editorStore.selectedComponent)

// 组件配置
const componentConfig = computed(() => {
  if (!selectedComponent.value) {
    return null
  }
  return getComponentConfig(selectedComponent.value.type)
})

// 防抖更新属性 (300ms)
const debouncedUpdateProp = useDebounceFn((key: string, value: any) => {
  if (!selectedComponent.value) {
    return
  }
  editorStore.updateComponentProps(selectedComponent.value.id, {
    [key]: value,
  })
}, 300)

// 防抖更新样式 (300ms)
const debouncedUpdateStyle = useDebounceFn((key: string, value: any) => {
  if (!selectedComponent.value) {
    return
  }
  editorStore.updateComponentStyles(selectedComponent.value.id, {
    [key]: value,
  })
}, 300)

// 更新属性
function updateProp(key: string, value: any) {
  debouncedUpdateProp(key, value)
}

// 更新样式
function updateStyle(key: string, value: any) {
  debouncedUpdateStyle(key, value)
}

// 更新事件
function updateEvent(key: string, value: any) {
  if (!selectedComponent.value) {
    return
  }
  const events = { ...selectedComponent.value.events }
  if (value === null || value === undefined) {
    delete events[key]
  } else {
    events[key] = value
  }
  editorStore.updateComponent(selectedComponent.value.id, { events })
}

// 删除组件
function handleDelete() {
  if (!selectedComponent.value) {
    return
  }
  editorStore.deleteComponent(selectedComponent.value.id)
}

// 监听选中组件变化，平滑滚动到可视区域
watch(selectedComponent, async (newComponent, oldComponent) => {
  // 只在真正切换组件时才重置Tab（通过ID判断）
  const isComponentChanged = newComponent?.id !== oldComponent?.id

  if (newComponent) {
    await nextTick()
    const element = document.querySelector(`[data-component-id="${newComponent.id}"]`)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
    }
  }

  // 只在切换到不同组件时重置到属性Tab
  if (isComponentChanged) {
    activeTab.value = 'props'
  }
})
</script>

<template>
  <div class="property-panel">
    <div class="panel-header">
      <h3 class="panel-title">属性配置</h3>
    </div>

    <div class="panel-content">
      <ElEmpty v-if="!selectedComponent" description="请选择一个组件" />

      <div v-else class="panel-tabs">
        <ElTabs v-model="activeTab" class="property-tabs">
          <ElTabPane label="属性" name="props">
            <PropsPanel
              v-if="componentConfig"
              :component="selectedComponent"
              :config="componentConfig"
              @update-prop="updateProp"
            />
          </ElTabPane>

          <ElTabPane label="样式" name="style">
            <StylePanel
              :component="selectedComponent"
              @update-style="updateStyle"
            />
          </ElTabPane>

          <ElTabPane label="动画" name="animation">
            <AnimationPanel
              :component="selectedComponent"
              @update-style="updateStyle"
            />
          </ElTabPane>

          <ElTabPane label="事件" name="events">
            <EventPanel
              :component="selectedComponent"
              @update-event="updateEvent"
            />
          </ElTabPane>
        </ElTabs>

        <!-- 操作按钮 -->
        <div class="panel-actions">
          <ElButton type="danger" plain block @click="handleDelete">
            <i class="i-tabler-trash mr-4px" />
            删除组件
          </ElButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.property-panel {
  width: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--editor-bg-tertiary);
  border-left: 1px solid var(--border-color);
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.panel-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.panel-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.property-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:deep(.el-tabs__header) {
  margin: 0;
  padding: 0 20px;
  background: var(--editor-bg-secondary);
}

:deep(.el-tabs__nav-wrap) {
  padding: 8px 0;
}

:deep(.el-tabs__item) {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  padding: 0 16px;
  height: 36px;
  line-height: 36px;
}

:deep(.el-tabs__item.is-active) {
  color: var(--el-color-primary);
}

:deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

:deep(.el-tab-pane) {
  height: 100%;
}

.panel-actions {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  background: var(--editor-bg-tertiary);
}
</style>
