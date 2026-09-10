<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { ElButton, ElMessage, ElTabPane, ElTabs } from 'element-plus'
import { useEditorStore } from '@/stores/editor'
import { getComponentConfig } from '@/config/component-registry'
import PropsPanel from './panels/PropsPanel.vue'
import StylePanel from './panels/StylePanel.vue'
import AnimationPanel from './panels/AnimationPanel.vue'
import EventPanel from './panels/EventPanel.vue'

const editorStore = useEditorStore()
const activeTab = ref('content')
const imageInput = ref<HTMLInputElement | null>(null)
const assetName = ref('夏日活动主视觉.jpg')
const assetDimensions = ref('1125 × 632')
const assetSize = ref('图片素材')

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
  const value = String(selectedComponent.value?.styles?.margin || '0')
  const parts = value.trim().split(/\s+/)
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

function updateImageProp(key: string, value: string) {
  if (!selectedComponent.value) return
  editorStore.updateComponentProps(selectedComponent.value.id, { [key]: value })
}
function updateImageStyle(key: string, value: string | number) {
  if (!selectedComponent.value) return
  editorStore.updateComponentStyles(selectedComponent.value.id, { [key]: value })
}
function updateImageMargin(edge: 'top' | 'bottom', value: string) {
  if (!selectedComponent.value) return
  const numeric = Math.max(0, Number(value) || 0)
  const current = imageMargin.value
  const next = edge === 'top' ? { ...current, top: numeric } : { ...current, bottom: numeric }
  editorStore.updateComponentStyles(selectedComponent.value.id, { margin: `${next.top}px ${next.right}px ${next.bottom}px ${next.left}px` })
}
function updateImageOpacity(value: string) {
  updateImageStyle('opacity', Math.min(100, Math.max(0, Number(value) || 0)) / 100)
}
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
function handleDelete() { if (selectedComponent.value) editorStore.deleteComponent(selectedComponent.value.id) }
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
              <section>
                <div class="section-caption"><strong>图片设置</strong><i class="i-tabler-chevron-up" /></div>
                <div class="asset-row">
                  <img :src="selectedImageSrc" alt="当前图片">
                  <div class="asset-info"><strong>{{ assetName }}</strong><span>{{ assetDimensions }} · {{ assetSize }}</span><div class="asset-actions"><button @click="chooseImage"><i class="i-tabler-external-link" />更换图片</button><button @click="resetCrop"><i class="i-tabler-crop" />裁剪</button></div></div>
                </div>
              </section>

              <section>
                <div class="section-caption"><strong>链接设置</strong><i class="i-tabler-chevron-up" /></div>
                <label class="field-row"><span>跳转链接</span><select :value="imageLinkMode" @change="updateImageLink(($event.target as HTMLSelectElement).value)"><option value="navigate">自定义页面</option><option value="none">无跳转</option></select></label>
                <label v-if="imageLinkMode === 'navigate'" class="field-row"><span>选择页面</span><div class="link-target"><select :value="imageLinkTarget" @change="updateImageLink('navigate', ($event.target as HTMLSelectElement).value)"><option value="/activity-detail">活动详情页</option><option value="/goods">商品列表页</option><option value="/signup">报名页面</option></select><i class="i-tabler-external-link" /></div></label>
                <label class="field-row"><span>内容对齐</span><div class="align-group"><button :class="{ active: imageAlign === 'left' }" @click.prevent="updateImageStyle('textAlign','left')"><i class="i-tabler-align-left" /></button><button :class="{ active: imageAlign === 'center' }" @click.prevent="updateImageStyle('textAlign','center')"><i class="i-tabler-align-center" /></button><button :class="{ active: imageAlign === 'right' }" @click.prevent="updateImageStyle('textAlign','right')"><i class="i-tabler-align-right" /></button><button :class="{ active: imageObjectFit === 'fill' }" @click.prevent="updateImageProp('objectFit','fill')"><i class="i-tabler-align-justified" /></button></div></label>
              </section>

              <section>
                <div class="section-caption"><strong>样式</strong><i class="i-tabler-chevron-up" /></div>
                <div class="sub-caption">尺寸与位置</div>
                <div class="two-col">
                  <label class="field-row compact"><span>宽度</span><div class="unit-input"><input :value="imageWidth" type="number" min="1" max="100" @input="updateImageProp('width', `${($event.target as HTMLInputElement).value}%`)"><em>%</em></div></label>
                  <label class="field-row compact"><span>高度</span><div class="unit-input"><input :value="imageHeight" placeholder="自动" @change="updateImageProp('height', ($event.target as HTMLInputElement).value === 'auto' ? 'auto' : `${($event.target as HTMLInputElement).value.replace('px','')}px`)"><em v-if="imageHeight !== 'auto'">px</em></div></label>
                  <label class="field-row compact"><span>上边距</span><div class="unit-input"><input :value="imageMargin.top" type="number" min="0" @input="updateImageMargin('top', ($event.target as HTMLInputElement).value)"><em>px</em></div></label>
                  <label class="field-row compact"><span>下边距</span><div class="unit-input"><input :value="imageMargin.bottom" type="number" min="0" @input="updateImageMargin('bottom', ($event.target as HTMLInputElement).value)"><em>px</em></div></label>
                </div>
                <label class="field-row"><span>圆角</span><div class="radius-control"><div class="unit-input"><input :value="imageRadius" type="number" min="0" max="80" @input="updateImageProp('borderRadius', `${($event.target as HTMLInputElement).value}px`)"><em>px</em></div><button title="同步圆角"><i class="i-tabler-link" /></button></div></label>
                <label class="field-row"><span>图片位置</span><select :value="imageObjectPosition" @change="updateImageProp('objectPosition', ($event.target as HTMLSelectElement).value)"><option value="center center">居中</option><option value="center top">顶部</option><option value="center bottom">底部</option><option value="left center">左侧</option><option value="right center">右侧</option></select></label>
                <label class="field-row"><span>裁切方式</span><select :value="imageObjectFit" @change="updateImageProp('objectFit', ($event.target as HTMLSelectElement).value)"><option value="cover">填充裁切</option><option value="contain">完整显示</option><option value="fill">拉伸填充</option></select></label>
              </section>

              <section>
                <div class="sub-caption">背景</div>
                <label class="field-row"><span>背景颜色</span><div class="color-control"><input :value="imageBackground" type="color" @input="updateImageStyle('backgroundColor', ($event.target as HTMLInputElement).value)"><input :value="imageBackground" @change="updateImageStyle('backgroundColor', ($event.target as HTMLInputElement).value)"></div></label>
                <label class="field-row"><span>背景图片</span><button class="upload-bg" @click.prevent="chooseImage"><i class="i-tabler-plus" />上传背景图</button></label>
                <label class="field-row"><span>不透明度</span><div class="range-editor"><input :value="imageOpacity" type="range" min="0" max="100" @input="updateImageOpacity(($event.target as HTMLInputElement).value)"><div class="unit-input opacity-input"><input :value="imageOpacity" type="number" min="0" max="100" @input="updateImageOpacity(($event.target as HTMLInputElement).value)"><em>%</em></div></div></label>
              </section>

              <section class="advanced-content">
                <div class="section-caption compact"><strong>高级内容</strong><i class="i-tabler-chevron-down" /></div>
                <PropsPanel :component="selectedComponent" :config="componentConfig" @update-prop="debouncedUpdateProp" />
              </section>
            </template>

            <template v-else>
              <div class="selected-summary"><span class="summary-icon"><i :class="componentConfig.icon" /></span><div><strong>{{ componentConfig.name }}</strong><small>{{ selectedComponent.type }}</small></div><i class="i-tabler-chevron-right" /></div>
              <div class="section-caption"><strong>内容设置</strong><i class="i-tabler-chevron-up" /></div>
              <PropsPanel :component="selectedComponent" :config="componentConfig" @update-prop="debouncedUpdateProp" />
            </template>
          </div>

          <div v-else class="empty-state"><i class="i-tabler-cursor-text" /><strong>选择一个组件</strong><span>点击画布中的组件后，可在这里编辑内容与样式</span></div>
        </ElTabPane>

        <ElTabPane label="样式" name="style"><div v-if="selectedComponent" class="tab-body"><StylePanel :component="selectedComponent" @update-style="debouncedUpdateStyle" /></div><div v-else class="empty-state"><i class="i-tabler-adjustments" /><strong>样式设置</strong><span>选择组件后配置尺寸、间距、背景与边框</span></div></ElTabPane>
        <ElTabPane label="交互" name="interaction"><div v-if="selectedComponent" class="tab-body"><EventPanel :component="selectedComponent" @update-event="updateEvent" /><AnimationPanel :component="selectedComponent" @update-style="debouncedUpdateStyle" /></div><div v-else class="empty-state"><i class="i-tabler-pointer" /><strong>交互设置</strong><span>选择组件后配置点击、跳转与动画效果</span></div></ElTabPane>
        <ElTabPane label="数据" name="data"><div class="empty-state"><i class="i-tabler-database" /><strong>数据绑定</strong><span>连接商品、活动、表单与营销数据源</span><button>+ 添加数据源</button></div></ElTabPane>
      </ElTabs>
    </div>
    <div v-if="selectedComponent" class="panel-actions"><ElButton type="danger" plain @click="handleDelete"><i class="i-tabler-trash mr-4px" />删除组件</ElButton></div>
  </aside>
