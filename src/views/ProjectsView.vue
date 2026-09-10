<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import PlatformHeader from '@/components/platform/PlatformHeader.vue'

const router = useRouter()
const keyword = ref('')
const status = ref<'全部' | '已发布' | '草稿' | '回收站'>('全部')
const statuses = ['全部', '已发布', '草稿', '回收站'] as const

const projects = ref([
  { id: 1, name: '夏日焕新活动', status: '已发布' as const, pages: 3, updated: '2026-09-10 14:30', theme: 'summer' },
  { id: 2, name: '品牌周年庆', status: '草稿' as const, pages: 2, updated: '2026-09-10 11:20', theme: 'pink' },
  { id: 3, name: '新品发布会', status: '已发布' as const, pages: 4, updated: '2026-09-09 18:42', theme: 'blue' },
  { id: 4, name: '邀请函', status: '草稿' as const, pages: 1, updated: '2026-09-08 09:15', theme: 'dark' },
  { id: 5, name: '门店活动', status: '已发布' as const, pages: 2, updated: '2026-09-07 16:30', theme: 'orange' },
  { id: 6, name: '会员日活动', status: '草稿' as const, pages: 3, updated: '2026-09-06 10:05', theme: 'violet' },
])

const filtered = computed(() => projects.value.filter((item) => {
  if (status.value === '回收站') return false
  return (status.value === '全部' || item.status === status.value) && item.name.includes(keyword.value.trim())
}))

function duplicateProject(item: typeof projects.value[number]) {
  projects.value.unshift({ ...item, id: Date.now(), name: `${item.name} 副本`, status: '草稿', updated: '刚刚' })
  ElMessage.success('作品已复制')
}

async function deleteProject(item: typeof projects.value[number]) {
  try {
    await ElMessageBox.confirm(`确定将“${item.name}”移入回收站吗？`, '删除作品', {
      confirmButtonText: '移入回收站', cancelButtonText: '取消', type: 'warning',
    })
    projects.value = projects.value.filter(project => project.id !== item.id)
    ElMessage.success('已移入回收站')
  }
  catch {}
}
</script>

<template>
  <div class="page-shell">
    <PlatformHeader />
    <main class="page">
      <div class="page-head">
        <div><h1>我的作品</h1><p>管理所有 H5 营销项目与发布状态</p></div>
        <button class="primary" @click="router.push('/')"><i class="i-tabler-plus" /> 新建作品</button>
      </div>

      <section class="panel">
        <div class="filters">
          <div class="tabs"><button v-for="item in statuses" :key="item" :class="{ active: status === item }" @click="status = item">{{ item }}</button></div>
          <label class="search ds-search-field"><i class="i-tabler-search" /><input v-model="keyword" placeholder="搜索作品名称" /></label>
        </div>

        <div v-if="filtered.length" class="table">
          <div class="tr head"><span>作品名称</span><span>状态</span><span>页面数</span><span>更新时间</span><span>操作</span></div>
          <div v-for="item in filtered" :key="item.id" class="tr">
            <span class="project"><span class="thumb" :class="item.theme"><i class="i-tabler-device-mobile" /></span><strong>{{ item.name }}</strong></span>
            <span><em :class="{ draft: item.status === '草稿' }">{{ item.status }}</em></span>
            <span>{{ item.pages }} 页</span>
            <span>{{ item.updated }}</span>
            <span class="ops"><button @click="router.push('/')">编辑</button><button @click="duplicateProject(item)">复制</button><button class="danger" @click="deleteProject(item)">删除</button></span>
          </div>
        </div>
        <div v-else class="empty"><i :class="status === '回收站' ? 'i-tabler-trash' : 'i-tabler-search-off'" /><strong>{{ status === '回收站' ? '回收站暂无作品' : '没有找到相关作品' }}</strong><span>{{ status === '回收站' ? '删除的作品会暂存在这里' : '换一个关键词或状态试试' }}</span></div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.page-shell{min-height:100%;background:var(--surface-0)}.page{max-width:1380px;margin:auto;padding:24px 28px 44px}.page-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}.page-head h1{margin:0 0 5px;color:var(--text-strong);font-size:22px}.page-head p{margin:0;color:var(--text-muted);font-size:var(--font-size-md)}.primary{height:36px;padding:0 14px;border:0;border-radius:var(--radius-md);background:var(--brand-600);color:var(--text-inverse);box-shadow:var(--shadow-brand);cursor:pointer;font-weight:600}.panel{background:var(--surface-1);border:1px solid var(--border-subtle);border-radius:var(--radius-xl);overflow:hidden;box-shadow:var(--shadow-xs)}.filters{padding:14px 16px;border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between}.tabs{display:flex;gap:4px}.tabs button{height:32px;padding:0 13px;border:0;border-radius:var(--radius-md);background:transparent;color:var(--text-secondary);cursor:pointer;transition:all var(--motion-base) var(--ease-standard)}.tabs button:hover{color:var(--brand-600);background:var(--brand-50)}.tabs button.active{background:var(--brand-100);color:var(--brand-600);font-weight:600}.search{width:260px;height:34px;display:flex;align-items:center;padding:0 10px;color:var(--text-muted)}.search input{width:100%;margin-left:6px;font-size:var(--font-size-md)}.tr{display:grid;grid-template-columns:2.3fr .8fr .7fr 1.3fr 1.2fr;align-items:center;min-height:64px;padding:0 18px;border-bottom:1px solid var(--border-subtle);font-size:var(--font-size-md);color:var(--text-secondary)}.tr:last-child{border-bottom:0}.tr.head{min-height:42px;background:var(--surface-2);color:var(--text-muted);font-size:var(--font-size-sm)}.project{display:flex;align-items:center;gap:11px;min-width:0}.project strong{overflow:hidden;color:var(--text-primary);text-overflow:ellipsis;white-space:nowrap}.thumb{width:38px;height:44px;flex:0 0 38px;border-radius:7px;display:grid;place-items:center;color:#fff;font-size:18px}.thumb.summer{background:linear-gradient(145deg,#58c8ff,#a8ebd6 58%,#ffe29c)}.thumb.pink{background:linear-gradient(145deg,#ff9fc0,#ffdbe8)}.thumb.blue{background:linear-gradient(145deg,#5d9cff,#c6dcff)}.thumb.dark{background:linear-gradient(145deg,#24354e,#60728d)}.thumb.orange{background:linear-gradient(145deg,#ff9d68,#ffd1a7)}.thumb.violet{background:linear-gradient(145deg,#8e7df2,#d8d0ff)}.tr em{font-style:normal;font-size:var(--font-size-xs);padding:4px 8px;border-radius:10px;background:var(--success-50);color:var(--success-500)}.tr em.draft{background:var(--surface-3);color:var(--text-muted)}.ops{display:flex;gap:4px}.ops button{height:28px;padding:0 8px;border:0;border-radius:var(--radius-sm);background:transparent;color:var(--brand-600);cursor:pointer}.ops button:hover{background:var(--brand-50)}.ops .danger{color:var(--danger-500)}.ops .danger:hover{background:var(--danger-50)}.empty{height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-muted)}.empty i{font-size:34px;color:var(--brand-300)}.empty strong{margin-top:10px;color:var(--text-secondary);font-size:var(--font-size-base)}.empty span{margin-top:5px;font-size:var(--font-size-sm)}@media(max-width:1000px){.page{padding:22px 20px}.tr{grid-template-columns:2fr .8fr .7fr 1fr}.tr>span:nth-child(4){display:none}.search{width:210px}}
</style>
