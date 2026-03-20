/**
 * 模板类型定义
 */

import type { PageSchema } from './schema'

// 模板
export interface Template {
  id: string // 模板唯一标识
  name: string // 模板名称
  description: string // 模板描述
  category: TemplateCategory // 模板分类
  thumbnail: string // 缩略图 URL
  schema: PageSchema // 页面 Schema
  tags: string[] // 标签
  author?: string // 作者
  createTime?: number // 创建时间
  usageCount?: number // 使用次数
}

// 模板分类
export const TemplateCategory = {
  Marketing: 'marketing', // 营销活动
  Product: 'product', // 产品展示
  Form: 'form', // 表单收集
  Article: 'article', // 文章资讯
  Other: 'other', // 其他
} as const

export type TemplateCategory = typeof TemplateCategory[keyof typeof TemplateCategory]
