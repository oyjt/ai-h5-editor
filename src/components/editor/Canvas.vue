<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
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
/** 连续画布：当前页之外的页面以缩略预览并排展示，点击即切换为当前页 */
const GHOST_SCALE = 0.42
const ghostStyle = computed(() => {
  const tablet = editorStore.deviceMode === 'tablet'
  const width = tablet ? 462 : 390
  const height = tablet ? 810 : 844
  return { '--ghost-w': `${width}px`, '--ghost-h': `${height}px`, '--ghost-scale': String(GHOST_SCALE), 'width': `${width * GHOST_SCALE}px`, 'height': `${height * GHOST_SCALE}px` }
})
const ghostsBefore = computed(() => editorStore.pages.map((page, index) => ({ page, index })).filter(item => item.index < editorStore.currentPageIndex))
const ghostsAfter = computed(() => editorStore.pages.map((page, index) => ({ page, index })).filter(item => item.index > editorStore.currentPageIndex))
const isDragOver = ref(false)
// 切换页面后把当前页滚到画布中央
watch(() => editorStore.currentPageIndex, async () => {
  await nextTick()
  shellRef.value?.querySelector('.preview-viewport')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
})
const selectedComponent = computed(() => editorStore.selectedComponent)
const selectedIndex = computed(() => {
  if (!selectedComponent.value) return -1
  return editorStore.currentPage.components.findIndex(item => item.id === selectedComponent.value?.id)
})
const canMoveUp = computed(() => selectedIndex.value > 0)
const canMoveDown = computed(() => selectedIndex.value >= 0 && selectedIndex.value < editorStore.currentPage.components.length - 1)
const previewStyle = computed(() => {
  const scale = editorStore.canvasZoom / 100
  const tablet = editorStore.deviceMode === 'tablet'
  const width = tablet ? 462 : 390
  const height = tablet ? 810 : 844
  return {
    '--preview-scale': String(scale),
    '--device-width': `${width}px`,
    '--device-height': `${height}px`,
    width: `${width * scale}px`,
    height: `${height * scale}px`,
  }
})

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
</script>

<template>
  <div ref="shellRef" class="canvas-shell">
    <div class="ruler ruler-x"><span v-for="n in 13" :key="n">{{ (n - 1) * 100 }}</span></div>
    <div class="ruler ruler-y"><span v-for="n in 10" :key="n">{{ (n - 1) * 100 }}</span></div>

    <button class="marquee-toggle" :class="{ active: marqueeOn }" :aria-pressed="marqueeOn" title="框选组件后交给 AI 修改" @click="toggleMarquee"><i class="i-tabler-focus-2" /><span>框选改图</span></button>
    <div v-if="marqueeOn" class="marquee-layer" @pointerdown="onMarqueeDown" @pointermove="onMarqueeMove" @pointerup="onMarqueeUp">
      <div v-if="marqueeBox" class="marquee-box" :style="marqueeBox" />
    </div>

    <div class="canvas-stage">
      <div class="preview-group">
        <button v-for="item in ghostsBefore" :key="item.page.id" type="button" class="ghost-page" :aria-label="`切换到页面：${item.page.name}`" @click="editorStore.switchPage(item.index)">
          <span class="ghost-frame" :style="ghostStyle"><span class="ghost-inner"><PageRenderer :schema="item.page" /></span></span>
          <em>{{ item.page.name }}</em>
        </button>
        <div class="preview-viewport" :style="previewStyle">
          <div class="phone-wrap">
            <div class="phone-shadow" />
            <div class="device-frame" :class="{ 'drag-over': isDragOver, tablet: editorStore.deviceMode === 'tablet' }" @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop">
              <div class="device-screen">
                <div v-if="editorStore.deviceMode === 'mobile'" class="notch">
                  <span class="speaker" />
                  <span class="camera" />
                </div>
                <div class="status-bar" :class="{ tablet: editorStore.deviceMode === 'tablet' }">
                  <strong>9:41</strong>
                  <span><i class="i-tabler-antenna-bars-5" /><i class="i-tabler-wifi" /><i class="i-tabler-battery-4" /></span>
                </div>
                <div class="page-content" @click="handleCanvasClick">
                  <PageRenderer :schema="editorStore.currentPage" :is-editing="true" :selected-id="editorStore.selectedComponentId" :hovered-id="editorStore.hoveredComponentId" @select-component="handleSelectComponent" @hover-component="handleHoverComponent" @update-order="handleUpdateOrder" />
                </div>
                <div v-if="isDragOver" class="drop-mask"><i class="i-tabler-plus" /><strong>释放以添加组件</strong><span>组件将加入当前页面，可继续拖拽排序</span></div>
              </div>
            </div>
          </div>
        </div>

        <div class="device-tools" :class="{ hidden: !selectedComponent }">
          <button class="danger" title="删除模块" @click="handleDelete"><i class="i-tabler-trash" /><span>删除</span></button>
          <button title="上移模块" :disabled="!canMoveUp" @click="handleMoveUp"><i class="i-tabler-arrow-up" /><span>上移</span></button>
          <button title="下移模块" :disabled="!canMoveDown" @click="handleMoveDown"><i class="i-tabler-arrow-down" /><span>下移</span></button>
        </div>
        <button v-for="item in ghostsAfter" :key="item.page.id" type="button" class="ghost-page" :aria-label="`切换到页面：${item.page.name}`" @click="editorStore.switchPage(item.index)">
          <span class="ghost-frame" :style="ghostStyle"><span class="ghost-inner"><PageRenderer :schema="item.page" /></span></span>
          <em>{{ item.page.name }}</em>
        </button>
              </div>
    </div>
  </div>
