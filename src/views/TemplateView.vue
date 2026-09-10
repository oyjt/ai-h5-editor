<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElDialog, ElMessage, ElMessageBox } from 'element-plus'
import PlatformHeader from '@/components/platform/PlatformHeader.vue'
import { useTemplatesStore } from '@/stores/templates'
import { useEditorStore } from '@/stores/editor'
import type { Template } from '@/types/template'
import { TemplateCategory } from '@/types/template'

const router = useRouter()
const templatesStore = useTemplatesStore()
const editorStore = useEditorStore()
const keyword = ref('')
const category = ref<TemplateCategory | 'all'>('all')
const scope = ref<'all' | 'favorite' | 'custom'>('all')
const previewTemplate = ref<Template | null>(null)
const previewVisible = ref(false)

const categories = [
  { value: 'all', label: '全部' },
  { value: TemplateCategory.Marketing, label: '节日活动' },
  { value: TemplateCategory.Product, label: '电商促销' },
  { value: TemplateCategory.Form, label: '表单收集' },
  { value: TemplateCategory.Article, label: '内容展示' },
]

const filtered = computed(() => {
  let list = templatesStore.getAllTemplatesList()
  if (scope.value === 'favorite') list = list.filter(item => templatesStore.isFavorite(item.id))
  if (scope.value === 'custom') list = list.filter(item => templatesStore.customTemplates.some(custom => custom.id === item.id))
  if (category.value !== 'all') list = list.filter(item => item.category === category.value)
  if (keyword.value.trim()) {
    const target = keyword.value.trim().toLowerCase()
    list = list.filter(item => `${item.name}${item.description}${item.tags.join('')}`.toLowerCase().includes(target))
  }
  return list
})

function isCustom(id: string) { return templatesStore.customTemplates.some(item => item.id === id) }
function openPreview(template: Template) { previewTemplate.value = template; previewVisible.value = true }
function toggleFavorite(template: Template) {
  templatesStore.toggleFavorite(template.id)
  ElMessage.success(templatesStore.isFavorite(template.id) ? '已收藏模板' : '已取消收藏')
}
async function useTemplate(id: string) {
  const template = templatesStore.getTemplateById(id)
  if (!template) return ElMessage.error('模板不存在')
  try {
    await ElMessageBox.confirm(`使用“${template.name}”后会替换当前编辑页面，是否继续？`, '使用模板', {
      confirmButtonText: '使用模板', cancelButtonText: '取消', type: 'info',
    })
    editorStore.setCurrentPage(structuredClone(template.schema))
    editorStore.savePage()
    ElMessage.success(`已应用模板：${template.name}`)
    previewVisible.value = false
    router.push('/')
  }
  catch {}
}
async function deleteCustom(template: Template) {
  try {
    await ElMessageBox.confirm(`确定删除自定义模板“${template.name}”吗？删除后无法恢复。`, '删除模板', {
      confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning',
    })
    if (templatesStore.deleteCustomTemplate(template.id)) ElMessage.success('模板已删除')
  }
  catch {}
}

onMounted(() => templatesStore.loadCustomTemplates())
</script>

