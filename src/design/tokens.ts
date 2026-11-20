/**
 * Design Token 运行时
 * Schema 里的值可以写成 `{color.primary}` 这样的 Token 引用：
 * - 编辑器与预览里解析为 CSS 变量 var(--ud-color-primary)
 * - 导出静态 HTML 时解析为具体值
 */

import { designTokens } from './tokens.generated'
import type { DesignToken } from './tokens.generated'

export type TokenGroup = 'color' | 'space' | 'radius' | 'font-size'

const tokenByPath = new Map<string, DesignToken>(designTokens.map(token => [token.path, token]))
const REF_PATTERN = /\{([a-z][\w-]*(?:\.[\w-]+)+)\}/g

export function getTokensByGroup(group: TokenGroup): DesignToken[] {
  return designTokens.filter(token => token.group === group)
}

export function hasToken(path: string) {
  return tokenByPath.has(path)
}

export function tokenRef(path: string) {
  return `{${path}}`
}

/** 把字符串里的 Token 引用替换成 CSS 变量或具体值，未知引用保持原样 */
export function resolveTokenString(value: string, mode: 'css' | 'static' = 'css'): string {
  if (!value.includes('{')) return value
  return value.replace(REF_PATTERN, (match, path: string) => {
    const token = tokenByPath.get(path)
    if (!token) return match
    return mode === 'css' ? `var(${token.cssVar})` : token.value
  })
}

export function resolveTokensDeep<T>(input: T, mode: 'css' | 'static' = 'css'): T {
  if (typeof input === 'string') return resolveTokenString(input, mode) as T
  if (Array.isArray(input)) return input.map(item => resolveTokensDeep(item, mode)) as T
  if (input && typeof input === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) out[key] = resolveTokensDeep(value, mode)
    return out as T
  }
  return input
}

/** 是否是完整的 Token 引用，例如 `{color.primary}` */
export function isTokenRef(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const match = /^\{([a-z][\w-]*(?:\.[\w-]+)+)\}$/.exec(value.trim())
  return !!match && tokenByPath.has(match[1])
}

export function normalizeHex(value: string): string | null {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim())
  if (!match) return null
  const hex = match[1].length === 3 ? match[1].split('').map(c => c + c).join('') : match[1]
  return `#${hex.toLowerCase()}`
}

function rgbOf(hex: string): [number, number, number] {
  return [Number.parseInt(hex.slice(1, 3), 16), Number.parseInt(hex.slice(3, 5), 16), Number.parseInt(hex.slice(5, 7), 16)]
}

/** 找到与给定颜色最接近的颜色 Token */
export function nearestColorToken(hex: string): { token: DesignToken, exact: boolean } | null {
  const target = normalizeHex(hex)
  if (!target) return null
  const [r, g, b] = rgbOf(target)
  let best: { token: DesignToken, distance: number } | null = null
  for (const token of getTokensByGroup('color')) {
    const candidate = normalizeHex(token.value)
    if (!candidate) continue
    const [cr, cg, cb] = rgbOf(candidate)
    const distance = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2
    if (!best || distance < best.distance) best = { token, distance }
  }
  return best ? { token: best.token, exact: best.distance === 0 } : null
}

export function nearestDimensionToken(group: 'space' | 'radius' | 'font-size', px: number): DesignToken | null {
  let best: { token: DesignToken, distance: number } | null = null
  for (const token of getTokensByGroup(group)) {
    const value = Number.parseFloat(token.value)
    if (Number.isNaN(value) || value > 1000) continue
    const distance = Math.abs(value - px)
    if (!best || distance < best.distance) best = { token, distance }
  }
  return best?.token ?? null
}
