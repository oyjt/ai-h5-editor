<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAllComponents } from '@/config/component-registry'
import { useEditorStore } from '@/stores/editor'
import { useTemplatesStore } from '@/stores/templates'
import { createComponentSchema } from '@/utils/schema-generator'

const editorStore = useEditorStore()
const templatesStore = useTemplatesStore()
const activeRail = ref<'components' | 'pages' | 'assets' | 'icons' | 'mine'>('components')
const activeTab = ref<'components' | 'pages' | 'templates'>('components')
const keyword = ref('')
const assetKeyword = ref('')
const expanded = ref({ basic: true, marketing: true, tree: true })
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const basicPalette = [
  { key: 'banner', type: 'image', label: 'Banner', icon: 'i-tabler-photo' }, { key: 'swiper', type: 'swiper', label: '轮播', icon: 'i-tabler-carousel-horizontal' }, { key: 'image', type: 'image', label: '图片', icon: 'i-tabler-photo' }, { key: 'text', type: 'text', label: '文本', icon: 'i-tabler-letter-t' }, { key: 'button', type: 'button', label: '按钮', icon: 'i-tabler-minus' }, { key: 'goods-card', type: 'card', label: '商品卡片', icon: 'i-tabler-shopping-bag' }, { key: 'coupon', type: 'coupon', label: '优惠券', icon: 'i-tabler-ticket' }, { key: 'form', type: 'marketingForm', label: '表单', icon: 'i-tabler-forms' }, { key: 'countdown', type: 'countdown', label: '倒计时', icon: 'i-tabler-alarm' }, { key: 'lottery', type: 'lottery', label: '抽奖', icon: 'i-tabler-rosette-discount-check' }, { key: 'popup', type: 'popover', label: '弹窗', icon: 'i-tabler-message' }, { key: 'video', type: 'video', label: '视频', icon: 'i-tabler-player-play-filled' }, { key: 'nav', type: 'nav-bar', label: '导航栏', icon: 'i-tabler-layout-navbar' }, { key: 'divider', type: 'divider', label: '分割线', icon: 'i-tabler-minus' }, { key: 'media-list', type: 'cell', label: '图文列表', icon: 'i-tabler-list-details' },
]
const marketingPalette = [
  { key: 'group-buy', type: 'groupBuy', label: '拼团', icon: 'i-tabler-users' }, { key: 'flash-sale', type: 'flashSale', label: '秒杀', icon: 'i-tabler-clock-bolt' }, { key: 'points', type: 'goodsList', label: '积分商城', icon: 'i-tabler-gift' }, { key: 'member', type: 'card', label: '会员卡', icon: 'i-tabler-credit-card' }, { key: 'signin', type: 'button', label: '签到', icon: 'i-tabler-calendar-check' }, { key: 'poster', type: 'image', label: '裂变海报', icon: 'i-tabler-photo-share' },
]
const marketingAssets = [
  { name: '夏日活动主视觉', src: asset('marketing/summer-hero.jpg'), height: '298px' }, { name: '防晒商品图', src: asset('marketing/product-sunscreen.jpg'), height: '180px' }, { name: '耳机商品图', src: asset('marketing/product-headphones.jpg'), height: '180px' },
]
const iconItems = ['i-tabler-home','i-tabler-heart','i-tabler-shopping-bag','i-tabler-user','i-tabler-gift','i-tabler-ticket','i-tabler-bell','i-tabler-star','i-tabler-calendar','i-tabler-map-pin','i-tabler-phone','i-tabler-share']
const structureNames: Record<string, string> = { image: 'Banner轮播图', coupon: '优惠券模块', goodsList: '商品推荐', marketingForm: '报名表单', tabbar: '底部按钮' }

