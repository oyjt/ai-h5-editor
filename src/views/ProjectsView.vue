<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import PlatformHeader from '@/components/platform/PlatformHeader.vue'

const router = useRouter()
const keyword = ref('')
const status = ref('全部')
const statuses = ['全部', '已发布', '草稿']

const projects = ref([
  { id: 1, name: '夏日焕新营销页', status: '已发布', pages: 3, updated: '刚刚' },
  { id: 2, name: '七夕礼遇专题', status: '草稿', pages: 2, updated: '2 小时前' },
  { id: 3, name: '618 大促会场', status: '已发布', pages: 5, updated: '昨天' },
  { id: 4, name: '会员招募活动', status: '草稿', pages: 2, updated: '3 天前' },
])

const filtered = computed(() => projects.value.filter(project =>
  (status.value === '全部' || project.status === status.value)
  && project.name.includes(keyword.value.trim()),
))
</script>

<template>
  <div class="page-shell">
    <PlatformHeader />
    <main class="page">
      <div class="title-row">
        <div>
          <h1>我的作品</h1>
          <p>管理所有 H5 营销项目、页面与发布状态</p>
        </div>
        <button class="primary" @click="router.push('/')"><i class="i-tabler-plus" /> 新建作品</button>
      </div>

      <section class="panel">
        <div class="filters">
          <div class="tabs">
            <button v-for="item in statuses" :key="item" :class="{ active: status === item }" @click="status = item">{{ item }}</button>
          </div>
          <div class="search"><i class="i-tabler-search" /><input v-model="keyword" placeholder="搜索作品名称"></div>
        </div>

        <div v-if="filtered.length" class="table">
          <div class="tr head"><span>作品</span><span>状态</span><span>页面数</span><span>最近更新</span><span>操作</span></div>
          <div v-for="item in filtered" :key="item.id" class="tr">
            <span class="project"><span class="thumb"><i class="i-tabler-device-mobile" /></span><strong>{{ item.name }}</strong></span>
            <span><em :class="{ draft: item.status === '草稿' }">{{ item.status }}</em></span>
            <span>{{ item.pages }} 个页面</span>
            <span>{{ item.updated }}</span>
            <span class="ops"><button @click="router.push('/')">编辑</button><button>复制</button><button>•••</button></span>
          </div>
        </div>
        <div v-else class="empty"><i class="i-tabler-search-off" /><strong>没有找到相关作品</strong><span>换一个关键词或状态试试</span></div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.page-shell{min-height:100%;background:var(--surface-0)}.page{max-width:1380px;margin:auto;padding:30px 32px}.title-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}.title-row h1{font-size:24px;margin:0 0 6px;color:var(--text-strong)}.title-row p{margin:0;color:var(--text-muted);font-size:var(--font-size-md)}.primary{height:38px;padding:0 16px;border:1px solid var(--brand-600);border-radius:var(--radius-md);background:var(--brand-600);color:var(--text-inverse);cursor:pointer;box-shadow:var(--shadow-brand);transition:all var(--motion-base) var(--ease-standard)}.primary:hover{background:var(--brand-500);border-color:var(--brand-500)}.panel{background:var(--surface-1);border:1px solid var(--border-subtle);border-radius:var(--radius-xl);overflow:hidden}.filters{padding:18px 20px;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between}.tabs{display:flex;gap:6px}.tabs button{border:0;background:var(--surface-3);color:var(--text-secondary);padding:8px 14px;border-radius:var(--radius-md);cursor:pointer;transition:all var(--motion-base) var(--ease-standard)}.tabs button:hover{color:var(--brand-600);background:var(--brand-50)}.tabs button.active{background:var(--brand-100);color:var(--brand-600)}.search{height:34px;width:220px;border:1px solid var(--border-default);border-radius:var(--radius-md);display:flex;align-items:center;padding:0 10px;color:var(--text-muted);background:var(--surface-1);transition:all var(--motion-base) var(--ease-standard)}.search:focus-within{border-color:var(--border-brand);box-shadow:var(--focus-ring)}.search input{border:0;outline:0;margin-left:6px;width:100%;font-size:var(--font-size-md);background:transparent;color:var(--text-primary)}.tr{display:grid;grid-template-columns:2.4fr .8fr .8fr 1fr 1.1fr;align-items:center;min-height:68px;padding:0 20px;border-bottom:1px solid var(--border-subtle);font-size:var(--font-size-md);color:var(--text-secondary)}.tr:last-child{border-bottom:0}.tr.head{min-height:44px;background:var(--surface-2);color:var(--text-muted);font-size:var(--font-size-sm)}.project{display:flex;align-items:center;gap:12px}.project strong{color:var(--text-primary)}.thumb{width:42px;height:48px;border-radius:7px;background:linear-gradient(145deg,#7acfff,#d9f6ff);display:grid;place-items:center;color:#fff;font-size:20px}.tr em{font-style:normal;font-size:10px;padding:4px 8px;background:var(--success-50);color:var(--success-500);border-radius:10px}.tr em.draft{background:var(--surface-3);color:var(--text-muted)}.ops{display:flex;gap:8px}.ops button{border:0;background:transparent;color:var(--brand-600);cursor:pointer;font-size:var(--font-size-sm);padding:5px 6px;border-radius:var(--radius-sm)}.ops button:hover{background:var(--brand-50)}.empty{height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-muted)}.empty i{font-size:34px;color:var(--brand-300)}.empty strong{margin-top:10px;color:var(--text-secondary);font-size:var(--font-size-base)}.empty span{margin-top:4px;font-size:var(--font-size-sm)}@media(max-width:1000px){.page{padding:24px 20px}.tr{grid-template-columns:2fr .8fr .8fr 1fr}.tr>span:nth-child(4){display:none}}
</style>
