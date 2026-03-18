/**
 * 模板管理 Store
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Template } from '@/types/template'
import { TemplateCategory } from '@/types/template'
import { getAllTemplates, getTemplatesByCategory } from '@/config/templates'

export const useTemplatesStore = defineStore('templates', () => {
  // 模板列表
  const templates = ref<Template[]>(getAllTemplates())

  // 自定义模板（用户保存的）
  const customTemplates = ref<Template[]>([])

  // 加载自定义模板
  function loadCustomTemplates() {
    try {
      const saved = localStorage.getItem('h5-editor-custom-templates')
      if (saved) {
        customTemplates.value = JSON.parse(saved)
      }
    }
    catch (error) {
      console.error('加载自定义模板失败:', error)
    }
  }

  // 保存自定义模板
  function saveCustomTemplate(template: Template) {
    customTemplates.value.push(template)
    try {
      localStorage.setItem('h5-editor-custom-templates', JSON.stringify(customTemplates.value))
      return true
    }
    catch (error) {
      console.error('保存自定义模板失败:', error)
      return false
    }
  }

  // 删除自定义模板
  function deleteCustomTemplate(id: string) {
    customTemplates.value = customTemplates.value.filter(t => t.id !== id)
    try {
      localStorage.setItem('h5-editor-custom-templates', JSON.stringify(customTemplates.value))
      return true
    }
    catch (error) {
      console.error('删除自定义模板失败:', error)
      return false
    }
  }

  // 获取所有模板（内置 + 自定义）
  function getAllTemplatesList() {
    return [...templates.value, ...customTemplates.value]
  }

  // 根据分类获取模板
  function getTemplatesByCategoryList(category: TemplateCategory) {
    return getAllTemplatesList().filter(t => t.category === category)
  }

  // 根据 ID 获取模板
  function getTemplateById(id: string) {
    return getAllTemplatesList().find(t => t.id === id)
  }

  // 搜索模板
  function searchTemplates(keyword: string) {
    const lowerKeyword = keyword.toLowerCase()
    return getAllTemplatesList().filter(t =>
      t.name.toLowerCase().includes(lowerKeyword)
      || t.description.toLowerCase().includes(lowerKeyword)
      || t.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)),
    )
  }

  return {
    // 状态
    templates,
    customTemplates,

    // 方法
    loadCustomTemplates,
    saveCustomTemplate,
    deleteCustomTemplate,
    getAllTemplatesList,
    getTemplatesByCategoryList,
    getTemplateById,
    searchTemplates,
  }
})
