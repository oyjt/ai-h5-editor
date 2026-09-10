<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElDialog, ElInput, ElMessage } from 'element-plus'
import PlatformHeader from '@/components/platform/PlatformHeader.vue'

const router=useRouter();const createVisible=ref(false);const keyword=ref('');const projectName=ref('未命名营销活动')
const projects=ref([
  {id:1,name:'夏日焕新营销页',status:'已发布',updated:'刚刚',theme:'summer'},
  {id:2,name:'七夕礼遇专题',status:'草稿',updated:'2 小时前',theme:'pink'},
  {id:3,name:'618 大促会场',status:'已发布',updated:'昨天',theme:'orange'},
])
const filteredProjects=computed(()=>projects.value.filter(item=>item.name.includes(keyword.value.trim())))
function createProject(){const name=projectName.value.trim();if(!name)return ElMessage.warning('请输入项目名称');projects.value.unshift({id:Date.now(),name,status:'草稿',updated:'刚刚',theme:'blue'});createVisible.value=false;ElMessage.success('项目已创建');router.push('/')}
</script>

<template>
  <div class="page-shell">
    <PlatformHeader/>
    <main class="workspace-page">
      <section class="hero">
        <div><p class="eyebrow">上午好，设计师 👋</p><h1>开始创作你的营销页面</h1><p>从模板快速开始，或创建一个空白 H5 页面。</p></div>
        <div class="hero-actions"><button class="secondary" @click="router.push('/templates')"><i class="i-tabler-template"/> 从模板创建</button><button class="primary" @click="createVisible=true"><i class="i-tabler-plus"/> 新建项目</button></div>
      </section>

      <section class="stats-grid">
        <article><span class="stat-icon blue"><i class="i-tabler-files"/></span><div><small>我的作品</small><strong>12</strong><em>全部项目</em></div></article>
        <article><span class="stat-icon green"><i class="i-tabler-circle-check"/></span><div><small>已发布</small><strong>6</strong><em>可对外访问</em></div></article>
        <article><span class="stat-icon orange"><i class="i-tabler-edit"/></span><div><small>草稿</small><strong>3</strong><em>继续完善</em></div></article>
        <article><span class="stat-icon violet"><i class="i-tabler-photo"/></span><div><small>素材</small><strong>28</strong><em>项目资源</em></div></article>
      </section>

      <section class="content-card">
        <div class="section-head"><div><h2>最近作品</h2><p>继续编辑最近创建的营销页面</p></div><div class="list-actions"><label class="search ds-search-field"><i class="i-tabler-search"/><input v-model="keyword" placeholder="搜索作品"></label><button @click="router.push('/projects')">查看全部 <i class="i-tabler-arrow-right"/></button></div></div>
        <div v-if="filteredProjects.length" class="project-grid">
          <article v-for="project in filteredProjects" :key="project.id" class="project-card">
            <div class="cover" :class="project.theme"><span class="summer-copy">{{ project.name.slice(0,6) }}</span><div class="mini-phone"><div/><div/><div/></div><button class="edit-mask" @click="router.push('/')"><i class="i-tabler-edit"/> 继续编辑</button></div>
            <div class="project-info"><div class="title-row"><h3>{{ project.name }}</h3><span :class="{draft:project.status==='草稿'}">{{ project.status }}</span></div><p><i class="i-tabler-clock"/> 更新于 {{ project.updated }}</p></div>
          </article>
          <button class="new-card" @click="createVisible=true"><i class="i-tabler-plus"/><strong>新建作品</strong><span>从空白页面开始</span></button>
        </div>
        <div v-else class="empty"><i class="i-tabler-search-off"/><strong>没有找到相关作品</strong><span>换一个关键词试试</span></div>
      </section>

      <section class="quick-grid">
        <article><i class="i-tabler-template"/><div><strong>模板中心</strong><span>精选营销模板快速复用</span></div><button @click="router.push('/templates')">去看看</button></article>
        <article><i class="i-tabler-photo"/><div><strong>素材管理</strong><span>统一管理图片与营销素材</span></div><button @click="router.push('/assets')">管理素材</button></article>
      </section>
    </main>

    <ElDialog v-model="createVisible" title="新建 H5 项目" width="460px" align-center>
      <div class="dialog-form"><label>项目名称</label><ElInput v-model="projectName" maxlength="30" show-word-limit/><label>创建方式</label><div class="create-types"><button class="selected"><i class="i-tabler-file-plus"/>空白页面</button><button @click="createVisible=false;router.push('/templates')"><i class="i-tabler-template"/>使用模板</button></div></div>
      <template #footer><button class="dialog-cancel" @click="createVisible=false">取消</button><button class="dialog-confirm" :disabled="!projectName.trim()" @click="createProject">创建并编辑</button></template>
    </ElDialog>
  </div>
</template>

