<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navItems = [
  { label: '工作台', path: '/workspace' },
  { label: '模板中心', path: '/templates' },
  { label: '我的作品', path: '/projects' },
  { label: '素材管理', path: '/assets' },
]

const activePath = computed(() => route.path)
</script>

<template>
  <header class="platform-header">
    <button class="brand" @click="router.push('/workspace')">
      <span class="brand-mark"><i class="i-tabler-sparkles" /></span>
      <span class="brand-copy"><strong>H5 营销编辑器</strong><small>快速搭建营销页面</small></span>
    </button>

    <nav class="top-nav" aria-label="平台导航">
      <button
        v-for="item in navItems"
        :key="item.path"
        :class="{ active: activePath === item.path }"
        @click="router.push(item.path)"
      >
        {{ item.label }}
      </button>
    </nav>

    <div class="header-spacer" />

    <div class="header-actions">
      <label class="global-search ds-search-field">
        <i class="i-tabler-search" />
        <input placeholder="搜索作品、模板或素材...">
        <kbd>⌘ K</kbd>
      </label>
      <button class="icon-btn" aria-label="通知"><i class="i-tabler-bell" /><em /></button>
      <div class="profile">
        <div class="avatar">设</div>
        <div class="user"><strong>设计师</strong><span>个人空间</span></div>
        <i class="i-tabler-chevron-down chevron" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.platform-header{height:60px;display:flex;align-items:center;padding:0 22px;background:var(--surface-1);border-bottom:1px solid var(--border-subtle);box-shadow:var(--shadow-xs);position:sticky;top:0;z-index:50}.brand{display:flex;align-items:center;border:0;background:transparent;cursor:pointer;padding:0;margin-right:26px}.brand-mark{width:34px;height:34px;border-radius:9px;display:grid;place-items:center;background:linear-gradient(135deg,var(--brand-700),var(--brand-400));color:var(--text-inverse);font-size:17px;box-shadow:var(--shadow-brand)}.brand-copy{display:flex;flex-direction:column;align-items:flex-start;margin-left:9px}.brand-copy strong{font-size:14px;color:var(--text-strong);line-height:1.15}.brand-copy small{font-size:8px;letter-spacing:.8px;color:var(--text-muted);margin-top:3px}.top-nav{height:100%;display:flex;align-items:stretch;gap:6px}.top-nav button{position:relative;height:100%;padding:0 13px;border:0;background:transparent;color:var(--text-secondary);font-size:var(--font-size-md);font-weight:var(--font-weight-medium);cursor:pointer;transition:color var(--motion-base) var(--ease-standard),background-color var(--motion-base) var(--ease-standard)}.top-nav button:hover{color:var(--brand-600);background:var(--brand-50)}.top-nav button.active{color:var(--brand-600);font-weight:var(--font-weight-semibold)}.top-nav button.active::after{content:'';position:absolute;left:13px;right:13px;bottom:0;height:2px;border-radius:2px 2px 0 0;background:var(--brand-600)}.header-spacer{flex:1}.header-actions{display:flex;align-items:center;gap:9px}.global-search{width:258px;height:34px}.global-search i{font-size:14px}.global-search kbd{height:20px;min-width:30px;padding:0 5px;border:1px solid var(--border-subtle);border-radius:5px;background:var(--surface-2);color:var(--text-muted);font:500 9px/18px var(--font-family-sans);text-align:center}.icon-btn{width:34px;height:34px;border:0;border-radius:var(--radius-md);background:transparent;position:relative;color:var(--text-secondary);font-size:17px;cursor:pointer}.icon-btn:hover{background:var(--surface-3);color:var(--brand-600)}.icon-btn em{position:absolute;width:6px;height:6px;background:var(--danger-500);border-radius:50%;right:6px;top:5px;border:1px solid var(--surface-1)}.profile{height:38px;display:flex;align-items:center;gap:8px;padding:0 5px 0 2px;border-radius:var(--radius-md);cursor:pointer}.profile:hover{background:var(--surface-2)}.avatar{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,var(--brand-100),var(--brand-300));color:var(--brand-600);font-size:11px;font-weight:700}.user{display:flex;flex-direction:column;line-height:1.05}.user strong{font-size:var(--font-size-sm);color:var(--text-primary)}.user span{font-size:8px;color:var(--text-muted);margin-top:3px}.chevron{font-size:11px;color:var(--text-muted)}@media(max-width:1180px){.brand{margin-right:12px}.top-nav button{padding:0 9px}.global-search{width:210px}.user{display:none}}@media(max-width:920px){.global-search{display:none}}@media(max-width:760px){.brand-copy small{display:none}.top-nav{overflow:auto}.top-nav button{white-space:nowrap}}
</style>
