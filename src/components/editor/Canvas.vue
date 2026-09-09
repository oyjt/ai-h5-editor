<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useEditorStore } from '@/stores/editor'
import PageRenderer from '@/components/renderer/PageRenderer.vue'
import { getAllComponents } from '@/config/component-registry'
import { createComponentSchema } from '@/utils/schema-generator'

const editorStore = useEditorStore()
const isDragOver = ref(false)
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
const heroUrl = asset('marketing/summer-hero.svg')
const selectedComponent = computed(() => editorStore.selectedComponent)
const previewStyle = computed(() => {
  const scale = editorStore.canvasZoom / 100
  const tablet = editorStore.deviceMode === 'tablet'
  const width = tablet ? 430 : 350
  const height = tablet ? 720 : 742
  return {
    '--preview-scale': String(scale),
    width: `${width * scale}px`,
    height: `${height * scale}px`,
  }
})

function handleSelectComponent(id: string) { editorStore.selectComponent(id) }
function handleHoverComponent(id: string | null) { editorStore.hoverComponent(id) }
function handleUpdateOrder(components: any[]) { editorStore.updateComponentsOrder(components) }
function handleCanvasClick() { editorStore.selectComponent(null) }
function handleDragOver(e: DragEvent) { e.preventDefault(); isDragOver.value = true; if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy' }
function handleDragLeave() { isDragOver.value = false }
function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
  const componentType = e.dataTransfer?.getData('componentType')
  if (!componentType) return
  const config = getAllComponents().find(item => item.type === componentType)
  if (!config) return ElMessage.error('组件配置不存在')
  editorStore.addComponent(createComponentSchema(componentType, { ...config.defaultProps }, { ...config.defaultStyles }))
  ElMessage.success(`已添加 ${config.name}`)
}
function handleMoveUp() { if (selectedComponent.value) editorStore.moveComponentUp(selectedComponent.value.id) }
function handleMoveDown() { if (selectedComponent.value) editorStore.moveComponentDown(selectedComponent.value.id) }
function handleDuplicate() {
  const current = selectedComponent.value
  if (!current) return
  const clone = createComponentSchema(current.type, { ...current.props }, { ...current.styles })
  clone.events = current.events ? { ...current.events } : undefined
  editorStore.addComponent(clone)
  ElMessage.success('已复制组件')
}
function handleDelete() { if (selectedComponent.value) editorStore.deleteComponent(selectedComponent.value.id) }
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
            </div>
          </div>
        </div>
      </div>

      <aside class="page-strip">
        <div class="page-thumb active">
          <div class="thumb-preview"><img :src="heroUrl" alt="页面缩略图"><div class="thumb-coupons"><i /><i /><i /></div><div class="thumb-cards"><i /><i /></div><div class="thumb-form" /></div>
          <strong>页面 1</strong>
        </div>
        <button class="add-page"><i class="i-tabler-plus" /><span>新增页面</span></button>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.canvas-shell{flex:1;min-width:0;height:100%;position:relative;overflow:hidden;background:#f4f7fb;background-image:radial-gradient(circle,rgba(123,145,173,.14) 1px,transparent 1px);background-size:18px 18px}[data-theme='dark'] .canvas-shell{background-color:#20242b}.ruler{position:absolute;z-index:4;color:#a8b4c4;font-size:9px;pointer-events:none;background:rgba(248,250,253,.88);backdrop-filter:blur(8px)}.ruler-x{left:24px;right:0;top:0;height:24px;border-bottom:1px solid #e9eef5;display:flex;justify-content:space-around;align-items:center}.ruler-y{left:0;top:24px;bottom:0;width:24px;border-right:1px solid #e9eef5;display:flex;flex-direction:column;justify-content:space-around;align-items:center}.canvas-stage{position:absolute;inset:24px 0 0 24px;display:flex;align-items:center;justify-content:center;gap:22px;padding:18px 28px 24px;overflow:auto}.preview-viewport{display:flex;align-items:center;justify-content:center;flex:0 0 auto;transition:width .18s ease,height .18s ease}.phone-wrap{position:relative;display:flex;align-items:center;justify-content:center;transform:scale(var(--preview-scale));transform-origin:center center;transition:transform .18s ease}.phone-shadow{position:absolute;left:50%;bottom:-17px;width:282px;height:32px;transform:translateX(-50%);border-radius:50%;background:rgba(65,84,110,.12);filter:blur(16px)}.device-frame{width:350px;height:742px;border-radius:43px;padding:7px;background:linear-gradient(145deg,#f7f9fc 0%,#b7c0ca 48%,#eef2f7 100%);box-shadow:0 18px 44px rgba(54,75,103,.19),0 0 0 1px rgba(108,120,136,.32),inset 0 0 0 1px rgba(255,255,255,.82);transition:.2s ease;position:relative}.device-frame.tablet{width:430px;height:720px;border-radius:29px;padding:7px}.device-frame.tablet::before,.device-frame.tablet::after{display:none}.device-frame::before,.device-frame::after{content:'';position:absolute;left:-3px;width:3px;border-radius:3px;background:#aab4c0}.device-frame::before{top:148px;height:62px}.device-frame::after{top:226px;height:44px}.device-frame.drag-over{box-shadow:0 0 0 4px rgba(23,105,255,.16),0 18px 46px rgba(23,105,255,.24)}.device-screen{width:100%;height:100%;overflow:hidden;border-radius:36px;background:#fff;position:relative;box-shadow:inset 0 0 0 1px rgba(32,48,67,.08)}.device-frame.tablet .device-screen{border-radius:23px}.status-bar{position:absolute;left:0;right:0;top:0;height:36px;padding:11px 18px 0;display:flex;align-items:flex-start;justify-content:space-between;color:#17344c;font-size:10px;z-index:40;pointer-events:none;text-shadow:0 1px 1px rgba(255,255,255,.42)}.status-bar.tablet{padding-left:22px;padding-right:22px}.status-bar strong{padding-left:4px}.status-bar span{display:flex;gap:3px;align-items:center;font-size:12px}.page-content{width:100%;height:100%;overflow:auto;background:#fff;scrollbar-width:none}.page-content::-webkit-scrollbar{width:0;height:0}.device-tools{width:48px;border-radius:8px;background:#fff;box-shadow:0 8px 26px rgba(44,68,100,.12);border:1px solid #e4eaf2;overflow:hidden;align-self:center;transition:.15s ease;flex:0 0 auto}.device-tools.disabled{opacity:.42}.device-tools.disabled button{pointer-events:none}.device-tools button{width:48px;height:52px;border:0;border-bottom:1px solid #edf1f6;background:#fff;color:#637287;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:9px;cursor:pointer}.device-tools button:last-child{border-bottom:0}.device-tools button:hover{color:#1769ff;background:#f4f8ff}.device-tools button.danger:hover{color:#ef4444;background:#fff6f6}.device-tools i{font-size:16px}.page-strip{width:92px;align-self:flex-start;margin-top:9px;display:flex;flex-direction:column;gap:12px;flex:0 0 auto}.page-thumb{border:1px solid #dce5f1;background:#fff;border-radius:8px;padding:6px;text-align:center;color:#64748b;font-size:10px;box-shadow:0 3px 12px rgba(68,91,120,.04)}.page-thumb.active{border-color:#2684ff;box-shadow:0 0 0 2px rgba(38,132,255,.08)}.thumb-preview{height:122px;background:#fff;border-radius:5px;overflow:hidden;padding:3px;border:1px solid #eef2f6}.thumb-preview img{width:100%;height:48px;object-fit:cover;border-radius:3px;display:block}.thumb-coupons,.thumb-cards{display:grid;gap:2px;margin-top:3px}.thumb-coupons{grid-template-columns:repeat(3,1fr)}.thumb-coupons i{height:14px;border-radius:2px;background:#ffe4df}.thumb-cards{grid-template-columns:1fr 1fr}.thumb-cards i{height:27px;border-radius:2px;background:#edf3fa}.thumb-form{height:18px;margin-top:3px;border-radius:2px;background:#e8f2ff}.page-thumb strong{display:block;margin-top:6px;font-weight:500;color:#46566a}.add-page{height:76px;border:1px dashed #c9d4e3;background:rgba(255,255,255,.78);border-radius:8px;color:#8b98a9;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;font-size:9px;cursor:pointer}.add-page:hover{border-color:#7aaeff;color:#1769ff;background:#f7faff}.add-page i{font-size:20px}@media(max-height:900px){.canvas-stage{align-items:flex-start;padding-top:14px}.page-strip{transform:scale(.92);transform-origin:top left}}@media(max-width:1500px){.page-strip{width:82px}.device-tools{width:44px}.device-tools button{width:44px;height:48px}.canvas-stage{gap:17px;padding-left:17px;padding-right:17px}}
</style>
