<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const items = [
  { label: '工作台', icon: 'i-tabler-home', path: '/workspace' },
  { label: '模板中心', icon: 'i-tabler-template', path: '/templates' },
  { label: '我的作品', icon: 'i-tabler-folder', path: '/projects' },
  { label: '素材管理', icon: 'i-tabler-photo', path: '/assets' },
  { label: '数据分析', icon: 'i-tabler-chart-bar', path: '/analytics' },
]

const activePath = computed(() => route.path)
</script>

<template>
  <header class="platform-header">
    <button class="brand" @click="router.push('/workspace')">
      <span class="brand-mark"><i class="i-tabler-sparkles" /></span>
      <span class="brand-copy"><strong>H5 营销平台</strong><small>让营销更简单</small></span>
    </button>
    <nav class="nav-list">
      <button v-for="item in items" :key="item.path" :class="{ active: activePath === item.path }" @click="router.push(item.path)">
        <i :class="item.icon" />{{ item.label }}
      </button>
    </nav>
    <div class="header-actions">
      <div class="global-search"><i class="i-tabler-search" /><input placeholder="搜索模板、作品或功能..." /></div>
      <button class="icon-btn"><i class="i-tabler-bell" /><em /></button>
      <div class="avatar">管</div>
      <div class="user"><strong>管理员</strong><span>企业版</span></div>
      <i class="i-tabler-chevron-down chevron" />
    </div>
  </header>
</template>

<style scoped>
.platform-header{height:64px;display:flex;align-items:center;padding:0 24px;background:#fff;border-bottom:1px solid #e9eef5;box-shadow:0 1px 8px rgba(35,63,106,.04);position:sticky;top:0;z-index:50}.brand{display:flex;align-items:center;border:0;background:transparent;cursor:pointer;min-width:210px;padding:0}.brand-mark{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(135deg,#2868ff,#58a1ff);color:#fff;font-size:19px;box-shadow:0 8px 18px rgba(43,105,255,.2)}.brand-copy{display:flex;flex-direction:column;align-items:flex-start;margin-left:10px}.brand-copy strong{font-size:16px;color:#17253a}.brand-copy small{font-size:9px;letter-spacing:2px;color:#a1adbd;margin-top:3px}.nav-list{display:flex;align-items:center;gap:6px;flex:1}.nav-list button{height:36px;padding:0 13px;border:0;background:transparent;color:#58677b;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:6px}.nav-list button:hover,.nav-list button.active{background:#f3f7ff;color:#2467f4}.header-actions{display:flex;align-items:center;gap:9px}.global-search{width:230px;height:34px;border:1px solid #e8edf4;background:#f8faff;border-radius:9px;display:flex;align-items:center;padding:0 10px;color:#9aa8ba}.global-search input{border:0;outline:0;background:transparent;width:100%;font-size:12px;margin-left:6px;color:#39485c}.icon-btn{width:34px;height:34px;border:0;background:transparent;position:relative;color:#64748b;font-size:17px}.icon-btn em{position:absolute;width:6px;height:6px;background:#ff4d5e;border-radius:50%;right:6px;top:5px;border:1px solid #fff}.avatar{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#d9edff,#8ac4ff);color:#1769ff;font-weight:700}.user{display:flex;flex-direction:column;line-height:1.05}.user strong{font-size:11px;color:#29384b}.user span{font-size:9px;color:#9aa7b8;margin-top:4px}.chevron{font-size:12px;color:#98a4b3}@media(max-width:1280px){.global-search,.user{display:none}.nav-list button{padding:0 9px}.brand{min-width:190px}}
</style>
