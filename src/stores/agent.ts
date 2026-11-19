/**
 * Agent 会话状态：多会话、模式、执行步骤、偏离清单与规范校验结果
 */

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import { applyPatchesToPage } from '@/agent/apply'
import { resolveProvider } from '@/agent/provider'
import type { AgentContext, AgentMode, AgentPatch, Deviation } from '@/agent/types'
import { getComponentConfig } from '@/config/component-registry'
import { validatePage, violationsToPatches } from '@/design/spec-validator'
import type { Violation } from '@/design/spec-validator'
import { cloneSchema, findComponentById } from '@/utils/schema-generator'
import { useEditorStore } from './editor'

export interface AgentMessage {
  id: string
  role: 'user' | 'agent'
  text: string
  steps?: { label: string, done: boolean }[]
  deviations?: Deviation[]
  followUps?: string[]
  scope?: string
  status?: 'running' | 'done' | 'error'
}

export interface AgentSession {
  id: string
  title: string
  messages: AgentMessage[]
  running: boolean
}

const STORAGE_KEY = 'ud-agent-sessions'

function createSession(title = '新会话'): AgentSession {
  return { id: `sess_${nanoid(8)}`, title, messages: [], running: false }
}

function loadSessions(): AgentSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const sessions = (JSON.parse(raw) as AgentSession[]).map(item => ({ ...item, running: false }))
      if (sessions.length) return sessions
    }
  }
  catch {}
  return [createSession()]
}

export const useAgentStore = defineStore('agent', () => {
  const sessions = ref<AgentSession[]>(loadSessions())
  const activeId = ref(sessions.value[0].id)
  const mode = ref<AgentMode>('spec')
  const provider = resolveProvider()
  const lastCheckAt = ref(0)
  const pageRevision = ref(0)

  const active = computed(() => sessions.value.find(item => item.id === activeId.value) ?? sessions.value[0])
  const violations = computed<Violation[]>(() => {
    void pageRevision.value
    return validatePage(useEditorStore().currentPage)
  })
  const hasRunning = computed(() => sessions.value.some(item => item.running))

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.value.slice(0, 20))) }
    catch {}
  }
  function newSession() {
    const session = createSession(`新会话 ${sessions.value.length + 1}`)
    sessions.value.unshift(session)
    activeId.value = session.id
    persist()
  }
  function switchSession(id: string) {
    if (sessions.value.some(item => item.id === id)) activeId.value = id
  }
  function setMode(value: AgentMode) { mode.value = value }
  function refreshCheck() { pageRevision.value++; lastCheckAt.value = Date.now() }

  function buildContext(): AgentContext {
    const editor = useEditorStore()
    const ids = editor.agentSelectionIds.length ? editor.agentSelectionIds : (editor.selectedComponentId ? [editor.selectedComponentId] : [])
    const selection = ids
      .map(id => findComponentById(editor.currentPage.components, id))
      .filter((item): item is NonNullable<typeof item> => !!item)
      .map(item => ({ id: item.id, type: item.type, name: getComponentConfig(item.type)?.name ?? item.type, props: item.props, styles: item.styles }))
    return { mode: mode.value, selection, pageCount: editor.pages.length }
  }

  function runPatches(patches: AgentPatch[]) {
    const editor = useEditorStore()
    let applied = 0
    const errors: string[] = []
    // 按 create_page 切段：每段在各自页面里合并成一次历史记录
    let segment: AgentPatch[] = []
    const flush = () => {
      if (!segment.length) return
      const result = applyPatchesToPage(editor.currentPage, segment)
      if (result.applied) editor.commitPageTransform(result.page)
      applied += result.applied
      errors.push(...result.errors)
      segment = []
    }
    for (const patch of patches) {
      if (patch.op === 'create_page') {
        flush()
        const page = editor.addPage()
        page.name = patch.name
        if (page.meta) page.meta.title = patch.name
        applied++
      }
      else segment.push(patch)
    }
    flush()
    editor.savePage()
    refreshCheck()
    return { applied, errors }
  }

  async function send(prompt: string) {
    const text = prompt.trim()
    const session = active.value
    if (!text || session.running) return
    const context = buildContext()
    const scope = context.selection.length ? `选区：${context.selection.map(item => item.name).join('、')}` : undefined
    if (session.title.startsWith('新会话')) session.title = text.slice(0, 14)

    session.messages.push({ id: nanoid(6), role: 'user', text, scope })
    const reply: AgentMessage = { id: nanoid(6), role: 'agent', text: '正在规划…', steps: [], status: 'running' }
    session.messages.push(reply)
    session.running = true
    const target = session.messages[session.messages.length - 1]

    try {
      const plan = await provider.plan(text, context)
      target.steps = plan.steps.map(label => ({ label, done: false }))
      for (const step of target.steps) {
        await new Promise(resolve => setTimeout(resolve, 180))
        step.done = true
      }
      if (!plan.patches.length) {
        target.text = '这条需求我没能转成具体改动，可以先在画布上选中组件，或者说得更具体一点。'
        target.status = 'done'
        return
      }
      const result = runPatches(plan.patches)
      target.text = result.errors.length ? `${plan.summary}，其中 ${result.errors.length} 项未能应用` : plan.summary
      target.deviations = plan.deviations
      target.followUps = plan.followUps
      target.status = 'done'
      useEditorStore().setAgentSelection([])
    }
    catch (error) {
      console.error('[Agent] 执行失败', error)
      target.text = '执行失败，画布没有被修改，请重试。'
      target.status = 'error'
    }
    finally {
      session.running = false
      persist()
    }
  }

  /** 把校验建议一次性写回页面，作为一条历史记录 */
  function autofixViolations(targets: Violation[] = violations.value) {
    if (!targets.length) return 0
    const editor = useEditorStore()
    const next = cloneSchema(editor.currentPage)
    let fixed = 0
    for (const patch of violationsToPatches(targets)) {
      if (patch.componentId === 'page') {
        next.globalStyles = { ...next.globalStyles, [patch.key]: patch.value }
        fixed++
        continue
      }
      const component = findComponentById(next.components, patch.componentId)
      if (!component) continue
      component[patch.field] = { ...component[patch.field], [patch.key]: patch.value }
      fixed++
    }
    if (fixed) {
      editor.commitPageTransform(next)
      editor.savePage()
      refreshCheck()
    }
    return fixed
  }

  return { sessions, activeId, active, mode, providerName: provider.name, violations, lastCheckAt, hasRunning, newSession, switchSession, setMode, send, autofixViolations, refreshCheck }
})
