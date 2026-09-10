import type { PageSchema } from '@/types/schema'

export function exportAsJSON(schema: PageSchema): string {
  return JSON.stringify(schema, null, 2)
}

function triggerDownload(content: BlobPart, type: string, filename: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadJSON(schema: PageSchema, filename = 'page.json') {
  triggerDownload(exportAsJSON(schema), 'application/json', filename)
}

function toStyleString(styles: Record<string, unknown> = {}) {
  return Object.entries(styles)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${String(value)}`)
    .join('; ')
}

function escapeHTML(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function renderComponent(component: any): string {
  const props = component.props || {}
  const children = Array.isArray(component.children) ? component.children.map(renderComponent).join('') : ''
  const style = toStyleString(component.styles || {})

  if (component.type === 'text') return `<div style="${style}">${escapeHTML(props.content)}</div>`
  if (component.type === 'image') {
    const imageStyle = [
      `width:${props.width || '100%'}`,
      `height:${props.height || 'auto'}`,
      `object-fit:${props.objectFit || 'cover'}`,
      `object-position:${props.objectPosition || 'center center'}`,
      `border-radius:${props.borderRadius || '0'}`,
    ].join(';')
    return `<div style="${style}"><img src="${escapeHTML(props.src)}" alt="${escapeHTML(props.alt)}" style="${imageStyle}" />${children}</div>`
  }
  if (component.type === 'button') return `<div style="${style}"><button>${escapeHTML(props.text || '按钮')}</button>${children}</div>`
  return `<div style="${style}" data-component="${escapeHTML(component.type)}">${children}</div>`
}

export function exportAsHTML(schema: PageSchema): string {
  const components = schema.components.map(renderComponent).join('\n')
  const globalStyle = toStyleString(schema.globalStyles || {})
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
  <meta name="description" content="${escapeHTML(schema.meta?.description || '')}" />
  <title>${escapeHTML(schema.meta?.title || schema.name)}</title>
  <style>
    *{box-sizing:border-box}html,body{margin:0;min-height:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f5f7fa}#app{width:100%;max-width:750px;min-height:100vh;margin:0 auto;background:#fff;${globalStyle}}img{display:inline-block;max-width:100%}button{font:inherit}
  </style>
</head>
<body><main id="app">${components}</main></body>
</html>`
}

export function downloadHTML(schema: PageSchema, filename = 'page.html') {
  triggerDownload(exportAsHTML(schema), 'text/html;charset=utf-8', filename)
}

export function generatePreviewURL(schema: PageSchema): string {
  const encoded = encodeURIComponent(JSON.stringify(schema))
  const route = `${window.location.origin}${import.meta.env.BASE_URL}preview`
  return `${route}?data=${encoded}`
}

export function parsePreviewURL(): PageSchema | null {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const legacyParams = new URLSearchParams(window.location.hash.split('?')[1] || '')
    const data = searchParams.get('data') || legacyParams.get('data')
    if (!data) return null
    return JSON.parse(decodeURIComponent(data)) as PageSchema
  }
  catch (error) {
    console.error('解析预览 URL 失败:', error)
    return null
  }
}