</template>

<style scoped>
.hidden-file{display:none}.property-panel{width:354px;min-width:354px;height:100%;display:flex;flex-direction:column;background:#fff;border-left:1px solid #e7edf4}.property-tabs-wrap{flex:1;min-height:0;overflow:hidden}.property-tabs{height:100%;display:flex;flex-direction:column}:deep(.el-tabs__header){margin:0;padding:0 13px;border-bottom:1px solid #edf1f6;background:#fff}:deep(.el-tabs__nav-wrap::after){display:none}:deep(.el-tabs__item){height:51px;font-size:12px;color:#53647a}:deep(.el-tabs__item.is-active){color:#1769ff;font-weight:700}:deep(.el-tabs__active-bar){height:2px;background:#1769ff}:deep(.el-tabs__content){flex:1;overflow:auto}:deep(.el-tab-pane){min-height:100%}.tab-body{padding:5px 16px 22px}.tab-body section{padding-bottom:12px;border-bottom:1px solid #edf1f5}.tab-body section:last-child{border-bottom:0}.selected-summary{height:52px;border-bottom:1px solid #edf1f5;display:grid;grid-template-columns:34px 1fr 16px;gap:9px;align-items:center}.summary-icon{width:32px;height:32px;border-radius:7px;background:#edf4ff;color:#1769ff;display:grid;place-items:center;font-size:17px}.selected-summary strong{display:block;font-size:12px;color:#26374d}.selected-summary small{display:block;margin-top:2px;font-size:9px;color:#9ca8b7}.selected-summary>i{color:#9eabba;font-size:12px}.section-caption{height:43px;display:flex;align-items:center;justify-content:space-between;color:#8290a2;font-size:11px}.section-caption strong{font-size:12px;color:#26364b}.section-caption.compact{height:34px}.sub-caption{height:27px;padding:6px 8px;margin:0 -4px 5px;border-radius:5px;background:#f5f7fa;color:#4f6075;font-size:10px;font-weight:650}.asset-row{display:grid;grid-template-columns:94px 1fr;gap:11px;align-items:start}.asset-row img{width:94px;height:63px;object-fit:cover;border-radius:6px;border:1px solid #e4eaf2}.asset-info{min-width:0}.asset-info>strong{display:block;font-size:10px;color:#314157;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.asset-info>span{display:block;margin:4px 0 8px;font-size:9px;color:#9aa6b5}.asset-actions{display:flex;gap:6px}.asset-actions button{height:27px;border:1px solid #dfe7f1;background:#fff;color:#56677d;border-radius:5px;padding:0 8px;font-size:9px;cursor:pointer;display:flex;align-items:center;gap:4px}.asset-actions button:hover{border-color:#91baff;color:#1769ff;background:#f7faff}.field-row{min-height:39px;display:grid;grid-template-columns:82px 1fr;align-items:center;gap:9px;font-size:10px;color:#64758a}.field-row.compact{grid-template-columns:47px 1fr}.field-row select,.field-row input{width:100%;height:30px;border:1px solid #dfe6ef;background:#fff;border-radius:5px;color:#35465b;padding:0 8px;font-size:10px;outline:0}.field-row select:focus,.field-row input:focus{border-color:#8eb9ff;box-shadow:0 0 0 2px rgba(23,105,255,.06)}.align-group{height:30px;display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #dfe6ef;border-radius:5px;overflow:hidden}.align-group button{border:0;border-right:1px solid #e7edf4;background:#fff;color:#7f8ea1;cursor:pointer}.align-group button:last-child{border-right:0}.align-group button.active{color:#1769ff;background:#edf4ff}.two-col{display:grid;grid-template-columns:1fr 1fr;column-gap:11px}.unit-input,.link-target,.color-control,.radius-control{position:relative}.unit-input em{position:absolute;right:8px;top:8px;font-style:normal;font-size:9px;color:#9aa6b5}.unit-input input{padding-right:26px}.link-target{display:grid;grid-template-columns:1fr 28px;gap:6px;align-items:center}.link-target>i{color:#7d8da1;font-size:14px}.radius-control{display:grid;grid-template-columns:1fr 31px;gap:6px}.radius-control button{height:30px;border:1px solid #dfe6ef;border-radius:5px;background:#fff;color:#61738a;cursor:pointer}.color-control{display:grid;grid-template-columns:31px 1fr;gap:6px}.color-control input[type='color']{padding:4px;cursor:pointer}.upload-bg{height:32px;border:1px dashed #cbd7e5;border-radius:6px;background:#fff;color:#66778c;font-size:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px}.upload-bg:hover{border-color:#8bb7ff;color:#1769ff;background:#f8fbff}.range-editor{display:grid;grid-template-columns:1fr 72px;gap:8px;align-items:center}.range-editor>input[type='range']{height:3px;padding:0;border:0;box-shadow:none;accent-color:#1769ff}.opacity-input input{padding-right:22px}.advanced-content{padding-top:2px}.advanced-content :deep(.el-form-item){margin-bottom:13px}.empty-state{height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#8b98a9;padding:30px}.empty-state i{font-size:36px;color:#8bbcff;margin-bottom:12px}.empty-state strong{color:#314257;font-size:13px}.empty-state span{font-size:10px;line-height:1.6;margin-top:6px;max-width:220px}.empty-state button{margin-top:14px;border:1px solid #8ab9ff;background:#f6faff;color:#1769ff;border-radius:7px;padding:7px 10px;font-size:10px;cursor:pointer}.panel-actions{padding:11px 15px;border-top:1px solid #edf1f5;background:#fff}.panel-actions :deep(.el-button){width:100%;border-radius:7px}
@media(min-width:1700px){.property-panel{width:420px;min-width:420px}.tab-body{padding-left:20px;padding-right:20px}.field-row{grid-template-columns:92px 1fr}.field-row.compact{grid-template-columns:50px 1fr}}
@media(max-width:1440px){.property-panel{width:320px;min-width:320px}.tab-body{padding-left:13px;padding-right:13px}.field-row{grid-template-columns:72px 1fr}}
</style>
