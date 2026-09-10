<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import PlatformHeader from '@/components/platform/PlatformHeader.vue'

const router = useRouter()
const keyword = ref('')
const status = ref('全部')
const statuses = ['全部', '已发布', '草稿']
const projects = ref([
  { id: 1, name: '夏日焕新营销页', status: '已发布', views: 12560, conversion: '3.2%', updated: '刚刚' },
  { id: 2, name: '七夕礼遇专题', status: '草稿', views: 8320, conversion: '2.8%', updated: '2 小时前' },
  { id: 3, name: '618 大促会场', status: '已发布', views: 23908, conversion: '5.6%', updated: '昨天' },
  { id: 4, name: '会员招募活动', status: '草稿', views: 1680, conversion: '1.9%', updated: '3 天前' },
])
const filtered = computed(() => projects.value.filter(p => (status.value === '全部' || p.status === status.value) && p.name.includes(keyword.value.trim())))
</script>

<template>
  <div class="page-shell"><PlatformHeader /><main class="page"><div class="title-row"><div><h1>我的作品</h1><p>管理所有 H5 营销项目与发布状态</p></div><button class="primary" @click="router.push('/')"><i class="i-tabler-plus" /> 新建作品</button></div><section class="panel"><div class="filters"><div class="tabs"><button v-for="item in statuses" :key="item" :class="{active:status===item}" @click="status=item">{{ item }}</button></div><div class="search"><i class="i-tabler-search"/><input v-model="keyword" placeholder="搜索作品名称" /></div></div><div class="table"><div class="tr head"><span>作品</span><span>状态</span><span>访问量</span><span>转化率</span><span>最近更新</span><span>操作</span></div><div v-for="item in filtered" :key="item.id" class="tr"><span class="project"><span class="thumb"><i class="i-tabler-device-mobile"/></span><strong>{{item.name}}</strong></span><span><em :class="{draft:item.status==='草稿'}">{{item.status}}</em></span><span>{{item.views.toLocaleString()}}</span><span>{{item.conversion}}</span><span>{{item.updated}}</span><span class="ops"><button @click="router.push('/')">编辑</button><button @click="router.push('/analytics')">数据</button><button>•••</button></span></div></div></section></main></div>
</template>

<style scoped>
.page-shell{min-height:100%;background:#f6f8fc}.page{max-width:1380px;margin:auto;padding:30px 32px}.title-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}.title-row h1{font-size:24px;margin:0 0 6px;color:#1e2d42}.title-row p{margin:0;color:#8a98ab;font-size:12px}.primary{height:38px;padding:0 16px;border:0;border-radius:9px;background:#2868ff;color:#fff;cursor:pointer}.panel{background:#fff;border:1px solid #e8edf4;border-radius:15px;overflow:hidden}.filters{padding:18px 20px;border-bottom:1px solid #edf1f5;display:flex;justify-content:space-between}.tabs{display:flex;gap:6px}.tabs button{border:0;background:#f5f7fb;color:#708095;padding:8px 14px;border-radius:8px;cursor:pointer}.tabs button.active{background:#edf4ff;color:#2868ff}.search{height:34px;width:220px;border:1px solid #e2e8f0;border-radius:8px;display:flex;align-items:center;padding:0 10px;color:#9aa6b7}.search input{border:0;outline:0;margin-left:6px;width:100%;font-size:12px}.tr{display:grid;grid-template-columns:2.2fr .8fr .8fr .8fr 1fr 1.1fr;align-items:center;min-height:68px;padding:0 20px;border-bottom:1px solid #f0f3f7;font-size:12px;color:#637188}.tr.head{min-height:44px;background:#fafbfd;color:#8d99aa;font-size:11px}.project{display:flex;align-items:center;gap:12px}.project strong{color:#334155}.thumb{width:42px;height:48px;border-radius:7px;background:linear-gradient(145deg,#7acfff,#d9f6ff);display:grid;place-items:center;color:#fff;font-size:20px}.tr em{font-style:normal;font-size:10px;padding:4px 8px;background:#e9f8f1;color:#1f9d6c;border-radius:10px}.tr em.draft{background:#f1f4f7;color:#8895a6}.ops{display:flex;gap:8px}.ops button{border:0;background:transparent;color:#3471f6;cursor:pointer;font-size:11px}
</style>
