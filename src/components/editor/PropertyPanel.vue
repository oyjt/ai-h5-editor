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
const selectedComponent = computed(() => editorStore.selectedComponent)
const componentConfig = computed(() => selectedComponent.value ? getComponentConfig(selectedComponent.value.type) : null)
const isImageSelected = computed(() => selectedComponent.value?.type === 'image')
const marketingHeroUrl = `${import.meta.env.BASE_URL}marketing/summer-hero.jpg`
const selectedImageSrc = computed(() => String(selectedComponent.value?.props?.src || marketingHeroUrl))

const imageWidth = computed(() => String(selectedComponent.value?.props?.width || '100%').replace('%', ''))
const imageHeight = computed(() => String(selectedComponent.value?.props?.height || '246px').replace('px', ''))
const imageRadius = computed(() => String(selectedComponent.value?.props?.borderRadius || '11px').replace('px', ''))
const imageObjectFit = computed(() => String(selectedComponent.value?.props?.objectFit || 'cover'))
const imageOpacity = computed(() => Math.round(Number(selectedComponent.value?.styles?.opacity ?? 1) * 100))
const imageMargin = computed(() => {
  const value = String(selectedComponent.value?.styles?.margin || '0 10px 7px')
  const parts = value.trim().split(/\s+/)
  if (parts.length === 1) return { top: parseFloat(parts[0]) || 0, bottom: parseFloat(parts[0]) || 0 }
  if (parts.length === 2) return { top: parseFloat(parts[0]) || 0, bottom: parseFloat(parts[0]) || 0 }
  return { top: parseFloat(parts[0]) || 0, bottom: parseFloat(parts[2]) || 0 }
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

function updateImageMargin(edge: 'top' | 'bottom', value: string) {
  if (!selectedComponent.value) return
  const numeric = Math.max(0, Number(value) || 0)
  const current = imageMargin.value
  const next = edge === 'top' ? { ...current, top: numeric } : { ...current, bottom: numeric }
  editorStore.updateComponentStyles(selectedComponent.value.id, { margin: `${next.top}px 10px ${next.bottom}px` })
}

function updateImageOpacity(value: string) {
  if (!selectedComponent.value) return
  const numeric = Math.min(100, Math.max(0, Number(value) || 0))
  editorStore.updateComponentStyles(selectedComponent.value.id, { opacity: numeric / 100 })
}

function updateEvent(key: string, value: any) {
  if (!selectedComponent.value) return
  const events = { ...selectedComponent.value.events }
  if (value === null || value === undefined) delete events[key]
  else events[key] = value
  editorStore.updateComponent(selectedComponent.value.id, { events })
}

function handleDelete() {
  if (selectedComponent.value) editorStore.deleteComponent(selectedComponent.value.id)
}

function chooseImage() {
  imageInput.value?.click()
}

function handleImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !selectedComponent.value) return
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    editorStore.updateComponentProps(selectedComponent.value!.id, { src: String(reader.result) })
    ElMessage.success('图片已替换')
  }
  reader.readAsDataURL(file)
  ;(event.target as HTMLInputElement).value = ''
}

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
              <section class="image-settings">
                <div class="section-caption"><strong>图片设置</strong><i class="i-tabler-chevron-up" /></div>
                <div class="asset-row selected-asset">
                  <img :src="selectedImageSrc" alt="当前图片">
                  <div>
                    <strong>夏日活动主视觉.jpg</strong>
                    <span>1125 × 632 · 图片素材</span>
                    <div class="asset-actions">
                      <button @click="chooseImage"><i class="i-tabler-photo-edit" />更换图片</button>
                      <button @click="ElMessage.info('可通过裁切方式调整图片展示区域')"><i class="i-tabler-crop" />裁剪</button>
                    </div>
                  </div>
                </div>
              </section>

              <section class="image-link-settings">
                <div class="section-caption"><strong>链接设置</strong><i class="i-tabler-chevron-up" /></div>
                <label><span>跳转链接</span><select><option>自定义页面</option><option>无跳转</option></select></label>
                <label><span>选择页面</span><select><option>活动详情页</option><option>商品列表页</option></select></label>
                <label><span>内容对齐</span><div class="align-group"><button><i class="i-tabler-align-left" /></button><button class="active"><i class="i-tabler-align-center" /></button><button><i class="i-tabler-align-right" /></button><button><i class="i-tabler-align-justified" /></button></div></label>
              </section>

              <section class="image-style-settings">
                <div class="section-caption"><strong>样式</strong><i class="i-tabler-chevron-up" /></div>
                <div class="sub-caption">尺寸与位置</div>
                <div class="two-col">
                  <label><span>宽度</span><div class="unit-input"><input :value="imageWidth" type="number" min="1" max="100" @input="updateImageProp('width', `${($event.target as HTMLInputElement).value}%`)"><em>%</em></div></label>
                  <label><span>高度</span><div class="unit-input"><input :value="imageHeight" type="number" min="40" @input="updateImageProp('height', `${($event.target as HTMLInputElement).value}px`)"><em>px</em></div></label>
                  <label><span>上边距</span><div class="unit-input"><input :value="imageMargin.top" type="number" min="0" @input="updateImageMargin('top', ($event.target as HTMLInputElement).value)"><em>px</em></div></label>
                  <label><span>下边距</span><div class="unit-input"><input :value="imageMargin.bottom" type="number" min="0" @input="updateImageMargin('bottom', ($event.target as HTMLInputElement).value)"><em>px</em></div></label>
                </div>
                <label><span>圆角</span><div class="unit-input"><input :value="imageRadius" type="number" min="0" max="80" @input="updateImageProp('borderRadius', `${($event.target as HTMLInputElement).value}px`)"><em>px</em></div></label>
                <label><span>裁切方式</span><select :value="imageObjectFit" @change="updateImageProp('objectFit', ($event.target as HTMLSelectElement).value)"><option value="cover">填充裁切</option><option value="contain">完整显示</option><option value="fill">拉伸填充</option></select></label>
              </section>

              <section class="image-appearance-settings">
                <div class="sub-caption">显示</div>
                <label><span>不透明度</span><div class="range-editor"><input :value="imageOpacity" type="range" min="0" max="100" @input="updateImageOpacity(($event.target as HTMLInputElement).value)"><div class="unit-input"><input :value="imageOpacity" type="number" min="0" max="100" @input="updateImageOpacity(($event.target as HTMLInputElement).value)"><em>%</em></div></div></label>
              </section>

              <section class="advanced-content">
                <div class="section-caption compact"><strong>高级内容</strong><i class="i-tabler-chevron-down" /></div>
                <PropsPanel :component="selectedComponent" :config="componentConfig" @update-prop="debouncedUpdateProp" />
              </section>
            </template>

            <template v-else>
              <div class="selected-summary">
                <span class="summary-icon"><i :class="componentConfig.icon" /></span>
                <div><strong>{{ componentConfig.name }}</strong><small>{{ selectedComponent.type }}</small></div>
                <i class="i-tabler-chevron-right" />
              </div>
              <div class="section-caption"><strong>内容设置</strong><i class="i-tabler-chevron-up" /></div>
              <PropsPanel :component="selectedComponent" :config="componentConfig" @update-prop="debouncedUpdateProp" />
            </template>
          </div>

          <div v-else class="demo-property">
            <section>
              <div class="section-caption"><strong>图片设置</strong><i class="i-tabler-chevron-up" /></div>
              <div class="asset-row">
                <img :src="marketingHeroUrl" alt="夏日活动主视觉">
                <div><strong>夏日活动主视觉.jpg</strong><span>1125 × 632 · 245KB</span><div class="asset-actions"><button><i class="i-tabler-photo-edit" />更换图片</button><button><i class="i-tabler-crop" />裁剪</button></div></div>
              </div>
            </section>
            <section>
              <div class="section-caption"><strong>链接设置</strong><i class="i-tabler-chevron-up" /></div>
              <label><span>跳转链接</span><select><option>自定义页面</option></select></label>
              <label><span>选择页面</span><select><option>活动详情页</option></select></label>
              <label><span>内容对齐</span><div class="align-group"><button><i class="i-tabler-align-left" /></button><button class="active"><i class="i-tabler-align-center" /></button><button><i class="i-tabler-align-right" /></button><button><i class="i-tabler-align-justified" /></button></div></label>
            </section>
          </div>
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
.hidden-file{display:none}.property-panel{width:354px;min-width:354px;height:100%;display:flex;flex-direction:column;background:#fff;border-left:1px solid #e7edf4}.property-tabs-wrap{flex:1;min-height:0;overflow:hidden}.property-tabs{height:100%;display:flex;flex-direction:column}:deep(.el-tabs__header){margin:0;padding:0 13px;border-bottom:1px solid #edf1f6;background:#fff}:deep(.el-tabs__nav-wrap::after){display:none}:deep(.el-tabs__item){height:51px;font-size:12px;color:#53647a}:deep(.el-tabs__item.is-active){color:#1769ff;font-weight:700}:deep(.el-tabs__active-bar){height:2px;background:#1769ff}:deep(.el-tabs__content){flex:1;overflow:auto}:deep(.el-tab-pane){min-height:100%}.tab-body,.demo-property{padding:5px 16px 22px}.selected-summary{height:52px;border-bottom:1px solid #edf1f5;display:grid;grid-template-columns:34px 1fr 16px;gap:9px;align-items:center}.summary-icon{width:32px;height:32px;border-radius:7px;background:#edf4ff;color:#1769ff;display:grid;place-items:center;font-size:17px}.selected-summary strong{display:block;font-size:12px;color:#26374d}.selected-summary small{display:block;margin-top:2px;font-size:9px;color:#9ca8b7}.selected-summary>i{color:#9eabba;font-size:12px}.section-caption{height:43px;display:flex;align-items:center;justify-content:space-between;color:#8290a2;font-size:11px}.section-caption strong{font-size:12px;color:#26364b}.section-caption.compact{height:34px}.sub-caption{height:27px;padding:6px 8px;margin:0 -4px 5px;border-radius:5px;background:#f5f7fa;color:#4f6075;font-size:10px;font-weight:650}.demo-property section,.image-settings,.image-link-settings,.image-style-settings,.image-appearance-settings,.advanced-content{padding-bottom:11px;border-bottom:1px solid #edf1f5}.demo-property section:last-child,.advanced-content:last-child{border-bottom:0}.asset-row{display:grid;grid-template-columns:84px 1fr;gap:10px;align-items:start}.asset-row.selected-asset{padding-bottom:3px}.asset-row img{width:84px;height:57px;object-fit:cover;border-radius:6px;border:1px solid #e4eaf2}.asset-row>div>strong{display:block;font-size:10px;color:#314157;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.asset-row>div>span{display:block;margin:3px 0 7px;font-size:9px;color:#9aa6b5}.asset-actions{display:flex;gap:5px}.asset-actions button{height:25px;border:1px solid #dfe7f1;background:#fff;color:#56677d;border-radius:5px;padding:0 7px;font-size:9px;cursor:pointer;display:flex;align-items:center;gap:4px}.asset-actions button:hover{border-color:#91baff;color:#1769ff;background:#f7faff}.demo-property label,.image-link-settings label,.image-style-settings label,.image-appearance-settings label{min-height:37px;display:grid;grid-template-columns:76px 1fr;align-items:center;gap:8px;font-size:10px;color:#64758a}.demo-property select,.demo-property input,.image-link-settings select,.image-style-settings select,.image-style-settings input,.image-appearance-settings input[type='number']{width:100%;height:29px;border:1px solid #dfe6ef;background:#fff;border-radius:5px;color:#35465b;padding:0 8px;font-size:10px;outline:0}.demo-property select:focus,.demo-property input:focus,.image-link-settings select:focus,.image-style-settings select:focus,.image-style-settings input:focus,.image-appearance-settings input:focus{border-color:#8eb9ff;box-shadow:0 0 0 2px rgba(23,105,255,.06)}.align-group{height:29px;display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #dfe6ef;border-radius:5px;overflow:hidden}.align-group button{border:0;border-right:1px solid #e7edf4;background:#fff;color:#7f8ea1;cursor:pointer}.align-group button:last-child{border-right:0}.align-group button.active{color:#1769ff;background:#edf4ff}.two-col{display:grid;grid-template-columns:1fr 1fr;column-gap:10px}.two-col label{grid-template-columns:45px 1fr}.unit-input{position:relative}.unit-input em{position:absolute;right:8px;top:7px;font-style:normal;font-size:9px;color:#9aa6b5;pointer-events:none}.unit-input input{padding-right:23px}.range-editor{display:grid;grid-template-columns:1fr 72px;gap:8px;align-items:center}.range-editor>input[type='range']{appearance:none;height:3px;padding:0;border:0;border-radius:999px;background:#dce5f0;accent-color:#1769ff}.range-editor>input[type='range']::-webkit-slider-thumb{appearance:none;width:12px;height:12px;border:2px solid #1769ff;border-radius:50%;background:#fff;cursor:pointer}.advanced-content{padding-top:2px}.advanced-content :deep(.el-form-item){margin-bottom:13px}.empty-state{height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#8b98a9;padding:30px}.empty-state i{font-size:36px;color:#8bbcff;margin-bottom:12px}.empty-state strong{color:#314257;font-size:13px}.empty-state span{font-size:10px;line-height:1.6;margin-top:6px;max-width:220px}.empty-state button{margin-top:14px;border:1px solid #8ab9ff;background:#f6faff;color:#1769ff;border-radius:7px;padding:7px 10px;font-size:10px;cursor:pointer}.panel-actions{padding:11px 15px;border-top:1px solid #edf1f5;background:#fff}.panel-actions :deep(.el-button){width:100%;border-radius:7px}
@media(max-width:1440px){.property-panel{width:320px;min-width:320px}}
</style>