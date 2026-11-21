<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useEditorStore } from '@/stores/editor'
import PageRenderer from '@/components/renderer/PageRenderer.vue'
import { getAllComponents } from '@/config/component-registry'
import { createComponentSchema } from '@/utils/schema-generator'

const shellRef = ref<HTMLElement | null>(null)
const marqueeOn = ref(false)
const marquee = ref<{ x0: number, y0: number, x1: number, y1: number } | null>(null)
const marqueeBox = computed(() => {
  const m = marquee.value
  if (!m) return null
  return { left: `${Math.min(m.x0, m.x1)}px`, top: `${Math.min(m.y0, m.y1)}px`, width: `${Math.abs(m.x1 - m.x0)}px`, height: `${Math.abs(m.y1 - m.y0)}px` }
})
function localPoint(e: PointerEvent) {
  const rect = shellRef.value!.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}
function onMarqueeDown(e: PointerEvent) {
  const p = localPoint(e)
  marquee.value = { x0: p.x, y0: p.y, x1: p.x, y1: p.y };
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}
function onMarqueeMove(e: PointerEvent) {
  if (!marquee.value) return
  const p = localPoint(e)
  marquee.value = { ...marquee.value, x1: p.x, y1: p.y }
}
function onMarqueeUp() {
  const m = marquee.value
  marquee.value = null
  if (!m || !shellRef.value) return
  const origin = shellRef.value.getBoundingClientRect()
  const left = origin.left + Math.min(m.x0, m.x1)
  const right = origin.left + Math.max(m.x0, m.x1)
  const top = origin.top + Math.min(m.y0, m.y1)
  const bottom = origin.top + Math.max(m.y0, m.y1)
  const ids = editorStore.currentPage.components.filter((item) => {
    const el = shellRef.value!.querySelector(`[data-component-id="${item.id}"]`)
    if (!el) return false
    const r = el.getBoundingClientRect()
    return r.left < right && r.right > left && r.top < bottom && r.bottom > top
  }).map(item => item.id)
  editorStore.setAgentSelection(ids)
  if (ids.length) ElMessage.success(`已框选 ${ids.length} 个组件，到 AI 面板说怎么改`)
  marqueeOn.value = false
}
function toggleMarquee() {
  marqueeOn.value = !marqueeOn.value
  if (!marqueeOn.value) marquee.value = null
}

const editorStore = useEditorStore()
const isDragOver = ref(false)
const selectedComponent = computed(() => editorStore.selectedComponent)
const selectedIndex = computed(() => {
  if (!selectedComponent.value) return -1
  return editorStore.currentPage.components.findIndex(item => item.id === selectedComponent.value?.id)
})
const canMoveUp = computed(() => selectedIndex.value > 0)
const canMoveDown = computed(() => selectedIndex.value >= 0 && selectedIndex.value < editorStore.currentPage.components.length - 1)

function handleSelectComponent(id: string) { editorStore.selectComponent(id) }
function handleHoverComponent(id: string | null) { editorStore.hoverComponent(id) }
function handleUpdateOrder(components: any[]) { editorStore.updateComponentsOrder(components) }
function handleCanvasClick() { editorStore.selectComponent(null) }
function handleDragOver(e: DragEvent) { e.preventDefault(); isDragOver.value = true; if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy' }
function handleDragLeave(e: DragEvent) {
  if ((e.currentTarget as HTMLElement)?.contains(e.relatedTarget as Node)) return
  isDragOver.value = false
}
function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
  const componentType = e.dataTransfer?.getData('componentType')
  if (!componentType) return
  const config = getAllComponents().find(item => item.type === componentType)
  if (!config) return ElMessage.error('组件配置不存在')
  const component = createComponentSchema(componentType, { ...config.defaultProps }, { ...config.defaultStyles })
  editorStore.addComponent(component)
  editorStore.selectComponent(component.id)
  ElMessage.success(`已添加 ${config.name}`)
}
function handleMoveUp() { if (selectedComponent.value && canMoveUp.value) editorStore.moveComponentUp(selectedComponent.value.id) }
function handleMoveDown() { if (selectedComponent.value && canMoveDown.value) editorStore.moveComponentDown(selectedComponent.value.id) }
function handleDelete() {
  if (!selectedComponent.value) return
  editorStore.deleteComponent(selectedComponent.value.id)
  ElMessage.success('组件已删除')
}

