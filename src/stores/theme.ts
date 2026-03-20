/**
 * 主题管理 Store
 */
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'dark' | 'light'

export const useThemeStore = defineStore('theme', () => {
  // 检测系统主题偏好
  function getSystemTheme(): Theme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // 从 localStorage 读取主题设置，如果没有则跟随系统
  const savedTheme = localStorage.getItem('theme') as Theme | null
  const theme = ref<Theme>(savedTheme || getSystemTheme())

  // 标记用户是否手动设置过主题
  const isManuallySet = ref<boolean>(!!savedTheme)

  // 应用主题到 document
  function applyTheme(newTheme: Theme) {
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  // 切换主题
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    isManuallySet.value = true
  }

  // 设置主题
  function setTheme(newTheme: Theme) {
    theme.value = newTheme
    isManuallySet.value = true
  }

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    // 只有在用户没有手动设置过主题时，才跟随系统变化
    if (!isManuallySet.value) {
      theme.value = e.matches ? 'dark' : 'light'
    }
  })

  // 监听主题变化，保存到 localStorage 并应用
  watch(theme, (newTheme) => {
    if (isManuallySet.value) {
      localStorage.setItem('theme', newTheme)
    }
    applyTheme(newTheme)
  }, { immediate: true })

  return {
    theme,
    toggleTheme,
    setTheme,
    isManuallySet,
  }
})
