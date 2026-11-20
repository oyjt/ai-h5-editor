/**
 * 图片来源解析
 * - asset://<id>：用户上传到本机的素材，解析为 blob URL
 * - 示例图外链（picsum / unsplash）：按「示例图来源」设置处理
 *     remote 保持外链；local 换成仓库内置的本地示例图；auto 先用外链，加载失败时自动回落到本地
 */

import type { ImageSource } from '@/stores/settings'
import { ASSET_PREFIX, resolveAssetUrl } from '@/utils/asset-db'

const REMOTE_SAMPLE = /https:\/\/(?:picsum\.photos|images\.unsplash\.com)\/[^\s"')]+/g
const ASSET_REF = /asset:\/\/[\w-]+/g

const POOLS = {
  banner: ['banner-1', 'banner-2', 'banner-3', 'banner-4'],
  product: ['product-1', 'product-2', 'product-3', 'product-4', 'product-5', 'product-6'],
  portrait: ['portrait-1', 'portrait-2'],
}

function hash(text: string) {
  let value = 0
  for (let i = 0; i < text.length; i++) value = (value * 31 + text.charCodeAt(i)) >>> 0
  return value
}

function aspectOf(url: string): number {
  const picsum = url.match(/picsum\.photos\/(?:seed\/[^/]+\/)?(\d+)\/(\d+)/)
  if (picsum) return Number(picsum[1]) / Number(picsum[2])
  const w = url.match(/[?&]w=(\d+)/)?.[1]
  const h = url.match(/[?&]h=(\d+)/)?.[1]
  return w && h ? Number(w) / Number(h) : 1.8
}

export function isRemoteSample(url: string) {
  return /^https:\/\/(?:picsum\.photos|images\.unsplash\.com)\//.test(url)
}

/** 为外链示例图挑一张本地示例图，同一个外链永远得到同一张 */
export function localSampleFor(url: string): string {
  const ratio = aspectOf(url)
  const pool = ratio > 1.3 ? POOLS.banner : ratio < 0.85 ? POOLS.portrait : POOLS.product
  return `${import.meta.env.BASE_URL}samples/${pool[hash(url) % pool.length]}.svg`
}

export function resolveImagesInString(value: string, source: ImageSource): string {
  if (!value.includes('asset://') && !value.includes('picsum.photos') && !value.includes('images.unsplash.com')) return value
  let out = value.replace(ASSET_REF, ref => resolveAssetUrl(ref))
  if (source === 'local') out = out.replace(REMOTE_SAMPLE, url => localSampleFor(url))
  return out
}

export function resolveImagesDeep<T>(input: T, source: ImageSource): T {
  if (typeof input === 'string') return resolveImagesInString(input, source) as T
  if (Array.isArray(input)) return input.map(item => resolveImagesDeep(item, source)) as T
  if (input && typeof input === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) out[key] = resolveImagesDeep(value, source)
    return out as T
  }
  return input
}

/** 「自动」模式：外链示例图加载失败时回落到本地示例图 */
export function installImageFallback(getSource: () => ImageSource) {
  document.addEventListener('error', (event) => {
    const target = event.target
    if (!(target instanceof HTMLImageElement) || getSource() === 'remote') return
    const src = target.getAttribute('src') || ''
    if (!isRemoteSample(src)) return
    target.src = localSampleFor(src)
  }, true)
}

export { ASSET_PREFIX }