// ───────── 无限画布：平移 / 缩放 / 适应 / 动态标尺 ─────────
const MIN_ZOOM = 10
const MAX_ZOOM = 400
const FRAME_GAP = 120
const RULER = 24

const viewport = ref({ w: 1000, h: 700 })
const pan = ref({ x: 0, y: 0 })
const animating = ref(false)
const spaceDown = ref(false)
const panning = ref(false)
let internalZoom = false
let animTimer: ReturnType<typeof setTimeout> | undefined

const scale = computed(() => editorStore.canvasZoom / 100)
const frameSize = computed(() => (editorStore.deviceMode === 'tablet' ? { w: 462, h: 810 } : { w: 390, h: 844 }))
const frames = computed(() => editorStore.pages.map((page, index) => ({
  page,
  index,
  x: index * (frameSize.value.w + FRAME_GAP),
  y: 0,
  active: index === editorStore.currentPageIndex,
})))
const worldStyle = computed(() => ({ transform: `translate(${pan.value.x}px, ${pan.value.y}px) scale(${scale.value})` }))
const toolsStyle = computed(() => ({ transform: `scale(${1 / scale.value})` }))

function setPan(x: number, y: number, animate = false) {
  pan.value = { x, y }
  if (animate) {
    animating.value = true
    clearTimeout(animTimer)
    animTimer = setTimeout(() => { animating.value = false }, 260)
  }
}
function applyZoom(percent: number) {
  internalZoom = true
  editorStore.setCanvasZoom(percent)
  void nextTick(() => { internalZoom = false })
}
/** 以屏幕点 (cx, cy)（相对画布容器）为中心缩放，保持该点下的内容不动 */
function zoomAround(cx: number, cy: number, nextPercent: number, animate = false) {
  const prev = scale.value
  const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(nextPercent)))
  const next = clamped / 100
  if (next === prev) return
  const wx = (cx - pan.value.x) / prev
  const wy = (cy - pan.value.y) / prev
  applyZoom(clamped)
  setPan(cx - wx * next, cy - wy * next, animate)
}
function centerOnRect(x: number, y: number, w: number, h: number, percent?: number, animate = true) {
  const target = (percent ?? editorStore.canvasZoom) / 100
  const area = { w: viewport.value.w - RULER, h: viewport.value.h - RULER }
  if (percent !== undefined) applyZoom(percent)
  setPan(RULER + area.w / 2 - (x + w / 2) * target, RULER + area.h / 2 - (y + h / 2) * target, animate)
}
function centerOnPage(index = editorStore.currentPageIndex, animate = true) {
  const f = frames.value[index]
  if (f) centerOnRect(f.x, f.y, frameSize.value.w, frameSize.value.h, undefined, animate)
}
function fitAll() {
  const list = frames.value
  if (!list.length) return
  const w = list.length * frameSize.value.w + (list.length - 1) * FRAME_GAP
  const h = frameSize.value.h
  const area = { w: viewport.value.w - RULER - 96, h: viewport.value.h - RULER - 96 }
  const percent = Math.max(MIN_ZOOM, Math.min(100, Math.floor(Math.min(area.w / w, area.h / h) * 100)))
  centerOnRect(0, 0, w, h, percent)
}
function resetTo100() { centerOnPage(editorStore.currentPageIndex); zoomAround(RULER + (viewport.value.w - RULER) / 2, RULER + (viewport.value.h - RULER) / 2, 100, true) }

// 工具栏的 ± 按钮：以画布中心缩放
watch(() => editorStore.canvasZoom, (next, prev) => {
  if (internalZoom || next === prev) return
  const cx = RULER + (viewport.value.w - RULER) / 2
  const cy = RULER + (viewport.value.h - RULER) / 2
  const k = next / prev
  setPan(cx - (cx - pan.value.x) * k, cy - (cy - pan.value.y) * k)
})
// 切换当前页（页面管理 / AI）后把它带到视野中央
watch(() => editorStore.currentPageIndex, () => centerOnPage())
watch(() => editorStore.deviceMode, () => nextTick(() => centerOnPage(undefined, false)))

