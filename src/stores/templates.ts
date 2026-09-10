/**
 * 模板管理 Store
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Template } from '@/types/template'
import { TemplateCategory } from '@/types/template'
import { getAllTemplates } from '@/config/templates'

const CUSTOM_KEY = 'h5-editor-custom-templates'
const FAVORITES_KEY = 'h5-editor-template-favorites'

export const useTemplatesStore = defineStore('templates', () => {
  const templates = ref<Template[]>(getAllTemplates())
  const customTemplates = ref<Template[]>([])
  const favoriteTemplateIds = ref<string[]>([])

  function loadCustomTemplates() {
    try {
      const saved = localStorage.getItem(CUSTOM_KEY)
      if (saved) customTemplates.value = JSON.parse(saved)
      const favorites = localStorage.getItem(FAVORITES_KEY)
      if (favorites) favoriteTemplateIds.value = JSON.parse(favorites)
    }
    catch (error) {
      console.error('加载模板数据失败:', error)
    }
  }

  function saveCustomTemplate(template: Template) {
    customTemplates.value.push(template)
    try {
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(customTemplates.value))
      return true
    }
    catch (error) {
      console.error('保存自定义模板失败:', error)
      return false
    }
  }

  function deleteCustomTemplate(id: string) {
    customTemplates.value = customTemplates.value.filter(t => t.id !== id)
    favoriteTemplateIds.value = favoriteTemplateIds.value.filter(item => item !== id)
    try {
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(customTemplates.value))
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteTemplateIds.value))
      return true
    }
    catch (error) {
      console.error('删除自定义模板失败:', error)
      return false
    }
  }

  function toggleFavorite(id: string) {
    if (favoriteTemplateIds.value.includes(id)) {
      favoriteTemplateIds.value = favoriteTemplateIds.value.filter(item => item !== id)
    }
    else {
      favoriteTemplateIds.value.push(id)
    }
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteTemplateIds.value))
      return true
    }
    catch (error) {
      console.error('保存收藏失败:', error)
      return false
    }
  }

  function isFavorite(id: string) {
    return favoriteTemplateIds.value.includes(id)
  }

  function getAllTemplatesList() { return [...templates.value, ...customTemplates.value] }
  function getTemplatesByCategoryList(category: TemplateCategory) { return getAllTemplatesList().filter(t => t.category === category) }
  function getTemplateById(id: string) { return getAllTemplatesList().find(t => t.id === id) }
  function searchTemplates(keyword: string) {
    const lowerKeyword = keyword.toLowerCase()
    return getAllTemplatesList().filter(t => t.name.toLowerCase().includes(lowerKeyword) || t.description.toLowerCase().includes(lowerKeyword) || t.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)))
  }

  return {
    templates,
    customTemplates,
    favoriteTemplateIds,
    loadCustomTemplates,
    saveCustomTemplate,
    deleteCustomTemplate,
    toggleFavorite,
    isFavorite,
    getAllTemplatesList,
    getTemplatesByCategoryList,
    getTemplateById,
    searchTemplates,
  }
})
