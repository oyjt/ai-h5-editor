/**
 * 规范校验器
 * 检查页面 Schema 是否遵守当前风格库（Design Token）：
 * - 颜色必须来自颜色 Token
 * - 间距按 4px 栅格
 * - 圆角、字号落在 Token 刻度上
 * 校验结果带修正建议，可一键生成补丁。
 */

import type { ComponentSchema, PageSchema } from '@/types/schema'
import {
  getExtraAllowed,
  getTokensByGroup,
  isTokenRef,
  nearestColorToken,
  nearestDimensionToken,
  normalizeHex,
  tokenRef,
} from './tokens'

export type ViolationRule = 'color-off-palette' | 'spacing-off-grid' | 'radius-off-scale' | 'font-size-off-scale'

export interface Violation {
  id: string
  rule: ViolationRule
  componentId: string
  componentType: string
  field: 'styles' | 'props'
  key: string
  current: string
  suggestion: string
  message: string
}

export interface FieldPatch {
  componentId: string
  field: 'styles' | 'props'
  key: string
  value: string
}

const SPACING_KEYS = /^(padding|margin|gap|rowGap|columnGap)(Top|Right|Bottom|Left)?$/
const COLOR_KEYS = /(color|background|border)/i
const RADIUS_KEYS = /^(borderRadius|round|radius)$/i
const FONT_SIZE_KEYS = /^fontSize$/

const colorValues = new Set(getTokensByGroup('color').map(token => normalizeHex(token.value)).filter(Boolean))
const radiusValues = new Set(getTokensByGroup('radius').map(token => Number.parseFloat(token.value)))
const fontSizeValues = new Set(getTokensByGroup('font-size').map(token => Number.parseFloat(token.value)))

function pxValues(value: string) {
  return [...value.matchAll(/(-?\d+(?:\.\d+)?)px/g)].map(match => Number.parseFloat(match[1]))
}

function checkColor(value: string): { suggestion: string, label: string } | null {
  const hex = normalizeHex(value)
  if (!hex || colorValues.has(hex) || getExtraAllowed().color.has(hex)) return null
  const near = nearestColorToken(hex)
  if (!near) return null
  return { suggestion: tokenRef(near.token.path), label: near.token.path }
}

function snapToGrid(px: number) {
  return Math.round(px / 4) * 4
}

function checkSpacing(value: string): string | null {
  const values = pxValues(value)
  if (!values.length || values.every(px => px === 0 || px % 4 === 0)) return null
  return value.replace(/(-?\d+(?:\.\d+)?)px/g, (_, num: string) => `${snapToGrid(Number.parseFloat(num))}px`)
}

function checkScale(group: 'radius' | 'font-size', value: string, allowed: Set<number>, extra: Set<number>): { suggestion: string, label: string } | null {
  const values = pxValues(value)
  if (values.length !== 1 || allowed.has(values[0]) || extra.has(values[0]) || values[0] === 0) return null
  const token = nearestDimensionToken(group, values[0])
  return token ? { suggestion: tokenRef(token.path), label: token.path } : null
}

function inspect(component: ComponentSchema, field: 'styles' | 'props', record: Record<string, unknown> | undefined, out: Violation[]) {
  if (!record) return
  for (const [key, raw] of Object.entries(record)) {
    if (typeof raw !== 'string' || isTokenRef(raw)) continue
    const base = { componentId: component.id, componentType: component.type, field, key, current: raw }
    const id = `${component.id}:${field}.${key}`

    if (COLOR_KEYS.test(key) && !SPACING_KEYS.test(key) && !RADIUS_KEYS.test(key)) {
      const hit = checkColor(raw)
      if (hit) out.push({ ...base, id, rule: 'color-off-palette', suggestion: hit.suggestion, message: `${key} 使用了不在风格库里的颜色 ${raw}，建议改为 ${hit.label}` })
      continue
    }
    if (SPACING_KEYS.test(key)) {
      const fixed = checkSpacing(raw)
      if (fixed) out.push({ ...base, id, rule: 'spacing-off-grid', suggestion: fixed, message: `${key} 的 ${raw} 不在 4px 栅格上，建议改为 ${fixed}` })
      continue
    }
    if (RADIUS_KEYS.test(key)) {
      const hit = checkScale('radius', raw, radiusValues, getExtraAllowed().radius)
      if (hit) out.push({ ...base, id, rule: 'radius-off-scale', suggestion: hit.suggestion, message: `${key} 的 ${raw} 不在圆角刻度上，建议改为 ${hit.label}` })
      continue
    }
    if (FONT_SIZE_KEYS.test(key)) {
      const hit = checkScale('font-size', raw, fontSizeValues, getExtraAllowed().fontSize)
      if (hit) out.push({ ...base, id, rule: 'font-size-off-scale', suggestion: hit.suggestion, message: `fontSize 的 ${raw} 不在字号刻度上，建议改为 ${hit.label}` })
    }
  }
}

function walk(components: ComponentSchema[], out: Violation[]) {
  for (const component of components) {
    inspect(component, 'styles', component.styles, out)
    inspect(component, 'props', component.props, out)
    if (component.children?.length) walk(component.children, out)
  }
}

export function validatePage(page: PageSchema): Violation[] {
  const out: Violation[] = []
  walk(page.components, out)
  if (page.globalStyles) {
    const root: ComponentSchema = { id: 'page', type: 'page', props: {}, styles: page.globalStyles }
    inspect(root, 'styles', page.globalStyles, out)
  }
  return out
}

export function violationsToPatches(violations: Violation[]): FieldPatch[] {
  return violations.map(item => ({ componentId: item.componentId, field: item.field, key: item.key, value: item.suggestion }))
}

export const RULE_LABELS: Record<ViolationRule, string> = {
  'color-off-palette': '颜色',
  'spacing-off-grid': '间距',
  'radius-off-scale': '圆角',
  'font-size-off-scale': '字号',
}
