/**
 * 组件类型定义
 */

import type { Component } from 'vue'

// 组件配置
export interface ComponentConfig {
  name: string // 组件名称
  type: string // 组件类型标识
  icon: string // 组件图标（UnoCSS 图标类名）
  category: ComponentCategory // 组件分类
  component: Component // Vue 组件
  defaultProps: Record<string, any> // 默认属性
  defaultStyles: Record<string, any> // 默认样式
  propSchema: PropSchema[] // 属性配置 Schema
}

// 组件分类
export const ComponentCategory = {
  Basic: 'basic', // 基础组件
  Form: 'form', // 表单组件
  Display: 'display', // 展示组件
  Layout: 'layout', // 布局组件
  Marketing: 'marketing', // 营销组件
} as const

export type ComponentCategory = typeof ComponentCategory[keyof typeof ComponentCategory]

// 属性配置 Schema
export interface PropSchema {
  key: string // 属性键名
  label: string // 属性标签
  type: PropType // 属性类型
  defaultValue: any // 默认值
  options?: PropOption[] // 选项（用于 select、radio 等）
  min?: number // 最小值（用于 number、slider）
  max?: number // 最大值（用于 number、slider）
  step?: number // 步长（用于 number、slider）
  placeholder?: string // 占位符
  description?: string // 属性描述
}

// 属性类型
export const PropType = {
  Text: 'text', // 文本输入
  Textarea: 'textarea', // 多行文本
  Number: 'number', // 数字输入
  Color: 'color', // 颜色选择器
  Select: 'select', // 下拉选择
  Radio: 'radio', // 单选
  Checkbox: 'checkbox', // 多选
  Switch: 'switch', // 开关
  Slider: 'slider', // 滑块
  Image: 'image', // 图片上传
  Date: 'date', // 日期选择
} as const

export type PropType = typeof PropType[keyof typeof PropType]

// 选项
export interface PropOption {
  label: string // 选项标签
  value: any // 选项值
}

// 组件注册表类型
export type ComponentRegistry = Record<string, ComponentConfig>
