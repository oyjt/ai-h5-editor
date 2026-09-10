/**
 * 编辑器状态管理
 */

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ComponentSchema, PageSchema } from '@/types/schema'
import {
  cloneSchema,
  createEmptyPageSchema,
  findComponentById,
  moveComponentById,
  removeComponentById,
  updateComponentById,
} from '@/utils/schema-generator'
import { useHistoryStore } from './history'

const PAGE_STORAGE_KEY = 'h5-editor-page'
const PROJECT_STORAGE_KEY = 'h5-editor-project'

interface StoredProject {
  version: 1
  currentPageIndex: number
  pages: PageSchema[]
}

export const useEditorStore = defineStore('editor', () => {
  const initialPage = createEmptyPageSchema()
  const currentPage = ref<PageSchema>(initialPage)
  const pages = ref<PageSchema[]>([initialPage])
  const currentPageIndex = ref(0)
  const selectedComponentId = ref<string | null>(null)
  const hoveredComponentId = ref<string | null>(null)
  const canvasZoom = ref(100)
  const deviceMode = ref<'mobile' | 'tablet'>('mobile')

  const selectedComponent = computed(() => {
    if (!selectedComponentId.value) return null
    return findComponentById(currentPage.value.components, selectedComponentId.value)
  })
  const hoveredComponent = computed(() => {
    if (!hoveredComponentId.value) return null
    return findComponentById(currentPage.value.components, hoveredComponentId.value)
  })

  function syncCurrentPageToProject() {
    if (!pages.value.length) pages.value = [currentPage.value]
    pages.value[currentPageIndex.value] = currentPage.value
  }
  function resetHistory(page = currentPage.value) {
    const historyStore = useHistoryStore()
    historyStore.clear()
    historyStore.pushHistory(cloneSchema(page))
  }
  function activatePage(index: number) {
    if (index < 0 || index >= pages.value.length) return false
    syncCurrentPageToProject()
    currentPageIndex.value = index
    currentPage.value = pages.value[index]
    selectedComponentId.value = null
    hoveredComponentId.value = null
    resetHistory(currentPage.value)
    return true
  }

  function addPage(page?: PageSchema) {
    syncCurrentPageToProject()
    const next = page || createEmptyPageSchema(`页面 ${pages.value.length + 1}`)
    if (!next.globalStyles) next.globalStyles = { backgroundColor: '#ffffff' }
    pages.value.push(next)
    activatePage(pages.value.length - 1)
    savePage()
    return next
  }
  function duplicatePage(index = currentPageIndex.value) {
    const source = pages.value[index]
    if (!source) return null
    const duplicate = cloneSchema(source)
    duplicate.id = `${source.id}-copy-${Date.now()}`
    duplicate.name = `${source.name || `页面 ${index + 1}`} 副本`
    duplicate.meta = {
      title: duplicate.name,
      description: duplicate.meta?.description ?? '',
      keywords: duplicate.meta?.keywords ?? [],
      author: duplicate.meta?.author,
      createTime: duplicate.meta?.createTime ?? Date.now(),
      updateTime: Date.now(),
    }
    pages.value.splice(index + 1, 0, duplicate)
    activatePage(index + 1)
    savePage()
    return duplicate
  }
  function renamePage(index: number, name: string) {
    const page = pages.value[index]
    const nextName = name.trim()
    if (!page || !nextName) return false
    page.name = nextName
    page.meta = {
      title: nextName,
      description: page.meta?.description ?? '',
      keywords: page.meta?.keywords ?? [],
      author: page.meta?.author,
      createTime: page.meta?.createTime ?? Date.now(),
      updateTime: Date.now(),
    }
    if (index === currentPageIndex.value) currentPage.value = page
    savePage()
    return true
  }
  function movePage(index: number, direction: 'up' | 'down') {
    syncCurrentPageToProject()
    const target = direction === 'up' ? index - 1 : index + 1
    if (index < 0 || index >= pages.value.length || target < 0 || target >= pages.value.length) return false
    const activeId = currentPage.value.id
    const [page] = pages.value.splice(index, 1)
    if (!page) return false
    pages.value.splice(target, 0, page)
    const nextActiveIndex = pages.value.findIndex(item => item.id === activeId)
    currentPageIndex.value = Math.max(0, nextActiveIndex)
    currentPage.value = pages.value[currentPageIndex.value]
    savePage()
    return true
  }
  function deletePage(index = currentPageIndex.value) {
    if (pages.value.length <= 1 || !pages.value[index]) return false
    pages.value.splice(index, 1)
    const nextIndex = Math.min(index, pages.value.length - 1)
    currentPageIndex.value = nextIndex
    currentPage.value = pages.value[nextIndex]
    selectedComponentId.value = null
    hoveredComponentId.value = null
    resetHistory(currentPage.value)
    savePage()
    return true
  }
  function switchPage(index: number) {
    const changed = activatePage(index)
    if (changed) savePage()
    return changed
  }

  function addComponent(component: ComponentSchema, parentId?: string, index?: number) {
    const historyStore = useHistoryStore()
    if (parentId) {
      const parent = findComponentById(currentPage.value.components, parentId)
      if (parent) {
        if (!parent.children) parent.children = []
        if (index !== undefined && index >= 0) parent.children.splice(index, 0, component)
        else parent.children.push(component)
      }
    }
    else if (index !== undefined && index >= 0) currentPage.value.components.splice(index, 0, component)
    else currentPage.value.components.push(component)
    syncCurrentPageToProject()
    historyStore.pushHistory(cloneSchema(currentPage.value))
    selectedComponentId.value = component.id
  }
  function updateComponentsOrder(components: ComponentSchema[]) {
    currentPage.value.components = components
    syncCurrentPageToProject()
    useHistoryStore().pushHistory(cloneSchema(currentPage.value))
  }
  function deleteComponent(id: string) {
    currentPage.value.components = removeComponentById(currentPage.value.components, id)
    syncCurrentPageToProject()
    useHistoryStore().pushHistory(cloneSchema(currentPage.value))
    if (selectedComponentId.value === id) selectedComponentId.value = null
  }
  function moveComponentUp(id: string) {
    currentPage.value.components = moveComponentById(currentPage.value.components, id, 'up')
    syncCurrentPageToProject()
    useHistoryStore().pushHistory(cloneSchema(currentPage.value))
  }
  function moveComponentDown(id: string) {
    currentPage.value.components = moveComponentById(currentPage.value.components, id, 'down')
    syncCurrentPageToProject()
    useHistoryStore().pushHistory(cloneSchema(currentPage.value))
  }
  function updateComponent(id: string, updates: Partial<ComponentSchema>) {
    currentPage.value.components = updateComponentById(currentPage.value.components, id, updates)
    syncCurrentPageToProject()
    useHistoryStore().pushHistory(cloneSchema(currentPage.value))
  }
  function updateComponentProps(id: string, props: Record<string, any>) {
    const component = findComponentById(currentPage.value.components, id)
    if (component) updateComponent(id, { props: { ...component.props, ...props } })
  }
  function updateComponentStyles(id: string, styles: Record<string, any>) {
    const component = findComponentById(currentPage.value.components, id)
    if (component) updateComponent(id, { styles: { ...component.styles, ...styles } })
  }

  function selectComponent(id: string | null) { selectedComponentId.value = id }
  function hoverComponent(id: string | null) { hoveredComponentId.value = id }
  function setCanvasZoom(value: number) { canvasZoom.value = Math.min(150, Math.max(50, value)) }
  function setDeviceMode(value: 'mobile' | 'tablet') { deviceMode.value = value }

  function setCurrentPage(page: PageSchema) {
    currentPage.value = page
    pages.value = [page]
    currentPageIndex.value = 0
    selectedComponentId.value = null
    hoveredComponentId.value = null
    resetHistory(page)
  }
  function clearPage() {
    const empty = createEmptyPageSchema(currentPage.value.name || `页面 ${currentPageIndex.value + 1}`)
    empty.globalStyles = { backgroundColor: '#ffffff' }
    currentPage.value = empty
    syncCurrentPageToProject()
    selectedComponentId.value = null
    hoveredComponentId.value = null
    resetHistory(empty)
  }

  function savePage() {
    try {
      syncCurrentPageToProject()
      const project: StoredProject = { version: 1, currentPageIndex: currentPageIndex.value, pages: pages.value }
      localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(project))
      localStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(currentPage.value))
      return true
    }
    catch (error) {
      console.error('保存页面失败:', error)
      return false
    }
  }
  function loadPage() {
    try {
      const storedProject = localStorage.getItem(PROJECT_STORAGE_KEY)
      if (storedProject) {
        const project = JSON.parse(storedProject) as StoredProject
        if (Array.isArray(project.pages) && project.pages.length) {
          pages.value = project.pages
          currentPageIndex.value = Math.min(Math.max(project.currentPageIndex || 0, 0), pages.value.length - 1)
          currentPage.value = pages.value[currentPageIndex.value]
          selectedComponentId.value = null
          hoveredComponentId.value = null
          resetHistory(currentPage.value)
          return true
        }
      }
      const saved = localStorage.getItem(PAGE_STORAGE_KEY)
      if (!saved) return false
      const page = JSON.parse(saved) as PageSchema
      setCurrentPage(page)
      return true
    }
    catch (error) {
      console.error('加载页面失败:', error)
      return false
    }
  }

  return {
    currentPage,
    pages,
    currentPageIndex,
    selectedComponentId,
    hoveredComponentId,
    canvasZoom,
    deviceMode,
    selectedComponent,
    hoveredComponent,
    addPage,
    duplicatePage,
    renamePage,
    movePage,
    deletePage,
    switchPage,
    addComponent,
    deleteComponent,
    moveComponentUp,
    moveComponentDown,
    updateComponent,
    updateComponentProps,
    updateComponentStyles,
    updateComponentsOrder,
    selectComponent,
    hoverComponent,
    setCanvasZoom,
    setDeviceMode,
    setCurrentPage,
    clearPage,
    savePage,
    loadPage,
  }
})
