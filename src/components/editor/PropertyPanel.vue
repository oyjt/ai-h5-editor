<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { ElButton, ElMessage, ElMessageBox, ElTabPane, ElTabs } from 'element-plus'
import { useEditorStore } from '@/stores/editor'
import { getComponentConfig } from '@/config/component-registry'
import PropsPanel from './panels/PropsPanel.vue'
import StylePanel from './panels/StylePanel.vue'
import AnimationPanel from './panels/AnimationPanel.vue'
import EventPanel from './panels/EventPanel.vue'

const editorStore = useEditorStore()
const activeTab = ref<'content' | 'style' | 'interaction' | 'animation'>('content')
const imageInput = ref<HTMLInputElement | null>(null)
const assetName = ref('夏日活动主视觉.jpg')
const assetDimensions = ref('1125 × 632')
const assetSize = ref('图片素材')
const sections = ref<Record<string, boolean>>({ image: true, link: true, style: true, background: true, advanced: false })

const selectedComponent = computed(() => editorStore.selectedComponent)
const componentConfig = computed(() => selectedComponent.value ? getComponentConfig(selectedComponent.value.type) : null)
const isImageSelected = computed(() => selectedComponent.value?.type === 'image')
const marketingHeroUrl = `${import.meta.env.BASE_URL}marketing/summer-hero.jpg`
const selectedImageSrc = computed(() => String(selectedComponent.value?.props?.src || marketingHeroUrl))
const imageWidth = computed(() => String(selectedComponent.value?.props?.width || '100%').replace('%', ''))
const imageHeight = computed(() => String(selectedComponent.value?.props?.height || 'auto').replace('px', ''))
const imageRadius = computed(() => String(selectedComponent.value?.props?.borderRadius || '0').replace('px', ''))
const imageObjectFit = computed(() => String(selectedComponent.value?.props?.objectFit || 'cover'))
const imageObjectPosition = computed(() => String(selectedComponent.value?.props?.objectPosition || 'center center'))
const imageOpacity = computed(() => Math.round(Number(selectedComponent.value?.styles?.opacity ?? 1) * 100))
const imageBackground = computed(() => String(selectedComponent.value?.styles?.backgroundColor || '#FFFFFF'))
const imageAlign = computed(() => String(selectedComponent.value?.styles?.textAlign || 'center'))
const imageLinkMode = computed(() => selectedComponent.value?.events?.clickAction?.type === 'navigate' ? 'navigate' : 'none')
const imageLinkTarget = computed(() => String(selectedComponent.value?.events?.clickAction?.url || '/activity-detail'))
const imageMargin = computed(() => {
  const parts = String(selectedComponent.value?.styles?.margin || '0').trim().split(/\s+/)
  if (parts.length === 1) return { top: parseFloat(parts[0]) || 0, right: 0, bottom: parseFloat(parts[0]) || 0, left: 0 }
  if (parts.length === 2) return { top: parseFloat(parts[0]) || 0, right: parseFloat(parts[1]) || 0, bottom: parseFloat(parts[0]) || 0, left: parseFloat(parts[1]) || 0 }
  if (parts.length === 3) return { top: parseFloat(parts[0]) || 0, right: parseFloat(parts[1]) || 0, bottom: parseFloat(parts[2]) || 0, left: parseFloat(parts[1]) || 0 }
  return { top: parseFloat(parts[0]) || 0, right: parseFloat(parts[1]) || 0, bottom: parseFloat(parts[2]) || 0, left: parseFloat(parts[3]) || 0 }
})

const debouncedUpdateProp = useDebounceFn((key: string, value: any) => {
  if (selectedComponent.value) editorStore.updateComponentProps(selectedComponent.value.id, { [key]: value })
}, 120)
const debouncedUpdateStyle = useDebounceFn((key: string, value: any) => {
  if (selectedComponent.value) editorStore.updateComponentStyles(selectedComponent.value.id, { [key]: value })
}, 120)

