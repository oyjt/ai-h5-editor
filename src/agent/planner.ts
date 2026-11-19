/**
 * 本地规划器：不依赖外部模型，按关键词把需求拆成页面和补丁。
 * 作为默认 Provider 和真实模型不可用时的兜底。
 * 所有颜色、间距、圆角、字号都用 Design Token 引用，保证产物天然符合规范。
 */

import { getTokensByGroup, tokenRef } from '@/design/tokens'
import type { AgentContext, AgentPatch, AgentPlan, Deviation } from './types'

type Props = Record<string, unknown>

const t = {
  primary: tokenRef('color.primary'),
  primaryBg: tokenRef('color.primary-bg'),
  error: tokenRef('color.error'),
  text: tokenRef('color.text'),
  textSecondary: tokenRef('color.text-secondary'),
  bgSoft: tokenRef('color.bg-soft'),
  bgContainer: tokenRef('color.bg-container'),
  sm: tokenRef('space.sm'),
  md: tokenRef('space.md'),
  xs: tokenRef('space.xs'),
  radiusLg: tokenRef('radius.lg'),
  radiusXl: tokenRef('radius.xl'),
  heading: tokenRef('font-size.heading'),
  base: tokenRef('font-size.base'),
}

const COLOR_WORDS: { words: string[], token: string, label: string }[] = [
  { words: ['蓝色', '蓝'], token: 'color.primary', label: '蓝色' },
  { words: ['红色', '红'], token: 'color.error', label: '红色' },
  { words: ['绿色', '绿'], token: 'color.success', label: '绿色' },
  { words: ['橙色', '黄色', '橙', '黄'], token: 'color.warning', label: '橙黄色' },
]
const OFF_PALETTE_WORDS: { words: string[], hex: string, label: string }[] = [
  { words: ['紫色', '紫'], hex: '#722ed1', label: '紫色' },
  { words: ['粉色', '粉'], hex: '#eb2f96', label: '粉色' },
  { words: ['黑金'], hex: '#d4af37', label: '黑金' },
]

const BUTTON_TYPE_BY_TOKEN: Record<string, string> = {
  [tokenRef('color.primary')]: 'primary',
  [tokenRef('color.error')]: 'danger',
  [tokenRef('color.success')]: 'success',
  [tokenRef('color.warning')]: 'warning',
}

