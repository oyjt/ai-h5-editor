<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PlatformHeader from '@/components/platform/PlatformHeader.vue'
import { useTemplatesStore } from '@/stores/templates'
import { useEditorStore } from '@/stores/editor'
import { TemplateCategory } from '@/types/template'

const router = useRouter()
const templatesStore = useTemplatesStore()
const editorStore = useEditorStore()
const keyword = ref('')
const category = ref<TemplateCategory | 'all'>('all')
const categories = [
  { value: 'all', label: '全部' },
  { value: TemplateCategory.Marketing, label: '节日活动' },
  { value: TemplateCategory.Product, label: '电商促销' },
  { value: TemplateCategory.Form, label: '表单收集' },
  { value: TemplateCategory.Article, label: '内容展示' },
]
const filtered = computed(() => {
  let list = templatesStore.getAllTemplatesList()
  if (category.value !== 'all') list = list.filter(item => item.category === category.value)
  if (keyword.value.trim()) list = list.filter(item => `${item.name}${item.description}${item.tags.join('')}`.includes(keyword.value.trim()))
  return list
})
function useTemplate(id: string) {
  const template = templatesStore.getTemplateById(id)
  if (!template) return ElMessage.error('模板不存在')
  editorStore.setCurrentPage(template.schema)
  editorStore.savePage()
  ElMessage.success(`已应用模板：${template.name}`)
  router.push('/')
}
onMounted(() => templatesStore.loadCustomTemplates())
</script>

<template>
  <div class="shell">
    <PlatformHeader />
    <main class="page">
      <section class="hero">
        <div><span>精选模板</span><h1>快速创建高转化营销页面</h1><p>覆盖节日营销、电商促销、线索收集等常见场景，一键应用后继续编辑。</p></div>
        <div class="search"><i class="i-tabler-search"/><input v-model="keyword" placeholder="搜索模板名称、场景或标签..."/></div>
      </section>
      <div class="tabs"><button v-for="item in categories" :key="String(item.value)" :class="{active:category===item.value}" @click="category=item.value">{{item.label}}</button></div>
      <section v-if="filtered.length" class="grid">
        <article v-for="(template,index) in filtered" :key="template.id" class="card">
          <div class="cover" :class="`cover-${index%4}`">
            <div class="phone"><span>{{template.name.slice(0,6)}}</span><i class="i-tabler-sparkles"/><div/><div/><div/></div>
            <span v-if="index<2" class="badge">推荐</span>
            <div class="overlay"><button @click="useTemplate(template.id)"><i class="i-tabler-wand"/> 使用模板</button></div>
          </div>
          <div class="info"><div class="name-row"><h3>{{template.name}}</h3><span>免费</span></div><p>{{template.description}}</p><div class="tags"><em v-for="tag in template.tags.slice(0,3)" :key="tag">{{tag}}</em></div></div>
        </article>
      </section>
      <div v-else class="empty"><i class="i-tabler-template-off"/><strong>没有找到相关模板</strong><span>换一个关键词或分类试试</span></div>
    </main>
  </div>
</template>

<style scoped>
.shell{min-height:100%;background:#f6f8fc;color:#1d2d42}.page{max-width:1380px;margin:auto;padding:28px 32px 46px}.hero{height:170px;border-radius:18px;background:linear-gradient(115deg,#edf6ff,#f7fbff 58%,#f1efff);border:1px solid #e6edf8;padding:28px 32px;display:flex;align-items:center;justify-content:space-between}.hero span{font-size:11px;color:#2f70ff;font-weight:700}.hero h1{font-size:26px;margin:7px 0 8px}.hero p{font-size:12px;color:#8492a5;margin:0}.search{width:330px;height:42px;border:1px solid #dfe8f4;background:#fff;border-radius:10px;display:flex;align-items:center;padding:0 12px;color:#9ba9ba;box-shadow:0 8px 20px rgba(58,78,112,.06)}.search input{border:0;outline:0;flex:1;margin-left:7px;font-size:12px}.tabs{display:flex;gap:7px;margin:20px 0 15px}.tabs button{border:1px solid #e3e9f1;background:#fff;color:#718096;padding:8px 15px;border-radius:18px;cursor:pointer;font-size:11px}.tabs button.active{border-color:#8db2ff;background:#edf4ff;color:#2868ff}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.card{background:#fff;border:1px solid #e8edf4;border-radius:14px;overflow:hidden;transition:.2s}.card:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(53,77,112,.09)}.cover{height:205px;position:relative;display:flex;justify-content:center;align-items:flex-end;padding-top:16px;overflow:hidden}.cover-0{background:linear-gradient(145deg,#72d0ff,#b7f0d8 58%,#ffe5a0)}.cover-1{background:linear-gradient(145deg,#ffc0d6,#ffe5ed)}.cover-2{background:linear-gradient(145deg,#ffab78,#ffd2a2)}.cover-3{background:linear-gradient(145deg,#97b9ff,#ded7ff)}.phone{width:105px;height:185px;background:#fff;border:5px solid #253448;border-radius:20px;padding:17px 8px 8px;box-shadow:0 15px 25px rgba(45,65,95,.18);display:flex;flex-direction:column;align-items:center}.phone span{font-size:12px;font-weight:800;color:#2872e9}.phone i{font-size:18px;color:#ffb14e;margin:6px}.phone div{width:100%;height:29px;border-radius:5px;background:#edf4ff;margin-top:5px}.badge{position:absolute;left:10px;top:10px;background:#ff5c6b;color:#fff;font-size:9px;padding:4px 7px;border-radius:10px}.overlay{position:absolute;inset:0;background:rgba(32,51,80,.58);display:grid;place-items:center;opacity:0;transition:.2s}.card:hover .overlay{opacity:1}.overlay button{height:36px;border:0;border-radius:8px;background:#fff;color:#2868ff;padding:0 14px;font-weight:600;cursor:pointer}.info{padding:14px}.name-row{display:flex;justify-content:space-between;align-items:center}.name-row h3{font-size:13px;margin:0}.name-row span{font-size:9px;color:#22a06b;background:#eaf9f1;padding:3px 7px;border-radius:10px}.info p{height:34px;overflow:hidden;color:#8794a6;font-size:10px;line-height:1.65;margin:7px 0}.tags{display:flex;gap:5px}.tags em{font-style:normal;font-size:9px;color:#758399;background:#f3f6fa;padding:3px 6px;border-radius:5px}.empty{height:360px;display:flex;flex-direction:column;justify-content:center;align-items:center;color:#95a2b2}.empty i{font-size:38px;color:#bcc7d3}.empty strong{font-size:13px;color:#69778a;margin-top:10px}.empty span{font-size:10px;margin-top:5px}@media(max-width:1150px){.grid{grid-template-columns:repeat(3,1fr)}.hero{height:auto;gap:20px}.search{width:280px}}</style>
