/**
 * 内置模板配置
 */

import type { Template } from '@/types/template'
import { TemplateCategory } from '@/types/template'
import { createEmptyPageSchema } from '@/utils/schema-generator'

// 内置模板列表
export const builtInTemplates: Template[] = [
  {
    id: 'template_simple_intro',
    name: '简单介绍页',
    description: '包含标题、图片和按钮的简单介绍页面',
    category: TemplateCategory.Product,
    thumbnail: 'https://picsum.photos/seed/template1/300/400',
    tags: ['简单', '介绍', '产品'],
    schema: {
      ...createEmptyPageSchema('简单介绍页'),
      components: [
        {
          id: 'comp_title',
          type: 'text',
          props: {
            content: '欢迎使用 H5 编辑器',
            fontSize: '24px',
            color: '#333333',
            fontWeight: 'bold',
            textAlign: 'center',
          },
          styles: {
            padding: '40px 20px 20px',
          },
        },
        {
          id: 'comp_image',
          type: 'image',
          props: {
            src: 'https://picsum.photos/seed/product1/300/200',
            alt: '产品图片',
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: '8px',
          },
          styles: {
            padding: '0 20px',
            margin: '20px 0',
          },
        },
        {
          id: 'comp_desc',
          type: 'text',
          props: {
            content: '这是一个功能强大的 H5 页面编辑器，支持拖拽组件、实时预览、模板应用等功能。',
            fontSize: '14px',
            color: '#666666',
            textAlign: 'center',
            lineHeight: '1.6',
          },
          styles: {
            padding: '20px',
          },
        },
        {
          id: 'comp_button',
          type: 'button',
          props: {
            text: '立即体验',
            type: 'primary',
            size: 'large',
            block: true,
            round: true,
          },
          styles: {
            padding: '0 20px',
            margin: '20px 0',
          },
        },
      ],
    },
  },
  {
    id: 'template_marketing',
    name: '营销活动页',
    description: '适合促销活动的营销页面模板',
    category: TemplateCategory.Marketing,
    thumbnail: 'https://picsum.photos/seed/template2/300/400',
    tags: ['营销', '活动', '促销'],
    schema: {
      ...createEmptyPageSchema('营销活动页'),
      components: [
        {
          id: 'comp_banner',
          type: 'image',
          props: {
            src: 'https://picsum.photos/seed/banner1/375/200',
            alt: '活动横幅',
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
          },
          styles: {},
        },
        {
          id: 'comp_title',
          type: 'text',
          props: {
            content: '🎉 限时优惠活动',
            fontSize: '28px',
            color: '#ff4444',
            fontWeight: 'bold',
            textAlign: 'center',
          },
          styles: {
            padding: '30px 20px 10px',
          },
        },
        {
          id: 'comp_subtitle',
          type: 'text',
          props: {
            content: '全场商品 5 折起',
            fontSize: '18px',
            color: '#333333',
            textAlign: 'center',
          },
          styles: {
            padding: '10px 20px',
          },
        },
        {
          id: 'comp_desc',
          type: 'text',
          props: {
            content: '活动时间：2024.01.01 - 2024.01.31\n数量有限，先到先得！',
            fontSize: '14px',
            color: '#666666',
            textAlign: 'center',
            lineHeight: '1.8',
          },
          styles: {
            padding: '20px',
          },
        },
        {
          id: 'comp_button',
          type: 'button',
          props: {
            text: '立即抢购',
            type: 'danger',
            size: 'large',
            block: true,
            round: true,
          },
          styles: {
            padding: '0 20px',
            margin: '30px 0',
          },
        },
      ],
    },
  },
  {
    id: 'template_form',
    name: '信息收集表单',
    description: '用于收集用户信息的表单页面',
    category: TemplateCategory.Form,
    thumbnail: 'https://picsum.photos/seed/template3/300/400',
    tags: ['表单', '收集', '信息'],
    schema: {
      ...createEmptyPageSchema('信息收集表单'),
      components: [
        {
          id: 'comp_title',
          type: 'text',
          props: {
            content: '用户信息登记',
            fontSize: '22px',
            color: '#333333',
            fontWeight: 'bold',
            textAlign: 'center',
          },
          styles: {
            padding: '40px 20px 20px',
          },
        },
        {
          id: 'comp_desc',
          type: 'text',
          props: {
            content: '请填写以下信息，我们将为您提供更好的服务',
            fontSize: '14px',
            color: '#666666',
            textAlign: 'center',
          },
          styles: {
            padding: '0 20px 30px',
          },
        },
        {
          id: 'comp_submit',
          type: 'button',
          props: {
            text: '提交信息',
            type: 'primary',
            size: 'large',
            block: true,
          },
          styles: {
            padding: '0 20px',
            margin: '30px 0',
          },
        },
      ],
    },
  },
  {
    id: 'template_article',
    name: '文章资讯页',
    description: '适合展示文章内容的页面模板',
    category: TemplateCategory.Article,
    thumbnail: 'https://picsum.photos/seed/template4/300/400',
    tags: ['文章', '资讯', '内容'],
    schema: {
      ...createEmptyPageSchema('文章资讯页'),
      components: [
        {
          id: 'comp_title',
          type: 'text',
          props: {
            content: '文章标题：如何使用 H5 编辑器',
            fontSize: '20px',
            color: '#333333',
            fontWeight: 'bold',
            textAlign: 'left',
          },
          styles: {
            padding: '30px 20px 10px',
          },
        },
        {
          id: 'comp_meta',
          type: 'text',
          props: {
            content: '作者：张三 | 发布时间：2024-01-01',
            fontSize: '12px',
            color: '#999999',
            textAlign: 'left',
          },
          styles: {
            padding: '10px 20px',
          },
        },
        {
          id: 'comp_cover',
          type: 'image',
          props: {
            src: 'https://picsum.photos/seed/article1/335/200',
            alt: '文章封面',
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: '8px',
          },
          styles: {
            padding: '0 20px',
            margin: '20px 0',
          },
        },
        {
          id: 'comp_content',
          type: 'text',
          props: {
            content: '这里是文章正文内容。H5 编辑器是一个功能强大的可视化页面编辑工具，支持拖拽组件、实时预览、模板应用等功能。\n\n通过简单的拖拽操作，您就可以快速创建出精美的 H5 页面。',
            fontSize: '15px',
            color: '#333333',
            textAlign: 'left',
            lineHeight: '1.8',
          },
          styles: {
            padding: '20px',
          },
        },
      ],
    },
  },
]

// 根据分类获取模板
export function getTemplatesByCategory(category: TemplateCategory) {
  return builtInTemplates.filter(t => t.category === category)
}

// 根据 ID 获取模板
export function getTemplateById(id: string) {
  return builtInTemplates.find(t => t.id === id)
}

// 获取所有模板
export function getAllTemplates() {
  return builtInTemplates
}
