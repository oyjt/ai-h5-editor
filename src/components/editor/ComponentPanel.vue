<script setup lang="ts">
import { computed, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { ElMessage } from 'element-plus'
import { getAllComponents } from '@/config/component-registry'
import { useEditorStore } from '@/stores/editor'
import { createComponentSchema } from '@/utils/schema-generator'

const editorStore = useEditorStore()
const activeRail = ref('components')
const activeTab = ref<'components' | 'pages' | 'templates'>('components')
const activeGroup = ref<'basic' | 'marketing' | 'content' | 'layout'>('basic')
const keyword = ref('')

const basicTypes = ['image', 'swiper', 'text', 'button', 'card', 'input', 'countdown', 'divider', 'notice', 'grid', 'tabbar', 'nav-bar']
const marketingTypes = ['coupon', 'flashSale', 'groupBuy', 'lottery', 'goodsList', 'marketingForm']
const contentTypes = ['text', 'image', 'button', 'card', 'notice', 'badge', 'tag', 'progress']
const layoutTypes = ['grid', 'divider', 'container', 'spacer', 'tabbar', 'nav-bar', 'actionbar']

const allComponents = computed(() => getAllComponents())
const filteredComponents = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  return q ? allComponents.value.filter(item => item.name.toLowerCase().includes(q) || item.type.toLowerCase().includes(q)) : allComponents.value
})

function pick(types: string[]) {
  return types.map(type => filteredComponents.value.find(item => item.type === type)).filter(Boolean) as any[]
}

const currentComponents = computed(() => {
  if (activeGroup.value === 'marketing') return pick(marketingTypes)
  if (activeGroup.value === 'content') return pick(contentTypes)
  if (activeGroup.value === 'layout') return pick(layoutTypes)
  return pick(basicTypes)
})

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
function getComponentName(type: string) { return getAllComponents().find(item => item.type === type)?.name || type }
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
        <i class="i-tabler-chevron-up panel-fold" />
      </div>

      <template v-if="activeTab === 'components'">
        <label class="search-box"><i class="i-tabler-search" /><input v-model="keyword" placeholder="搜索组件名称" /></label>
        <div class="group-tabs">
          <button :class="{ active: activeGroup === 'basic' }" @click="activeGroup = 'basic'">基础组件</button>
          <button :class="{ active: activeGroup === 'marketing' }" @click="activeGroup = 'marketing'">营销组件</button>
          <button :class="{ active: activeGroup === 'content' }" @click="activeGroup = 'content'">内容组件</button>
          <button :class="{ active: activeGroup === 'layout' }" @click="activeGroup = 'layout'">布局组件</button>
        </div>

        <div class="library-scroll">
          <section class="component-section">
            <div class="section-title">
              <strong>{{ activeGroup === 'marketing' ? '营销组件' : activeGroup === 'content' ? '内容组件' : activeGroup === 'layout' ? '布局组件' : '基础组件' }}</strong>
              <span v-if="activeGroup === 'marketing'">更多 <i class="i-tabler-chevron-right" /></span>
              <i v-else class="i-tabler-chevron-up" />
            </div>
            <VueDraggable :model-value="currentComponents" :group="{ name: 'components', pull: 'clone', put: false }" :clone="handleClone" :sort="false" item-key="type" class="component-grid">
              <button v-for="comp in currentComponents" :key="comp.type" class="component-card" :class="{ marketing: activeGroup === 'marketing' }" @click="handleAddComponent(comp.type)">
                <span class="component-icon"><i :class="comp.icon" /></span>
                <span class="component-name">{{ comp.name }}</span>
                <em v-if="['flashSale','groupBuy','lottery'].includes(comp.type)">HOT</em>
              </button>
            </VueDraggable>
          </section>

          <section class="page-tree-section">
            <div class="section-title"><strong>页面结构</strong><button><i class="i-tabler-plus" /></button></div>
            <div class="tree-root"><i class="i-tabler-chevron-down" /><i class="i-tabler-file" /><span>页面：首页</span></div>
            <div class="tree-children">
              <button v-for="component in editorStore.currentPage.components" :key="component.id" :class="{ active: editorStore.selectedComponentId === component.id }" @click="editorStore.selectComponent(component.id)">
                <i class="i-tabler-square-rounded" /><span>{{ getComponentName(component.type) }}</span>
              </button>
            </div>
          </section>
        </div>
      </template>

      <div v-else-if="activeTab === 'pages'" class="empty-tab"><i class="i-tabler-files" /><strong>页面管理</strong><p>管理活动页、详情页与表单页</p><button>+ 新增页面</button></div>
      <div v-else class="empty-tab"><i class="i-tabler-template" /><strong>营销模板</strong><p>从高转化模板快速开始</p><button>浏览模板中心</button></div>
    </div>
  </aside>