function pickColor(prompt: string, mode: AgentContext['mode'], deviations: Deviation[]): string | null {
  const hexMatch = prompt.match(/#[0-9a-f]{6}\b/i)
  const off = OFF_PALETTE_WORDS.find(item => item.words.some(word => prompt.includes(word)))
  const mainColorOverride = /主色|主题色|品牌色/.test(prompt) && (off || hexMatch)
  if (!mainColorOverride) {
    for (const item of COLOR_WORDS) if (item.words.some(word => prompt.includes(word))) return tokenRef(item.token)
  }
  const wanted = hexMatch?.[0] ?? off?.hex
  if (!wanted) return null
  const label = hexMatch?.[0] ?? off?.label ?? wanted
  if (mode === 'spec') {
    deviations.push({ kind: 'ignored', text: `需求里的 ${label} 不在风格库内，规范优先下已改用主色` })
    return t.primary
  }
  deviations.push({ kind: 'kept', text: `按你的要求使用了 ${label}（${wanted}），它不在风格库内` })
  return wanted
}

function heroBlock(title: string, subtitle: string, accent: string, seed: string): AgentPatch[] {
  return [
    { op: 'append_component', type: 'image', props: { src: `https://picsum.photos/seed/${seed}/375/200`, alt: title, borderRadius: t.radiusXl }, styles: { margin: `${t.sm}` } },
    { op: 'append_component', type: 'text', props: { content: title, fontSize: t.heading, fontWeight: 'bold', color: accent, textAlign: 'left' }, styles: { padding: `0 ${t.md}` } },
    { op: 'append_component', type: 'text', props: { content: subtitle, fontSize: t.base, color: t.textSecondary }, styles: { padding: `${t.xs} ${t.md}` } },
  ]
}

interface PageKind { key: string, match: RegExp, name: string, build: (accent: string, topic: string) => AgentPatch[], step: string }

const PAGE_KINDS: PageKind[] = [
  {
    key: 'channel', match: /聚合|频道|会场|活动页|首页/, name: '聚合页', step: '规划聚合页：头图、权益、商品流',
    build: (accent, topic) => [
      ...heroBlock(`${topic}上新`, '限时福利与新品集中呈现', accent, 'channel'),
      { op: 'append_component', type: 'coupon', props: { title: `${topic}专享券`, accentColor: accent, backgroundColor: t.primaryBg }, styles: { margin: `${t.sm}` } },
      { op: 'append_component', type: 'goodsList', props: { title: '热卖精选', accentColor: t.error } },
    ],
  },
  {
    key: 'shop', match: /店铺|商家|门店/, name: '店铺页', step: '规划店铺页：店招、活动入口、商品列表',
    build: (accent, topic) => [
      ...heroBlock('品牌店铺', `${topic}专场`, accent, 'shop'),
      { op: 'append_component', type: 'countdown', props: { color: accent } },
      { op: 'append_component', type: 'goodsList', props: { title: '店铺热销', accentColor: t.error } },
    ],
  },
  {
    key: 'detail', match: /详情|商品页/, name: '商品详情', step: '规划详情页：主图、卖点、行动按钮',
    build: (accent, topic) => [
      { op: 'append_component', type: 'swiper', props: { height: '260px' } },
      { op: 'append_component', type: 'text', props: { content: `${topic}精选商品`, fontSize: t.heading, fontWeight: 'bold', color: t.text }, styles: { padding: `${t.sm} ${t.md} ${tokenRef('space.xxs')}` } },
      { op: 'append_component', type: 'text', props: { content: '核心卖点一句话说清楚', fontSize: t.base, color: t.textSecondary }, styles: { padding: `0 ${t.md}` } },
      { op: 'append_component', type: 'button', props: { text: '立即购买', type: 'primary', block: true, round: false }, styles: { margin: `${t.md}` } },
      { op: 'append_component', type: 'text', props: { content: '价格与权益以下单页为准', fontSize: tokenRef('font-size.sm'), color: accent }, styles: { padding: `0 ${t.md}` } },
    ],
  },
  {
    key: 'order', match: /下单|订单|结算/, name: '下单页', step: '规划下单页：收货信息与提交',
    build: () => [
      { op: 'append_component', type: 'text', props: { content: '确认订单', fontSize: t.heading, fontWeight: 'bold', color: t.text }, styles: { padding: `${t.md}` } },
      { op: 'append_component', type: 'marketingForm', props: { title: '收货信息', buttonText: '提交订单', accentColor: t.primary, backgroundColor: t.bgSoft } },
    ],
  },
  {
    key: 'form', match: /表单|报名|线索|留资/, name: '报名页', step: '规划报名页：权益说明与表单',
    build: (accent, topic) => [
      ...heroBlock(`${topic}报名`, '填写信息领取专属权益', accent, 'form'),
      { op: 'append_component', type: 'marketingForm', props: { accentColor: accent, backgroundColor: t.bgSoft } },
    ],
  },
]

function extractTopic(prompt: string) {
  const match = prompt.match(/(冬促|夏日|春季|新品|双十一|618|开学|年货|会员)[^，。,\s]{0,4}/)
  return match ? match[0].replace(/(的|频道|页)$/, '').replace(/(报名|详情|店铺|聚合)$/, '') : '活动'
}

const CREATE_INTENT = /做一个|做个|生成|创建|新建|设计一个|帮我做|来一个/

function planModify(prompt: string, ctx: AgentContext): AgentPlan | null {
  if (!ctx.selection.length) return null
  // 描述的是整页新需求时按创建处理，不被默认选中的组件劫持
  if (CREATE_INTENT.test(prompt) || PAGE_KINDS.some(kind => kind.match.test(prompt))) return null
  const deviations: Deviation[] = []
  const patches: AgentPatch[] = []
  const steps: string[] = []

  if (/去掉|删除|移除/.test(prompt)) {
    for (const item of ctx.selection) patches.push({ op: 'delete_component', id: item.id })
    steps.push(`删除选中的 ${ctx.selection.length} 个组件`)
    return { summary: `已删除选区内的 ${ctx.selection.length} 个组件`, steps, patches, deviations, followUps: ['在原位置补一个按钮', '换成两列商品'] }
  }

  const color = pickColor(prompt, ctx.mode, deviations)
  const quoted = prompt.match(/[“"「『]([^”"」』]+)[”"」』]/)?.[1]
  const wantsRadius = /圆角/.test(prompt)
  const wantsSpace = /间距|留白|空一点|松一点/.test(prompt)

  for (const item of ctx.selection) {
    const props: Props = {}
    const styles: Props = {}
    if (color) {
      const buttonType = item.type === 'button' ? BUTTON_TYPE_BY_TOKEN[color] : undefined
      if (buttonType) props.type = buttonType
      else if ('accentColor' in item.props) props.accentColor = color
      else if ('color' in item.props) props.color = color
      else styles.color = color
    }
    if (quoted) {
      const key = ['content', 'text', 'title'].find(k => k in item.props)
      if (key) props[key] = quoted
    }
    if (wantsRadius) props.borderRadius = /更大|大一点/.test(prompt) ? t.radiusXl : t.radiusLg
    if (wantsSpace) styles.padding = `${t.md}`
    if (Object.keys(props).length || Object.keys(styles).length) patches.push({ op: 'patch_component', id: item.id, props, styles })
  }

  if (!patches.length) return null
  steps.push(`理解修改意图，作用于 ${ctx.selection.length} 个选中组件`, '生成属性补丁')
  const names = ctx.selection.map(item => item.name).join('、')
  return { summary: `已修改 ${names}`, steps, patches, deviations, followUps: ['再整体检查一遍规范', '把同样的改动应用到其他页面'] }
}

export function planLocally(prompt: string, ctx: AgentContext): AgentPlan {
  const text = prompt.trim()
  const modify = planModify(text, ctx)
  if (modify) return modify

  const deviations: Deviation[] = []
  const accent = pickColor(text, ctx.mode, deviations) ?? t.primary
  const topic = extractTopic(text)
  const kinds = PAGE_KINDS.filter(kind => kind.match.test(text))
  const chosen = kinds.length ? kinds : [PAGE_KINDS[0]]

  const patches: AgentPatch[] = []
  const steps = ['检索风格库：Ant Design 规范、Token 与组件']
  for (const kind of chosen) {
    steps.push(kind.step)
    patches.push({ op: 'create_page', name: `${topic}${kind.name}` }, ...kind.build(accent, topic))
  }
  steps.push('生成页面补丁', '规范校验')
  const names = chosen.map(kind => `${topic}${kind.name}`).join('、')
  return {
    summary: `已生成 ${chosen.length} 个页面：${names}`,
    steps,
    patches,
    deviations,
    followUps: chosen.length < 3 ? ['继续扩展下单页', '分支：深色模式'] : ['分支：深色模式', '检查并修正规范偏离'],
  }
}

export function describeTokens(): string {
  return (['color', 'space', 'radius', 'font-size'] as const)
    .map(group => `${group}: ${getTokensByGroup(group).map(token => `{${token.path}}=${token.value}`).join('，')}`)
    .join('\n')
}
