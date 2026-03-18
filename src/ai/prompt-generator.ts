/**
 * AI 提示词生成器
 * 基于组件 Catalog 生成系统提示词
 */

import { componentCatalog } from './catalog'

export function generateSystemPrompt(): string {
  const componentDefs = Object.entries(componentCatalog)
    .map(([type, config]) => {
      const schema = config.propsSchema.shape
      const props = Object.entries(schema)
        .map(([key, zodType]: [string, any]) => {
          const desc = zodType.description || ''
          return `    - ${key}: ${desc}`
        })
        .join('\n')

      return `### ${config.name} (type: "${type}")
${config.description}
属性:
${props}`
    })
    .join('\n\n')

  return `你是一个 H5 页面生成助手。用户会描述他们想要的页面，你需要生成符合以下格式的 JSON：

{
  "components": [
    {
      "type": "组件类型",
      "props": { /* 组件属性 */ },
      "styles": { /* CSS 样式，如 padding, margin */ }
    }
  ]
}

## 可用组件

${componentDefs}

## 规则
1. 只使用上述定义的组件类型
2. 确保所有必需属性都有值
3. 样式使用标准 CSS 属性（驼峰命名）
4. 颜色使用十六进制格式
5. 尺寸带单位（px, %, rem 等）

请根据用户需求生成合理的页面结构。`
}