function canScrollInside(target: EventTarget | null, dy: number) {
  const el = (target as HTMLElement | null)?.closest?.('.page-content') as HTMLElement | null
  if (!el) return false
  if (dy < 0) return el.scrollTop > 0
  return el.scrollTop + el.clientHeight < el.scrollHeight - 1
}
function onWheel(e: WheelEvent) {
  const rect = shellRef.value!.getBoundingClientRect()
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    const factor = Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0025))
    zoomAround(e.clientX - rect.left, e.clientY - rect.top, editorStore.canvasZoom * factor)
    return
  }
  // 编辑页自身还能滚动时，让页面内容先滚
  if (e.deltaX === 0 && canScrollInside(e.target, e.deltaY)) return
  e.preventDefault()
  setPan(pan.value.x - e.deltaX, pan.value.y - e.deltaY)
}

let panStart: { px: number, py: number, x: number, y: number, moved: boolean, onBackground: boolean } | null = null
function onPointerDown(e: PointerEvent) {
  if (marqueeOn.value) return
  const target = e.target as HTMLElement
  const onBackground = !target.closest('.frame, .frame-tools, .canvas-controls, .marquee-toggle')
  const hand = spaceDown.value || e.button === 1
  if (!hand && !onBackground) return
  if (e.button !== 0 && e.button !== 1) return
  e.preventDefault()
  panStart = { px: e.clientX, py: e.clientY, x: pan.value.x, y: pan.value.y, moved: false, onBackground }
  panning.value = true
  shellRef.value!.setPointerCapture(e.pointerId)
}
function onPointerMove(e: PointerEvent) {
  if (!panStart) return
  const dx = e.clientX - panStart.px
  const dy = e.clientY - panStart.py
  if (Math.abs(dx) + Math.abs(dy) > 3) panStart.moved = true
  setPan(panStart.x + dx, panStart.y + dy)
}
function onPointerUp(e: PointerEvent) {
  if (!panStart) return
  if (!panStart.moved && panStart.onBackground) editorStore.selectComponent(null)
  panStart = null
  panning.value = false
  shellRef.value?.releasePointerCapture(e.pointerId)
}

function isTyping(e: KeyboardEvent) {
  const el = e.target as HTMLElement | null
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)
}
function onKeydown(e: KeyboardEvent) {
  if (isTyping(e)) return
  if (e.code === 'Space') { spaceDown.value = true; e.preventDefault(); return }
  if (e.shiftKey && e.code === 'Digit1') { e.preventDefault(); fitAll() }
  else if (e.shiftKey && e.code === 'Digit0') { e.preventDefault(); resetTo100() }
  else if (e.shiftKey && e.code === 'Digit2') { e.preventDefault(); centerOnPage() }
}
function onKeyup(e: KeyboardEvent) { if (e.code === 'Space') spaceDown.value = false }

let observer: ResizeObserver | undefined
onMounted(() => {
  observer = new ResizeObserver(([entry]) => { viewport.value = { w: entry.contentRect.width, h: entry.contentRect.height } })
  observer.observe(shellRef.value!)
  const rect = shellRef.value!.getBoundingClientRect()
  viewport.value = { w: rect.width, h: rect.height }
  // 首次进入：整页放得下就按 100%，放不下按高度缩小，避免顶部被裁掉
  const fit = Math.max(MIN_ZOOM, Math.min(100, Math.floor((viewport.value.h - RULER - 72) / frameSize.value.h * 100)))
  const f = frames.value[editorStore.currentPageIndex]
  if (f) centerOnRect(f.x, f.y, frameSize.value.w, frameSize.value.h, fit, false)
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('keyup', onKeyup)
  shellRef.value!.addEventListener('wheel', onWheel, { passive: false })
})
onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('keyup', onKeyup)
  shellRef.value?.removeEventListener('wheel', onWheel)
  clearTimeout(animTimer)
})

// 标尺：刻度间距随缩放自适应，标签是世界坐标（第一页左上角为原点）
function niceStep(minWorld: number) {
  const pow = 10 ** Math.floor(Math.log10(minWorld))
  for (const m of [1, 2, 5, 10]) if (pow * m >= minWorld) return pow * m
  return pow * 10
}
function ticks(axis: 'x' | 'y') {
  const s = scale.value
  const length = axis === 'x' ? viewport.value.w : viewport.value.h
  const offset = axis === 'x' ? pan.value.x : pan.value.y
  const step = niceStep(60 / s)
  const start = Math.floor((RULER - offset) / s / step) * step
  const out: { pos: number, label: number }[] = []
  for (let v = start; v * s + offset < length; v += step) {
    const pos = v * s + offset
    if (pos >= RULER) out.push({ pos, label: Math.round(v) })
  }
  return out
}
const ticksX = computed(() => ticks('x'))
const ticksY = computed(() => ticks('y'))
</script>