const allComponents = computed(() => getAllComponents())
const normalizedKeyword = computed(() => keyword.value.trim().toLowerCase())
const basicComponents = computed(() => basicPalette.map(item => ({ ...item, config: allComponents.value.find(comp => comp.type === item.type) })).filter(item => item.config && (!normalizedKeyword.value || item.label.toLowerCase().includes(normalizedKeyword.value) || item.type.toLowerCase().includes(normalizedKeyword.value))))
const marketingComponents = computed(() => marketingPalette.map(item => ({ ...item, config: allComponents.value.find(comp => comp.type === item.type) })).filter(item => item.config && (!normalizedKeyword.value || item.label.toLowerCase().includes(normalizedKeyword.value) || item.type.toLowerCase().includes(normalizedKeyword.value))))
const quickTemplates = computed(() => templatesStore.getAllTemplatesList().slice(0, 6))
const filteredAssets = computed(() => marketingAssets.filter(item => !assetKeyword.value.trim() || item.name.includes(assetKeyword.value.trim())))

function handleAddComponent(type: string) {
  const config = allComponents.value.find(item => item.type === type)
  if (!config) return ElMessage.error('组件配置不存在')
  editorStore.addComponent(createComponentSchema(type, { ...config.defaultProps }, { ...config.defaultStyles }))
  ElMessage.success(`已添加 ${config.name}`)
}
function handleClone(original: any) {
  const type = original.type || original.config?.type
  const config = allComponents.value.find(item => item.type === type)
  return config ? createComponentSchema(type, { ...config.defaultProps }, { ...config.defaultStyles }) : null
}
function handleAddAsset(item: typeof marketingAssets[number]) {
  const config = allComponents.value.find(component => component.type === 'image')
  if (!config) return
  editorStore.addComponent(createComponentSchema('image', { ...config.defaultProps, src: item.src, alt: item.name, width: '100%', height: item.height, objectFit: 'cover', objectPosition: 'center center', borderRadius: '10px' }, { margin: '8px 10px', textAlign: 'center' }))
  ElMessage.success(`已添加 ${item.name}`)
}
async function applyTemplate(id: string) {
  const template = templatesStore.getTemplateById(id)
  if (!template) return ElMessage.error('模板不存在')
  try {
    await ElMessageBox.confirm(`应用“${template.name}”后将替换当前页面内容，是否继续？`, '应用模板', { confirmButtonText: '应用模板', cancelButtonText: '取消', type: 'warning' })
    editorStore.setCurrentPage(structuredClone(template.schema))
    editorStore.savePage()
    ElMessage.success(`已应用模板：${template.name}`)
  }
  catch {}
}
async function copyIcon(icon: string) { try { await navigator.clipboard.writeText(icon); ElMessage.success(`已复制 ${icon}`) } catch { ElMessage.info(icon) } }
function handleAddPage() { editorStore.addPage(); ElMessage.success('已新增页面') }
function handleDuplicatePage(index: number, event: Event) { event.stopPropagation(); editorStore.duplicatePage(index); ElMessage.success('页面已复制') }
async function handleDeletePage(index: number, event: Event) {
  event.stopPropagation()
  if (editorStore.pages.length <= 1) return ElMessage.warning('至少保留一个页面')
  try { await ElMessageBox.confirm(`确定删除“${editorStore.pages[index]?.name || `页面 ${index + 1}`}”吗？`, '删除页面', { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消', confirmButtonClass: 'el-button--danger' }); editorStore.deletePage(index); ElMessage.success('页面已删除') } catch {}
}
function getComponentName(type: string) { return structureNames[type] || allComponents.value.find(item => item.type === type)?.name || type }
function chooseRail(value: typeof activeRail.value) { activeRail.value = value; if (value === 'components') activeTab.value = 'components'; if (value === 'pages') activeTab.value = 'pages' }
function toggleSection(key: keyof typeof expanded.value) { expanded.value[key] = !expanded.value[key] }
onMounted(() => templatesStore.loadCustomTemplates())
</script>

<template>
  <aside class="left-workspace">
    <nav class="left-rail">
      <button :class="{ active: activeRail === 'components' }" @click="chooseRail('components')"><i class="i-tabler-layout-grid" /><span>组件</span></button>
      <button :class="{ active: activeRail === 'pages' }" @click="chooseRail('pages')"><i class="i-tabler-file-text" /><span>页面</span></button>
      <button :class="{ active: activeRail === 'assets' }" @click="chooseRail('assets')"><i class="i-tabler-photo" /><span>素材</span></button>
      <button :class="{ active: activeRail === 'icons' }" @click="chooseRail('icons')"><i class="i-tabler-icons" /><span>图标</span></button>
      <button class="rail-bottom" :class="{ active: activeRail === 'mine' }" @click="chooseRail('mine')"><i class="i-tabler-user-circle" /><span>我的</span></button>
    </nav>

    <div class="library-panel">
      <template v-if="activeRail === 'components' || activeRail === 'pages'">
        <div class="panel-tabs">
          <button :class="{ active: activeTab === 'components' }" @click="activeTab = 'components'; activeRail = 'components'">组件</button>
          <button :class="{ active: activeTab === 'pages' }" @click="activeTab = 'pages'; activeRail = 'pages'">页面</button>
          <button :class="{ active: activeTab === 'templates' }" @click="activeTab = 'templates'; activeRail = 'components'">模板</button>
        </div>

        <template v-if="activeTab === 'components'">
          <label class="search-box"><i class="i-tabler-search" /><input v-model="keyword" placeholder="搜索组件名称" /></label>
          <div class="library-scroll">
            <section class="component-section first">
              <button class="section-title" @click="toggleSection('basic')"><strong>基础组件</strong><i :class="expanded.basic ? 'i-tabler-chevron-up' : 'i-tabler-chevron-down'" /></button>
              <VueDraggable v-show="expanded.basic" :model-value="basicComponents" :group="{ name: 'components', pull: 'clone', put: false }" :clone="handleClone" :sort="false" item-key="key" class="component-grid"><button v-for="item in basicComponents" :key="item.key" class="component-card" @click="handleAddComponent(item.type)"><span class="component-icon"><i :class="item.icon" /></span><span>{{ item.label }}</span></button></VueDraggable>
            </section>
            <section class="component-section marketing-section">
              <button class="section-title" @click="toggleSection('marketing')"><strong>营销组件</strong><span>{{ marketingComponents.length }} 项 <i :class="expanded.marketing ? 'i-tabler-chevron-up' : 'i-tabler-chevron-down'" /></span></button>
              <VueDraggable v-show="expanded.marketing" :model-value="marketingComponents" :group="{ name: 'components', pull: 'clone', put: false }" :clone="handleClone" :sort="false" item-key="key" class="component-grid"><button v-for="item in marketingComponents" :key="item.key" class="component-card marketing" @click="handleAddComponent(item.type)"><span class="component-icon"><i :class="item.icon" /></span><span>{{ item.label }}</span></button></VueDraggable>
            </section>
            <section class="page-tree-section">
              <button class="section-title" @click="toggleSection('tree')"><strong>页面结构</strong><i :class="expanded.tree ? 'i-tabler-chevron-up' : 'i-tabler-chevron-down'" /></button>
              <template v-if="expanded.tree"><div class="tree-root"><i class="i-tabler-file" /><span>页面：{{ editorStore.currentPage.name || `页面 ${editorStore.currentPageIndex + 1}` }}</span></div><div class="tree-children"><button v-for="component in editorStore.currentPage.components" :key="component.id" :class="{ active: editorStore.selectedComponentId === component.id }" @click="editorStore.selectComponent(component.id)"><i class="i-tabler-square-rounded" /><span>{{ getComponentName(component.type) }}</span></button></div></template>
            </section>
          </div>
        </template>

        <div v-else-if="activeTab === 'pages'" class="page-manager">
          <div class="page-manager-head"><div><strong>页面管理</strong><span>{{ editorStore.pages.length }} 个页面</span></div><button @click="handleAddPage"><i class="i-tabler-plus" />新增</button></div>
          <div class="page-manager-list"><button v-for="(page,index) in editorStore.pages" :key="page.id" class="page-manager-item" :class="{ active: editorStore.currentPageIndex === index }" @click="editorStore.switchPage(index)"><span class="page-index">{{ String(index + 1).padStart(2, '0') }}</span><span class="page-copy"><strong>{{ page.name || `页面 ${index + 1}` }}</strong><small>{{ page.components.length }} 个组件</small></span><span class="page-actions"><i class="i-tabler-copy" title="复制页面" @click="handleDuplicatePage(index,$event)" /><i class="i-tabler-trash" title="删除页面" @click="handleDeletePage(index,$event)" /></span></button></div>
        </div>

        <div v-else class="template-panel">
          <div class="template-panel-head"><div><strong>推荐模板</strong><span>应用后替换当前页面</span></div><button @click="$router.push('/templates')">全部模板 <i class="i-tabler-chevron-right" /></button></div>
          <div class="quick-template-list"><article v-for="template in quickTemplates" :key="template.id" class="quick-template-card"><div class="template-preview"><i class="i-tabler-layout-dashboard" /><span>{{ template.name.slice(0, 6) }}</span></div><div class="template-info"><strong>{{ template.name }}</strong><small>{{ template.description }}</small><button @click="applyTemplate(template.id)"><i class="i-tabler-wand" />应用</button></div></article></div>
        </div>
      </template>

      <template v-else-if="activeRail === 'assets'">
        <div class="rail-panel-title"><div><strong>素材库</strong><span>点击素材添加到画布</span></div><i class="i-tabler-photo" /></div>
        <label class="search-box"><i class="i-tabler-search" /><input v-model="assetKeyword" placeholder="搜索素材" /></label>
        <div v-if="filteredAssets.length" class="asset-library"><button v-for="item in filteredAssets" :key="item.src" @click="handleAddAsset(item)"><img :src="item.src" :alt="item.name"><span>{{ item.name }}</span></button></div>
        <div v-else class="empty-tab compact"><i class="i-tabler-photo-off" /><strong>没有找到素材</strong><p>尝试其他关键词</p></div>
      </template>

      <template v-else-if="activeRail === 'icons'"><div class="rail-panel-title"><div><strong>图标库</strong><span>点击复制图标类名</span></div><i class="i-tabler-icons" /></div><div class="icon-library"><button v-for="icon in iconItems" :key="icon" :title="icon" @click="copyIcon(icon)"><i :class="icon" /></button></div></template>
      <div v-else class="empty-tab"><i class="i-tabler-user-circle" /><strong>我的资源</strong><p>收藏的组件、素材与模板将在这里统一管理</p></div>
    </div>
  </aside>
</template>

<style scoped>
.left-workspace{width:392px;min-width:392px;height:100%;display:flex;background:var(--surface-1);border-right:1px solid var(--border-subtle);color:var(--text-primary)}.left-rail{width:var(--editor-rail-width);flex:0 0 var(--editor-rail-width);border-right:1px solid var(--border-subtle);display:flex;flex-direction:column;padding:10px 7px 12px;gap:5px;background:var(--surface-2)}.left-rail button{height:58px;border:0;border-radius:var(--radius-md);background:transparent;color:var(--text-muted);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:var(--font-size-xs);cursor:pointer;position:relative;transition:all var(--motion-base) var(--ease-standard)}.left-rail button i{font-size:20px}.left-rail button:hover{color:var(--brand-600);background:var(--brand-50)}.left-rail button.active{color:var(--brand-600);background:var(--brand-100)}.left-rail button.active::before{content:'';position:absolute;left:-7px;top:8px;bottom:8px;width:3px;background:var(--brand-600);border-radius:0 3px 3px 0}.left-rail .rail-bottom{margin-top:auto}.library-panel{flex:1;min-width:0;display:flex;flex-direction:column;overflow:hidden}.panel-tabs{height:var(--tab-height);padding:0 20px;border-bottom:1px solid var(--border-subtle);display:flex;gap:28px;align-items:flex-end}.panel-tabs button{height:var(--tab-height);border:0;border-bottom:2px solid transparent;background:transparent;color:var(--text-secondary);font-size:var(--font-size-base);cursor:pointer;transition:all var(--motion-fast)}.panel-tabs button:hover{color:var(--brand-600)}.panel-tabs button.active{color:var(--brand-600);border-bottom-color:var(--brand-600);font-weight:var(--font-weight-semibold)}.search-box{margin:14px 16px 7px;height:var(--control-height-lg);display:flex;align-items:center;gap:7px;padding:0 11px;border:1px solid transparent;border-radius:var(--radius-md);background:var(--surface-3);color:var(--text-muted);transition:all var(--motion-fast)}.search-box:focus-within{background:var(--surface-1);border-color:var(--brand-500);box-shadow:var(--focus-ring)}.search-box input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:var(--text-primary);font-size:var(--font-size-sm)}.library-scroll{flex:1;overflow:auto;padding:0 15px 22px}.component-section{padding-top:12px}.component-section.first{padding-top:8px}.section-title{width:100%;height:30px;border:0;background:transparent;display:flex;align-items:center;justify-content:space-between;color:var(--text-muted);font-size:var(--font-size-sm);cursor:pointer}.section-title strong{color:var(--text-primary);font-size:var(--font-size-md);font-weight:var(--font-weight-semibold)}.section-title span{display:flex;align-items:center;gap:3px;font-size:var(--font-size-xs)}.section-title:hover strong,.section-title:hover i{color:var(--brand-600)}.component-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:7px}.component-card{height:68px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--surface-2);color:var(--text-secondary);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:grab;transition:all var(--motion-base) var(--ease-standard)}.component-card:hover{border-color:var(--border-brand);background:var(--brand-50);box-shadow:var(--shadow-xs);transform:translateY(-1px)}.component-card:active{transform:translateY(0) scale(.98)}.component-icon{width:28px;height:28px;border-radius:var(--radius-sm);display:grid;place-items:center;background:var(--brand-100);color:var(--brand-600);font-size:17px}.component-card>span:last-child{font-size:var(--font-size-xs)}.component-card.marketing .component-icon{background:#fff0ef;color:#ef6262}.marketing-section{padding-top:14px}.page-tree-section{margin-top:14px;padding-top:10px;border-top:1px solid var(--border-subtle)}.tree-root{height:32px;display:flex;align-items:center;gap:6px;padding:0 8px;border-radius:var(--radius-sm);background:var(--brand-100);color:var(--brand-600);font-size:var(--font-size-sm);white-space:nowrap;overflow:hidden}.tree-root span{overflow:hidden;text-overflow:ellipsis}.tree-children{margin-left:15px;padding:4px 0 0 10px;border-left:1px solid var(--border-default);display:flex;flex-direction:column}.tree-children button{height:28px;border:0;background:transparent;color:var(--text-secondary);text-align:left;display:flex;align-items:center;gap:6px;font-size:var(--font-size-xs);cursor:pointer;border-radius:var(--radius-xs);padding:0 6px}.tree-children button.active,.tree-children button:hover{color:var(--brand-600);background:var(--brand-50)}.page-manager,.template-panel{flex:1;min-height:0;display:flex;flex-direction:column}.page-manager-head,.template-panel-head{height:66px;padding:0 17px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border-subtle)}.page-manager-head>div,.template-panel-head>div{display:flex;flex-direction:column;gap:3px}.page-manager-head strong,.template-panel-head strong{font-size:var(--font-size-base);color:var(--text-primary)}.page-manager-head span,.template-panel-head span{font-size:9px;color:var(--text-muted)}.page-manager-head button,.template-panel-head button{height:var(--control-height-sm);border:1px solid var(--border-brand);border-radius:var(--radius-sm);background:var(--brand-50);color:var(--brand-600);font-size:var(--font-size-xs);display:flex;align-items:center;gap:3px;padding:0 8px;cursor:pointer}.page-manager-list{padding:12px;overflow:auto;display:flex;flex-direction:column;gap:8px}.page-manager-item{width:100%;height:62px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--surface-1);padding:0 9px;display:grid;grid-template-columns:34px 1fr 48px;align-items:center;gap:8px;text-align:left;cursor:pointer}.page-manager-item:hover{border-color:var(--border-default);background:var(--surface-2)}.page-manager-item.active{border-color:var(--border-brand);background:var(--brand-50);box-shadow:var(--focus-ring)}.page-index{width:32px;height:38px;border-radius:var(--radius-sm);background:var(--surface-3);color:var(--text-secondary);display:grid;place-items:center;font-size:var(--font-size-xs);font-weight:var(--font-weight-bold)}.page-manager-item.active .page-index{background:var(--brand-600);color:#fff}.page-copy{min-width:0;display:flex;flex-direction:column;gap:4px}.page-copy strong{font-size:var(--font-size-xs);color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-copy small{font-size:8px;color:var(--text-muted)}.page-actions{display:flex;gap:5px;opacity:0;justify-content:flex-end}.page-manager-item:hover .page-actions,.page-manager-item.active .page-actions{opacity:1}.page-actions i{width:20px;height:20px;border-radius:var(--radius-xs);display:grid;place-items:center;color:var(--text-muted)}.page-actions i:hover{background:var(--brand-100);color:var(--brand-600)}.quick-template-list{padding:12px;overflow:auto;display:flex;flex-direction:column;gap:10px}.quick-template-card{display:grid;grid-template-columns:84px 1fr;gap:10px;border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:8px;background:var(--surface-1);transition:all var(--motion-base)}.quick-template-card:hover{border-color:var(--border-brand);box-shadow:var(--shadow-xs)}.template-preview{height:108px;border-radius:var(--radius-sm);background:linear-gradient(145deg,var(--brand-100),#ecfbff);display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--brand-600);gap:6px}.template-preview i{font-size:24px}.template-preview span{font-size:9px;font-weight:var(--font-weight-semibold)}.template-info{min-width:0;display:flex;flex-direction:column;padding:4px 0}.template-info strong{font-size:var(--font-size-sm);color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.template-info small{margin-top:5px;font-size:9px;line-height:1.5;color:var(--text-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.template-info button{margin-top:auto;height:28px;border:1px solid var(--border-brand);border-radius:var(--radius-sm);background:var(--brand-50);color:var(--brand-600);font-size:var(--font-size-xs);cursor:pointer}.rail-panel-title{height:64px;padding:0 18px;border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;color:var(--text-muted)}.rail-panel-title>div{display:flex;flex-direction:column;gap:3px}.rail-panel-title strong{font-size:14px;color:var(--text-primary)}.rail-panel-title span{font-size:9px;color:var(--text-muted)}.rail-panel-title>i{font-size:18px}.asset-library{padding:10px 16px;display:grid;grid-template-columns:1fr 1fr;gap:9px;overflow:auto}.asset-library button{border:1px solid var(--border-subtle);background:var(--surface-1);border-radius:var(--radius-md);padding:5px;text-align:left;color:var(--text-secondary);cursor:pointer;transition:all var(--motion-base)}.asset-library button:hover{border-color:var(--border-brand);box-shadow:var(--shadow-xs);transform:translateY(-1px)}.asset-library img{width:100%;height:86px;display:block;object-fit:cover;border-radius:var(--radius-sm)}.asset-library span{display:block;padding:7px 3px 3px;font-size:var(--font-size-xs);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.icon-library{padding:18px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.icon-library button{height:54px;border:1px solid var(--border-subtle);background:var(--surface-2);border-radius:var(--radius-md);color:var(--brand-600);font-size:22px;cursor:pointer}.icon-library button:hover{background:var(--brand-50);border-color:var(--border-brand)}.empty-tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:var(--text-muted);padding:30px}.empty-tab.compact{min-height:220px}.empty-tab i{font-size:38px;color:var(--brand-300);margin-bottom:12px}.empty-tab strong{color:var(--text-primary);font-size:14px}.empty-tab p{font-size:var(--font-size-sm);margin:7px 0 15px}
@media(min-width:1700px){.left-workspace{width:454px;min-width:454px}.left-rail{--editor-rail-width:78px}.component-card{height:72px}.component-grid{gap:10px}.library-scroll{padding-left:18px;padding-right:18px}.search-box{margin-left:18px;margin-right:18px}}
@media(max-width:1440px){.left-workspace{width:360px;min-width:360px}.component-card{height:64px}.component-grid{gap:7px}}
</style>
