<script setup lang="ts">
/**
 * 编辑器主页面 - 三栏布局
 */
import { onMounted } from 'vue'
import Toolbar from '@/components/editor/Toolbar.vue'
import ComponentPanel from '@/components/editor/ComponentPanel.vue'
import Canvas from '@/components/editor/Canvas.vue'
import PropertyPanel from '@/components/editor/PropertyPanel.vue'
import { useEditorStore } from '@/stores/editor'

const editorStore = useEditorStore()

// 页面加载时尝试恢复上次保存的页面
onMounted(() => {
  editorStore.loadPage()
})
</script>

<template>
  <div class="editor-view">
    <!-- 工具栏 -->
    <Toolbar />

    <!-- 主内容区域：三栏布局 -->
    <div class="editor-main">
      <!-- 左侧：组件面板 -->
      <ComponentPanel />

      <!-- 中间：画布区域 -->
      <Canvas />

      <!-- 右侧：属性配置面板 -->
      <PropertyPanel />
    </div>
  </div>
</template>

<style scoped>
.editor-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--editor-bg-primary);
  min-width: 1280px;
}

.editor-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}
</style>