<template>
  <div
    ref="shellRef"
    class="canvas-shell"
    :class="{ 'hand-ready': spaceDown, 'is-panning': panning }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div class="world" :class="{ animating }" :style="worldStyle">
      <div
        v-for="f in frames"
        :key="f.page.id"
        class="frame"
        :class="{ active: f.active }"
        :style="{ left: `${f.x}px`, top: `${f.y}px`, width: `${frameSize.w}px` }"
      >
        <button type="button" class="frame-name" :style="{ transform: `scale(${1 / scale})` }" @click="editorStore.switchPage(f.index)">{{ f.page.name }}</button>

        <div
          v-if="f.active"
          class="device-frame"
          :class="{ 'drag-over': isDragOver, 'tablet': editorStore.deviceMode === 'tablet' }"
          :style="{ width: `${frameSize.w}px`, height: `${frameSize.h}px` }"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
        >
          <div class="device-screen">
            <div v-if="editorStore.deviceMode === 'mobile'" class="notch"><span class="speaker" /><span class="camera" /></div>
            <div class="status-bar" :class="{ tablet: editorStore.deviceMode === 'tablet' }">
              <strong>9:41</strong>
              <span><i class="i-tabler-antenna-bars-5" /><i class="i-tabler-wifi" /><i class="i-tabler-battery-4" /></span>
            </div>
            <div class="page-content" @click="handleCanvasClick">
              <PageRenderer :schema="editorStore.currentPage" :is-editing="true" :selected-id="editorStore.selectedComponentId" :hovered-id="editorStore.hoveredComponentId" @select-component="handleSelectComponent" @hover-component="handleHoverComponent" @update-order="handleUpdateOrder" />
            </div>
            <div v-if="isDragOver" class="drop-mask"><i class="i-tabler-plus" /><strong>释放以添加组件</strong><span>组件将加入当前页面，可继续拖拽排序</span></div>
          </div>
          <div class="frame-tools" :class="{ hidden: !selectedComponent }" :style="toolsStyle">
            <button class="danger" title="删除模块" @click="handleDelete"><i class="i-tabler-trash" /><span>删除</span></button>
            <button title="上移模块" :disabled="!canMoveUp" @click="handleMoveUp"><i class="i-tabler-arrow-up" /><span>上移</span></button>
            <button title="下移模块" :disabled="!canMoveDown" @click="handleMoveDown"><i class="i-tabler-arrow-down" /><span>下移</span></button>
          </div>
        </div>

        <div v-else role="button" tabindex="0" class="device-frame idle" :class="{ tablet: editorStore.deviceMode === 'tablet' }" :style="{ width: `${frameSize.w}px`, height: `${frameSize.h}px` }" :aria-label="`切换到页面：${f.page.name}`" @click="editorStore.switchPage(f.index)" @keydown.enter="editorStore.switchPage(f.index)">
          <span class="device-screen idle-screen"><span class="idle-inner"><PageRenderer :schema="f.page" /></span></span>
        </div>
      </div>
    </div>

    <div class="ruler ruler-corner" />
    <div class="ruler ruler-x"><span v-for="t in ticksX" :key="t.label" class="tick" :style="{ left: `${t.pos}px` }">{{ t.label }}</span></div>
    <div class="ruler ruler-y"><span v-for="t in ticksY" :key="t.label" class="tick" :style="{ top: `${t.pos}px` }"><b>{{ t.label }}</b></span></div>

    <button class="marquee-toggle" :class="{ active: marqueeOn }" :aria-pressed="marqueeOn" title="框选组件后交给 AI 修改" @click="toggleMarquee"><i class="i-tabler-focus-2" /><span>框选改图</span></button>
    <div v-if="marqueeOn" class="marquee-layer" @pointerdown="onMarqueeDown" @pointermove="onMarqueeMove" @pointerup="onMarqueeUp">
      <div v-if="marqueeBox" class="marquee-box" :style="marqueeBox" />
    </div>

    <div class="canvas-controls" role="toolbar" aria-label="画布视图">
      <button type="button" title="适应全部页面（Shift+1）" @click="fitAll"><i class="i-tabler-arrows-maximize" /></button>
      <button type="button" title="定位到当前页（Shift+2）" @click="centerOnPage()"><i class="i-tabler-focus-centered" /></button>
      <button type="button" class="zoom-text" title="恢复 100%（Shift+0）" @click="resetTo100">{{ editorStore.canvasZoom }}%</button>
    </div>
    <div class="canvas-hint">滚轮平移 · Ctrl/⌘ + 滚轮缩放 · 空格或拖动空白处移动画布</div>
  </div>
