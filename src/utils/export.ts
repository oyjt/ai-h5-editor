/**
 * 页面导出工具
 */

import type { PageSchema } from '@/types/schema'

/**
 * 导出为 JSON
 */
export function exportAsJSON(schema: PageSchema): string {
  return JSON.stringify(schema, null, 2)
}

/**
 * 下载 JSON 文件
 */
export function downloadJSON(schema: PageSchema, filename = 'page.json') {
  const json = exportAsJSON(schema)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * 导出为 HTML
 */
export function exportAsHTML(schema: PageSchema): string {
  // 生成组件 HTML
  function generateComponentHTML(component: any): string {
    const { type, props, styles, children } = component

    // 样式转换
    const styleStr = Object.entries(styles || {})
      .map(([key, value]) => {
        // 将驼峰命名转换为短横线命名
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
        return `${cssKey}: ${value}`
      })
      .join('; ')

    let html = ''

    // 根据组件类型生成 HTML
    switch (type) {
      case 'text':
        html = `<div style="${styleStr}">${props.content || ''}</div>`
        break

      case 'image':
        html = `<div style="${styleStr}"><img src="${props.src || ''}" alt="${props.alt || ''}" style="width: ${props.width || '100%'}; height: ${props.height || 'auto'}; object-fit: ${props.objectFit || 'cover'}; border-radius: ${props.borderRadius || '0'};" /></div>`
        break

      case 'button':
        html = `<div style="${styleStr}"><button class="van-button van-button--${props.type || 'default'} van-button--${props.size || 'normal'}${props.block ? ' van-button--block' : ''}${props.round ? ' van-button--round' : ''}${props.plain ? ' van-button--plain' : ''}"${props.disabled ? ' disabled' : ''}>${props.text || '按钮'}</button></div>`
        break

      default:
        html = `<div style="${styleStr}">未知组件: ${type}</div>`
    }

    // 递归处理子组件
    if (children && children.length > 0) {
      const childrenHTML = children.map(generateComponentHTML).join('\n')
      html = html.replace('</div>', `${childrenHTML}</div>`)
    }

    return html
  }

  // 生成完整 HTML
  const componentsHTML = schema.components.map(generateComponentHTML).join('\n')

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="description" content="${schema.meta?.description || ''}">
  <meta name="keywords" content="${schema.meta?.keywords?.join(', ') || ''}">
  <title>${schema.meta?.title || schema.name}</title>

  <!-- Vant CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vant@4/lib/index.css">

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: #f5f7fa;
    }

    #app {
      max-width: 750px;
      margin: 0 auto;
      background: #fff;
      min-height: 100vh;
    }

    /* Vant Button 样式 */
    .van-button {
      position: relative;
      display: inline-block;
      box-sizing: border-box;
      height: 44px;
      margin: 0;
      padding: 0 15px;
      font-size: 16px;
      line-height: 1.2;
      text-align: center;
      border-radius: 2px;
      cursor: pointer;
      transition: opacity 0.2s;
      border: 1px solid #ebedf0;
      background: #fff;
      color: #323233;
    }

    .van-button--primary {
      color: #fff;
      background: #1989fa;
      border: 1px solid #1989fa;
    }

    .van-button--success {
      color: #fff;
      background: #07c160;
      border: 1px solid #07c160;
    }

    .van-button--danger {
      color: #fff;
      background: #ee0a24;
      border: 1px solid #ee0a24;
    }

    .van-button--warning {
      color: #fff;
      background: #ff976a;
      border: 1px solid #ff976a;
    }

    .van-button--large {
      width: 100%;
      height: 50px;
    }

    .van-button--small {
      height: 32px;
      padding: 0 8px;
      font-size: 12px;
    }

    .van-button--mini {
      height: 24px;
      padding: 0 4px;
      font-size: 10px;
    }

    .van-button--block {
      display: block;
      width: 100%;
    }

    .van-button--round {
      border-radius: 999px;
    }

    .van-button--plain {
      background: #fff;
    }

    .van-button--plain.van-button--primary {
      color: #1989fa;
    }

    .van-button--plain.van-button--success {
      color: #07c160;
    }

    .van-button--plain.van-button--danger {
      color: #ee0a24;
    }

    .van-button--plain.van-button--warning {
      color: #ff976a;
    }

    .van-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .van-button:active {
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <div id="app">
${componentsHTML}
  </div>
</body>
</html>`

  return html
}

/**
 * 下载 HTML 文件
 */
export function downloadHTML(schema: PageSchema, filename = 'page.html') {
  const html = exportAsHTML(schema)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * 生成预览链接（使用 URL 参数）
 */
export function generatePreviewURL(schema: PageSchema): string {
  const json = exportAsJSON(schema)
  const encoded = encodeURIComponent(json)
  const baseURL = window.location.origin + window.location.pathname
  return `${baseURL}#/preview?data=${encoded}`
}

/**
 * 从 URL 参数解析页面数据
 */
export function parsePreviewURL(): PageSchema | null {
  try {
    const params = new URLSearchParams(window.location.hash.split('?')[1])
    const data = params.get('data')
    if (!data) {
      return null
    }
    return JSON.parse(decodeURIComponent(data))
  }
  catch (error) {
    console.error('解析预览 URL 失败:', error)
    return null
  }
}
