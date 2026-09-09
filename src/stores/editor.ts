/**
 * 编辑器状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PageSchema, ComponentSchema } from '@/types/schema'
import {
  createEmptyPageSchema,
  findComponentById,
  removeComponentById,
  updateComponentById,
  moveComponentById,
  cloneSchema,
} from '@/utils/schema-generator'
import { useHistoryStore } from './history'

export const useEditorStore = defineStore('editor', () => {
  const currentPage = ref<PageSchema>(createEmptyPageSchema())
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

    historyStore.pushHistory(cloneSchema(currentPage.value))
    selectedComponentId.value = component.id
  }

  function updateComponentsOrder(components: ComponentSchema[]) {
    const historyStore = useHistoryStore()
    currentPage.value.components = components
    historyStore.pushHistory(cloneSchema(currentPage.value))
  }

  function deleteComponent(id: string) {
    const historyStore = useHistoryStore()
    currentPage.value.components = removeComponentById(currentPage.value.components, id)
    historyStore.pushHistory(cloneSchema(currentPage.value))
    if (selectedComponentId.value === id) selectedComponentId.value = null
  }

  function moveComponentUp(id: string) {
    const historyStore = useHistoryStore()
    currentPage.value.components = moveComponentById(currentPage.value.components, id, 'up')
    historyStore.pushHistory(cloneSchema(currentPage.value))
  }

  function moveComponentDown(id: string) {
    const historyStore = useHistoryStore()
    currentPage.value.components = moveComponentById(currentPage.value.components, id, 'down')
    historyStore.pushHistory(cloneSchema(currentPage.value))
  }

  function updateComponent(id: string, updates: Partial<ComponentSchema>) {
    const historyStore = useHistoryStore()
    currentPage.value.components = updateComponentById(currentPage.value.components, id, updates)
    historyStore.pushHistory(cloneSchema(currentPage.value))
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
    const historyStore = useHistoryStore()
    currentPage.value = page
    selectedComponentId.value = null
    hoveredComponentId.value = null
    historyStore.clear()
    historyStore.pushHistory(cloneSchema(page))
  }

  function clearPage() { setCurrentPage(createEmptyPageSchema()) }

  function savePage() {
    try {
      localStorage.setItem('h5-editor-page', JSON.stringify(currentPage.value))
      return true
    }
    catch (error) {
      console.error('保存页面失败:', error)
      return false
    }
  }

  function loadPage() {
    try {
      const saved = localStorage.getItem('h5-editor-page')
      if (saved) {
        const page = JSON.parse(saved) as PageSchema
        setCurrentPage(page)
        return true
      }
      return false
    }
    catch (error) {
      console.error('加载页面失败:', error)
      return false
    }
  }

  return {
    currentPage,
    selectedComponentId,
    hoveredComponentId,
    canvasZoom,
    deviceMode,
    selectedComponent,
    hoveredComponent,
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