</template>

<style scoped>
.canvas-shell{flex:1;min-width:0;height:100%;position:relative;overflow:hidden;background:#f4f7fb;background-image:radial-gradient(circle,rgba(123,145,173,.2) 1px,transparent 1px);background-size:18px 18px;cursor:default;touch-action:none;user-select:none}
[data-theme='dark'] .canvas-shell{background-color:#20242b}
.canvas-shell.hand-ready{cursor:grab}.canvas-shell.hand-ready .frame{pointer-events:none}.canvas-shell.is-panning{cursor:grabbing}
.world{position:absolute;left:0;top:0;width:0;height:0;transform-origin:0 0;will-change:transform}.world.animating{transition:transform .25s ease}
.frame{position:absolute}
.frame-name{position:absolute;left:0;top:-30px;transform-origin:left bottom;border:0;background:transparent;color:#65758a;font-size:12px;cursor:pointer;padding:2px 4px;max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.frame.active .frame-name{color:#1769ff;font-weight:600}.frame-name:hover{color:#1769ff}
.ruler{position:absolute;z-index:4;color:#a7b3c3;font-size:9px;pointer-events:none;background:rgba(248,250,253,.94);backdrop-filter:blur(8px);overflow:hidden}
.ruler-corner{left:0;top:0;width:24px;height:24px;z-index:5;border-right:1px solid #e7edf4;border-bottom:1px solid #e7edf4}
.ruler-x{left:0;right:0;top:0;height:24px;border-bottom:1px solid #e7edf4}.ruler-y{left:0;top:0;bottom:0;width:24px;border-right:1px solid #e7edf4}
.tick{position:absolute;white-space:nowrap}.ruler-x .tick{top:0;height:24px;padding-left:3px;border-left:1px solid #d5dde8;line-height:24px;transform:translateX(0)}
.ruler-y .tick{left:0;width:24px;border-top:1px solid #d5dde8}.ruler-y .tick b{display:block;font-weight:400;writing-mode:vertical-rl;transform:rotate(180deg);padding:3px 0 0 6px}
.device-frame{display:block;padding:8px;border:0;border-radius:49px;box-sizing:border-box;background:linear-gradient(145deg,#121417 0%,#2a2d32 45%,#08090b 100%);box-shadow:0 28px 60px rgba(36,48,66,.28),0 0 0 1px #08090b,inset 0 0 0 1px rgba(255,255,255,.12);position:relative}
.device-frame::before,.device-frame::after{content:'';position:absolute;left:-3px;width:3px;background:#191b1f;border-radius:3px 0 0 3px}.device-frame::before{top:168px;height:63px}.device-frame::after{top:246px;height:43px}
.device-frame.tablet{border-radius:31px;padding:7px;background:linear-gradient(145deg,#202328,#050607)}.device-frame.tablet::before,.device-frame.tablet::after{display:none}
.device-frame.drag-over{box-shadow:0 0 0 4px rgba(23,105,255,.18),0 24px 58px rgba(23,105,255,.28)}
.device-frame.idle{cursor:pointer;opacity:.86;transition:opacity .15s}.device-frame.idle:hover,.device-frame.idle:focus-visible{opacity:1}
.device-screen{display:block;width:100%;height:100%;overflow:hidden;border-radius:41px;background:#fff;position:relative;box-shadow:inset 0 0 0 1px rgba(0,0,0,.2)}.device-frame.tablet .device-screen{border-radius:24px}
.idle-screen{overflow:hidden}.idle-inner{display:block;width:100%;height:100%;overflow:hidden;pointer-events:none}
.notch{position:absolute;z-index:46;top:0;left:50%;transform:translateX(-50%);width:154px;height:29px;border-radius:0 0 18px 18px;background:#08090b;display:flex;align-items:center;justify-content:center;gap:9px;pointer-events:none}.speaker{width:48px;height:4px;border-radius:4px;background:#25282d}.camera{width:7px;height:7px;border-radius:50%;background:#101722;box-shadow:inset 0 0 0 2px #1c2736}
.status-bar{position:absolute;left:0;right:0;top:0;height:39px;padding:11px 19px 0;display:flex;align-items:flex-start;justify-content:space-between;color:#17344c;font-size:10px;z-index:45;pointer-events:none;text-shadow:0 1px 1px rgba(255,255,255,.52)}.status-bar strong{padding-left:4px}.status-bar span{display:flex;gap:3px;align-items:center;font-size:12px}.status-bar.tablet{padding-left:22px;padding-right:22px}
.page-content{width:100%;height:100%;overflow:auto;background:#fff;scrollbar-width:none;cursor:default}.page-content::-webkit-scrollbar{width:0;height:0}
.drop-mask{position:absolute;inset:10px;z-index:48;border:2px dashed #3988ff;border-radius:32px;background:rgba(239,246,255,.9);backdrop-filter:blur(3px);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#1769ff;pointer-events:none}.drop-mask i{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:#1769ff;color:#fff;font-size:24px;box-shadow:0 8px 20px rgba(23,105,255,.22)}.drop-mask strong{font-size:13px;margin-top:12px}.drop-mask span{font-size:9px;color:#7192bd;margin-top:5px}
.frame-tools{position:absolute;left:calc(100% + 12px);top:64px;transform-origin:left top;width:48px;background:#fff;border:1px solid #e2e9f1;border-radius:9px;box-shadow:0 8px 24px rgba(45,66,94,.12);overflow:hidden;transition:opacity .12s ease}.frame-tools.hidden{opacity:0;pointer-events:none}
.frame-tools button{width:48px;height:58px;border:0;border-bottom:1px solid #edf1f6;background:#fff;color:#65758a;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:9px;cursor:pointer}.frame-tools button:last-child{border-bottom:0}.frame-tools button:hover:not(:disabled){background:#f3f7ff;color:#1769ff}.frame-tools button.danger:hover{background:#fff4f4;color:#ef4444}.frame-tools button:disabled{color:#c5ccd6;background:#fbfcfd;cursor:not-allowed}.frame-tools i{font-size:16px}.frame-tools span{line-height:1}
.canvas-controls{position:absolute;left:40px;bottom:16px;z-index:20;display:flex;background:var(--surface-1,#fff);border:1px solid var(--border-default,#dfe6ee);border-radius:8px;box-shadow:var(--shadow-xs,0 1px 4px rgba(0,0,0,.08));overflow:hidden}
.canvas-controls button{height:32px;min-width:34px;border:0;border-right:1px solid var(--border-subtle,#edf1f6);background:transparent;color:var(--text-secondary,#65758a);cursor:pointer;display:grid;place-items:center;padding:0 8px}.canvas-controls button:last-child{border-right:0}.canvas-controls button:hover{background:var(--brand-50,#eef4ff);color:var(--brand-600,#1769ff)}.zoom-text{font-size:12px;font-variant-numeric:tabular-nums;min-width:56px!important}
.canvas-hint{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);font-size:11px;color:#9aa7b8;pointer-events:none;white-space:nowrap}
.marquee-toggle{position:absolute;right:16px;top:40px;z-index:20;height:32px;padding:0 12px;border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--surface-1);color:var(--text-secondary);display:flex;align-items:center;gap:6px;font-size:var(--font-size-sm);cursor:pointer;box-shadow:var(--shadow-xs)}.marquee-toggle:hover{color:var(--brand-600);border-color:var(--border-brand)}.marquee-toggle.active{background:var(--brand-600);border-color:var(--brand-600);color:var(--text-inverse)}
.marquee-layer{position:absolute;inset:0;z-index:15;cursor:crosshair;touch-action:none}.marquee-box{position:absolute;border:1px dashed var(--brand-600);background:rgba(23,105,255,.1);pointer-events:none}
@media (prefers-reduced-motion:reduce){.world.animating{transition:none}}
</style>
