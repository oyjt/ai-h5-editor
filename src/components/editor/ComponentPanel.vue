<script setup lang="ts">
import { computed, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { ElMessage } from 'element-plus'
import { getAllComponents } from '@/config/component-registry'
import { useEditorStore } from '@/stores/editor'
import { createComponentSchema } from '@/utils/schema-generator'

const editorStore = useEditorStore()
const activeRail = ref<'components' | 'pages' | 'assets' | 'icons' | 'mine'>('components')
const activeTab = ref<'components' | 'pages' | 'templates'>('components')
const keyword = ref('')
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const basicPalette = [
  { key: 'banner', type: 'image', label: 'Banner', icon: 'i-tabler-photo' },
  { key: 'swiper', type: 'swiper', label: '轮播', icon: 'i-tabler-carousel-horizontal' },
  { key: 'image', type: 'image', label: '图片', icon: 'i-tabler-photo' },
  { key: 'text', type: 'text', label: '文本', icon: 'i-tabler-letter-t' },
  { key: 'button', type: 'button', label: '按钮', icon: 'i-tabler-minus' },
  { key: 'goods-card', type: 'card', label: '商品卡片', icon: 'i-tabler-shopping-bag' },
  { key: 'coupon', type: 'coupon', label: '优惠券', icon: 'i-tabler-ticket' },
  { key: 'form', type: 'marketingForm', label: '表单', icon: 'i-tabler-forms' },
  { key: 'countdown', type: 'countdown', label: '倒计时', icon: 'i-tabler-alarm' },
  { key: 'lottery', type: 'lottery', label: '抽奖', icon: 'i-tabler-rosette-discount-check' },
  { key: 'popup', type: 'popover', label: '弹窗', icon: 'i-tabler-message' },
  { key: 'video', type: 'video', label: '视频', icon: 'i-tabler-player-play-filled' },
  { key: 'nav', type: 'nav-bar', label: '导航栏', icon: 'i-tabler-layout-navbar' },
  { key: 'divider', type: 'divider', label: '分割线', icon: 'i-tabler-minus' },
  { key: 'media-list', type: 'cell', label: '图文列表', icon: 'i-tabler-list-details' },
]

const marketingPalette = [
  { key: 'group-buy', type: 'groupBuy', label: '拼团', icon: 'i-tabler-users' },
  { key: 'flash-sale', type: 'flashSale', label: '秒杀', icon: 'i-tabler-clock-bolt' },
  { key: 'points', type: 'goodsList', label: '积分商城', icon: 'i-tabler-gift' },
  { key: 'member', type: 'card', label: '会员卡', icon: 'i-tabler-credit-card' },
  { key: 'signin', type: 'button', label: '签到', icon: 'i-tabler-calendar-check' },
  { key: 'poster', type: 'image', label: '裂变海报', icon: 'i-tabler-photo-share' },
]

const marketingAssets = [
  { name: '夏日活动主视觉', src: asset('marketing/summer-hero.jpg'), height: '298px' },
  { name: '防晒商品图', src: asset('marketing/product-sunscreen.jpg'), height: '180px' },
  { name: '耳机商品图', src: asset('marketing/product-headphones.jpg'), height: '180px' },
]

const iconItems = [
  'i-tabler-home', 'i-tabler-heart', 'i-tabler-shopping-bag', 'i-tabler-user',
  'i-tabler-gift', 'i-tabler-ticket', 'i-tabler-bell', 'i-tabler-star',
  'i-tabler-calendar', 'i-tabler-map-pin', 'i-tabler-phone', 'i-tabler-share',
]

const allComponents = computed(() => getAllComponents())
const normalizedKeyword = computed(() => keyword.value.trim().toLowerCase())
const basicComponents = computed(() => basicPalette
  .map(item => ({ ...item, config: allComponents.value.find(comp => comp.type === item.type) }))
  .filter(item => item.config && (!normalizedKeyword.value || item.label.toLowerCase().includes(normalizedKeyword.value) || item.type.toLowerCase().includes(normalizedKeyword.value))))
const marketingComponents = computed(() => marketingPalette
  .map(item => ({ ...item, config: allComponents.value.find(comp => comp.type === item.type) }))
  .filter(item => item.config && (!normalizedKeyword.value || item.label.toLowerCase().includes(normalizedKeyword.value) || item.type.toLowerCase().includes(normalizedKeyword.value))))

const structureNames: Record<string, string> = {
  image: 'Banner轮播图',
  coupon: '优惠券模块',
  goodsList: '商品推荐',
  marketingForm: '报名表单',
  tabbar: '底部按钮',
}

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
  editorStore.addComponent(createComponentSchema('image', {
    ...config.defaultProps,
    src: item.src,
    alt: item.name,
    width: '100%',
    height: item.height,
    objectFit: 'cover',
    objectPosition: 'center center',
    borderRadius: '10px',
  }, { margin: '8px 10px', textAlign: 'center' }))
  ElMessage.success(`已添加 ${item.name}`)
}

