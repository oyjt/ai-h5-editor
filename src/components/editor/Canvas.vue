<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { PageSchema } from '@/types/schema'
import { useEditorStore } from '@/stores/editor'
import PageRenderer from '@/components/renderer/PageRenderer.vue'
import { getAllComponents } from '@/config/component-registry'
import { createComponentSchema } from '@/utils/schema-generator'

const editorStore = useEditorStore()
const isDragOver = ref(false)
const fallbackHeroUrl = `${import.meta.env.BASE_URL}marketing/summer-hero.jpg`
const selectedComponent = computed(() => editorStore.selectedComponent)
const previewStyle = computed(() => {
  const scale = editorStore.canvasZoom / 100
  const tablet = editorStore.deviceMode === 'tablet'
  const width = tablet ? 460 : 400
  const height = tablet ? 800 : 840
  return {
    '--preview-scale': String(scale),
    '--device-width': `${width}px`,
    '--device-height': `${height}px`,
    width: `${width * scale}px`,
    height: `${height * scale}px`,
  }
})

function pageThumbnail(page: PageSchema) {
  const image = page.components.find(component => component.type === 'image' && component.props?.src)
  return String(image?.props?.src || fallbackHeroUrl)
}
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
function handleMoveUp() { if (selectedComponent.value) editorStore.moveComponentUp(selectedComponent.value.id) }
function handleMoveDown() { if (selectedComponent.value) editorStore.moveComponentDown(selectedComponent.value.id) }
function handleDuplicate() {
  const current = selectedComponent.value
  if (!current) return
  const clone = createComponentSchema(current.type, structuredClone(current.props || {}), structuredClone(current.styles || {}))
  clone.events = current.events ? structuredClone(current.events) : undefined
  clone.children = current.children ? structuredClone(current.children) : undefined
  editorStore.addComponent(clone)
  editorStore.selectComponent(clone.id)
  ElMessage.success('已复制组件')
}
function handleDelete() { if (selectedComponent.value) editorStore.deleteComponent(selectedComponent.value.id) }
function handleAddPage() {
  editorStore.addPage()
  ElMessage.success('已新增页面')
}
</script>

