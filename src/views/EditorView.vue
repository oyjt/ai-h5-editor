<script setup lang="ts">
import { onMounted } from 'vue'
import Toolbar from '@/components/editor/Toolbar.vue'
import ComponentPanel from '@/components/editor/ComponentPanel.vue'
import Canvas from '@/components/editor/Canvas.vue'
import PropertyPanel from '@/components/editor/PropertyPanel.vue'
import { useEditorStore } from '@/stores/editor'
import { createMarketingDemoPage } from '@/config/demo-page'

const editorStore = useEditorStore()

onMounted(() => {
  const restored = editorStore.loadPage()
  if (!restored) {
    editorStore.setCurrentPage(createMarketingDemoPage())
  }
})
</script>

<template>
  <div class="editor-view">
    <Toolbar />
    <div class="editor-main">
      <ComponentPanel />
      <Canvas />
      <PropertyPanel />
    </div>
  </div>
</template>

<style scoped>
.editor-view { width:100%; height:100%; display:flex; flex-direction:column; background:var(--editor-bg-primary); min-width:1280px; }
.editor-main { flex:1; min-height:0; display:flex; overflow:hidden; }
</style>
