/**
 * Agent Provider
 * 默认使用本地规划器；配置了 VITE_LLM_ENDPOINT 后改走用户配置的模型服务（OpenAI 兼容协议），
 * 网关返回不合法或请求失败时回落到本地规划器。
 * 优先使用设置面板中用户自带的模型 Key（仅存浏览器 localStorage）；未配置则读取 VITE_LLM_*，再否则用本地规划器。
 */

import { z } from 'zod'
import { describeTokens, planLocally } from './planner'
import type { AgentContext, AgentPlan, AgentProvider } from './types'

const PatchSchema = z.discriminatedUnion('op', [
  z.object({ op: z.literal('create_page'), name: z.string() }),
  z.object({ op: z.literal('append_component'), type: z.string(), props: z.record(z.string(), z.unknown()).optional(), styles: z.record(z.string(), z.unknown()).optional() }),
  z.object({ op: z.literal('patch_component'), id: z.string(), props: z.record(z.string(), z.unknown()).optional(), styles: z.record(z.string(), z.unknown()).optional() }),
  z.object({ op: z.literal('delete_component'), id: z.string() }),
])

const PlanSchema = z.object({
  summary: z.string(),
  steps: z.array(z.string()).default([]),
  patches: z.array(PatchSchema),
  followUps: z.array(z.string()).default([]),
})

export const localProvider: AgentProvider = {
  name: '本地规划器',
  async plan(prompt, ctx) {
    await new Promise(resolve => setTimeout(resolve, 600))
    return planLocally(prompt, ctx)
  },
}

function systemPrompt(ctx: AgentContext) {
  const modeRule = ctx.mode === 'spec'
    ? '规范优先：颜色、间距、圆角、字号只能使用 Token 引用，用户要求与规范冲突时按规范执行。'
    : 'Prompt 优先：用户明确的要求优先，但仍尽量用 Token。'
  return `你是 H5 页面设计 Agent，只输出 JSON：{"summary","steps","patches","followUps"}。
patches 的 op 只能是 create_page / append_component / patch_component / delete_component。
所有颜色、间距、圆角、字号用 Token 引用，写法如 {color.primary}。
${modeRule}
可用 Token：\n${describeTokens()}
当前选区：${JSON.stringify(ctx.selection.map(item => ({ id: item.id, type: item.type })))}`
}

export function createRemoteProvider(endpoint: string, model: string, apiKey?: string): AgentProvider {
  return {
    name: `模型网关（${model}）`,
    async plan(prompt, ctx): Promise<AgentPlan> {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) },
          body: JSON.stringify({
            model,
            response_format: { type: 'json_object' },
            messages: [{ role: 'system', content: systemPrompt(ctx) }, { role: 'user', content: prompt }],
          }),
        })
        if (!response.ok) throw new Error(`网关返回 ${response.status}`)
        const data = await response.json()
        const content = data?.choices?.[0]?.message?.content
        const parsed = PlanSchema.parse(JSON.parse(content))
        return { ...parsed, deviations: [] }
      }
      catch (error) {
        console.warn('[Agent] 模型网关不可用，回落到本地规划器：', error)
        return planLocally(prompt, ctx)
      }
    },
  }
}

/** 设置里填写的模型服务优先，其次是构建时的环境变量，都没有则用本地规划器 */
export function resolveProvider(custom?: { endpoint?: string, model?: string, apiKey?: string }): AgentProvider {
  const endpoint = custom?.endpoint || (import.meta.env.VITE_LLM_ENDPOINT as string | undefined)
  if (!endpoint) return localProvider
  const model = custom?.model || (import.meta.env.VITE_LLM_MODEL as string) || 'default'
  const apiKey = custom?.apiKey || (import.meta.env.VITE_LLM_API_KEY as string | undefined)
  return createRemoteProvider(endpoint, model, apiKey)
}
