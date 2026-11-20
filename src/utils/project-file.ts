/**
 * 项目文件：把浏览器里的项目数据和上传素材打包成一个 JSON，用于备份和换设备
 */

import { blobToDataUrl, dataUrlToBlob, getAssetBlob, listAssets, restoreAsset } from './asset-db'

const FORMAT = 'ai-h5-editor-project'
const PROJECT_KEY = 'h5-editor-project'
const PAGE_KEY = 'h5-editor-page'

interface ProjectFile {
  format: typeof FORMAT
  version: 1
  exportedAt: string
  project: unknown
  page: unknown
  assets: { id: string, name: string, type: string, size: number, width?: number, height?: number, createdAt: number, dataUrl: string }[]
}

export async function exportProjectFile() {
  const assets: ProjectFile['assets'] = []
  for (const meta of listAssets()) {
    const blob = await getAssetBlob(meta.id)
    if (!blob) continue
    const { url: _url, ...rest } = meta
    assets.push({ ...rest, dataUrl: await blobToDataUrl(blob) })
  }
  const file: ProjectFile = {
    format: FORMAT,
    version: 1,
    exportedAt: new Date().toISOString(),
    project: JSON.parse(localStorage.getItem(PROJECT_KEY) || 'null'),
    page: JSON.parse(localStorage.getItem(PAGE_KEY) || 'null'),
    assets,
  }
  const blob = new Blob([JSON.stringify(file)], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `ai-h5-editor-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  setTimeout(() => URL.revokeObjectURL(link.href), 1000)
}

export async function importProjectFile(file: File) {
  let data: ProjectFile
  try { data = JSON.parse(await file.text()) }
  catch { throw new Error('文件不是有效的 JSON') }
  if (data?.format !== FORMAT || !data.project) throw new Error('这不是 ai-h5-editor 的项目文件')
  for (const item of data.assets ?? []) {
    const { dataUrl, ...meta } = item
    await restoreAsset(meta, await dataUrlToBlob(dataUrl))
  }
  localStorage.setItem(PROJECT_KEY, JSON.stringify(data.project))
  if (data.page) localStorage.setItem(PAGE_KEY, JSON.stringify(data.page))
}