function toggleSection(key: string) { sections.value[key] = !sections.value[key] }
function updateImageProp(key: string, value: string) { if (selectedComponent.value) editorStore.updateComponentProps(selectedComponent.value.id, { [key]: value }) }
function updateImageStyle(key: string, value: string | number) { if (selectedComponent.value) editorStore.updateComponentStyles(selectedComponent.value.id, { [key]: value }) }
function updateImageMargin(edge: 'top' | 'bottom', value: string) {
  if (!selectedComponent.value) return
  const numeric = Math.max(0, Number(value) || 0)
  const current = imageMargin.value
  const next = edge === 'top' ? { ...current, top: numeric } : { ...current, bottom: numeric }
  editorStore.updateComponentStyles(selectedComponent.value.id, { margin: `${next.top}px ${next.right}px ${next.bottom}px ${next.left}px` })
}
function updateImageOpacity(value: string) { updateImageStyle('opacity', Math.min(100, Math.max(0, Number(value) || 0)) / 100) }
function updateImageLink(mode: string, target = imageLinkTarget.value) {
  if (!selectedComponent.value) return
  const events = { ...selectedComponent.value.events }
  if (mode === 'navigate') events.clickAction = { type: 'navigate', url: target }
  else delete events.clickAction
  editorStore.updateComponent(selectedComponent.value.id, { events })
}
function updateEvent(key: string, value: any) {
  if (!selectedComponent.value) return
  const events = { ...selectedComponent.value.events }
  if (value === null || value === undefined) delete events[key]
  else events[key] = value
  editorStore.updateComponent(selectedComponent.value.id, { events })
}
async function handleDelete() {
  if (!selectedComponent.value) return
  try {
    await ElMessageBox.confirm('删除后可通过撤销恢复，确定删除当前组件吗？', '删除组件', { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消', confirmButtonClass: 'el-button--danger' })
    editorStore.deleteComponent(selectedComponent.value.id)
    ElMessage.success('组件已删除')
  }
  catch {}
}
function chooseImage() { imageInput.value?.click() }
function resetCrop() {
  if (!selectedComponent.value) return
  editorStore.updateComponentProps(selectedComponent.value.id, { objectFit: 'cover', objectPosition: 'center center' })
  ElMessage.success('已重置裁切区域')
}
function handleImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !selectedComponent.value) return
  if (!file.type.startsWith('image/')) return ElMessage.error('请选择图片文件')
  if (file.size > 10 * 1024 * 1024) return ElMessage.error('图片不能超过 10MB')
  const reader = new FileReader()
  reader.onload = () => {
    const src = String(reader.result)
    const image = new Image()
    image.onload = () => { assetDimensions.value = `${image.naturalWidth} × ${image.naturalHeight}` }
    image.src = src
    assetName.value = file.name
    assetSize.value = `${(file.size / 1024).toFixed(file.size > 1024 * 1024 ? 0 : 1)}KB`
    editorStore.updateComponentProps(selectedComponent.value!.id, { src, alt: file.name })
    ElMessage.success('图片已替换')
  }
  reader.readAsDataURL(file)
  ;(event.target as HTMLInputElement).value = ''
}
function refreshAssetMeta(src: string) {
  if (!src) return
  if (!src.startsWith('data:')) {
    const clean = src.split('?')[0]
    assetName.value = decodeURIComponent(clean.split('/').pop() || '图片素材')
    assetSize.value = '图片素材'
  }
  const image = new Image()
  image.onload = () => { assetDimensions.value = `${image.naturalWidth} × ${image.naturalHeight}` }
  image.src = src
}

