<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useEditorStore } from '@/stores/editor'
import PageRenderer from '@/components/renderer/PageRenderer.vue'
import { getAllComponents } from '@/config/component-registry'
import { createComponentSchema } from '@/utils/schema-generator'

const editorStore = useEditorStore()
const isDragOver = ref(false)
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
  <div class="canvas-shell">
    <div class="ruler ruler-x"><span v-for="n in 13" :key="n">{{ (n - 1) * 100 }}</span></div>
    <div class="ruler ruler-y"><span v-for="n in 10" :key="n">{{ (n - 1) * 100 }}</span></div>

    <div class="canvas-stage">
      <div class="preview-group">
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
      </div>
    </div>
  </div>
</template>

<style scoped>
.canvas-shell{flex:1;min-width:0;height:100%;position:relative;overflow:hidden;background:#f4f7fb;background-image:radial-gradient(circle,rgba(123,145,173,.14) 1px,transparent 1px);background-size:18px 18px}[data-theme='dark'] .canvas-shell{background-color:#20242b}.ruler{position:absolute;z-index:4;color:#a7b3c3;font-size:9px;pointer-events:none;background:rgba(248,250,253,.92);backdrop-filter:blur(8px)}.ruler-x{left:24px;right:0;top:0;height:24px;border-bottom:1px solid #e7edf4;display:flex;justify-content:space-around;align-items:center}.ruler-y{left:0;top:24px;bottom:0;width:24px;border-right:1px solid #e7edf4;display:flex;flex-direction:column;justify-content:space-around;align-items:center}.canvas-stage{position:absolute;inset:24px 0 0 24px;display:flex;align-items:center;justify-content:center;padding:18px 42px 26px;overflow:auto}.preview-group{display:flex;align-items:center;justify-content:center;gap:14px;min-width:max-content}.preview-viewport{display:flex;align-items:center;justify-content:center;flex:0 0 auto;transition:width .18s ease,height .18s ease}.phone-wrap{position:relative;display:flex;align-items:center;justify-content:center;transform:scale(var(--preview-scale));transform-origin:center center;transition:transform .18s ease}.phone-shadow{position:absolute;left:50%;bottom:-20px;width:320px;height:35px;transform:translateX(-50%);border-radius:50%;background:rgba(42,52,66,.18);filter:blur(20px)}.device-frame{width:var(--device-width);height:var(--device-height);padding:8px;border-radius:49px;background:linear-gradient(145deg,#121417 0%,#2a2d32 45%,#08090b 100%);box-shadow:0 28px 60px rgba(36,48,66,.28),0 0 0 1px #08090b,inset 0 0 0 1px rgba(255,255,255,.12);position:relative;transition:.18s ease}.device-frame::before,.device-frame::after{content:'';position:absolute;left:-3px;width:3px;background:#191b1f;border-radius:3px 0 0 3px}.device-frame::before{top:168px;height:63px}.device-frame::after{top:246px;height:43px}.device-frame.tablet{border-radius:31px;padding:7px;background:linear-gradient(145deg,#202328,#050607)}.device-frame.tablet::before,.device-frame.tablet::after{display:none}.device-frame.drag-over{box-shadow:0 0 0 4px rgba(23,105,255,.18),0 24px 58px rgba(23,105,255,.28)}.device-screen{width:100%;height:100%;overflow:hidden;border-radius:41px;background:#fff;position:relative;box-shadow:inset 0 0 0 1px rgba(0,0,0,.2)}.device-frame.tablet .device-screen{border-radius:24px}.notch{position:absolute;z-index:46;top:0;left:50%;transform:translateX(-50%);width:154px;height:29px;border-radius:0 0 18px 18px;background:#08090b;display:flex;align-items:center;justify-content:center;gap:9px;pointer-events:none}.speaker{width:48px;height:4px;border-radius:4px;background:#25282d}.camera{width:7px;height:7px;border-radius:50%;background:#101722;box-shadow:inset 0 0 0 2px #1c2736}.status-bar{position:absolute;left:0;right:0;top:0;height:39px;padding:11px 19px 0;display:flex;align-items:flex-start;justify-content:space-between;color:#17344c;font-size:10px;z-index:45;pointer-events:none;text-shadow:0 1px 1px rgba(255,255,255,.52)}.status-bar strong{padding-left:4px}.status-bar span{display:flex;gap:3px;align-items:center;font-size:12px}.status-bar.tablet{padding-left:22px;padding-right:22px}.page-content{width:100%;height:100%;overflow:auto;background:#fff;scrollbar-width:none}.page-content::-webkit-scrollbar{width:0;height:0}.drop-mask{position:absolute;inset:10px;z-index:48;border:2px dashed #3988ff;border-radius:32px;background:rgba(239,246,255,.9);backdrop-filter:blur(3px);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#1769ff;pointer-events:none}.drop-mask i{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:#1769ff;color:#fff;font-size:24px;box-shadow:0 8px 20px rgba(23,105,255,.22)}.drop-mask strong{font-size:13px;margin-top:12px}.drop-mask span{font-size:9px;color:#7192bd;margin-top:5px}.device-tools{width:48px;flex:0 0 48px;background:#fff;border:1px solid #e2e9f1;border-radius:9px;box-shadow:0 8px 24px rgba(45,66,94,.12);overflow:hidden;transition:opacity .12s ease,transform .12s ease}.device-tools.hidden{opacity:0;pointer-events:none;transform:translateX(-6px)}.device-tools button{width:48px;height:58px;border:0;border-bottom:1px solid #edf1f6;background:#fff;color:#65758a;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:9px;cursor:pointer;transition:.12s ease}.device-tools button:last-child{border-bottom:0}.device-tools button:hover:not(:disabled){background:#f3f7ff;color:#1769ff}.device-tools button.danger:hover{background:#fff4f4;color:#ef4444}.device-tools button:disabled{color:#c5ccd6;background:#fbfcfd;cursor:not-allowed}.device-tools i{font-size:16px}.device-tools span{line-height:1}@media(max-height:930px){.canvas-stage{align-items:flex-start;padding-top:14px}.phone-wrap{transform:scale(calc(var(--preview-scale) * .9));transform-origin:top center}.device-tools{margin-top:64px}}@media(max-width:1500px){.canvas-stage{padding-left:26px;padding-right:26px}.preview-group{gap:10px}.device-tools{width:44px;flex-basis:44px}.device-tools button{width:44px;height:52px}.device-frame{border-radius:45px}}@media(max-width:1320px){.canvas-stage{justify-content:flex-start;padding-left:18px}.phone-wrap{transform:scale(calc(var(--preview-scale) * .86));transform-origin:left center}.preview-viewport{width:calc(var(--device-width) * var(--preview-scale) * .86)!important}}
</style>