</template>

<style scoped>
.left-workspace{width:392px;min-width:392px;height:100%;display:flex;background:#fff;border-right:1px solid #e8eef5}.left-rail{width:66px;border-right:1px solid #edf1f6;display:flex;flex-direction:column;align-items:stretch;padding:10px 7px;gap:4px;background:#f9fbfd}.left-rail button{height:60px;border:0;border-radius:9px;background:transparent;color:#7c8ca0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;font-size:10px;cursor:pointer;position:relative}.left-rail button i{font-size:20px}.left-rail button:hover{color:#1769ff;background:#f2f6ff}.left-rail button.active{color:#1769ff;background:#edf4ff}.left-rail button.active::before{content:'';position:absolute;left:-7px;top:10px;bottom:10px;width:3px;border-radius:0 3px 3px 0;background:#1769ff}.left-rail .rail-bottom{margin-top:auto}.library-panel{width:326px;min-width:0;display:flex;flex-direction:column;overflow:hidden}.panel-tabs{height:52px;padding:0 16px;border-bottom:1px solid #edf1f6;display:flex;gap:27px;align-items:flex-end;position:relative}.panel-tabs button{height:52px;border:0;border-bottom:2px solid transparent;background:transparent;color:#506177;font-size:13px;cursor:pointer}.panel-tabs button.active{color:#1769ff;border-bottom-color:#1769ff;font-weight:700}.panel-fold{position:absolute;right:15px;top:19px;color:#8d9bad;font-size:12px}.search-box{margin:13px 14px 8px;height:38px;display:flex;align-items:center;gap:7px;padding:0 11px;border:1px solid #eef2f6;border-radius:8px;background:#f8fafc;color:#9ba8b8}.search-box input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:#34465b;font-size:11px}.group-tabs{display:grid;grid-template-columns:repeat(4,1fr);padding:0 14px;border-bottom:1px solid #f0f3f7}.group-tabs button{height:35px;border:0;border-bottom:2px solid transparent;background:transparent;color:#7b899b;font-size:10px;cursor:pointer}.group-tabs button.active{color:#1769ff;border-bottom-color:#1769ff;font-weight:650}.library-scroll{flex:1;overflow:auto;padding:0 13px 20px}.component-section{padding-top:12px}.section-title{height:28px;display:flex;align-items:center;justify-content:space-between;color:#8391a3;font-size:11px}.section-title strong{color:#24354a;font-size:12px}.section-title span{font-size:10px;color:#8b99aa;display:flex;align-items:center}.section-title button{border:0;background:transparent;color:#68798f;cursor:pointer}.component-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:7px}.component-card{height:68px;border:1px solid #eef2f6;border-radius:8px;background:#fafcff;color:#526277;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:grab;transition:.18s ease;position:relative}.component-card:hover{border-color:#a8c6ff;background:#f5f9ff;box-shadow:0 5px 14px rgba(54,87,132,.07);transform:translateY(-1px)}.component-icon{width:27px;height:27px;border-radius:6px;display:grid;place-items:center;background:#eef4ff;color:#3c7bf7;font-size:17px}.component-card.marketing .component-icon{background:#fff1f0;color:#ff6464}.component-name{font-size:10px}.component-card em{position:absolute;right:-1px;top:-1px;padding:1px 4px;border-radius:0 8px 0 6px;background:#ff5d5d;color:#fff;font-style:normal;font-size:7px}.page-tree-section{margin-top:14px;padding-top:11px;border-top:1px solid #edf1f5}.tree-root{height:30px;display:flex;align-items:center;gap:5px;padding:0 7px;border-radius:5px;background:#eaf3ff;color:#1769ff;font-size:11px}.tree-children{margin-left:13px;padding:5px 0 0 11px;border-left:1px solid #dce5f0;display:flex;flex-direction:column}.tree-children button{height:25px;border:0;background:transparent;color:#6e7e91;text-align:left;display:flex;align-items:center;gap:6px;font-size:10px;cursor:pointer;border-radius:5px;padding:0 6px}.tree-children button:hover,.tree-children button.active{color:#1769ff;background:#f1f6ff}.tree-children button i{font-size:11px}.empty-tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#8d9bad;padding:30px}.empty-tab i{font-size:38px;color:#83b3fb;margin-bottom:12px}.empty-tab strong{color:#304157;font-size:14px}.empty-tab p{font-size:11px;margin:7px 0 15px}.empty-tab button{border:1px solid #9ec0ff;background:#f7faff;color:#1769ff;border-radius:7px;padding:8px 12px;cursor:pointer}
@media(max-width:1440px){.left-workspace{width:360px;min-width:360px}.library-panel{width:294px}.component-grid{grid-template-columns:repeat(3,1fr)}}
</style>
