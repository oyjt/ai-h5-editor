/**
 * 补丁应用器：纯函数，输入页面 Schema 与补丁，输出新的页面 Schema
 */

import type { ComponentSchema, PageSchema } from '@/types/schema'
import { getComponentConfig } from '@/config/component-registry'
import { cloneSchema, createComponentSchema, findComponentById, removeComponentById } from '@/utils/schema-generator'
import type { AgentPatch } from './types'

export interface ApplyResult {
  page: PageSchema
  applied: number
  errors: string[]
  createdIds: string[]
}

/** 应用不含 create_page 的补丁；create_page 由 Store 负责先切到新页面 */
export function applyPatchesToPage(source: PageSchema, patches: AgentPatch[]): ApplyResult {
  const page = cloneSchema(source)
  const errors: string[] = []
  const createdIds: string[] = []
  let applied = 0

  for (const patch of patches) {
    if (patch.op === 'append_component') {
      const config = getComponentConfig(patch.type)
      if (!config) { errors.push(`未知组件类型：${patch.type}`); continue }
      const component: ComponentSchema = createComponentSchema(
        patch.type,
        { ...config.defaultProps, ...patch.props },
        { ...config.defaultStyles, ...patch.styles },
      )
      page.components.push(component)
      createdIds.push(component.id)
      applied++
    }
    else if (patch.op === 'patch_component') {
      const target = findComponentById(page.components, patch.id)
      if (!target) { errors.push(`找不到组件：${patch.id}`); continue }
      target.props = { ...target.props, ...patch.props }
      target.styles = { ...target.styles, ...patch.styles }
      applied++
    }
    else if (patch.op === 'delete_component') {
      if (!findComponentById(page.components, patch.id)) { errors.push(`找不到组件：${patch.id}`); continue }
      page.components = removeComponentById(page.components, patch.id)
      applied++
    }
  }
  return { page, applied, errors, createdIds }
}
