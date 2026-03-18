/**
 * JSON Schema 生成器和验证器
 */

import type { ComponentSchema, PageSchema, SchemaValidationResult } from '@/types/schema'
import { nanoid } from 'nanoid'

/**
 * 生成组件 ID
 */
export function generateComponentId(): string {
  return `comp_${nanoid(10)}`
}

/**
 * 生成页面 ID
 */
export function generatePageId(): string {
  return `page_${nanoid(10)}`
}

/**
 * 创建空白页面 Schema
 */
export function createEmptyPageSchema(name = '未命名页面'): PageSchema {
  return {
    id: generatePageId(),
    name,
    version: '1.0.0',
    components: [],
    globalStyles: {},
    meta: {
      title: name,
      description: '',
      keywords: [],
      createTime: Date.now(),
      updateTime: Date.now(),
    },
  }
}

/**
 * 创建组件 Schema
 */
export function createComponentSchema(
  type: string,
  props: Record<string, any> = {},
  styles: Record<string, any> = {},
): ComponentSchema {
  return {
    id: generateComponentId(),
    type,
    props,
    styles,
    children: [],
  }
}

/**
 * 验证组件 Schema
 */
export function validateComponentSchema(schema: ComponentSchema): SchemaValidationResult {
  const errors: string[] = []

  if (!schema.id) {
    errors.push('组件缺少 id 字段')
  }

  if (!schema.type) {
    errors.push('组件缺少 type 字段')
  }

  if (!schema.props || typeof schema.props !== 'object') {
    errors.push('组件 props 必须是对象')
  }

  if (!schema.styles || typeof schema.styles !== 'object') {
    errors.push('组件 styles 必须是对象')
  }

  // 递归验证子组件
  if (schema.children && Array.isArray(schema.children)) {
    schema.children.forEach((child, index) => {
      const childResult = validateComponentSchema(child)
      if (!childResult.valid) {
        errors.push(`子组件 [${index}] 验证失败: ${childResult.errors.join(', ')}`)
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * 验证页面 Schema
 */
export function validatePageSchema(schema: PageSchema): SchemaValidationResult {
  const errors: string[] = []

  if (!schema.id) {
    errors.push('页面缺少 id 字段')
  }

  if (!schema.name) {
    errors.push('页面缺少 name 字段')
  }

  if (!schema.version) {
    errors.push('页面缺少 version 字段')
  }

  if (!Array.isArray(schema.components)) {
    errors.push('页面 components 必须是数组')
  }
  else {
    // 验证每个组件
    schema.components.forEach((component, index) => {
      const result = validateComponentSchema(component)
      if (!result.valid) {
        errors.push(`组件 [${index}] 验证失败: ${result.errors.join(', ')}`)
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * 深度克隆 Schema
 */
export function cloneSchema<T>(schema: T): T {
  return JSON.parse(JSON.stringify(schema))
}

/**
 * 在组件树中查找组件
 */
export function findComponentById(
  components: ComponentSchema[],
  id: string,
): ComponentSchema | null {
  for (const component of components) {
    if (component.id === id) {
      return component
    }

    if (component.children && component.children.length > 0) {
      const found = findComponentById(component.children, id)
      if (found) {
        return found
      }
    }
  }

  return null
}

/**
 * 删除组件
 */
export function removeComponentById(
  components: ComponentSchema[],
  id: string,
): ComponentSchema[] {
  return components.filter((component) => {
    if (component.id === id) {
      return false
    }

    if (component.children && component.children.length > 0) {
      component.children = removeComponentById(component.children, id)
    }

    return true
  })
}

/**
 * 更新组件
 */
export function updateComponentById(
  components: ComponentSchema[],
  id: string,
  updates: Partial<ComponentSchema>,
): ComponentSchema[] {
  return components.map((component) => {
    if (component.id === id) {
      return { ...component, ...updates }
    }

    if (component.children && component.children.length > 0) {
      return {
        ...component,
        children: updateComponentById(component.children, id, updates),
      }
    }

    return component
  })
}

/**
 * 移动组件位置
 */
export function moveComponentById(
  components: ComponentSchema[],
  id: string,
  direction: 'up' | 'down',
): ComponentSchema[] {
  // 在当前层级查找组件
  const index = components.findIndex(comp => comp.id === id)

  if (index !== -1) {
    // 找到了组件，执行移动
    const newComponents = [...components]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    // 检查边界
    if (targetIndex >= 0 && targetIndex < newComponents.length) {
      // 交换位置
      [newComponents[index], newComponents[targetIndex]] = [newComponents[targetIndex], newComponents[index]]
    }

    return newComponents
  }

  // 在子组件中递归查找
  return components.map((component) => {
    if (component.children && component.children.length > 0) {
      return {
        ...component,
        children: moveComponentById(component.children, id, direction),
      }
    }
    return component
  })
}
