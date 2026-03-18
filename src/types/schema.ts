/**
 * JSON Schema 类型定义
 * 用于描述页面和组件的数据结构
 */

// 组件 Schema
export interface ComponentSchema {
  id: string // 组件唯一标识
  type: string // 组件类型：'text' | 'image' | 'button' | 'form' | ...
  props: Record<string, any> // 组件属性
  styles: Record<string, any> // 组件样式
  events?: Record<string, string> // 事件绑定
  children?: ComponentSchema[] // 子组件
}

// 页面 Schema
export interface PageSchema {
  id: string // 页面唯一标识
  name: string // 页面名称
  version: string // Schema 版本
  components: ComponentSchema[] // 页面组件列表
  globalStyles?: Record<string, any> // 全局样式
  meta?: PageMeta // 页面元信息
}

// 页面元信息
export interface PageMeta {
  title: string // 页面标题
  description: string // 页面描述
  keywords: string[] // 关键词
  author?: string // 作者
  createTime?: number // 创建时间
  updateTime?: number // 更新时间
}

// Schema 验证结果
export interface SchemaValidationResult {
  valid: boolean // 是否有效
  errors: string[] // 错误信息列表
}