<template>
  <div class="shell">
    <PlatformHeader />
    <main class="page">
      <section class="hero">
        <div class="hero-copy"><span>精选模板</span><h1>快速创建高转化营销页面</h1><p>覆盖节日营销、电商促销、线索收集等常见场景，一键应用后继续编辑。</p></div>
        <div class="search"><i class="i-tabler-search"/><input v-model="keyword" placeholder="搜索模板名称、场景或标签..."/><button v-if="keyword" @click="keyword=''">×</button></div>
      </section>

      <section class="toolbar-row">
        <div class="scope-tabs">
          <button :class="{active:scope==='all'}" @click="scope='all'"><i class="i-tabler-layout-grid"/>全部模板</button>
          <button :class="{active:scope==='favorite'}" @click="scope='favorite'"><i class="i-tabler-star"/>我的收藏 <em>{{templatesStore.favoriteTemplateIds.length}}</em></button>
          <button :class="{active:scope==='custom'}" @click="scope='custom'"><i class="i-tabler-user-square"/>我的模板 <em>{{templatesStore.customTemplates.length}}</em></button>
        </div>
        <div class="result-count">共 {{ filtered.length }} 个模板</div>
      </section>

      <div class="tabs"><button v-for="item in categories" :key="String(item.value)" :class="{active:category===item.value}" @click="category=item.value">{{item.label}}</button></div>

      <section v-if="filtered.length" class="grid">
        <article v-for="(template,index) in filtered" :key="template.id" class="card">
          <div class="cover" :class="`cover-${index%4}`" @click="openPreview(template)">
            <div class="phone"><span>{{template.name.slice(0,6)}}</span><i class="i-tabler-sparkles"/><div/><div/><div/></div>
            <span v-if="index<2 && scope==='all'" class="badge">推荐</span>
            <button class="favorite" :class="{active:templatesStore.isFavorite(template.id)}" :title="templatesStore.isFavorite(template.id)?'取消收藏':'收藏模板'" @click.stop="toggleFavorite(template)"><i :class="templatesStore.isFavorite(template.id)?'i-tabler-star-filled':'i-tabler-star'"/></button>
            <div class="overlay">
              <button class="secondary" @click.stop="openPreview(template)"><i class="i-tabler-eye"/>预览</button>
              <button class="primary" @click.stop="useTemplate(template.id)"><i class="i-tabler-wand"/>使用模板</button>
            </div>
          </div>
          <div class="info">
            <div class="name-row"><h3>{{template.name}}</h3><span>{{isCustom(template.id)?'自定义':'免费'}}</span></div>
            <p>{{template.description}}</p>
            <div class="card-footer">
              <div class="tags"><em v-for="tag in template.tags.slice(0,3)" :key="tag">{{tag}}</em></div>
              <button v-if="isCustom(template.id)" class="delete-template" title="删除自定义模板" @click="deleteCustom(template)"><i class="i-tabler-trash"/></button>
            </div>
          </div>
        </article>
      </section>

      <div v-else class="empty"><span class="empty-icon"><i :class="scope==='favorite'?'i-tabler-star-off':scope==='custom'?'i-tabler-template-off':'i-tabler-search-off'"/></span><strong>{{scope==='favorite'?'还没有收藏模板':scope==='custom'?'还没有自定义模板':'没有找到相关模板'}}</strong><span>{{scope==='favorite'?'在模板卡片右上角点击星标即可收藏':scope==='custom'?'可在编辑器中将页面保存为模板':'换一个关键词或分类试试'}}</span><button v-if="scope!=='all'" @click="scope='all'">浏览全部模板</button></div>
    </main>

    <ElDialog v-model="previewVisible" width="760px" align-center class="template-preview-dialog" :close-on-click-modal="true">
      <template #header>
        <div v-if="previewTemplate" class="dialog-head"><div><span>模板预览</span><h3>{{previewTemplate.name}}</h3></div><button :class="{active:templatesStore.isFavorite(previewTemplate.id)}" @click="toggleFavorite(previewTemplate)"><i :class="templatesStore.isFavorite(previewTemplate.id)?'i-tabler-star-filled':'i-tabler-star'"/>{{templatesStore.isFavorite(previewTemplate.id)?'已收藏':'收藏'}}</button></div>
      </template>
      <div v-if="previewTemplate" class="preview-body">
        <div class="preview-stage">
          <div class="preview-phone">
            <div class="preview-notch"/>
            <div class="preview-screen">
              <div class="mock-hero"><strong>{{previewTemplate.name}}</strong><span>{{previewTemplate.description}}</span></div>
              <div class="mock-coupons"><i/><i/><i/></div>
              <div class="mock-products"><div/><div/></div>
              <div class="mock-form"><i/><i/><button>立即参与</button></div>
            </div>
          </div>
        </div>
        <aside class="preview-info"><span class="preview-type">营销模板</span><h2>{{previewTemplate.name}}</h2><p>{{previewTemplate.description}}</p><div class="preview-tags"><em v-for="tag in previewTemplate.tags" :key="tag">{{tag}}</em></div><div class="preview-meta"><div><strong>{{previewTemplate.schema.components.length}}</strong><span>页面组件</span></div><div><strong>H5</strong><span>适用终端</span></div><div><strong>免费</strong><span>使用权限</span></div></div><button class="use-button" @click="useTemplate(previewTemplate.id)"><i class="i-tabler-wand"/>使用此模板</button><small>应用后仍可自由修改全部组件、内容和样式</small></aside>
      </div>
    </ElDialog>
  </div>
</template>

