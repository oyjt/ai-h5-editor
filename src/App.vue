<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import QuickLauncher from '@/components/agent/QuickLauncher.vue'
import TaskIsland from '@/components/agent/TaskIsland.vue'
import SettingsDialog from '@/components/dialogs/SettingsDialog.vue'
import { useStyleLibraryStore } from '@/stores/style-library'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
// 启动即同步当前风格库登记的取值，校验器才会放行已采纳的颜色/圆角/字号
useStyleLibraryStore()

function onKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    ui.toggleLauncher()
  }
  else if (event.key === 'Escape' && ui.launcherVisible) ui.toggleLauncher(false)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div id="app">
    <RouterView />
    <SettingsDialog />
    <TaskIsland />
    <QuickLauncher />
  </div>
</template>

<style scoped>
#app {
  width: 100%;
  height: 100%;
}
</style>
