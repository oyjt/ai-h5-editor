/**
 * 设计转代码：把页面 Schema 生成 Vue 单文件组件、CSS 和 Design DSL。
 * Token 引用在 CSS 里保留为 var(--ud-*)，在 DSL 里保留为 {token.path}，与风格库一一对应。
 */

import type { ComponentSchema, PageSchema } from '@/types/schema'
import { resolveTokenString, resolveTokensDeep } from './tokens'

export interface CodegenResult {
  vue: string
  css: string
  dsl: string
}

function kebab(key: string) {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase()
}

function pascal(type: string) {
  return `Ud${type.replace(/(^|[-_])(\w)/g, (_, __, c: string) => c.toUpperCase())}`
}

function cssBlock(selector: string, styles: Record<string, unknown> | undefined) {
  const lines = Object.entries(styles ?? {})
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `  ${kebab(key)}: ${resolveTokenString(String(value), 'css')};`)
  return lines.length ? `${selector} {\n${lines.join('\n')}\n}` : ''
}

function attr(name: string, value: unknown) {
  if (typeof value === 'string') return `${name}="${value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"`
  return `:${name}='${JSON.stringify(value).replaceAll('&', '&amp;').replaceAll('\'', '&#39;')}'`
}

export function generateCode(page: PageSchema): CodegenResult {
  let index = 0
  const cssParts: string[] = []
  const rootCss = cssBlock('.page', page.globalStyles)
  if (rootCss) cssParts.push(rootCss)

  const render = (component: ComponentSchema, depth: number): string => {
    const cls = `c${++index}`
    const block = cssBlock(`.${cls}`, component.styles)
    if (block) cssParts.push(block)
    const pad = '  '.repeat(depth)
    const props = Object.entries(resolveTokensDeep(component.props ?? {}, 'static')).filter(([, value]) => value !== undefined && value !== null)
    const attrs = [`class="${cls}"`, ...props.map(([key, value]) => attr(key, value))].join(' ')
    const tag = pascal(component.type)
    if (component.children?.length) {
      return `${pad}<${tag} ${attrs}>\n${component.children.map(child => render(child, depth + 1)).join('\n')}\n${pad}</${tag}>`
    }
    return `${pad}<${tag} ${attrs} />`
  }

  const body = page.components.map(component => render(component, 2)).join('\n')
  const css = cssParts.join('\n\n')
  const vue = `<template>\n  <main class="page">\n${body}\n  </main>\n</template>\n\n<style scoped>\n${css}\n</style>\n`

  const toDsl = (component: ComponentSchema): unknown => ({
    type: component.type,
    ...(Object.keys(component.props ?? {}).length ? { props: component.props } : {}),
    ...(Object.keys(component.styles ?? {}).length ? { styles: component.styles } : {}),
    ...(component.children?.length ? { children: component.children.map(toDsl) } : {}),
  })
  const dsl = JSON.stringify({ type: 'Page', name: page.name, styles: page.globalStyles ?? {}, children: page.components.map(toDsl) }, null, 2)

  return { vue, css, dsl }
}

/** 统计 Token 引用与硬编码颜色，用于走查清单 */
export function auditTokens(page: PageSchema) {
  let refs = 0
  let hardcoded = 0
  const scan = (value: unknown) => {
    if (typeof value === 'string') {
      refs += (value.match(/\{[a-z][\w-]*(?:\.[\w-]+)+\}/g) ?? []).length
      hardcoded += (value.match(/#[0-9a-f]{3,8}\b/gi) ?? []).length
    }
    else if (Array.isArray(value)) value.forEach(scan)
    else if (value && typeof value === 'object') Object.values(value).forEach(scan)
  }
  const walk = (list: ComponentSchema[]) => {
    for (const item of list) {
      scan(item.styles)
      scan(item.props)
      walk(item.children ?? [])
    }
  }
  scan(page.globalStyles)
  walk(page.components)
  return { refs, hardcoded }
}
