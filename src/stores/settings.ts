/**
 * 本机设置：示例图来源、模型接入。全部只存浏览器 localStorage，不上传。
 */

import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export type ImageSource = 'remote' | 'local' | 'auto'

const KEY = 'ai-h5-settings'

interface Persisted {
  imageSource: ImageSource
  llmEndpoint: string
  llmModel: string
  llmApiKey: string
}

function load(): Persisted {
  const fallback: Persisted = { imageSource: 'auto', llmEndpoint: '', llmModel: '', llmApiKey: '' }
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  }
  catch { return fallback }
}

/** 非响应式读取，给渲染器和工具函数使用 */
export function readImageSource(): ImageSource {
  return load().imageSource
}

export const useSettingsStore = defineStore('settings', () => {
  const initial = load()
  const imageSource = ref<ImageSource>(initial.imageSource)
  const llmEndpoint = ref(initial.llmEndpoint)
  const llmModel = ref(initial.llmModel)
  const llmApiKey = ref(initial.llmApiKey)
  const dialogVisible = ref(false)

  watch([imageSource, llmEndpoint, llmModel, llmApiKey], () => {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        imageSource: imageSource.value,
        llmEndpoint: llmEndpoint.value.trim(),
        llmModel: llmModel.value.trim(),
        llmApiKey: llmApiKey.value.trim(),
      }))
    }
    catch {}
  })

  function openDialog() { dialogVisible.value = true }
  return { imageSource, llmEndpoint, llmModel, llmApiKey, dialogVisible, openDialog }
})
