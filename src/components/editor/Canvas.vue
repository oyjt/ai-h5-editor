<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useEditorStore } from '@/stores/editor'
import PageRenderer from '@/components/renderer/PageRenderer.vue'
import { getAllComponents } from '@/config/component-registry'
import { createComponentSchema } from '@/utils/schema-generator'

const editorStore = useEditorStore()
const isDragOver = ref(false)
const isDragging = ref(false)
const hasComponents = computed(() => editorStore.currentPage.components.length > 0)
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
const heroUrl = asset('marketing/summer-hero.svg')
const sunscreenUrl = asset('marketing/product-sunscreen.svg')
const headphonesUrl = asset('marketing/product-headphones.svg')

function handleSelectComponent(id: string) { editorStore.selectComponent(id) }
function handleHoverComponent(id: string | null) { editorStore.hoverComponent(id) }
function handleUpdateOrder(components: any[]) { editorStore.updateComponentsOrder(components) }
function handleDragStart() { isDragging.value = true }
function handleDragOver(e: DragEvent) { e.preventDefault(); isDragOver.value = true; if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy' }
function handleDragLeave() { isDragOver.value = false }
function handleDragEnd() { isDragging.value = false; isDragOver.value = false }
function handleDrop(e: DragEvent) {
  e.preventDefault(); isDragOver.value = false
  const componentType = e.dataTransfer?.getData('componentType')
  if (!componentType) return
  const config = getAllComponents().find(item => item.type === componentType)
  if (!config) return ElMessage.error('组件配置不存在')
  editorStore.addComponent(createComponentSchema(componentType, { ...config.defaultProps }, { ...config.defaultStyles }))
  ElMessage.success(`已添加 ${config.name}`)
}
</script>

<template>
  <div class="canvas">
    <div class="ruler ruler-x"><span v-for="n in 12" :key="n">{{ n * 10 }}</span></div>
    <div class="ruler ruler-y"><span v-for="n in 10" :key="n">{{ n * 10 }}</span></div>

    <div class="canvas-container">
      <div class="floating-tools">
        <button><i class="i-tabler-arrow-up" /><span>上移</span></button>
        <button><i class="i-tabler-arrow-down" /><span>下移</span></button>
        <button><i class="i-tabler-copy" /><span>复制</span></button>
        <button><i class="i-tabler-trash" /><span>删除</span></button>
      </div>

      <div class="phone-shell">
        <div
          class="device-frame"
          :class="{ 'drag-over': isDragOver, dragging: isDragging }"
          @dragstart="handleDragStart"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
          @dragend="handleDragEnd"
        >
          <div class="device-screen">
            <div class="status-bar"><strong>9:41</strong><span><i class="i-tabler-antenna-bars-5" /><i class="i-tabler-wifi" /><i class="i-tabler-battery-4" /></span></div>

            <div v-if="!hasComponents" class="marketing-demo">
              <div class="hero-block selected-demo">
                <img :src="heroUrl" alt="夏日焕新季" />
                <div class="selection-toolbar"><button><i class="i-tabler-copy" /></button><button><i class="i-tabler-trash" /></button><button><i class="i-tabler-dots" /></button></div>
                <i v-for="n in 8" :key="n" class="resize-dot" :class="`dot-${n}`" />
                <span class="slide-index">1/3</span>
              </div>

              <section class="coupon-card">
                <div class="coupon"><strong>¥20</strong><span>满199可用</span></div>
                <div class="coupon"><strong>¥50</strong><span>满300可用</span></div>
                <div class="coupon"><strong>¥100</strong><span>满500可用</span></div>
                <button>立即<br>领取</button>
              </section>

              <section class="recommend-section">
                <div class="section-heading"><strong>· 热门推荐 ·</strong><span>更多 ›</span></div>
                <div class="product-grid">
                  <article><img :src="sunscreenUrl" alt="防晒霜" /><p>安热沙防晒霜 SPF50+</p><div><strong>¥159</strong><del>¥199</del><i class="i-tabler-shopping-cart" /></div></article>
                  <article><img :src="headphonesUrl" alt="蓝牙耳机" /><p>新品蓝牙耳机 轻盈舒适</p><div><strong>¥299</strong><del>¥399</del><i class="i-tabler-shopping-cart" /></div></article>
                </div>
              </section>

              <section class="signup-card">
                <h3>立即报名 领取专属福利</h3>
                <p>填写信息，获取活动详情与限时优惠</p>
                <div class="form-row"><input placeholder="请输入您的姓名" /><input placeholder="请输入手机号" /></div>
                <button>立即提交</button>
              </section>

              <nav class="demo-tabbar"><span class="active"><i class="i-tabler-home-filled" />首页</span><span><i class="i-tabler-heart-filled" />活动</span><span><i class="i-tabler-shopping-bag" />好物</span><span><i class="i-tabler-user-filled" />我的</span></nav>
            </div>

            <div v-else class="page-content">
              <PageRenderer
                :schema="editorStore.currentPage"
                :is-editing="true"
                :selected-id="editorStore.selectedComponentId"
                :hovered-id="editorStore.hoveredComponentId"
                @select-component="handleSelectComponent"
                @hover-component="handleHoverComponent"
                @update-order="handleUpdateOrder"
              />
            </div>
          </div>
        </div>
      </div>

      <aside class="page-strip">
        <div class="page-thumb active"><div class="thumb-preview"><img :src="heroUrl" alt="页面缩略图" /><span /><span /></div><strong>页面 1</strong></div>
        <button class="add-page"><i class="i-tabler-plus" /><span>新增页面</span></button>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.canvas { flex:1; min-width:0; height:100%; position:relative; overflow:hidden; background:#f6f9fd; background-image:radial-gradient(circle,rgba(94,123,165,.16) 1px,transparent 1px); background-size:20px 20px; }
[data-theme='dark'] .canvas { background-color:#20242b; }
.ruler { position:absolute; z-index:5; color:#a8b2c0; font-size:9px; pointer-events:none; }
.ruler-x { left:0; right:0; top:0; height:24px; border-bottom:1px solid rgba(148,163,184,.18); display:flex; justify-content:space-around; align-items:center; }
.ruler-y { left:0; top:24px; bottom:0; width:24px; border-right:1px solid rgba(148,163,184,.18); display:flex; flex-direction:column; justify-content:space-around; align-items:center; }
.canvas-container { position:absolute; inset:24px 0 0 24px; display:flex; align-items:center; justify-content:center; gap:24px; padding:24px 34px; overflow:auto; }
.phone-shell { position:relative; }
.device-frame { width:375px; height:760px; border-radius:42px; padding:9px; background:linear-gradient(145deg,#d8dee7,#8f99a7); box-shadow:0 18px 50px rgba(50,77,113,.20),0 0 0 1px rgba(80,93,110,.25); transition:.2s ease; }
.device-frame.drag-over { box-shadow:0 0 0 4px rgba(23,105,255,.18),0 18px 50px rgba(23,105,255,.24); transform:scale(1.01); }
.device-frame.dragging { opacity:.82; }
.device-screen { width:100%; height:100%; overflow:hidden; border-radius:34px; background:#fff; display:flex; flex-direction:column; position:relative; }
.status-bar { height:36px; min-height:36px; padding:8px 18px 0; display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,.96); color:#17324d; font-size:11px; position:relative; z-index:10; }
.status-bar span { display:flex; gap:4px; align-items:center; font-size:13px; }
.page-content { flex:1; min-height:0; overflow:auto; }
.marketing-demo { flex:1; min-height:0; overflow:auto; background:#fff; color:#263c55; padding-bottom:48px; }
.marketing-demo::-webkit-scrollbar,.page-content::-webkit-scrollbar { width:3px; }.marketing-demo::-webkit-scrollbar-thumb,.page-content::-webkit-scrollbar-thumb{background:rgba(20,50,80,.18);border-radius:3px}
.hero-block { margin:0 10px; position:relative; border-radius:12px; overflow:visible; }.hero-block>img{display:block;width:100%;border-radius:12px}
.selected-demo { outline:2px solid #2684ff; outline-offset:-2px; }
.selection-toolbar { position:absolute; right:4px; top:-28px; height:28px; display:flex; background:#2684ff; border-radius:6px 6px 0 0; overflow:hidden; }.selection-toolbar button{width:30px;border:0;background:transparent;color:#fff;cursor:pointer}.selection-toolbar button:hover{background:rgba(255,255,255,.16)}
.resize-dot { width:7px;height:7px;border:2px solid #2684ff;background:#fff;border-radius:50%;position:absolute;z-index:4}.dot-1{left:-4px;top:-4px}.dot-2{left:50%;top:-4px}.dot-3{right:-4px;top:-4px}.dot-4{right:-4px;top:50%}.dot-5{right:-4px;bottom:-4px}.dot-6{left:50%;bottom:-4px}.dot-7{left:-4px;bottom:-4px}.dot-8{left:-4px;top:50%}
.slide-index { position:absolute;right:8px;bottom:8px;background:rgba(0,0,0,.45);color:#fff;border-radius:10px;padding:2px 7px;font-size:10px; }
.coupon-card { margin:9px 10px; padding:7px; background:linear-gradient(135deg,#ffd7d2,#ffaaa2); border-radius:12px; display:grid; grid-template-columns:repeat(3,1fr) 58px; gap:5px; }.coupon{background:#fff4ea;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;height:57px;border:1px dashed #ff8b7c}.coupon strong{font-size:17px;color:#e94141}.coupon span{font-size:9px;color:#9b6d67}.coupon-card>button{border:0;border-radius:8px;background:linear-gradient(180deg,#ff645f,#ef3e43);color:white;font-size:11px;font-weight:700}
.recommend-section { padding:2px 10px 0; }.section-heading{display:flex;align-items:center;justify-content:center;position:relative;height:30px}.section-heading strong{font-size:12px;color:#253f63}.section-heading span{position:absolute;right:0;font-size:9px;color:#8b9aae}
.product-grid { display:grid;grid-template-columns:1fr 1fr;gap:8px; }.product-grid article{border:1px solid #edf0f4;border-radius:10px;overflow:hidden;background:#fff;box-shadow:0 4px 12px rgba(38,67,102,.05)}.product-grid img{width:100%;height:92px;object-fit:cover;display:block}.product-grid p{font-size:9px;padding:6px 7px 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.product-grid article>div{display:flex;align-items:center;gap:4px;padding:0 7px 7px}.product-grid strong{color:#ef4444;font-size:12px}.product-grid del{color:#a5afba;font-size:8px}.product-grid i{margin-left:auto;color:#ff8990;font-size:13px}
.signup-card { margin:10px; padding:12px; border-radius:12px; background:linear-gradient(180deg,#eaf4ff,#f7fbff); text-align:center; }.signup-card h3{font-size:13px;color:#2457a6}.signup-card>p{font-size:9px;color:#7a8ba3;margin:4px 0 9px}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:7px}.form-row input{width:100%;height:31px;border:1px solid #e3ebf5;background:#fff;border-radius:6px;padding:0 8px;font-size:9px;outline:0}.signup-card>button{width:100%;height:34px;border:0;border-radius:18px;background:linear-gradient(90deg,#1677ff,#3b82f6);color:#fff;font-size:11px;margin-top:8px}
.demo-tabbar { height:46px; position:sticky; bottom:-48px; margin-top:-2px; background:#fff; border-top:1px solid #edf1f5; display:grid;grid-template-columns:repeat(4,1fr);box-shadow:0 -4px 14px rgba(29,58,92,.05)}.demo-tabbar span{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:8px;color:#8b99aa}.demo-tabbar i{font-size:14px}.demo-tabbar .active{color:#1677ff}
.floating-tools { width:48px; border-radius:8px; background:var(--editor-bg-tertiary); box-shadow:0 8px 24px rgba(40,71,110,.12); border:1px solid var(--border-color); overflow:hidden; }.floating-tools button{width:48px;height:48px;border:0;border-bottom:1px solid var(--border-color);background:transparent;color:var(--text-tertiary);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:9px;cursor:pointer}.floating-tools button:last-child{border-bottom:0}.floating-tools button:hover{color:#1769ff;background:rgba(23,105,255,.05)}.floating-tools i{font-size:15px}
.page-strip { width:82px; align-self:flex-start; margin-top:18px; display:flex;flex-direction:column;gap:12px; }.page-thumb{border:1px solid var(--border-color);background:var(--editor-bg-tertiary);border-radius:8px;padding:6px;text-align:center;color:var(--text-secondary);font-size:10px}.page-thumb.active{border-color:#2684ff;box-shadow:0 0 0 2px rgba(38,132,255,.08)}.thumb-preview{height:104px;background:#fff;border-radius:5px;overflow:hidden;padding:4px}.thumb-preview img{width:100%;height:45px;object-fit:cover;border-radius:3px}.thumb-preview span{display:block;height:20px;margin-top:4px;border-radius:3px;background:#f1f5f9}.page-thumb strong{display:block;margin-top:6px;font-weight:500}.add-page{height:76px;border:1px dashed #c7d1df;background:var(--editor-bg-tertiary);border-radius:8px;color:var(--text-tertiary);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;font-size:9px;cursor:pointer}.add-page i{font-size:19px}
@media (max-height:900px){.device-frame{height:680px;width:335px}.product-grid img{height:78px}.coupon{height:50px}.signup-card{padding:9px}}
</style>
