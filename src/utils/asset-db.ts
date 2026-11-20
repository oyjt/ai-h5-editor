/**
 * 本地素材库：用户上传的文件以 Blob 形式存进浏览器 IndexedDB，不占 localStorage 配额，也不上传到任何服务器。
 * Schema 里用 `asset://<id>` 引用。启动时 initAssets() 把全部素材转成 blob URL，之后同步解析。
 */

import { reactive } from 'vue'

export interface AssetRecord {
  id: string
  name: string
  type: string
  size: number
  width?: number
  height?: number
  createdAt: number
  blob: Blob
}

export type AssetMeta = Omit<AssetRecord, 'blob'> & { url: string }

const DB_NAME = 'ai-h5-assets'
const STORE = 'assets'
export const ASSET_PREFIX = 'asset://'
export const MAX_ASSET_SIZE = 10 * 1024 * 1024

const urls = reactive(new Map<string, string>())
const metas = reactive(new Map<string, AssetMeta>())

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const request = run(db.transaction(STORE, mode).objectStore(STORE))
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function measure(blob: Blob): Promise<{ width?: number, height?: number }> {
  if (!blob.type.startsWith('image/')) return Promise.resolve({})
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob)
    const image = new Image()
    image.onload = () => { resolve({ width: image.naturalWidth, height: image.naturalHeight }); URL.revokeObjectURL(url) }
    image.onerror = () => { resolve({}); URL.revokeObjectURL(url) }
    image.src = url
  })
}

function register(record: AssetRecord) {
  const url = URL.createObjectURL(record.blob)
  urls.set(record.id, url)
  const { blob: _blob, ...meta } = record
  metas.set(record.id, { ...meta, url })
}

/** 应用启动时调用一次；IndexedDB 不可用时静默跳过，应用仍可使用外链与内置图片 */
export async function initAssets() {
  try {
    const all = await tx<AssetRecord[]>('readonly', store => store.getAll())
    all.forEach(register)
  }
  catch (error) {
    console.warn('[素材库] IndexedDB 不可用，上传素材将无法保存：', error)
  }
}

export function resolveAssetUrl(ref: string): string {
  return urls.get(ref.slice(ASSET_PREFIX.length)) ?? ''
}

export function listAssets(): AssetMeta[] {
  return [...metas.values()].sort((a, b) => b.createdAt - a.createdAt)
}

export function assetRef(id: string) {
  return `${ASSET_PREFIX}${id}`
}

export async function saveAsset(file: File | Blob, name = (file as File).name || '未命名'): Promise<AssetMeta> {
  const size = (file as Blob).size
  if (size > MAX_ASSET_SIZE) throw new Error('文件不能超过 10MB')
  const dims = await measure(file)
  const record: AssetRecord = { id: `a_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, name, type: file.type, size, createdAt: Date.now(), blob: file, ...dims }
  await tx('readwrite', store => store.put(record))
  register(record)
  return metas.get(record.id)!
}

export async function deleteAsset(id: string) {
  await tx('readwrite', store => store.delete(id))
  const url = urls.get(id)
  if (url) URL.revokeObjectURL(url)
  urls.delete(id)
  metas.delete(id)
}

export async function getAssetBlob(id: string): Promise<Blob | null> {
  const record = await tx<AssetRecord | undefined>('readonly', store => store.get(id))
  return record?.blob ?? null
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  return (await fetch(dataUrl)).blob()
}

/** 导入项目文件时按原 id 写回素材 */
export async function restoreAsset(meta: Omit<AssetRecord, 'blob'>, blob: Blob) {
  const record: AssetRecord = { ...meta, blob }
  await tx('readwrite', store => store.put(record))
  if (urls.has(record.id)) URL.revokeObjectURL(urls.get(record.id)!)
  register(record)
}