<style scoped>
.shell{min-height:100%;background:var(--surface-0);color:var(--text-primary);overflow:auto}.page{max-width:1380px;margin:auto;padding:28px 32px 46px}.hero{min-height:170px;border-radius:var(--radius-2xl);background:linear-gradient(115deg,#edf6ff,#f7fbff 58%,#f1efff);border:1px solid #e6edf8;padding:28px 32px;display:flex;align-items:center;justify-content:space-between}.hero-copy>span{font-size:11px;color:var(--brand-600);font-weight:700}.hero h1{font-size:26px;color:var(--text-strong);margin:7px 0 8px}.hero p{font-size:12px;color:#8492a5;margin:0}.search{width:350px;height:42px;border:1px solid var(--border-default);background:var(--surface-1);border-radius:var(--radius-lg);display:flex;align-items:center;padding:0 12px;color:#9ba9ba;box-shadow:var(--shadow-sm);transition:.16s ease}.search:focus-within{border-color:var(--brand-400);box-shadow:0 0 0 3px rgba(23,105,255,.08)}.search input{border:0;outline:0;flex:1;margin-left:7px;font-size:12px;background:transparent;color:var(--text-primary)}.search button{width:24px;height:24px;border:0;border-radius:6px;background:transparent;color:#9ba7b7;cursor:pointer}.search button:hover{background:#f0f4f9;color:#53657a}.toolbar-row{height:54px;margin-top:18px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border-subtle)}.scope-tabs{display:flex;height:100%;align-items:flex-end;gap:26px}.scope-tabs button{height:42px;border:0;border-bottom:2px solid transparent;background:transparent;color:#718096;display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;position:relative}.scope-tabs button:hover{color:var(--brand-600)}.scope-tabs button.active{color:var(--brand-600);font-weight:700;border-bottom-color:var(--brand-600)}.scope-tabs button em{min-width:18px;height:18px;border-radius:9px;background:#eef3f8;color:#8290a2;font-style:normal;font-size:9px;display:grid;place-items:center;padding:0 5px}.scope-tabs button.active em{background:var(--brand-100);color:var(--brand-600)}.result-count{font-size:10px;color:#98a5b5}.tabs{display:flex;gap:7px;margin:18px 0 15px}.tabs button{border:1px solid var(--border-default);background:var(--surface-1);color:#718096;padding:8px 15px;border-radius:18px;cursor:pointer;font-size:11px;transition:.16s ease}.tabs button:hover{border-color:#b8cef2;color:var(--brand-600)}.tabs button.active{border-color:#8db2ff;background:#edf4ff;color:#2868ff}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.card{background:var(--surface-1);border:1px solid #e8edf4;border-radius:14px;overflow:hidden;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}.card:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(53,77,112,.09);border-color:#d9e4f3}.cover{height:205px;position:relative;display:flex;justify-content:center;align-items:flex-end;padding-top:16px;overflow:hidden;cursor:pointer}.cover-0{background:linear-gradient(145deg,#72d0ff,#b7f0d8 58%,#ffe5a0)}.cover-1{background:linear-gradient(145deg,#ffc0d6,#ffe5ed)}.cover-2{background:linear-gradient(145deg,#ffab78,#ffd2a2)}.cover-3{background:linear-gradient(145deg,#97b9ff,#ded7ff)}.phone{width:105px;height:185px;background:#fff;border:5px solid #253448;border-radius:20px;padding:17px 8px 8px;box-shadow:0 15px 25px rgba(45,65,95,.18);display:flex;flex-direction:column;align-items:center;transition:transform .2s ease}.card:hover .phone{transform:translateY(-3px)}.phone span{font-size:12px;font-weight:800;color:#2872e9}.phone i{font-size:18px;color:#ffb14e;margin:6px}.phone div{width:100%;height:29px;border-radius:5px;background:#edf4ff;margin-top:5px}.badge{position:absolute;left:10px;top:10px;background:#ff5c6b;color:#fff;font-size:9px;padding:4px 7px;border-radius:10px}.favorite{position:absolute;right:10px;top:10px;width:30px;height:30px;border:1px solid rgba(255,255,255,.78);border-radius:9px;background:rgba(255,255,255,.9);color:#738398;display:grid;place-items:center;cursor:pointer;z-index:3;box-shadow:0 4px 12px rgba(42,62,88,.08)}.favorite:hover,.favorite.active{color:#f5a524;background:#fff}.overlay{position:absolute;inset:0;background:rgba(32,51,80,.56);display:flex;align-items:center;justify-content:center;gap:8px;opacity:0;transition:.18s ease}.card:hover .overlay{opacity:1}.overlay button{height:36px;border-radius:8px;padding:0 13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:5px;font-size:11px}.overlay .secondary{border:1px solid rgba(255,255,255,.74);background:rgba(255,255,255,.12);color:#fff}.overlay .secondary:hover{background:rgba(255,255,255,.22)}.overlay .primary{border:0;background:#fff;color:#2868ff}.info{padding:14px}.name-row{display:flex;justify-content:space-between;align-items:center}.name-row h3{font-size:13px;margin:0;color:var(--text-strong)}.name-row span{font-size:9px;color:#22a06b;background:#eaf9f1;padding:3px 7px;border-radius:10px}.info p{height:34px;overflow:hidden;color:#8794a6;font-size:10px;line-height:1.65;margin:7px 0}.card-footer{display:flex;justify-content:space-between;align-items:center;gap:8px}.tags{display:flex;gap:5px;min-width:0;overflow:hidden}.tags em{font-style:normal;font-size:9px;color:#758399;background:#f3f6fa;padding:3px 6px;border-radius:5px;white-space:nowrap}.delete-template{width:25px;height:25px;flex:0 0 25px;border:0;border-radius:6px;background:transparent;color:#9aa7b7;display:grid;place-items:center;cursor:pointer}.delete-template:hover{background:#fff0f0;color:#ef4444}.empty{height:360px;display:flex;flex-direction:column;justify-content:center;align-items:center;color:#95a2b2}.empty-icon{width:56px;height:56px;border-radius:18px;background:#eef3f8;display:grid;place-items:center;color:#aab6c5;font-size:25px}.empty strong{font-size:13px;color:#69778a;margin-top:12px}.empty>span:not(.empty-icon){font-size:10px;margin-top:5px}.empty button{margin-top:14px;height:32px;padding:0 12px;border:1px solid #bfd2f4;border-radius:8px;background:#fff;color:#1769ff;font-size:10px;cursor:pointer}.dialog-head{display:flex;align-items:center;justify-content:space-between;padding-right:20px}.dialog-head span{font-size:9px;color:#8c99aa}.dialog-head h3{font-size:17px;color:#1d2d42;margin:3px 0 0}.dialog-head button{height:32px;padding:0 10px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;color:#718096;display:flex;align-items:center;gap:5px;font-size:10px;cursor:pointer}.dialog-head button.active{color:#f5a524;background:#fffaf0;border-color:#ffe0a4}.preview-body{display:grid;grid-template-columns:360px 1fr;gap:30px;padding:2px 4px 10px}.preview-stage{height:520px;border-radius:16px;background:radial-gradient(circle at 50% 15%,#fff 0,#edf5ff 46%,#e8eef7 100%);display:flex;align-items:center;justify-content:center}.preview-phone{width:220px;height:465px;border:7px solid #202734;border-radius:34px;background:#111827;padding:4px;box-shadow:0 24px 44px rgba(31,48,72,.22);position:relative}.preview-notch{position:absolute;top:7px;left:50%;transform:translateX(-50%);width:78px;height:19px;border-radius:0 0 13px 13px;background:#202734;z-index:2}.preview-screen{height:100%;border-radius:24px;overflow:hidden;background:#fff;padding-bottom:10px}.mock-hero{height:150px;padding:42px 15px 15px;background:linear-gradient(145deg,#65c8ff,#c4f0d6 55%,#ffe09f);display:flex;flex-direction:column;justify-content:flex-end}.mock-hero strong{font-size:18px;color:#17476f}.mock-hero span{font-size:8px;color:#52728b;margin-top:4px}.mock-coupons{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:8px}.mock-coupons i{height:40px;background:#ffe2de;border-radius:5px}.mock-products{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:0 8px}.mock-products div{height:92px;border-radius:8px;background:linear-gradient(#edf3fa 60%,#fff 60%);border:1px solid #eef2f6}.mock-form{margin:8px;padding:8px;border-radius:8px;background:#f5f9ff}.mock-form i{display:block;height:16px;background:#fff;border:1px solid #e8edf5;border-radius:4px;margin-bottom:5px}.mock-form button{width:100%;height:23px;border:0;border-radius:5px;background:#1769ff;color:#fff;font-size:8px}.preview-info{padding:20px 6px 0}.preview-type{font-size:10px;color:#1769ff;background:#edf4ff;border-radius:12px;padding:5px 8px}.preview-info h2{font-size:22px;color:#17263a;margin:14px 0 8px}.preview-info>p{font-size:11px;color:#8492a5;line-height:1.7}.preview-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}.preview-tags em{font-style:normal;font-size:9px;color:#68798d;background:#f3f6fa;padding:5px 7px;border-radius:6px}.preview-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:20px 0}.preview-meta div{padding:11px 8px;border:1px solid #e7edf4;border-radius:9px;background:#fbfcfe;text-align:center}.preview-meta strong{display:block;font-size:13px;color:#27384e}.preview-meta span{display:block;font-size:8px;color:#9aa7b7;margin-top:4px}.use-button{width:100%;height:40px;border:0;border-radius:9px;background:#1769ff;color:#fff;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 8px 18px rgba(23,105,255,.2)}.use-button:hover{background:#125ee8}.preview-info small{display:block;text-align:center;color:#9ba8b8;font-size:8px;margin-top:7px}@media(max-width:1150px){.grid{grid-template-columns:repeat(3,1fr)}.hero{height:auto;gap:20px}.search{width:280px}.page{padding-left:24px;padding-right:24px}}@media(max-width:900px){.grid{grid-template-columns:repeat(2,1fr)}.hero{align-items:flex-start;flex-direction:column}.search{width:100%}.scope-tabs{gap:14px}.preview-body{grid-template-columns:1fr}.preview-stage{display:none}}
</style>
