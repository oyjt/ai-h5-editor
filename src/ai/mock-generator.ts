/**
 * Mock AI 生成服务
 * 模拟 AI 生成页面组件
 */

import type { ComponentSchema } from '@/types/schema'
import { createComponentSchema } from '@/utils/schema-generator'

// Mock AI 响应延迟
const MOCK_DELAY = 1500

// Mock 生成结果示例库
const mockTemplates: Record<string, any[]> = {
  '产品介绍': [
    {
      type: 'text',
      props: {
        content: '全新产品发布',
        fontSize: '24px',
        color: '#1a1a1a',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      styles: { padding: '20px 16px 10px' },
    },
    {
      type: 'image',
      props: {
        src: 'https://picsum.photos/seed/product1/350/200',
        alt: '产品图片',
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
      },
      styles: { padding: '0 16px', margin: '10px 0' },
    },
    {
      type: 'text',
      props: {
        content: '这是一款革命性的产品，为您带来全新体验。',
        fontSize: '14px',
        color: '#666666',
        textAlign: 'center',
      },
      styles: { padding: '10px 16px' },
    },
    {
      type: 'button',
      props: {
        text: '立即购买',
        type: 'primary',
        size: 'large',
        block: true,
      },
      styles: { margin: '20px 16px' },
    },
  ],

  '活动宣传': [
    {
      type: 'text',
      props: {
        content: '🎉 限时优惠活动',
        fontSize: '22px',
        color: '#ff4d4f',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      styles: { padding: '20px 16px', background: '#fff7e6' },
    },
    {
      type: 'text',
      props: {
        content: '全场商品 5 折起\n活动时间：3月18日 - 3月25日',
        fontSize: '16px',
        color: '#333333',
        textAlign: 'center',
      },
      styles: { padding: '15px 16px' },
    },
    {
      type: 'button',
      props: {
        text: '查看活动详情',
        type: 'danger',
        size: 'large',
        block: true,
        round: true,
      },
      styles: { margin: '20px 16px' },
    },
  ],
}

// 关键词匹配
function matchTemplate(prompt: string): any[] | null {
  for (const [keyword, template] of Object.entries(mockTemplates)) {
    if (prompt.includes(keyword)) {
      return template
    }
  }
  return null
}

// 默认模板
function getDefaultTemplate(): any[] {
  return [
    {
      type: 'text',
      props: {
        content: 'AI 生成的页面',
        fontSize: '20px',
        color: '#1a1a1a',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      styles: { padding: '30px 16px' },
    },
    {
      type: 'text',
      props: {
        content: '这是根据您的描述生成的页面内容。',
        fontSize: '14px',
        color: '#666666',
        textAlign: 'center',
      },
      styles: { padding: '10px 16px' },
    },
  ]
}

// 为组件添加 ID
function addComponentIds(components: any[]): ComponentSchema[] {
  return components.map(comp => createComponentSchema(comp.type, comp.props, comp.styles))
}

/**
 * Mock AI 生成页面
 */
export async function mockGeneratePage(prompt: string): Promise<ComponentSchema[]> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY))

  // 匹配模板
  const template = matchTemplate(prompt) || getDefaultTemplate()

  // 添加组件 ID
  return addComponentIds(template)
}
