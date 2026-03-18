/**
 * 历史记录管理（撤销/重做）
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PageSchema } from '@/types/schema'
import { cloneSchema } from '@/utils/schema-generator'

const MAX_HISTORY_SIZE = 50 // 最大历史记录数量

export const useHistoryStore = defineStore('history', () => {
  // 历史记录栈（过去的状态）
  const past = ref<PageSchema[]>([])

  // 重做记录栈（未来的状态）
  const future = ref<PageSchema[]>([])

  // 计算属性：是否可以撤销
  const canUndo = computed(() => past.value.length > 1)

  // 计算属性：是否可以重做
  const canRedo = computed(() => future.value.length > 0)

  /**
   * 记录历史
   */
  function pushHistory(page: PageSchema) {
    // 添加到历史记录
    past.value.push(cloneSchema(page))

    // 限制历史记录数量
    if (past.value.length > MAX_HISTORY_SIZE) {
      past.value.shift()
    }

    // 清空重做记录
    future.value = []
  }

  /**
   * 撤销
   */
  function undo(): PageSchema | null {
    if (!canUndo.value) {
      return null
    }

    // 从历史记录中弹出当前状态
    const current = past.value.pop()!

    // 将当前状态推入重做记录
    future.value.push(current)

    // 返回上一个状态
    return cloneSchema(past.value[past.value.length - 1])
  }

  /**
   * 重做
   */
  function redo(): PageSchema | null {
    if (!canRedo.value) {
      return null
    }

    // 从重做记录中弹出状态
    const next = future.value.pop()!

    // 将状态推入历史记录
    past.value.push(next)

    // 返回重做的状态
    return cloneSchema(next)
  }

  /**
   * 清空历史记录
   */
  function clear() {
    past.value = []
    future.value = []
  }

  return {
    // 状态
    past,
    future,
    canUndo,
    canRedo,

    // 方法
    pushHistory,
    undo,
    redo,
    clear,
  }
})
