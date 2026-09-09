<script setup lang="ts">
import { onMounted } from 'vue'
import Toolbar from '@/components/editor/Toolbar.vue'
import ComponentPanel from '@/components/editor/ComponentPanel.vue'
import Canvas from '@/components/editor/Canvas.vue'
import PropertyPanel from '@/components/editor/PropertyPanel.vue'
import { useEditorStore } from '@/stores/editor'
import { createMarketingDemoPage } from '@/config/demo-page'

const editorStore = useEditorStore()
const DEMO_VERSION = '2026-09-09-high-fidelity-v5-assets'
const DEMO_VERSION_KEY = 'h5-editor-demo-version'

function selectHero() {
  const hero = editorStore.currentPage.components[0]
  if (hero) editorStore.selectComponent(hero.id)
}

onMounted(() => {
  const versionMatched = localStorage.getItem(DEMO_VERSION_KEY) === DEMO_VERSION
  const restored = versionMatched ? editorStore.loadPage() : false

  if (!restored) {
    editorStore.setCurrentPage(createMarketingDemoPage())
    editorStore.savePage()
    localStorage.setItem(DEMO_VERSION_KEY, DEMO_VERSION)
  }

  selectHero()
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
.editor-view{width:100%;height:100%;display:flex;flex-direction:column;background:var(--editor-bg-primary);min-width:1280px}.editor-main{flex:1;min-height:0;display:flex;overflow:hidden}
</style>