watch(selectedImageSrc, refreshAssetMeta, { immediate: true })
watch(selectedComponent, async (next, prev) => {
  if (next?.id !== prev?.id) activeTab.value = 'content'
  if (!next) return
  await nextTick()
  document.querySelector(`[data-component-id="${next.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
})
</script>

<template>
  <aside class="property-panel">
    <input ref="imageInput" class="hidden-file" type="file" accept="image/*" @change="handleImageChange">
    <div class="property-tabs-wrap">
      <ElTabs v-model="activeTab" class="property-tabs" stretch>
        <ElTabPane label="内容" name="content">
          <div v-if="selectedComponent && componentConfig" class="tab-body">
            <template v-if="isImageSelected">
              <section class="setting-section">
                <button class="section-caption" @click="toggleSection('image')"><strong>图片设置</strong><i :class="sections.image ? 'i-tabler-chevron-up' : 'i-tabler-chevron-down'" /></button>
                <div v-show="sections.image" class="section-content">
                  <div class="asset-row"><img :src="selectedImageSrc" alt="当前图片"><div class="asset-info"><strong>{{ assetName }}</strong><span>{{ assetDimensions }} · {{ assetSize }}</span><div class="asset-actions"><button @click="chooseImage"><i class="i-tabler-replace" />更换图片</button><button @click="resetCrop"><i class="i-tabler-crop" />裁剪</button></div></div></div>
                </div>
              </section>

              <section class="setting-section">
                <button class="section-caption" @click="toggleSection('link')"><strong>链接设置</strong><i :class="sections.link ? 'i-tabler-chevron-up' : 'i-tabler-chevron-down'" /></button>
                <div v-show="sections.link" class="section-content">
                  <label class="field-row"><span>跳转链接</span><select :value="imageLinkMode" @change="updateImageLink(($event.target as HTMLSelectElement).value)"><option value="navigate">自定义页面</option><option value="none">无跳转</option></select></label>
                  <label v-if="imageLinkMode === 'navigate'" class="field-row"><span>选择页面</span><select :value="imageLinkTarget" @change="updateImageLink('navigate', ($event.target as HTMLSelectElement).value)"><option value="/activity-detail">活动详情页</option><option value="/goods">商品列表页</option><option value="/signup">报名页面</option></select></label>
                  <label class="field-row"><span>内容对齐</span><div class="align-group"><button :class="{ active: imageAlign === 'left' }" @click.prevent="updateImageStyle('textAlign','left')"><i class="i-tabler-align-left" /></button><button :class="{ active: imageAlign === 'center' }" @click.prevent="updateImageStyle('textAlign','center')"><i class="i-tabler-align-center" /></button><button :class="{ active: imageAlign === 'right' }" @click.prevent="updateImageStyle('textAlign','right')"><i class="i-tabler-align-right" /></button><button :class="{ active: imageObjectFit === 'fill' }" @click.prevent="updateImageProp('objectFit','fill')"><i class="i-tabler-align-justified" /></button></div></label>
                </div>
              </section>

              <section class="setting-section">
                <button class="section-caption" @click="toggleSection('style')"><strong>样式设置</strong><i :class="sections.style ? 'i-tabler-chevron-up' : 'i-tabler-chevron-down'" /></button>
                <div v-show="sections.style" class="section-content">
                  <div class="sub-caption">尺寸与位置</div>
                  <div class="two-col"><label class="field-row compact"><span>宽度</span><div class="unit-input"><input :value="imageWidth" type="number" min="1" max="100" @input="updateImageProp('width', `${($event.target as HTMLInputElement).value}%`)"><em>%</em></div></label><label class="field-row compact"><span>高度</span><div class="unit-input"><input :value="imageHeight" placeholder="自动" @change="updateImageProp('height', ($event.target as HTMLInputElement).value === 'auto' ? 'auto' : `${($event.target as HTMLInputElement).value.replace('px','')}px`)"><em v-if="imageHeight !== 'auto'">px</em></div></label><label class="field-row compact"><span>上边距</span><div class="unit-input"><input :value="imageMargin.top" type="number" min="0" @input="updateImageMargin('top', ($event.target as HTMLInputElement).value)"><em>px</em></div></label><label class="field-row compact"><span>下边距</span><div class="unit-input"><input :value="imageMargin.bottom" type="number" min="0" @input="updateImageMargin('bottom', ($event.target as HTMLInputElement).value)"><em>px</em></div></label></div>
                  <label class="field-row"><span>圆角</span><div class="unit-input"><input :value="imageRadius" type="number" min="0" max="80" @input="updateImageProp('borderRadius', `${($event.target as HTMLInputElement).value}px`)"><em>px</em></div></label>
                  <label class="field-row"><span>图片位置</span><select :value="imageObjectPosition" @change="updateImageProp('objectPosition', ($event.target as HTMLSelectElement).value)"><option value="center center">居中</option><option value="center top">顶部</option><option value="center bottom">底部</option><option value="left center">左侧</option><option value="right center">右侧</option></select></label>
                  <label class="field-row"><span>裁切方式</span><select :value="imageObjectFit" @change="updateImageProp('objectFit', ($event.target as HTMLSelectElement).value)"><option value="cover">填充裁切</option><option value="contain">完整显示</option><option value="fill">拉伸填充</option></select></label>
                </div>
              </section>

              <section class="setting-section">
                <button class="section-caption" @click="toggleSection('background')"><strong>背景设置</strong><i :class="sections.background ? 'i-tabler-chevron-up' : 'i-tabler-chevron-down'" /></button>
                <div v-show="sections.background" class="section-content"><label class="field-row"><span>背景颜色</span><div class="color-control"><input :value="imageBackground" type="color" @input="updateImageStyle('backgroundColor', ($event.target as HTMLInputElement).value)"><input :value="imageBackground" @change="updateImageStyle('backgroundColor', ($event.target as HTMLInputElement).value)"></div></label><label class="field-row"><span>背景图片</span><button class="upload-bg" @click.prevent="chooseImage"><i class="i-tabler-plus" />上传背景图</button></label><label class="field-row"><span>不透明度</span><div class="range-editor"><input :value="imageOpacity" type="range" min="0" max="100" @input="updateImageOpacity(($event.target as HTMLInputElement).value)"><div class="unit-input opacity-input"><input :value="imageOpacity" type="number" min="0" max="100" @input="updateImageOpacity(($event.target as HTMLInputElement).value)"><em>%</em></div></div></label></div>
              </section>

              <section class="setting-section advanced-content">
                <button class="section-caption compact" @click="toggleSection('advanced')"><strong>高级内容</strong><i :class="sections.advanced ? 'i-tabler-chevron-up' : 'i-tabler-chevron-down'" /></button>
                <div v-show="sections.advanced" class="section-content"><PropsPanel :component="selectedComponent" :config="componentConfig" @update-prop="debouncedUpdateProp" /></div>
              </section>
            </template>

            <template v-else>
              <div class="selected-summary"><span class="summary-icon"><i :class="componentConfig.icon" /></span><div><strong>{{ componentConfig.name }}</strong><small>{{ selectedComponent.type }}</small></div><i class="i-tabler-chevron-right" /></div>
              <section class="setting-section"><div class="section-caption static"><strong>内容设置</strong></div><div class="section-content"><PropsPanel :component="selectedComponent" :config="componentConfig" @update-prop="debouncedUpdateProp" /></div></section>
            </template>
          </div>
          <div v-else class="empty-state"><i class="i-tabler-cursor-text" /><strong>选择一个组件</strong><span>点击画布中的组件后，可在这里编辑内容与样式</span></div>
        </ElTabPane>
        <ElTabPane label="样式" name="style"><div v-if="selectedComponent" class="tab-body generic"><StylePanel :component="selectedComponent" @update-style="debouncedUpdateStyle" /></div><div v-else class="empty-state"><i class="i-tabler-adjustments" /><strong>样式设置</strong><span>选择组件后配置尺寸、间距、背景与边框</span></div></ElTabPane>
        <ElTabPane label="交互" name="interaction"><div v-if="selectedComponent" class="tab-body generic"><EventPanel :component="selectedComponent" @update-event="updateEvent" /></div><div v-else class="empty-state"><i class="i-tabler-pointer" /><strong>交互设置</strong><span>选择组件后配置点击、跳转与行为</span></div></ElTabPane>
        <ElTabPane label="动画" name="animation"><div v-if="selectedComponent" class="tab-body generic"><AnimationPanel :component="selectedComponent" @update-style="debouncedUpdateStyle" /></div><div v-else class="empty-state"><i class="i-tabler-sparkles" /><strong>动画设置</strong><span>选择组件后设置入场与强调动画</span></div></ElTabPane>
      </ElTabs>
    </div>
    <div v-if="selectedComponent" class="panel-actions"><ElButton type="danger" plain @click="handleDelete"><i class="i-tabler-trash mr-4px" />删除组件</ElButton></div>
  </aside>
</template>

<style scoped>
.hidden-file{display:none}.property-panel{width:var(--property-panel-width);min-width:var(--property-panel-width);height:100%;display:flex;flex-direction:column;background:var(--surface-1);border-left:1px solid var(--border-subtle);color:var(--text-primary)}.property-tabs-wrap{flex:1;min-height:0;overflow:hidden}.property-tabs{height:100%;display:flex;flex-direction:column}:deep(.el-tabs__header){margin:0;padding:0 12px;border-bottom:1px solid var(--border-subtle);background:var(--surface-1)}:deep(.el-tabs__nav-wrap::after){display:none}:deep(.el-tabs__item){height:var(--tab-height);font-size:var(--font-size-md);color:var(--text-secondary)}:deep(.el-tabs__item.is-active){color:var(--brand-600);font-weight:var(--font-weight-semibold)}:deep(.el-tabs__active-bar){height:2px;background:var(--brand-600)}:deep(.el-tabs__content){flex:1;overflow:auto}:deep(.el-tab-pane){min-height:100%}.tab-body{padding:8px 16px 22px}.tab-body.generic{padding-top:16px}.setting-section{border-bottom:1px solid var(--border-subtle)}.setting-section:last-child{border-bottom:0}.section-caption{width:100%;height:44px;padding:0;border:0;background:transparent;display:flex;align-items:center;justify-content:space-between;color:var(--text-muted);cursor:pointer}.section-caption.static{cursor:default}.section-caption strong{font-size:var(--font-size-md);font-weight:var(--font-weight-semibold);color:var(--text-primary)}.section-caption i{font-size:12px;transition:transform var(--motion-base) var(--ease-standard)}.section-caption:hover strong,.section-caption:hover i{color:var(--brand-600)}.section-caption.compact{height:38px}.section-content{padding-bottom:14px}.selected-summary{height:56px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--surface-2);display:grid;grid-template-columns:34px 1fr 16px;gap:9px;align-items:center;padding:0 10px;margin:4px 0 8px}.summary-icon{width:32px;height:32px;border-radius:var(--radius-sm);background:var(--brand-100);color:var(--brand-600);display:grid;place-items:center;font-size:17px}.selected-summary strong{display:block;font-size:var(--font-size-md);color:var(--text-primary)}.selected-summary small{display:block;margin-top:2px;font-size:var(--font-size-xs);color:var(--text-muted)}.selected-summary>i{color:var(--text-muted);font-size:12px}.sub-caption{height:28px;padding:6px 8px;margin:0 -4px 6px;border-radius:var(--radius-sm);background:var(--surface-3);color:var(--text-secondary);font-size:var(--font-size-xs);font-weight:var(--font-weight-semibold)}.asset-row{display:grid;grid-template-columns:94px 1fr;gap:11px;align-items:start}.asset-row img{width:94px;height:63px;object-fit:cover;border-radius:var(--radius-sm);border:1px solid var(--border-default);background:var(--surface-2)}.asset-info{min-width:0}.asset-info>strong{display:block;font-size:var(--font-size-xs);color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.asset-info>span{display:block;margin:4px 0 8px;font-size:9px;color:var(--text-muted)}.asset-actions{display:flex;gap:6px}.asset-actions button,.upload-bg{min-height:var(--control-height-sm);border:1px solid var(--border-default);background:var(--surface-1);color:var(--text-secondary);border-radius:var(--radius-sm);padding:0 8px;font-size:var(--font-size-xs);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;transition:all var(--motion-base) var(--ease-standard)}.asset-actions button:hover,.upload-bg:hover{border-color:var(--border-brand);color:var(--brand-600);background:var(--brand-50)}.field-row{min-height:42px;display:grid;grid-template-columns:82px 1fr;align-items:center;gap:9px;font-size:var(--font-size-xs);color:var(--text-secondary)}.field-row.compact{grid-template-columns:48px 1fr}.field-row select,.field-row input{width:100%;height:var(--control-height-md);border:1px solid var(--border-default);background:var(--surface-1);border-radius:var(--radius-md);color:var(--text-primary);padding:0 9px;font-size:var(--font-size-xs);outline:0;transition:border-color var(--motion-fast),box-shadow var(--motion-fast)}.field-row select:hover,.field-row input:hover{border-color:var(--border-brand)}.field-row select:focus,.field-row input:focus{border-color:var(--brand-500);box-shadow:var(--focus-ring)}.align-group{height:var(--control-height-md);display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--border-default);border-radius:var(--radius-md);overflow:hidden}.align-group button{border:0;border-right:1px solid var(--border-subtle);background:var(--surface-1);color:var(--text-muted);cursor:pointer;transition:all var(--motion-fast)}.align-group button:last-child{border-right:0}.align-group button:hover{background:var(--surface-2);color:var(--brand-600)}.align-group button.active{color:var(--brand-600);background:var(--brand-100)}.two-col{display:grid;grid-template-columns:1fr 1fr;column-gap:11px}.unit-input,.color-control{position:relative}.unit-input em{position:absolute;right:8px;top:10px;font-style:normal;font-size:9px;color:var(--text-muted)}.unit-input input{padding-right:26px}.color-control{display:grid;grid-template-columns:34px 1fr;gap:6px}.color-control input[type='color']{padding:4px;cursor:pointer}.upload-bg{width:100%;border-style:dashed}.range-editor{display:grid;grid-template-columns:1fr 72px;gap:8px;align-items:center}.range-editor>input[type='range']{height:3px;padding:0;border:0;box-shadow:none;accent-color:var(--brand-600)}.opacity-input input{padding-right:22px}.advanced-content :deep(.el-form-item){margin-bottom:13px}.empty-state{height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:var(--text-muted);padding:30px}.empty-state i{font-size:36px;color:var(--brand-300);margin-bottom:12px}.empty-state strong{color:var(--text-primary);font-size:var(--font-size-base)}.empty-state span{font-size:var(--font-size-xs);line-height:1.6;margin-top:6px;max-width:220px}.panel-actions{padding:11px 15px;border-top:1px solid var(--border-subtle);background:var(--surface-1)}.panel-actions :deep(.el-button){width:100%;border-radius:var(--radius-md)}
@media(min-width:1700px){.property-panel{--property-panel-width:420px}.tab-body{padding-left:20px;padding-right:20px}.field-row{grid-template-columns:92px 1fr}}
@media(max-width:1440px){.property-panel{--property-panel-width:320px}.tab-body{padding-left:13px;padding-right:13px}.field-row{grid-template-columns:72px 1fr}}
</style>
