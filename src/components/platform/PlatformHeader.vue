<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const items = [
  { label:'工作台',icon:'i-tabler-home',path:'/workspace' },
  { label:'模板中心',icon:'i-tabler-template',path:'/templates' },
  { label:'我的作品',icon:'i-tabler-folder',path:'/projects' },
  { label:'素材管理',icon:'i-tabler-photo',path:'/assets' },
]
const activePath=computed(()=>route.path)
</script>

<template>
  <header class="platform-header">
    <button class="brand" @click="router.push('/workspace')"><span class="brand-mark"><i class="i-tabler-sparkles"/></span><span class="brand-copy"><strong>H5 营销编辑器</strong><small>快速搭建营销页面</small></span></button>
    <nav class="nav-list"><button v-for="item in items" :key="item.path" :class="{active:activePath===item.path}" @click="router.push(item.path)"><i :class="item.icon"/>{{ item.label }}</button></nav>
    <div class="header-actions"><div class="global-search"><i class="i-tabler-search"/><input placeholder="搜索模板、作品或素材..."></div><button class="icon-btn" aria-label="通知"><i class="i-tabler-bell"/><em/></button><div class="avatar">设</div><div class="user"><strong>设计师</strong><span>个人空间</span></div><i class="i-tabler-chevron-down chevron"/></div>
  </header>
</template>

<style scoped>
.platform-header{height:64px;display:flex;align-items:center;padding:0 24px;background:var(--surface-1);border-bottom:1px solid var(--border-subtle);box-shadow:var(--shadow-xs);position:sticky;top:0;z-index:50}.brand{display:flex;align-items:center;border:0;background:transparent;cursor:pointer;min-width:220px;padding:0}.brand-mark{width:38px;height:38px;border-radius:var(--radius-lg);display:grid;place-items:center;background:linear-gradient(135deg,var(--brand-700),var(--brand-400));color:var(--text-inverse);font-size:19px;box-shadow:var(--shadow-brand)}.brand-copy{display:flex;flex-direction:column;align-items:flex-start;margin-left:10px}.brand-copy strong{font-size:var(--font-size-lg);color:var(--text-strong)}.brand-copy small{font-size:9px;letter-spacing:1.2px;color:var(--text-muted);margin-top:3px}.nav-list{display:flex;align-items:center;gap:6px;flex:1}.nav-list button{height:var(--toolbar-control-height);padding:0 13px;border:0;background:transparent;color:var(--text-secondary);border-radius:var(--radius-md);cursor:pointer;font-size:var(--font-size-base);display:flex;align-items:center;gap:6px;transition:all var(--motion-base) var(--ease-standard)}.nav-list button:hover,.nav-list button.active{background:var(--brand-50);color:var(--brand-600)}.header-actions{display:flex;align-items:center;gap:9px}.global-search{width:230px;height:var(--control-height-md);border:1px solid var(--border-subtle);background:var(--surface-2);border-radius:var(--radius-md);display:flex;align-items:center;padding:0 10px;color:var(--text-muted);transition:all var(--motion-base) var(--ease-standard)}.global-search:focus-within{border-color:var(--border-brand);box-shadow:var(--focus-ring);background:var(--surface-1)}.global-search input{border:0;outline:0;background:transparent;width:100%;font-size:var(--font-size-md);margin-left:6px;color:var(--text-primary)}.icon-btn{width:34px;height:34px;border:0;border-radius:var(--radius-md);background:transparent;position:relative;color:var(--text-secondary);font-size:17px;cursor:pointer}.icon-btn:hover{background:var(--surface-3);color:var(--brand-600)}.icon-btn em{position:absolute;width:6px;height:6px;background:var(--danger-500);border-radius:50%;right:6px;top:5px;border:1px solid var(--surface-1)}.avatar{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,var(--brand-100),var(--brand-300));color:var(--brand-600);font-weight:700}.user{display:flex;flex-direction:column;line-height:1.05}.user strong{font-size:var(--font-size-sm);color:var(--text-primary)}.user span{font-size:9px;color:var(--text-muted);margin-top:4px}.chevron{font-size:12px;color:var(--text-muted)}@media(max-width:1280px){.global-search,.user{display:none}.nav-list button{padding:0 9px}.brand{min-width:190px}}
</style>
