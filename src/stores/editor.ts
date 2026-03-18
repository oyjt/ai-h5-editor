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
  // 当前编辑的页面
  const currentPage = ref<PageSchema>(createEmptyPageSchema())

  // 选中的组件 ID
  const selectedComponentId = ref<string | null>(null)

  // 悬停的组件 ID
  const hoveredComponentId = ref<string | null>(null)

  // 编辑模式：edit | preview
  const mode = ref<'edit' | 'preview'>('edit')

  // 计算属性：选中的组件
  const selectedComponent = computed(() => {
    if (!selectedComponentId.value) {
      return null
    }
    return findComponentById(currentPage.value.components, selectedComponentId.value)
  })

  // 计算属性：悬停的组件
  const hoveredComponent = computed(() => {
    if (!hoveredComponentId.value) {
      return null
    }
    return findComponentById(currentPage.value.components, hoveredComponentId.value)
  })

  /**
   * 添加组件
   */
  function addComponent(component: ComponentSchema, parentId?: string, index?: number) {
    const historyStore = useHistoryStore()

    if (parentId) {
      // 添加到指定父组件
      const parent = findComponentById(currentPage.value.components, parentId)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        if (index !== undefined && index >= 0) {
          parent.children.splice(index, 0, component)
        }
        else {
          parent.children.push(component)
        }
      }
    }
    else {
      // 添加到根级别
      if (index !== undefined && index >= 0) {
        currentPage.value.components.splice(index, 0, component)
      }
      else {
        currentPage.value.components.push(component)
      }
    }

    // 记录历史
    historyStore.pushHistory(cloneSchema(currentPage.value))

    // 自动选中新添加的组件
    selectedComponentId.value = component.id
  }

  /**
   * 更新组件列表顺序
   */
  function updateComponentsOrder(components: ComponentSchema[]) {
    const historyStore = useHistoryStore()

    currentPage.value.components = components

    // 记录历史
    historyStore.pushHistory(cloneSchema(currentPage.value))
  }

  /**
   * 删除组件
   */
  function deleteComponent(id: string) {
    const historyStore = useHistoryStore()

    currentPage.value.components = removeComponentById(currentPage.value.components, id)

    // 记录历史
    historyStore.pushHistory(cloneSchema(currentPage.value))

    // 清除选中状态
    if (selectedComponentId.value === id) {
      selectedComponentId.value = null
    }
  }

  /**
   * 上移组件
   */
  function moveComponentUp(id: string) {
    const historyStore = useHistoryStore()

    currentPage.value.components = moveComponentById(currentPage.value.components, id, 'up')

    // 记录历史
    historyStore.pushHistory(cloneSchema(currentPage.value))
  }

  /**
   * 下移组件
   */
  function moveComponentDown(id: string) {
    const historyStore = useHistoryStore()

    currentPage.value.components = moveComponentById(currentPage.value.components, id, 'down')

    // 记录历史
    historyStore.pushHistory(cloneSchema(currentPage.value))
  }

  /**
   * 更新组件
   */
  function updateComponent(id: string, updates: Partial<ComponentSchema>) {
    const historyStore = useHistoryStore()

    currentPage.value.components = updateComponentById(
      currentPage.value.components,
      id,
      updates,
    )

    // 记录历史
    historyStore.pushHistory(cloneSchema(currentPage.value))
  }

  /**
   * 更新组件属性
   */
  function updateComponentProps(id: string, props: Record<string, any>) {
    const component = findComponentById(currentPage.value.components, id)
    if (component) {
      updateComponent(id, {
        props: { ...component.props, ...props },
      })
    }
  }

  /**
   * 更新组件样式
   */
  function updateComponentStyles(id: string, styles: Record<string, any>) {
    const component = findComponentById(currentPage.value.components, id)
    if (component) {
      updateComponent(id, {
        styles: { ...component.styles, ...styles },
      })
    }
  }

  /**
   * 选择组件
   */
  function selectComponent(id: string | null) {
    selectedComponentId.value = id
  }

  /**
   * 悬停组件
   */
  function hoverComponent(id: string | null) {
    hoveredComponentId.value = id
  }

  /**
   * 切换模式
   */
  function toggleMode() {
    mode.value = mode.value === 'edit' ? 'preview' : 'edit'
  }

  /**
   * 设置当前页面
   */
  function setCurrentPage(page: PageSchema) {
    const historyStore = useHistoryStore()

    currentPage.value = page
    selectedComponentId.value = null
    hoveredComponentId.value = null

    // 清空历史记录
    historyStore.clear()
    // 记录初始状态
    historyStore.pushHistory(cloneSchema(page))
  }

  /**
   * 清空页面
   */
  function clearPage() {
    setCurrentPage(createEmptyPageSchema())
  }

  /**
   * 保存页面到 localStorage
   */
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

  /**
   * 从 localStorage 加载页面
   */
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
    // 状态
    currentPage,
    selectedComponentId,
    hoveredComponentId,
    mode,
    selectedComponent,
    hoveredComponent,

    // 方法
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
    toggleMode,
    setCurrentPage,
    clearPage,
    savePage,
    loadPage,
  }
})
