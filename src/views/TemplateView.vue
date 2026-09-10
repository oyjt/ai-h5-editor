<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElDialog, ElMessage, ElMessageBox } from 'element-plus'
import PlatformHeader from '@/components/platform/PlatformHeader.vue'
import { useEditorStore } from '@/stores/editor'
import { useTemplatesStore } from '@/stores/templates'
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
    await ElMessageBox.confirm(`使用“${template.name}”后会替换当前编辑页面，是否继续？`, '使用模板', { confirmButtonText: '使用模板', cancelButtonText: '取消', type: 'info' })
    editorStore.setCurrentPage(structuredClone(template.schema))
    editorStore.savePage()
    previewVisible.value = false
    ElMessage.success(`已应用模板：${template.name}`)
    router.push('/')
  }
  catch {}
}
async function deleteCustom(template: Template) {
  try {
    await ElMessageBox.confirm(`确定删除自定义模板“${template.name}”吗？删除后无法恢复。`, '删除模板', { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' })
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
      <div class="page-head">
        <div><h1>模板中心</h1><p>海量精品模板，快速创建专业的 H5 页面</p></div>
        <label class="search ds-search-field"><i class="i-tabler-search" /><input v-model="keyword" placeholder="搜索模板名称、关键词..." /><button v-if="keyword" @click="keyword = ''">×</button></label>
      </div>

      <section class="panel">
        <div class="top-filters">
          <div class="category-tabs"><button v-for="item in categories" :key="String(item.value)" :class="{ active: category === item.value }" @click="category = item.value">{{ item.label }}</button></div>
          <div class="scope-tabs">
            <button :class="{ active: scope === 'all' }" @click="scope = 'all'">全部模板</button>
            <button :class="{ active: scope === 'favorite' }" @click="scope = 'favorite'"><i class="i-tabler-star" /> 我的收藏 <em>{{ templatesStore.favoriteTemplateIds.length }}</em></button>
            <button :class="{ active: scope === 'custom' }" @click="scope = 'custom'"><i class="i-tabler-user-square" /> 我的模板 <em>{{ templatesStore.customTemplates.length }}</em></button>
          </div>
        </div>

        <div class="subbar"><span>共 {{ filtered.length }} 个模板</span><button @click="scope = 'all'; category = 'all'; keyword = ''"><i class="i-tabler-refresh" /> 重置筛选</button></div>

        <section v-if="filtered.length" class="grid">
          <article v-for="(template,index) in filtered" :key="template.id" class="card">
            <div class="cover" :class="`cover-${index % 6}`" @click="openPreview(template)">
              <div class="template-art"><strong>{{ template.name.slice(0, 6) }}</strong><span>{{ template.tags[0] || '营销活动' }}</span><i class="i-tabler-sparkles" /></div>
              <span v-if="index < 2 && scope === 'all'" class="badge">推荐</span>
              <button class="favorite" :class="{ active: templatesStore.isFavorite(template.id) }" @click.stop="toggleFavorite(template)"><i :class="templatesStore.isFavorite(template.id) ? 'i-tabler-heart-filled' : 'i-tabler-heart'" /></button>
              <div class="overlay"><button class="ghost" @click.stop="openPreview(template)"><i class="i-tabler-eye" />预览</button><button class="use" @click.stop="useTemplate(template.id)"><i class="i-tabler-wand" />使用模板</button></div>
            </div>
            <div class="info">
              <div class="name-row"><h3>{{ template.name }}</h3><span>{{ isCustom(template.id) ? '自定义' : '免费' }}</span></div>
              <p>{{ template.description }}</p>
              <div class="card-foot"><div class="tags"><em v-for="tag in template.tags.slice(0, 2)" :key="tag">{{ tag }}</em></div><button v-if="isCustom(template.id)" class="delete" @click="deleteCustom(template)"><i class="i-tabler-trash" /></button></div>
            </div>
          </article>
        </section>

        <div v-else class="empty"><i :class="scope === 'favorite' ? 'i-tabler-heart-off' : 'i-tabler-template-off'" /><strong>{{ scope === 'favorite' ? '还没有收藏模板' : scope === 'custom' ? '还没有自定义模板' : '没有找到相关模板' }}</strong><span>调整筛选条件或搜索关键词后重试</span></div>
      </section>
    </main>

    <ElDialog v-model="previewVisible" width="760px" align-center>
      <template #header><div v-if="previewTemplate" class="dialog-head"><div><small>模板预览</small><h3>{{ previewTemplate.name }}</h3></div><button @click="toggleFavorite(previewTemplate)"><i :class="templatesStore.isFavorite(previewTemplate.id) ? 'i-tabler-heart-filled' : 'i-tabler-heart'" /> {{ templatesStore.isFavorite(previewTemplate.id) ? '已收藏' : '收藏' }}</button></div></template>
      <div v-if="previewTemplate" class="preview-body">
        <div class="preview-stage"><div class="preview-phone"><div class="notch" /><div class="screen"><div class="mock-hero"><strong>{{ previewTemplate.name }}</strong><span>{{ previewTemplate.description }}</span></div><div class="mock-row"><i /><i /><i /></div><div class="mock-products"><i /><i /></div></div></div></div>
        <aside class="preview-info"><span>营销模板</span><h2>{{ previewTemplate.name }}</h2><p>{{ previewTemplate.description }}</p><div class="preview-tags"><em v-for="tag in previewTemplate.tags" :key="tag">{{ tag }}</em></div><button @click="useTemplate(previewTemplate.id)"><i class="i-tabler-wand" /> 使用此模板</button><small>应用后可继续自由编辑全部组件和样式</small></aside>
      </div>
    </ElDialog>
  </div>
</template>

<style scoped>
.shell{min-height:100%;background:var(--surface-0);color:var(--text-primary)}.page{max-width:1380px;margin:auto;padding:24px 28px 44px}.page-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:16px}.page-head h1{font-size:22px;margin:0 0 5px;color:var(--text-strong)}.page-head p{margin:0;color:var(--text-muted);font-size:var(--font-size-md)}.search{width:320px;height:36px;display:flex;align-items:center;padding:0 10px;color:var(--text-muted)}.search input{flex:1;min-width:0;margin-left:6px;font-size:var(--font-size-md)}.search button{width:24px;height:24px;border:0;border-radius:6px;background:transparent;color:var(--text-muted);cursor:pointer}.search button:hover{background:var(--surface-3);color:var(--text-secondary)}.panel{background:var(--surface-1);border:1px solid var(--border-subtle);border-radius:var(--radius-xl);padding:0 18px 18px;box-shadow:var(--shadow-xs)}.top-filters{min-height:58px;border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;gap:20px}.category-tabs,.scope-tabs{display:flex;align-items:center;gap:4px}.category-tabs button,.scope-tabs button{height:32px;border:0;border-radius:var(--radius-md);background:transparent;color:var(--text-secondary);padding:0 12px;font-size:var(--font-size-md);cursor:pointer;display:flex;align-items:center;gap:5px}.category-tabs button:hover,.scope-tabs button:hover{background:var(--brand-50);color:var(--brand-600)}.category-tabs button.active,.scope-tabs button.active{background:var(--brand-100);color:var(--brand-600);font-weight:600}.scope-tabs em{font-style:normal;min-width:17px;height:17px;border-radius:9px;background:var(--surface-3);display:grid;place-items:center;font-size:9px}.subbar{height:44px;display:flex;align-items:center;justify-content:space-between;color:var(--text-muted);font-size:var(--font-size-xs)}.subbar button{height:28px;border:0;border-radius:var(--radius-sm);background:transparent;color:var(--text-secondary);cursor:pointer}.subbar button:hover{background:var(--surface-3);color:var(--brand-600)}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.card{background:var(--surface-1);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);overflow:hidden;transition:all var(--motion-base) var(--ease-standard)}.card:hover{transform:translateY(-2px);border-color:var(--border-brand);box-shadow:var(--shadow-sm)}.cover{height:174px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;cursor:pointer}.cover-0{background:linear-gradient(145deg,#62cbff,#b7edd7 58%,#ffe39d)}.cover-1{background:linear-gradient(145deg,#ff9fbd,#ffe2ec)}.cover-2{background:linear-gradient(145deg,#ff9a70,#ffd4aa)}.cover-3{background:linear-gradient(145deg,#34456b,#8a72b7)}.cover-4{background:linear-gradient(145deg,#ffc166,#fff0b2)}.cover-5{background:linear-gradient(145deg,#75a0ff,#d1ddff)}.template-art{width:118px;height:146px;border:4px solid rgba(27,39,57,.92);border-radius:17px;background:rgba(255,255,255,.95);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 14px 24px rgba(31,51,78,.16)}.template-art strong{font-size:13px;color:var(--brand-600)}.template-art span{margin-top:5px;font-size:9px;color:var(--text-muted)}.template-art i{margin-top:12px;font-size:24px;color:#f5a524}.badge{position:absolute;left:9px;top:9px;padding:4px 7px;border-radius:10px;background:#ff5968;color:#fff;font-size:9px}.favorite{position:absolute;right:9px;top:9px;width:29px;height:29px;border:1px solid rgba(255,255,255,.78);border-radius:8px;background:rgba(255,255,255,.92);color:var(--text-secondary);cursor:pointer;z-index:2}.favorite:hover,.favorite.active{color:#ff5e7a}.overlay{position:absolute;inset:0;background:rgba(31,49,75,.48);display:flex;align-items:center;justify-content:center;gap:7px;opacity:0;transition:opacity var(--motion-base) var(--ease-standard)}.card:hover .overlay{opacity:1}.overlay button{height:34px;padding:0 12px;border-radius:var(--radius-md);font-size:11px;font-weight:600;cursor:pointer}.ghost{border:1px solid rgba(255,255,255,.7);background:rgba(255,255,255,.12);color:#fff}.use{border:0;background:#fff;color:var(--brand-600)}.info{padding:11px 12px 12px}.name-row{display:flex;align-items:center;justify-content:space-between}.name-row h3{margin:0;font-size:12px;color:var(--text-primary)}.name-row span{font-size:9px;padding:3px 7px;border-radius:10px;background:var(--success-50);color:var(--success-500)}.info p{height:31px;margin:6px 0;color:var(--text-muted);font-size:9px;line-height:1.65;overflow:hidden}.card-foot{display:flex;align-items:center;justify-content:space-between}.tags{display:flex;gap:4px}.tags em,.preview-tags em{font-style:normal;font-size:9px;padding:3px 6px;border-radius:5px;background:var(--surface-3);color:var(--text-secondary)}.delete{width:25px;height:25px;border:0;border-radius:6px;background:transparent;color:var(--text-muted);cursor:pointer}.delete:hover{background:var(--danger-50);color:var(--danger-500)}.empty{height:320px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-muted)}.empty>i{font-size:34px;color:var(--brand-300)}.empty strong{margin-top:9px;color:var(--text-secondary)}.empty span{margin-top:5px;font-size:10px}.dialog-head{display:flex;align-items:center;justify-content:space-between;padding-right:24px}.dialog-head small{color:var(--text-muted);font-size:9px}.dialog-head h3{margin:4px 0 0;font-size:16px;color:var(--text-strong)}.dialog-head button{height:30px;border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--surface-1);color:var(--text-secondary);cursor:pointer}.preview-body{display:grid;grid-template-columns:360px 1fr;gap:28px}.preview-stage{height:500px;border-radius:var(--radius-xl);background:radial-gradient(circle at 50% 15%,#fff 0,#edf5ff 50%,#e7edf6 100%);display:flex;align-items:center;justify-content:center}.preview-phone{width:214px;height:450px;padding:4px;border:7px solid #202734;border-radius:34px;background:#202734;position:relative;box-shadow:0 20px 40px rgba(31,48,72,.2)}.notch{position:absolute;left:50%;top:4px;transform:translateX(-50%);width:76px;height:20px;border-radius:0 0 14px 14px;background:#202734;z-index:2}.screen{height:100%;border-radius:24px;overflow:hidden;background:#fff}.mock-hero{height:155px;padding:45px 14px 14px;background:linear-gradient(145deg,#65c8ff,#c4f0d6 55%,#ffe09f);display:flex;flex-direction:column;justify-content:flex-end}.mock-hero strong{font-size:17px;color:#17476f}.mock-hero span{font-size:8px;color:#52728b;margin-top:4px}.mock-row{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:8px}.mock-row i{height:44px;border-radius:5px;background:#ffe2de}.mock-products{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:0 8px}.mock-products i{height:105px;border-radius:8px;background:linear-gradient(#edf3fa 64%,#fff 64%);border:1px solid #eef2f6}.preview-info{padding:24px 6px}.preview-info>span{font-size:9px;color:var(--brand-600);background:var(--brand-50);padding:5px 8px;border-radius:10px}.preview-info h2{font-size:21px;margin:14px 0 8px;color:var(--text-strong)}.preview-info p{font-size:11px;line-height:1.7;color:var(--text-secondary)}.preview-tags{display:flex;gap:5px;flex-wrap:wrap;margin:14px 0 22px}.preview-info>button{width:100%;height:40px;border:0;border-radius:var(--radius-md);background:var(--brand-600);color:#fff;font-weight:600;cursor:pointer;box-shadow:var(--shadow-brand)}.preview-info>small{display:block;text-align:center;margin-top:7px;color:var(--text-muted);font-size:8px}@media(max-width:1120px){.grid{grid-template-columns:repeat(3,1fr)}.top-filters{align-items:flex-start;flex-direction:column;padding:12px 0}.page-head{align-items:flex-start;gap:14px;flex-direction:column}.search{width:100%}}@media(max-width:850px){.grid{grid-template-columns:repeat(2,1fr)}.preview-body{grid-template-columns:1fr}.preview-stage{display:none}.scope-tabs{flex-wrap:wrap}.page{padding:22px 20px}}
</style>
