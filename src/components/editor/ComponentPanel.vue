<script setup lang="ts">
import { computed, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { ElMessage } from 'element-plus'
import { ComponentCategory } from '@/types/component'
import { getAllComponents } from '@/config/components'
import { useEditorStore } from '@/stores/editor'
import { createComponentSchema } from '@/utils/schema-generator'

const editorStore = useEditorStore()
const activeRail = ref('components')
const activeTab = ref<'components' | 'pages' | 'templates'>('components')
const keyword = ref('')

const basicTypes = ['image', 'swiper', 'text', 'button', 'card', 'divider', 'input', 'countdown', 'notice', 'grid', 'tabbar', 'nav-bar']
const marketingTypes = ['badge', 'progress', 'steps', 'action-bar', 'tag', 'popover']

const allComponents = computed(() => getAllComponents())
const filteredComponents = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  return q ? allComponents.value.filter(item => item.name.toLowerCase().includes(q) || item.type.toLowerCase().includes(q)) : allComponents.value
})
const basicComponents = computed(() => basicTypes.map(type => filteredComponents.value.find(item => item.type === type)).filter(Boolean) as any[])
const marketingComponents = computed(() => marketingTypes.map(type => filteredComponents.value.find(item => item.type === type)).filter(Boolean) as any[])
const extraComponents = computed(() => filteredComponents.value.filter(item => !basicTypes.includes(item.type) && !marketingTypes.includes(item.type)))

function handleAddComponent(type: string) {
  const config = getAllComponents().find(item => item.type === type)
  if (!config) return ElMessage.error('组件配置不存在')
  editorStore.addComponent(createComponentSchema(type, { ...config.defaultProps }, { ...config.defaultStyles }))
  ElMessage.success(`已添加 ${config.name}`)
}

function handleClone(original: any) {
  const config = getAllComponents().find(item => item.type === original.type)
  return config ? createComponentSchema(original.type, { ...config.defaultProps }, { ...config.defaultStyles }) : null
}

function getComponentName(type: string) {
  return getAllComponents().find(item => item.type === type)?.name || type
}

function chooseRail(value: string) {
  activeRail.value = value
  if (value === 'components') activeTab.value = 'components'
  if (value === 'pages') activeTab.value = 'pages'
}
</script>

<template>
  <aside class="left-workspace">
    <div class="left-rail">
      <button :class="{ active: activeRail === 'components' }" @click="chooseRail('components')"><i class="i-tabler-layout-grid" /><span>组件</span></button>
      <button :class="{ active: activeRail === 'pages' }" @click="chooseRail('pages')"><i class="i-tabler-file-text" /><span>页面</span></button>
      <button :class="{ active: activeRail === 'assets' }" @click="activeRail = 'assets'"><i class="i-tabler-photo" /><span>素材</span></button>
      <button :class="{ active: activeRail === 'icons' }" @click="activeRail = 'icons'"><i class="i-tabler-icons" /><span>图标</span></button>
      <button class="rail-bottom"><i class="i-tabler-user-circle" /><span>我的</span></button>
    </div>

    <div class="library-panel">
      <div class="panel-tabs">
        <button :class="{ active: activeTab === 'components' }" @click="activeTab = 'components'">组件</button>
        <button :class="{ active: activeTab === 'pages' }" @click="activeTab = 'pages'">页面</button>
        <button :class="{ active: activeTab === 'templates' }" @click="activeTab = 'templates'">模板</button>
      </div>

      <template v-if="activeTab === 'components'">
        <label class="search-box"><i class="i-tabler-search" /><input v-model="keyword" placeholder="搜索组件名称" /></label>
        <div class="library-scroll">
          <section class="component-section">
            <div class="section-title"><strong>基础组件</strong><i class="i-tabler-chevron-up" /></div>
            <VueDraggable :model-value="basicComponents" :group="{ name: 'components', pull: 'clone', put: false }" :clone="handleClone" :sort="false" item-key="type" class="component-grid">
              <button v-for="comp in basicComponents" :key="comp.type" class="component-card" @click="handleAddComponent(comp.type)">
                <i :class="comp.icon" /><span>{{ comp.name }}</span>
              </button>
            </VueDraggable>
          </section>

          <section v-if="marketingComponents.length" class="component-section">
            <div class="section-title"><strong>营销组件</strong><span>更多 <i class="i-tabler-chevron-right" /></span></div>
            <VueDraggable :model-value="marketingComponents" :group="{ name: 'components', pull: 'clone', put: false }" :clone="handleClone" :sort="false" item-key="type" class="component-grid">
              <button v-for="comp in marketingComponents" :key="comp.type" class="component-card marketing" @click="handleAddComponent(comp.type)">
                <i :class="comp.icon" /><span>{{ comp.name }}</span>
              </button>
            </VueDraggable>
          </section>

          <section v-if="extraComponents.length" class="component-section compact-section">
            <div class="section-title"><strong>更多组件</strong><span>{{ extraComponents.length }}</span></div>
            <div class="chip-list">
              <button v-for="comp in extraComponents" :key="comp.type" @click="handleAddComponent(comp.type)"><i :class="comp.icon" />{{ comp.name }}</button>
            </div>
          </section>

          <section class="page-tree-section">
            <div class="section-title"><strong>页面结构</strong><button><i class="i-tabler-plus" /></button></div>
            <div class="tree-root"><i class="i-tabler-chevron-down" /><i class="i-tabler-file" /><span>页面：首页</span></div>
            <div v-if="editorStore.currentPage.components.length" class="tree-children">
              <button v-for="component in editorStore.currentPage.components" :key="component.id" :class="{ active: editorStore.selectedComponentId === component.id }" @click="editorStore.selectComponent(component.id)">
                <i class="i-tabler-components" /><span>{{ getComponentName(component.type) }}</span>
              </button>
            </div>
            <div v-else class="tree-children demo-tree">
              <span>顶部视觉</span><span>优惠券模块</span><span>商品推荐</span><span>报名表单</span><span>底部导航</span>
            </div>
          </section>
        </div>
      </template>

      <div v-else-if="activeTab === 'pages'" class="empty-tab"><i class="i-tabler-files" /><strong>页面管理</strong><p>当前项目包含 1 个营销页面</p><button>+ 新增页面</button></div>
      <div v-else class="empty-tab"><i class="i-tabler-template" /><strong>营销模板</strong><p>从高转化模板快速开始</p><button>浏览模板中心</button></div>
    </div>
  </aside>
