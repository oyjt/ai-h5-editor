/**
 * Agent 协议
 * Agent 不直接改画布，只产出结构化补丁，由 apply.ts 统一应用并进入撤销链路。
 */

export type AgentMode = 'spec' | 'prompt'

export type AgentPatch =
  | { op: 'create_page', name: string }
  | { op: 'append_component', type: string, props?: Record<string, unknown>, styles?: Record<string, unknown> }
  | { op: 'patch_component', id: string, props?: Record<string, unknown>, styles?: Record<string, unknown> }
  | { op: 'delete_component', id: string }

export interface Deviation {
  /** ignored：规范优先下忽略了用户的偏离要求；kept：Prompt 优先下保留并记录 */
  kind: 'ignored' | 'kept'
  text: string
}

export interface AgentPlan {
  summary: string
  steps: string[]
  patches: AgentPatch[]
  deviations: Deviation[]
  followUps: string[]
}

export interface AgentContext {
  mode: AgentMode
  /** 画布里被选中或框选的组件，修改类指令作用于它们 */
  selection: { id: string, type: string, name: string, props: Record<string, unknown>, styles: Record<string, unknown> }[]
  pageCount: number
}

export interface AgentProvider {
  readonly name: string
  plan: (prompt: string, ctx: AgentContext) => Promise<AgentPlan>
}
