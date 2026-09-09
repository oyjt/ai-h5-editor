<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { ElButton, ElEmpty, ElTabPane, ElTabs } from 'element-plus'
import { useEditorStore } from '@/stores/editor'
import { getComponentConfig } from '@/config/components'
import PropsPanel from './panels/PropsPanel.vue'
import StylePanel from './panels/StylePanel.vue'
import AnimationPanel from './panels/AnimationPanel.vue'
import EventPanel from './panels/EventPanel.vue'

const editorStore = useEditorStore()
const activeTab = ref('content')
const selectedComponent = computed(() => editorStore.selectedComponent)
const componentConfig = computed(() => selectedComponent.value ? getComponentConfig(selectedComponent.value.type) : null)

const debouncedUpdateProp = useDebounceFn((key: string, value: any) => {
  if (selectedComponent.value) editorStore.updateComponentProps(selectedComponent.value.id, { [key]: value })
}, 300)
const debouncedUpdateStyle = useDebounceFn((key: string, value: any) => {
  if (selectedComponent.value) editorStore.updateComponentStyles(selectedComponent.value.id, { [key]: value })
}, 300)

function updateEvent(key: string, value: any) {
  if (!selectedComponent.value) return
  const events = { ...selectedComponent.value.events }
  if (value === null || value === undefined) delete events[key]
  else events[key] = value
  editorStore.updateComponent(selectedComponent.value.id, { events })
}
function handleDelete() { if (selectedComponent.value) editorStore.deleteComponent(selectedComponent.value.id) }