<style scoped>
.page-shell{min-height:100%;background:var(--surface-0);color:var(--text-strong)}.workspace-page{max-width:1440px;margin:0 auto;padding:24px 28px 44px}.hero{min-height:132px;border-radius:var(--radius-xl);padding:24px 28px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(110deg,var(--brand-50),#f8fbff 58%,#eef4ff);border:1px solid var(--border-subtle);box-shadow:var(--shadow-xs)}.eyebrow{font-size:var(--font-size-base);color:var(--brand-600);margin:0 0 7px;font-weight:600}.hero h1{font-size:24px;margin:0 0 8px;letter-spacing:-.3px}.hero p{color:var(--text-secondary);margin:0;font-size:var(--font-size-md)}.hero-actions{display:flex;gap:9px}.hero button,.list-actions button,.quick-grid button,.dialog-cancel,.dialog-confirm{border-radius:var(--radius-md);height:36px;padding:0 14px;border:1px solid var(--border-default);background:var(--surface-1);cursor:pointer;color:var(--text-secondary);transition:all var(--motion-base) var(--ease-standard)}.hero button:hover,.list-actions button:hover,.quick-grid button:hover{border-color:var(--border-brand);color:var(--brand-600);background:var(--brand-50)}.hero .primary,.dialog-confirm{background:var(--brand-600);color:var(--text-inverse);border-color:var(--brand-600);box-shadow:var(--shadow-brand)}.dialog-confirm:disabled{opacity:.45;cursor:not-allowed}.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:16px 0}.stats-grid article{background:var(--surface-1);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:16px 17px;display:flex;align-items:center;gap:12px;box-shadow:var(--shadow-xs)}.stat-icon{width:40px;height:40px;border-radius:10px;display:grid;place-items:center;font-size:19px}.blue{background:var(--brand-100);color:var(--brand-600)}.violet{background:#f1edff;color:#7958eb}.green{background:var(--success-50);color:var(--success-500)}.orange{background:var(--warning-50);color:var(--warning-500)}.stats-grid div{display:grid;grid-template-columns:1fr auto;align-items:end;flex:1}.stats-grid small{grid-column:1/-1;color:var(--text-muted);font-size:var(--font-size-sm)}.stats-grid strong{font-size:20px;margin-top:4px}.stats-grid em{font-style:normal;color:var(--text-muted);font-size:var(--font-size-xs)}.content-card{background:var(--surface-1);border:1px solid var(--border-subtle);border-radius:var(--radius-xl);padding:19px;box-shadow:var(--shadow-xs)}.section-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.section-head h2{font-size:16px;margin:0 0 4px}.section-head p{font-size:var(--font-size-sm);color:var(--text-muted);margin:0}.list-actions{display:flex;gap:8px}.search{height:34px;width:220px;display:flex;align-items:center;padding:0 10px;color:var(--text-muted)}.search input{width:100%;margin-left:6px;font-size:var(--font-size-md)}.project-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.project-card,.new-card{border:1px solid var(--border-subtle);border-radius:var(--radius-lg);overflow:hidden;background:var(--surface-1)}.project-card{transition:all var(--motion-base) var(--ease-standard)}.project-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-sm);border-color:var(--border-brand)}.cover{height:164px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}.cover.summer{background:linear-gradient(145deg,#54c7ff,#a7edda 55%,#ffe49b)}.cover.pink{background:linear-gradient(145deg,#ffb7cf,#ffe0ed)}.cover.orange{background:linear-gradient(145deg,#ffaf73,#ffd5a8)}.cover.blue{background:linear-gradient(145deg,#90b7ff,#dce9ff)}.summer-copy{font-size:20px;font-weight:800;color:#fff;text-shadow:0 2px 8px rgba(40,90,130,.18)}.mini-phone{position:absolute;right:18px;bottom:-22px;width:54px;height:112px;background:#fff;border:4px solid #263649;border-radius:12px;padding:9px 5px}.mini-phone div{height:18px;border-radius:4px;background:var(--brand-50);margin-bottom:5px}.edit-mask{position:absolute;inset:0;border:0;background:rgba(30,49,80,.58);color:#fff;opacity:0;transition:.2s;cursor:pointer;font-size:12px}.cover:hover .edit-mask{opacity:1}.project-info{padding:12px}.title-row{display:flex;justify-content:space-between;align-items:center}.title-row h3{font-size:12px;margin:0}.title-row span{font-size:9px;color:var(--success-500);background:var(--success-50);padding:3px 7px;border-radius:10px}.title-row span.draft{color:var(--text-muted);background:var(--surface-3)}.project-info p{font-size:10px;color:var(--text-muted);margin:7px 0 0}.new-card{min-height:216px;border-style:dashed;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-muted);cursor:pointer;transition:all var(--motion-base) var(--ease-standard)}.new-card:hover{border-color:var(--border-brand);background:var(--brand-50)}.new-card i{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--brand-100);color:var(--brand-600);font-size:19px}.new-card strong{font-size:12px;color:var(--text-secondary);margin-top:9px}.new-card span{font-size:10px;margin-top:4px}.quick-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:16px}.quick-grid article{display:flex;align-items:center;gap:12px;background:var(--surface-1);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:16px}.quick-grid article>i{font-size:21px;color:var(--brand-600)}.quick-grid div{display:flex;flex-direction:column;flex:1}.quick-grid strong{font-size:12px}.quick-grid span{font-size:10px;color:var(--text-muted);margin-top:3px}.quick-grid button{height:30px;padding:0 10px;font-size:10px}.dialog-form{display:flex;flex-direction:column;gap:10px}.dialog-form label{font-size:12px;font-weight:600;color:var(--text-secondary)}.create-types{display:grid;grid-template-columns:1fr 1fr;gap:10px}.create-types button{height:74px;border:1px solid var(--border-default);background:var(--surface-1);border-radius:var(--radius-lg);cursor:pointer;color:var(--text-secondary);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px}.create-types button.selected{border-color:var(--border-brand);background:var(--brand-50);color:var(--brand-600)}.empty{height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-muted)}.empty i{font-size:32px;color:var(--brand-300)}.empty strong{font-size:13px;color:var(--text-secondary);margin-top:8px}.empty span{font-size:10px;margin-top:4px}@media(max-width:1100px){.stats-grid{grid-template-columns:repeat(2,1fr)}.project-grid{grid-template-columns:repeat(2,1fr)}.quick-grid{grid-template-columns:1fr}.workspace-page{padding:22px 20px}}
</style>