async function copyIcon(icon: string) {
  try {
    await navigator.clipboard.writeText(icon)
    ElMessage.success(`已复制 ${icon}`)
  }
  catch {
    ElMessage.info(icon)
  }
}

function getComponentName(type: string) { return structureNames[type] || allComponents.value.find(item => item.type === type)?.name || type }
function chooseRail(value: typeof activeRail.value) {
  activeRail.value = value
  if (value === 'components') activeTab.value = 'components'
  if (value === 'pages') activeTab.value = 'pages'
}
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
          <i class="i-tabler-chevron-up panel-fold" />
        </div>

        <template v-if="activeTab === 'components'">
          <label class="search-box"><i class="i-tabler-search" /><input v-model="keyword" placeholder="搜索组件名称" /></label>
          <div class="library-scroll">
            <section class="component-section first">
              <div class="section-title"><strong>基础组件</strong><i class="i-tabler-chevron-down" /></div>
              <VueDraggable :model-value="basicComponents" :group="{ name: 'components', pull: 'clone', put: false }" :clone="handleClone" :sort="false" item-key="key" class="component-grid">
                <button v-for="item in basicComponents" :key="item.key" class="component-card" @click="handleAddComponent(item.type)">
                  <span class="component-icon"><i :class="item.icon" /></span><span>{{ item.label }}</span>
                </button>
              </VueDraggable>
            </section>

            <section class="component-section marketing-section">
              <div class="section-title"><strong>营销组件</strong><button class="more">更多 <i class="i-tabler-chevron-right" /></button></div>
              <VueDraggable :model-value="marketingComponents" :group="{ name: 'components', pull: 'clone', put: false }" :clone="handleClone" :sort="false" item-key="key" class="component-grid marketing-grid">
                <button v-for="item in marketingComponents" :key="item.key" class="component-card marketing" @click="handleAddComponent(item.type)">
                  <span class="component-icon"><i :class="item.icon" /></span><span>{{ item.label }}</span>
                </button>
              </VueDraggable>
            </section>

            <section class="page-tree-section">
              <div class="section-title"><strong>页面结构</strong><button class="tree-add"><i class="i-tabler-plus" /></button></div>
              <div class="tree-root"><i class="i-tabler-chevron-down" /><i class="i-tabler-file" /><span>页面：首页</span></div>
              <div class="tree-children">
                <button v-for="component in editorStore.currentPage.components" :key="component.id" :class="{ active: editorStore.selectedComponentId === component.id }" @click="editorStore.selectComponent(component.id)">
                  <i class="i-tabler-square-rounded" /><span>{{ getComponentName(component.type) }}</span>
                </button>
              </div>
            </section>
          </div>
        </template>

        <div v-else-if="activeTab === 'pages'" class="empty-tab"><i class="i-tabler-files" /><strong>页面管理</strong><p>当前项目包含 1 个营销页面</p><button @click="ElMessage.info('当前设计稿为单页 H5，新增页面将在项目模式提供')">+ 新增页面</button></div>
        <div v-else class="empty-tab"><i class="i-tabler-template" /><strong>营销模板</strong><p>从高转化模板快速开始</p><button @click="$router.push('/templates')">浏览模板中心</button></div>
      </template>

      <template v-else-if="activeRail === 'assets'">
        <div class="rail-panel-title"><div><strong>素材库</strong><span>项目素材</span></div><i class="i-tabler-upload" /></div>
        <label class="search-box"><i class="i-tabler-search" /><input placeholder="搜索素材" /></label>
        <div class="asset-library">
          <button v-for="item in marketingAssets" :key="item.src" @click="handleAddAsset(item)"><img :src="item.src" :alt="item.name"><span>{{ item.name }}</span></button>
        </div>
      </template>

      <template v-else-if="activeRail === 'icons'">
        <div class="rail-panel-title"><div><strong>图标库</strong><span>点击复制图标类名</span></div><i class="i-tabler-icons" /></div>
        <div class="icon-library">
          <button v-for="icon in iconItems" :key="icon" :title="icon" @click="copyIcon(icon)"><i :class="icon" /></button>
        </div>
      </template>

      <div v-else class="empty-tab"><i class="i-tabler-user-circle" /><strong>我的资源</strong><p>收藏的组件、素材与模板将在这里统一管理</p></div>
    </div>
  </aside>
</template>

