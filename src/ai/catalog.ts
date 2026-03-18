/**
 * 组件 Catalog 定义
 * 使用 Zod 定义组件的 props schema，用于 AI 生成和验证
 */

import { z } from 'zod'

// 文本组件 Schema
export const TextPropsSchema = z.object({
  content: z.string().describe('文本内容'),
  fontSize: z.string().default('14px').describe('字体大小，如 14px, 1rem'),
  color: z.string().default('#333333').describe('文字颜色，十六进制格式'),
  fontWeight: z.enum(['normal', 'bold', 'lighter']).default('normal').describe('字体粗细'),
  textAlign: z.enum(['left', 'center', 'right']).default('left').describe('对齐方式'),
})

// 图片组件 Schema
export const ImagePropsSchema = z.object({
  src: z.string().url().describe('图片 URL 地址'),
  alt: z.string().default('图片').describe('替代文本'),
  width: z.string().default('100%').describe('宽度，如 100%, 300px'),
  height: z.string().default('auto').describe('高度，如 auto, 200px'),
  objectFit: z.enum(['cover', 'contain', 'fill', 'none']).default('cover').describe('填充方式'),
  borderRadius: z.string().default('0').describe('圆角，如 0, 8px, 50%'),
})

// 按钮组件 Schema
export const ButtonPropsSchema = z.object({
  text: z.string().describe('按钮文字'),
  type: z.enum(['default', 'primary', 'success', 'warning', 'danger']).default('primary').describe('按钮类型'),
  size: z.enum(['large', 'normal', 'small', 'mini']).default('normal').describe('按钮大小'),
  block: z.boolean().default(false).describe('是否为块级按钮'),
  round: z.boolean().default(false).describe('是否为圆角按钮'),
})

// 组件 Catalog
export const componentCatalog = {
  text: {
    name: '文本',
    description: '显示文本内容，支持自定义字体大小、颜色、粗细和对齐方式',
    propsSchema: TextPropsSchema,
  },
  image: {
    name: '图片',
    description: '显示图片，支持自定义宽高、填充方式和圆角',
    propsSchema: ImagePropsSchema,
  },
  button: {
    name: '按钮',
    description: '可点击的按钮，支持多种类型和尺寸',
    propsSchema: ButtonPropsSchema,
  },
}

export type ComponentType = keyof typeof componentCatalog
