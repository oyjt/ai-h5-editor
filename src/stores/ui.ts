import { ref } from 'vue'
import { defineStore } from 'pinia'

/** 全局界面状态：快速发起弹层 */
export const useUiStore = defineStore('ui', () => {
  const launcherVisible = ref(false)
  function toggleLauncher(value = !launcherVisible.value) { launcherVisible.value = value }
  return { launcherVisible, toggleLauncher }
})