<style scoped>
.left-workspace{width:392px;min-width:392px;height:100%;display:flex;background:#fff;border-right:1px solid #e7edf4}.left-rail{width:68px;flex:0 0 68px;border-right:1px solid #edf1f6;display:flex;flex-direction:column;padding:10px 7px 12px;gap:5px;background:#f8fafc}.left-rail button{height:58px;border:0;border-radius:9px;background:transparent;color:#8492a6;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:10px;cursor:pointer;position:relative}.left-rail button i{font-size:20px}.left-rail button.active{color:#1769ff;background:#eaf2ff}.left-rail button.active::before{content:'';position:absolute;left:-7px;top:8px;bottom:8px;width:3px;background:#1769ff;border-radius:0 3px 3px 0}.left-rail button:hover{color:#1769ff}.left-rail .rail-bottom{margin-top:auto}.library-panel{flex:1;min-width:0;display:flex;flex-direction:column;overflow:hidden}.panel-tabs{height:54px;padding:0 20px;border-bottom:1px solid #edf1f6;display:flex;gap:28px;align-items:flex-end;position:relative}.panel-tabs button{height:54px;border:0;border-bottom:2px solid transparent;background:transparent;color:#55657a;font-size:13px;cursor:pointer}.panel-tabs button.active{color:#1769ff;border-bottom-color:#1769ff;font-weight:700}.panel-fold{position:absolute;right:18px;top:20px;color:#8190a4;font-size:12px}.search-box{margin:14px 16px 7px;height:38px;display:flex;align-items:center;gap:7px;padding:0 11px;border-radius:8px;background:#f5f7fa;color:#9aa7b7}.search-box input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:#34465b;font-size:11px}.library-scroll{flex:1;overflow:auto;padding:0 15px 22px;scrollbar-width:thin}.component-section{padding-top:12px}.component-section.first{padding-top:8px}.section-title{height:28px;display:flex;align-items:center;justify-content:space-between;color:#8391a3;font-size:11px}.section-title strong{color:#23364d;font-size:12px}.section-title button{border:0;background:transparent;color:#8996a7;cursor:pointer}.more{font-size:10px;display:flex;align-items:center;gap:1px}.component-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:7px}.component-card{height:68px;border:1px solid #edf1f6;border-radius:7px;background:#f9fbfd;color:#526277;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:grab;transition:.16s ease}.component-card:hover{border-color:#9fc0ff;background:#f4f8ff;box-shadow:0 4px 12px rgba(45,79,122,.06)}.component-icon{width:27px;height:27px;border-radius:6px;display:grid;place-items:center;background:#eaf2ff;color:#3b7af7;font-size:17px}.component-card>span:last-child{font-size:10px}.component-card.marketing .component-icon{background:#fff0ef;color:#ff6363}.marketing-section{padding-top:14px}.page-tree-section{margin-top:14px;padding-top:10px;border-top:1px solid #edf1f5}.tree-add{font-size:16px!important;color:#526479!important}.tree-root{height:30px;display:flex;align-items:center;gap:5px;padding:0 7px;border-radius:4px;background:#dfeeff;color:#1769ff;font-size:11px}.tree-children{margin-left:15px;padding:4px 0 0 10px;border-left:1px solid #dce5f0;display:flex;flex-direction:column}.tree-children button{height:24px;border:0;background:transparent;color:#6f7e91;text-align:left;display:flex;align-items:center;gap:6px;font-size:10px;cursor:pointer;border-radius:4px;padding:0 6px}.tree-children button.active,.tree-children button:hover{color:#1769ff;background:#f0f6ff}.empty-tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#8d9bad;padding:30px}.empty-tab i{font-size:38px;color:#83b3fb;margin-bottom:12px}.empty-tab strong{color:#304157;font-size:14px}.empty-tab p{font-size:11px;margin:7px 0 15px}.empty-tab button{border:1px solid #9ec0ff;background:#f7faff;color:#1769ff;border-radius:7px;padding:8px 12px;cursor:pointer}.rail-panel-title{height:64px;padding:0 18px;border-bottom:1px solid #edf1f6;display:flex;align-items:center;justify-content:space-between;color:#7d8da1}.rail-panel-title>div{display:flex;flex-direction:column;gap:3px}.rail-panel-title strong{font-size:14px;color:#26384f}.rail-panel-title span{font-size:9px;color:#a1adbb}.rail-panel-title>i{font-size:18px}.asset-library{padding:10px 16px;display:grid;grid-template-columns:1fr 1fr;gap:9px;overflow:auto}.asset-library button{border:1px solid #e7edf4;background:#fff;border-radius:8px;padding:5px;text-align:left;color:#526277;cursor:pointer}.asset-library button:hover{border-color:#94baff;box-shadow:0 4px 12px rgba(50,85,130,.07)}.asset-library img{width:100%;height:86px;display:block;object-fit:cover;border-radius:5px}.asset-library span{display:block;padding:7px 3px 3px;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.icon-library{padding:18px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.icon-library button{height:54px;border:1px solid #e8edf4;background:#f9fbfd;border-radius:8px;color:#4c7fe4;font-size:22px;cursor:pointer}.icon-library button:hover{background:#eef5ff;border-color:#9fc0ff}
@media(min-width:1700px){.left-workspace{width:454px;min-width:454px}.left-rail{width:78px;flex-basis:78px;padding-left:8px;padding-right:8px}.left-rail button.active::before{left:-8px}.component-card{height:72px}.component-grid{gap:10px}.library-scroll{padding-left:18px;padding-right:18px}.search-box{margin-left:18px;margin-right:18px}}
@media(max-width:1440px){.left-workspace{width:360px;min-width:360px}.component-card{height:64px}.component-grid{gap:7px}}
</style>