</template>

<style scoped>
.left-workspace { width:392px; min-width:392px; height:100%; display:flex; background:var(--editor-bg-tertiary); border-right:1px solid var(--border-color); }
.left-rail { width:66px; border-right:1px solid var(--border-color); display:flex; flex-direction:column; align-items:stretch; padding:10px 7px; gap:4px; background:var(--editor-bg-secondary); }
.left-rail button { height:58px; border:0; border-radius:10px; background:transparent; color:var(--text-tertiary); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; font-size:11px; cursor:pointer; }
.left-rail button i { font-size:20px; }
.left-rail button.active { color:#1769ff; background:rgba(23,105,255,.09); }
.left-rail .rail-bottom { margin-top:auto; }
.library-panel { width:326px; min-width:0; display:flex; flex-direction:column; overflow:hidden; }
.panel-tabs { height:50px; padding:0 18px; border-bottom:1px solid var(--border-color); display:flex; gap:26px; align-items:flex-end; }
.panel-tabs button { height:50px; border:0; border-bottom:2px solid transparent; background:transparent; color:var(--text-secondary); font-size:14px; cursor:pointer; }
.panel-tabs button.active { color:#1769ff; border-bottom-color:#1769ff; font-weight:650; }
.search-box { margin:14px 16px 8px; height:38px; display:flex; align-items:center; gap:7px; padding:0 11px; border-radius:9px; background:var(--editor-bg-primary); color:var(--text-tertiary); }
.search-box input { flex:1; min-width:0; border:0; outline:0; background:transparent; color:var(--text-primary); font-size:12px; }
.library-scroll { flex:1; overflow:auto; padding:0 14px 24px; }
.component-section { padding-top:13px; }
.section-title { height:28px; display:flex; align-items:center; justify-content:space-between; color:var(--text-secondary); font-size:12px; }
.section-title strong { color:var(--text-primary); font-size:13px; }
.section-title span { font-size:11px; color:var(--text-tertiary); display:flex; align-items:center; }
.section-title button { border:0; background:transparent; color:var(--text-secondary); cursor:pointer; }
.component-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:7px; }
.component-card { height:68px; border:1px solid transparent; border-radius:10px; background:var(--editor-bg-primary); color:var(--text-secondary); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:7px; cursor:grab; transition:.18s ease; }
.component-card i { font-size:21px; color:#3b82f6; }
.component-card span { font-size:11px; }
.component-card:hover { border-color:#8dbaff; background:rgba(23,105,255,.06); transform:translateY(-1px); box-shadow:0 6px 16px rgba(31,86,160,.08); }
.component-card.marketing i { color:#ff6b6b; }
.compact-section { padding-bottom:8px; }
.chip-list { display:flex; flex-wrap:wrap; gap:6px; }
.chip-list button { border:1px solid var(--border-color); background:transparent; color:var(--text-secondary); border-radius:7px; padding:6px 8px; font-size:11px; cursor:pointer; display:flex; gap:4px; align-items:center; }
.page-tree-section { margin-top:10px; padding-top:10px; border-top:1px solid var(--border-color); }
.tree-root { height:30px; display:flex; align-items:center; gap:5px; padding:0 7px; border-radius:6px; background:rgba(23,105,255,.10); color:#1769ff; font-size:12px; }
.tree-children { margin-left:16px; padding:5px 0 0 10px; border-left:1px solid var(--border-color); display:flex; flex-direction:column; }
.tree-children button { height:25px; border:0; background:transparent; color:var(--text-tertiary); text-align:left; display:flex; align-items:center; gap:6px; font-size:11px; cursor:pointer; border-radius:5px; padding:0 6px; }
.tree-children button:hover,.tree-children button.active { color:#1769ff; background:rgba(23,105,255,.06); }
.demo-tree span { height:23px; font-size:11px; color:var(--text-tertiary); display:flex; align-items:center; padding-left:6px; }
.empty-tab { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:var(--text-tertiary); padding:30px; }
.empty-tab i { font-size:40px; color:#79aefc; margin-bottom:12px; }.empty-tab strong{color:var(--text-primary);font-size:15px}.empty-tab p{font-size:12px;margin:7px 0 15px}.empty-tab button{border:1px solid #80b2ff;background:rgba(23,105,255,.07);color:#1769ff;border-radius:8px;padding:8px 12px;cursor:pointer}
@media (max-width:1440px) { .left-workspace{width:350px;min-width:350px}.library-panel{width:284px}.component-grid{grid-template-columns:repeat(2,1fr)} }
</style>
