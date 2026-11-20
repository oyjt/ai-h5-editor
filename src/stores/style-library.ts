/**
 * 风格库：多库管理 + 二次蒸馏 + 发布版本
 * - 内置 Ant Design 风格库；用户可新建自己的风格库
 * - 蒸馏：扫描项目里所有页面，找出未登记的颜色 / 圆角 / 字号取值，生成待确认差异
 * - 采纳/驳回需人工确认，发布后采纳的取值写入风格库并升版本，校验器随之放行
 */

import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import { designTokens } from '@/design/tokens.generated'
import { setExtraAllowed } from '@/design/tokens'
import { normalizeHex } from '@/design/tokens'
import { validatePage } from '@/design/spec-validator'
import type { ViolationRule } from '@/design/spec-validator'
import type { ComponentSchema, PageSchema } from '@/types/schema'
import { useEditorStore } from './editor'
import { useAgentStore } from './agent'

export type CandidateKind = 'color' | 'radius' | 'font-size'
export type Decision = 'adopt' | 'reject'

export interface ExtraToken { kind: CandidateKind, value: string, adoptedAt: number }
export interface LibraryRelease { version: string, at: number, note: string }
export interface StyleLibrary {
  id: string
  name: string
  builtin?: boolean
  major: number
  minor: number
  extras: ExtraToken[]
  rejected: string[]
  decisions: Record<string, Decision>
  releases: LibraryRelease[]
}

export interface Candidate {
  key: string
  kind: CandidateKind
  value: string
  count: number
  pages: string[]
  title: string
  before: string
  after: string
  decision?: Decision
}

const KEY = 'ai-h5-style-libraries'
const RULE_TO_KIND: Partial<Record<ViolationRule, CandidateKind>> = {
  'color-off-palette': 'color',
  'radius-off-scale': 'radius',
  'font-size-off-scale': 'font-size',
}
export const KIND_LABEL: Record<CandidateKind, string> = { 'color': '颜色', 'radius': '圆角', 'font-size': '字号' }

export function versionOf(lib: StyleLibrary) {
  return `v${lib.major}.${lib.minor}`
}

function makeLibrary(name: string, builtin = false): StyleLibrary {
  return { id: builtin ? 'antd' : `lib_${nanoid(6)}`, name, builtin, major: builtin ? 5 : 1, minor: 0, extras: [], rejected: [], decisions: {}, releases: [] }
}

function load(): { libraries: StyleLibrary[], activeId: string } {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (Array.isArray(data.libraries) && data.libraries.length) return { libraries: data.libraries, activeId: data.activeId }
    }
  }
  catch {}
  return { libraries: [makeLibrary('Ant Design', true)], activeId: 'antd' }
}

function countComponents(list: ComponentSchema[]): number {
  return list.reduce((sum, item) => sum + 1 + countComponents(item.children ?? []), 0)
}

function rawValue(rule: ViolationRule, current: string): string | null {
  if (rule === 'color-off-palette') return normalizeHex(current)
  const px = /^(-?\d+(?:\.\d+)?)px$/.exec(current.trim())
  return px ? `${Number.parseFloat(px[1])}px` : null
}

export const useStyleLibraryStore = defineStore('style-library', () => {
  const initial = load()
  const libraries = ref<StyleLibrary[]>(initial.libraries)
  const activeId = ref(libraries.value.some(item => item.id === initial.activeId) ? initial.activeId : libraries.value[0].id)
  const scanRevision = ref(0)

  const active = computed(() => libraries.value.find(item => item.id === activeId.value) ?? libraries.value[0])

  function projectPages(): PageSchema[] {
    const editor = useEditorStore()
    return editor.pages.map((page, index) => (index === editor.currentPageIndex ? editor.currentPage : page))
  }

  function syncValidator() {
    const extras = active.value.extras
    const px = (kind: CandidateKind) => extras.filter(item => item.kind === kind).map(item => Number.parseFloat(item.value))
    setExtraAllowed({ color: extras.filter(item => item.kind === 'color').map(item => item.value), radius: px('radius'), fontSize: px('font-size') })
    try { useAgentStore().refreshCheck() }
    catch {}
  }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify({ libraries: libraries.value, activeId: activeId.value })) }
    catch {}
  }

  watch([libraries, activeId], persist, { deep: true })
  watch(activeId, syncValidator)
  syncValidator()

  /** 扫描整个项目，得到当前风格库下的待确认差异 */
  const candidates = computed<Candidate[]>(() => {
    void scanRevision.value
    const lib = active.value
    const groups = new Map<string, Candidate>()
    for (const page of projectPages()) {
      for (const violation of validatePage(page)) {
        const kind = RULE_TO_KIND[violation.rule]
        if (!kind) continue
        const value = rawValue(violation.rule, violation.current)
        if (!value) continue
        const key = `${kind}:${value}`
        if (lib.rejected.includes(key)) continue
        const hit = groups.get(key)
        if (hit) {
          hit.count++
          if (!hit.pages.includes(page.name)) hit.pages.push(page.name)
          continue
        }
        groups.set(key, {
          key,
          kind,
          value,
          count: 1,
          pages: [page.name],
          title: `${KIND_LABEL[kind]} ${value}`,
          before: `未登记，校验器会判定为偏离，建议改用 ${violation.suggestion.replace(/[{}]/g, '')}`,
          after: `登记到「${lib.name}」，作为合规的${KIND_LABEL[kind]}取值`,
          decision: lib.decisions[key],
        })
      }
    }
    return [...groups.values()].sort((a, b) => b.count - a.count)
  })

  const stats = computed(() => {
    const pages = projectPages()
    const list = candidates.value
    return {
      pageCount: pages.length,
      componentCount: pages.reduce((sum, page) => sum + countComponents(page.components), 0),
      tokenCount: designTokens.length + active.value.extras.length,
      adopted: list.filter(item => item.decision === 'adopt').length,
      rejected: list.filter(item => item.decision === 'reject').length,
      pending: list.filter(item => !item.decision).length,
    }
  })

  function rescan() { scanRevision.value++ }
  function select(id: string) { if (libraries.value.some(item => item.id === id)) activeId.value = id }
  function decide(key: string, decision: Decision | undefined) {
    const lib = active.value
    if (decision) lib.decisions[key] = decision
    else delete lib.decisions[key]
  }
  function rejectAll() { for (const item of candidates.value) decide(item.key, 'reject') }
  function create(name: string) {
    const lib = makeLibrary(name.trim() || `风格库 ${libraries.value.length + 1}`)
    libraries.value.push(lib)
    activeId.value = lib.id
    return lib
  }

  /** 发布：采纳的写入风格库，驳回的以后不再提示，升一个小版本 */
  function publish() {
    const lib = active.value
    const list = candidates.value
    if (list.some(item => !item.decision)) return false
    const adopted = list.filter(item => item.decision === 'adopt')
    const rejected = list.filter(item => item.decision === 'reject')
    for (const item of adopted) lib.extras.push({ kind: item.kind, value: item.value, adoptedAt: Date.now() })
    for (const item of rejected) lib.rejected.push(item.key)
    lib.decisions = {}
    lib.minor++
    lib.releases.unshift({ version: versionOf(lib), at: Date.now(), note: `采纳 ${adopted.length} 项，驳回 ${rejected.length} 项` })
    syncValidator()
    return true
  }

  return { libraries, activeId, active, candidates, stats, rescan, select, decide, rejectAll, create, publish }
})