watch(selectedComponent, async (next, prev) => {
  if (next?.id !== prev?.id) activeTab.value = 'content'
  if (!next) return
  await nextTick()
  document.querySelector(`[data-component-id="${next.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
})
</script>

<template>
  <aside class="property-panel">
    <div class="property-tabs-wrap">
      <ElTabs v-model="activeTab" class="property-tabs" stretch>
        <ElTabPane label="内容" name="content">
          <div v-if="selectedComponent && componentConfig" class="tab-body">
            <div class="section-caption"><strong>内容设置</strong><i class="i-tabler-chevron-up" /></div>
            <PropsPanel :component="selectedComponent" :config="componentConfig" @update-prop="debouncedUpdateProp" />
          </div>
          <div v-else class="demo-property">
            <section>
              <div class="section-caption"><strong>图片设置</strong><i class="i-tabler-chevron-up" /></div>
              <div class="asset-row"><img src="/marketing/summer-hero.svg" /><div><strong>夏日活动主视觉.svg</strong><span>750 × 420 · SVG</span><div class="asset-actions"><button>更换图片</button><button>裁剪</button></div></div></div>
            </section>
            <section>
              <div class="section-caption"><strong>链接设置</strong><i class="i-tabler-chevron-up" /></div>
              <label><span>跳转链接</span><select><option>自定义页面</option></select></label>
              <label><span>选择页面</span><select><option>活动详情页</option></select></label>
              <label><span>内容对齐</span><div class="align-group"><button><i class="i-tabler-align-left" /></button><button class="active"><i class="i-tabler-align-center" /></button><button><i class="i-tabler-align-right" /></button><button><i class="i-tabler-align-justified" /></button></div></label>
            </section>
          </div>
        </ElTabPane>

        <ElTabPane label="样式" name="style">
          <div v-if="selectedComponent" class="tab-body"><StylePanel :component="selectedComponent" @update-style="debouncedUpdateStyle" /></div>
          <div v-else class="demo-property style-demo">
            <section><div class="section-caption"><strong>尺寸与位置</strong><i class="i-tabler-chevron-up" /></div><div class="two-col"><label><span>宽度</span><input value="100%" /></label><label><span>高度</span><input value="自动" /></label><label><span>上边距</span><input value="0" /></label><label><span>下边距</span><input value="16" /></label></div><label><span>圆角</span><input value="12" /></label></section>
            <section><div class="section-caption"><strong>背景</strong><i class="i-tabler-chevron-up" /></div><label><span>背景颜色</span><input value="#FFFFFF" /></label><label><span>不透明度</span><input value="100%" /></label></section>
          </div>
        </ElTabPane>

        <ElTabPane label="交互" name="interaction">
          <div v-if="selectedComponent" class="tab-body"><EventPanel :component="selectedComponent" @update-event="updateEvent" /><AnimationPanel :component="selectedComponent" @update-style="debouncedUpdateStyle" /></div>
          <div v-else class="empty-state"><i class="i-tabler-pointer" /><strong>交互设置</strong><span>选择组件后配置点击、跳转与动画效果</span></div>
        </ElTabPane>

        <ElTabPane label="数据" name="data">
          <div class="empty-state"><i class="i-tabler-database" /><strong>数据绑定</strong><span>连接商品、活动、表单与营销数据源</span><button>+ 添加数据源</button></div>
        </ElTabPane>
      </ElTabs>
    </div>

    <div v-if="selectedComponent" class="panel-actions"><ElButton type="danger" plain @click="handleDelete"><i class="i-tabler-trash mr-4px" />删除组件</ElButton></div>
  </aside>
</template>

<style scoped>
.property-panel { width:354px; min-width:354px; height:100%; display:flex; flex-direction:column; background:var(--editor-bg-tertiary); border-left:1px solid var(--border-color); }
.property-tabs-wrap { flex:1; min-height:0; overflow:hidden; }
.property-tabs { height:100%; display:flex; flex-direction:column; }
:deep(.el-tabs__header){margin:0;padding:0 14px;border-bottom:1px solid var(--border-color);background:var(--editor-bg-tertiary)}
:deep(.el-tabs__nav-wrap::after){display:none}:deep(.el-tabs__item){height:50px;font-size:13px;color:var(--text-secondary)}:deep(.el-tabs__item.is-active){color:#1769ff;font-weight:650}:deep(.el-tabs__active-bar){height:2px;background:#1769ff}
:deep(.el-tabs__content){flex:1;overflow:auto}:deep(.el-tab-pane){min-height:100%}
.tab-body,.demo-property { padding:4px 17px 20px; }
.section-caption { height:42px; display:flex; align-items:center; justify-content:space-between; color:var(--text-secondary); font-size:12px; }.section-caption strong{font-size:13px;color:var(--text-primary)}
.demo-property section { padding-bottom:12px; border-bottom:1px solid var(--border-color); }.demo-property section:last-child{border-bottom:0}
.asset-row { display:grid;grid-template-columns:82px 1fr;gap:10px;align-items:start }.asset-row img{width:82px;height:58px;object-fit:cover;border-radius:7px;border:1px solid var(--border-color)}.asset-row>div>strong{display:block;font-size:11px;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.asset-row>div>span{display:block;margin:3px 0 7px;font-size:10px;color:var(--text-tertiary)}.asset-actions{display:flex;gap:5px}.asset-actions button{border:1px solid var(--border-color);background:transparent;color:var(--text-secondary);border-radius:6px;padding:4px 7px;font-size:10px;cursor:pointer}
.demo-property label { min-height:38px; display:grid;grid-template-columns:78px 1fr;align-items:center;gap:8px;font-size:11px;color:var(--text-secondary) }.demo-property select,.demo-property input{width:100%;height:30px;border:1px solid var(--border-color);background:var(--editor-bg-secondary);border-radius:6px;color:var(--text-primary);padding:0 8px;font-size:11px;outline:0}.align-group{height:30px;display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--border-color);border-radius:6px;overflow:hidden}.align-group button{border:0;border-right:1px solid var(--border-color);background:transparent;color:var(--text-tertiary)}.align-group button:last-child{border-right:0}.align-group button.active{color:#1769ff;background:rgba(23,105,255,.08)}
.two-col{display:grid;grid-template-columns:1fr 1fr;column-gap:10px}.two-col label{grid-template-columns:52px 1fr}
.empty-state { height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:var(--text-tertiary);padding:30px }.empty-state i{font-size:38px;color:#8bbcff;margin-bottom:12px}.empty-state strong{color:var(--text-primary);font-size:14px}.empty-state span{font-size:11px;line-height:1.6;margin-top:6px;max-width:220px}.empty-state button{margin-top:14px;border:1px solid #8ab9ff;background:rgba(23,105,255,.07);color:#1769ff;border-radius:7px;padding:7px 10px;font-size:11px;cursor:pointer}
.panel-actions { padding:12px 16px; border-top:1px solid var(--border-color); background:var(--editor-bg-tertiary) }.panel-actions :deep(.el-button){width:100%;border-radius:7px}
@media(max-width:1440px){.property-panel{width:320px;min-width:320px}}
</style>