</template>

<style scoped>
.canvas-shell{flex:1;min-width:0;height:100%;position:relative;overflow:hidden;background:#f4f7fb;background-image:radial-gradient(circle,rgba(123,145,173,.14) 1px,transparent 1px);background-size:18px 18px}[data-theme='dark'] .canvas-shell{background-color:#20242b}.ruler{position:absolute;z-index:4;color:#a7b3c3;font-size:9px;pointer-events:none;background:rgba(248,250,253,.92);backdrop-filter:blur(8px)}.ruler-x{left:24px;right:0;top:0;height:24px;border-bottom:1px solid #e7edf4;display:flex;justify-content:space-around;align-items:center}.ruler-y{left:0;top:24px;bottom:0;width:24px;border-right:1px solid #e7edf4;display:flex;flex-direction:column;justify-content:space-around;align-items:center}.canvas-stage{position:absolute;inset:24px 0 0 24px;display:flex;align-items:center;justify-content:flex-start;padding:18px 42px 26px;overflow:auto}.preview-group{display:flex;align-items:center;justify-content:center;gap:24px;min-width:max-content;margin:0 auto}.preview-viewport{display:flex;align-items:center;justify-content:center;flex:0 0 auto;transition:width .18s ease,height .18s ease}.phone-wrap{position:relative;display:flex;align-items:center;justify-content:center;transform:scale(var(--preview-scale));transform-origin:center center;transition:transform .18s ease}.phone-shadow{position:absolute;left:50%;bottom:-20px;width:320px;height:35px;transform:translateX(-50%);border-radius:50%;background:rgba(42,52,66,.18);filter:blur(20px)}.device-frame{width:var(--device-width);height:var(--device-height);padding:8px;border-radius:49px;background:linear-gradient(145deg,#121417 0%,#2a2d32 45%,#08090b 100%);box-shadow:0 28px 60px rgba(36,48,66,.28),0 0 0 1px #08090b,inset 0 0 0 1px rgba(255,255,255,.12);position:relative;transition:.18s ease}.device-frame::before,.device-frame::after{content:'';position:absolute;left:-3px;width:3px;background:#191b1f;border-radius:3px 0 0 3px}.device-frame::before{top:168px;height:63px}.device-frame::after{top:246px;height:43px}.device-frame.tablet{border-radius:31px;padding:7px;background:linear-gradient(145deg,#202328,#050607)}.device-frame.tablet::before,.device-frame.tablet::after{display:none}.device-frame.drag-over{box-shadow:0 0 0 4px rgba(23,105,255,.18),0 24px 58px rgba(23,105,255,.28)}.device-screen{width:100%;height:100%;overflow:hidden;border-radius:41px;background:#fff;position:relative;box-shadow:inset 0 0 0 1px rgba(0,0,0,.2)}.device-frame.tablet .device-screen{border-radius:24px}.notch{position:absolute;z-index:46;top:0;left:50%;transform:translateX(-50%);width:154px;height:29px;border-radius:0 0 18px 18px;background:#08090b;display:flex;align-items:center;justify-content:center;gap:9px;pointer-events:none}.speaker{width:48px;height:4px;border-radius:4px;background:#25282d}.camera{width:7px;height:7px;border-radius:50%;background:#101722;box-shadow:inset 0 0 0 2px #1c2736}.status-bar{position:absolute;left:0;right:0;top:0;height:39px;padding:11px 19px 0;display:flex;align-items:flex-start;justify-content:space-between;color:#17344c;font-size:10px;z-index:45;pointer-events:none;text-shadow:0 1px 1px rgba(255,255,255,.52)}.status-bar strong{padding-left:4px}.status-bar span{display:flex;gap:3px;align-items:center;font-size:12px}.status-bar.tablet{padding-left:22px;padding-right:22px}.page-content{width:100%;height:100%;overflow:auto;background:#fff;scrollbar-width:none}.page-content::-webkit-scrollbar{width:0;height:0}.drop-mask{position:absolute;inset:10px;z-index:48;border:2px dashed #3988ff;border-radius:32px;background:rgba(239,246,255,.9);backdrop-filter:blur(3px);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#1769ff;pointer-events:none}.drop-mask i{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:#1769ff;color:#fff;font-size:24px;box-shadow:0 8px 20px rgba(23,105,255,.22)}.drop-mask strong{font-size:13px;margin-top:12px}.drop-mask span{font-size:9px;color:#7192bd;margin-top:5px}.device-tools{width:48px;flex:0 0 48px;background:#fff;border:1px solid #e2e9f1;border-radius:9px;box-shadow:0 8px 24px rgba(45,66,94,.12);overflow:hidden;transition:opacity .12s ease,transform .12s ease}.device-tools.hidden{opacity:0;pointer-events:none;transform:translateX(-6px)}.device-tools button{width:48px;height:58px;border:0;border-bottom:1px solid #edf1f6;background:#fff;color:#65758a;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:9px;cursor:pointer;transition:.12s ease}.device-tools button:last-child{border-bottom:0}.device-tools button:hover:not(:disabled){background:#f3f7ff;color:#1769ff}.device-tools button.danger:hover{background:#fff4f4;color:#ef4444}.device-tools button:disabled{color:#c5ccd6;background:#fbfcfd;cursor:not-allowed}.device-tools i{font-size:16px}.device-tools span{line-height:1}@media(max-height:930px){.canvas-stage{align-items:flex-start;padding-top:14px}.phone-wrap{transform:scale(calc(var(--preview-scale) * .9));transform-origin:top center}.device-tools{margin-top:64px}}@media(max-width:1500px){.canvas-stage{padding-left:26px;padding-right:26px}.preview-group{gap:10px}.device-tools{width:44px;flex-basis:44px}.device-tools button{width:44px;height:52px}.device-frame{border-radius:45px}}@media(max-width:1320px){.canvas-stage{justify-content:flex-start;padding-left:18px}.phone-wrap{transform:scale(calc(var(--preview-scale) * .86));transform-origin:left center}.preview-viewport{width:calc(var(--device-width) * var(--preview-scale) * .86)!important}}
.marquee-toggle{position:absolute;right:16px;top:16px;z-index:20;height:32px;padding:0 12px;border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--surface-1);color:var(--text-secondary);display:flex;align-items:center;gap:6px;font-size:var(--font-size-sm);cursor:pointer;box-shadow:var(--shadow-xs)}.marquee-toggle:hover{color:var(--brand-600);border-color:var(--border-brand)}.marquee-toggle.active{background:var(--brand-600);border-color:var(--brand-600);color:var(--text-inverse)}.marquee-layer{position:absolute;inset:0;z-index:15;cursor:crosshair;touch-action:none}.marquee-box{position:absolute;border:1px dashed var(--brand-600);background:rgba(23,105,255,.1);pointer-events:none}
.ghost-page{flex:0 0 auto;border:0;background:transparent;padding:0;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;opacity:.82;transition:opacity .15s,transform .15s}.ghost-page:hover,.ghost-page:focus-visible{opacity:1;transform:translateY(-2px)}.ghost-page em{font-style:normal;font-size:12px;color:var(--text-secondary);max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ghost-frame{display:block;position:relative;overflow:hidden;border-radius:18px;background:#fff;box-shadow:0 0 0 1px var(--border-default),0 10px 24px rgba(36,48,66,.14);pointer-events:auto}.ghost-inner{display:block;position:absolute;left:0;top:0;width:var(--ghost-w);height:var(--ghost-h);transform:scale(var(--ghost-scale));transform-origin:top left;pointer-events:none;overflow:hidden}
</style>