<template>
  <div class="canvas-shell">
    <div class="ruler ruler-x"><span v-for="n in 13" :key="n">{{ (n - 1) * 100 }}</span></div>
    <div class="ruler ruler-y"><span v-for="n in 10" :key="n">{{ (n - 1) * 100 }}</span></div>

    <div class="canvas-stage">
      <div class="device-tools" :class="{ disabled: !selectedComponent }">
        <button title="上移" @click="handleMoveUp"><i class="i-tabler-arrow-up" /><span>上移</span></button>
        <button title="下移" @click="handleMoveDown"><i class="i-tabler-arrow-down" /><span>下移</span></button>
        <button title="复制" @click="handleDuplicate"><i class="i-tabler-copy" /><span>复制</span></button>
        <button class="danger" title="删除" @click="handleDelete"><i class="i-tabler-trash" /><span>删除</span></button>
      </div>

      <div class="preview-viewport" :style="previewStyle">
        <div class="phone-wrap">
          <div class="phone-shadow" />
          <div class="device-frame" :class="{ 'drag-over': isDragOver, tablet: editorStore.deviceMode === 'tablet' }" @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop">
            <div class="device-screen">
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

      <aside class="page-strip">
        <div class="page-list">
          <button v-for="(page,index) in editorStore.pages" :key="page.id" class="page-thumb" :class="{ active: editorStore.currentPageIndex === index }" @click="editorStore.switchPage(index)">
            <div class="thumb-preview" :class="{ empty: page.components.length === 0 }"><img v-if="page.components.length" :src="pageThumbnail(page)" alt="页面缩略图"><i v-else class="i-tabler-file-plus" /><div v-if="page.components.length" class="thumb-coupons"><i /><i /><i /></div><div v-if="page.components.length" class="thumb-cards"><i /><i /></div><div v-if="page.components.length" class="thumb-form" /></div>
            <strong>{{ page.name || `页面 ${index + 1}` }}</strong>
          </button>
        </div>
        <button class="add-page" @click="handleAddPage"><i class="i-tabler-plus" /><span>新增页面</span></button>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.canvas-shell{flex:1;min-width:0;height:100%;position:relative;overflow:hidden;background:#f4f7fb;background-image:radial-gradient(circle,rgba(123,145,173,.14) 1px,transparent 1px);background-size:18px 18px}[data-theme='dark'] .canvas-shell{background-color:#20242b}.ruler{position:absolute;z-index:4;color:#a8b4c4;font-size:9px;pointer-events:none;background:rgba(248,250,253,.88);backdrop-filter:blur(8px)}.ruler-x{left:24px;right:0;top:0;height:24px;border-bottom:1px solid #e9eef5;display:flex;justify-content:space-around;align-items:center}.ruler-y{left:0;top:24px;bottom:0;width:24px;border-right:1px solid #e9eef5;display:flex;flex-direction:column;justify-content:space-around;align-items:center}.canvas-stage{position:absolute;inset:24px 0 0 24px;display:flex;align-items:center;justify-content:center;gap:24px;padding:18px 30px 24px;overflow:auto}.preview-viewport{display:flex;align-items:center;justify-content:center;flex:0 0 auto;transition:width .18s ease,height .18s ease}.phone-wrap{position:relative;display:flex;align-items:center;justify-content:center;transform:scale(var(--preview-scale));transform-origin:center center;transition:transform .18s ease}.phone-shadow{position:absolute;left:50%;bottom:-18px;width:322px;height:34px;transform:translateX(-50%);border-radius:50%;background:rgba(65,84,110,.13);filter:blur(17px)}.device-frame{width:var(--device-width);height:var(--device-height);border-radius:46px;padding:8px;background:linear-gradient(145deg,#f9fafc 0%,#b7c0ca 48%,#eef2f7 100%);box-shadow:0 20px 50px rgba(54,75,103,.2),0 0 0 1px rgba(108,120,136,.32),inset 0 0 0 1px rgba(255,255,255,.85);transition:.2s ease;position:relative}.device-frame.tablet{border-radius:30px;padding:7px}.device-frame.tablet::before,.device-frame.tablet::after{display:none}.device-frame::before,.device-frame::after{content:'';position:absolute;left:-3px;width:3px;border-radius:3px;background:#aab4c0}.device-frame::before{top:166px;height:67px}.device-frame::after{top:252px;height:48px}.device-frame.drag-over{box-shadow:0 0 0 4px rgba(23,105,255,.16),0 20px 52px rgba(23,105,255,.25)}.device-screen{width:100%;height:100%;overflow:hidden;border-radius:38px;background:#fff;position:relative;box-shadow:inset 0 0 0 1px rgba(32,48,67,.08)}.device-frame.tablet .device-screen{border-radius:23px}.status-bar{position:absolute;left:0;right:0;top:0;height:38px;padding:12px 20px 0;display:flex;align-items:flex-start;justify-content:space-between;color:#17344c;font-size:10px;z-index:40;pointer-events:none;text-shadow:0 1px 1px rgba(255,255,255,.42)}.status-bar.tablet{padding-left:22px;padding-right:22px}.status-bar strong{padding-left:4px}.status-bar span{display:flex;gap:3px;align-items:center;font-size:12px}.page-content{width:100%;height:100%;overflow:auto;background:#fff;scrollbar-width:none}.page-content::-webkit-scrollbar{width:0;height:0}.drop-mask{position:absolute;inset:10px;z-index:45;border:2px dashed #3988ff;border-radius:30px;background:rgba(239,246,255,.88);backdrop-filter:blur(3px);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#1769ff;pointer-events:none}.drop-mask i{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:#1769ff;color:#fff;font-size:24px;box-shadow:0 8px 20px rgba(23,105,255,.22)}.drop-mask strong{font-size:13px;margin-top:12px}.drop-mask span{font-size:9px;color:#7192bd;margin-top:5px}.device-tools{width:50px;border-radius:8px;background:#fff;box-shadow:0 8px 26px rgba(44,68,100,.12);border:1px solid #e4eaf2;overflow:hidden;align-self:center;transition:.15s ease;flex:0 0 auto}.device-tools.disabled{opacity:.42}.device-tools.disabled button{pointer-events:none}.device-tools button{width:50px;height:56px;border:0;border-bottom:1px solid #edf1f6;background:#fff;color:#637287;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:9px;cursor:pointer}.device-tools button:last-child{border-bottom:0}.device-tools button:hover{color:#1769ff;background:#f4f8ff}.device-tools button.danger:hover{color:#ef4444;background:#fff6f6}.device-tools i{font-size:16px}.page-strip{width:106px;align-self:flex-start;margin-top:9px;display:flex;flex-direction:column;gap:12px;flex:0 0 auto;max-height:100%;overflow:hidden}.page-list{display:flex;flex-direction:column;gap:10px;overflow:auto;padding:2px;scrollbar-width:thin}.page-thumb{border:1px solid #dce5f1;background:#fff;border-radius:8px;padding:6px;text-align:center;color:#64748b;font-size:10px;box-shadow:0 3px 12px rgba(68,91,120,.04);cursor:pointer}.page-thumb.active{border-color:#2684ff;box-shadow:0 0 0 2px rgba(38,132,255,.08)}.thumb-preview{height:142px;background:#fff;border-radius:5px;overflow:hidden;padding:3px;border:1px solid #eef2f6}.thumb-preview.empty{display:grid;place-items:center;color:#9aabba;font-size:24px;background:#f8fafc}.thumb-preview img{width:100%;height:56px;object-fit:cover;border-radius:3px;display:block}.thumb-coupons,.thumb-cards{display:grid;gap:2px;margin-top:3px}.thumb-coupons{grid-template-columns:repeat(3,1fr)}.thumb-coupons i{height:16px;border-radius:2px;background:#ffe4df}.thumb-cards{grid-template-columns:1fr 1fr}.thumb-cards i{height:32px;border-radius:2px;background:#edf3fa}.thumb-form{height:22px;margin-top:3px;border-radius:2px;background:#e8f2ff}.page-thumb strong{display:block;margin-top:6px;font-weight:500;color:#46566a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.add-page{height:84px;flex:0 0 84px;border:1px dashed #c9d4e3;background:rgba(255,255,255,.78);border-radius:8px;color:#8b98a9;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;font-size:9px;cursor:pointer}.add-page:hover{border-color:#7aaeff;color:#1769ff;background:#f7faff}.add-page i{font-size:20px}@media(max-height:930px){.canvas-stage{align-items:flex-start;padding-top:14px}.phone-wrap{transform:scale(calc(var(--preview-scale) * .9));transform-origin:top center}.page-strip{transform:scale(.92);transform-origin:top left}}@media(max-width:1500px){.page-strip{width:86px}.device-tools{width:44px}.device-tools button{width:44px;height:48px}.canvas-stage{gap:17px;padding-left:17px;padding-right:17px}}
</style>
