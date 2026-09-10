<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <header class="platform-header">
    <button class="brand" @click="router.push('/workspace')">
      <span class="brand-mark"><i class="i-tabler-sparkles" /></span>
      <span class="brand-copy"><strong>H5 营销编辑器</strong><small>快速搭建营销页面</small></span>
    </button>

    <div class="header-spacer" />

    <div class="header-actions">
      <label class="global-search">
        <i class="i-tabler-search" />
        <input placeholder="搜索模板、作品或素材...">
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
.platform-header{height:64px;display:flex;align-items:center;padding:0 20px 0 22px;background:var(--surface-1);border-bottom:1px solid var(--border-subtle);box-shadow:var(--shadow-xs);position:sticky;top:0;z-index:50}.brand{display:flex;align-items:center;border:0;background:transparent;cursor:pointer;padding:0}.brand-mark{width:36px;height:36px;border-radius:var(--radius-lg);display:grid;place-items:center;background:linear-gradient(135deg,var(--brand-700),var(--brand-400));color:var(--text-inverse);font-size:18px;box-shadow:var(--shadow-brand)}.brand-copy{display:flex;flex-direction:column;align-items:flex-start;margin-left:10px}.brand-copy strong{font-size:15px;color:var(--text-strong);line-height:1.15}.brand-copy small{font-size:9px;letter-spacing:1px;color:var(--text-muted);margin-top:4px}.header-spacer{flex:1}.header-actions{display:flex;align-items:center;gap:10px}.global-search{width:286px;height:36px;border:1px solid var(--border-default);background:var(--surface-1);border-radius:var(--radius-md);display:flex;align-items:center;padding:0 9px 0 11px;color:var(--text-muted);transition:border-color var(--motion-base) var(--ease-standard),box-shadow var(--motion-base) var(--ease-standard),background-color var(--motion-base) var(--ease-standard)}.global-search:hover{border-color:var(--border-strong)}.global-search:focus-within{border-color:var(--brand-400);box-shadow:var(--focus-ring);background:var(--surface-1)}.global-search input{border:0!important;outline:0!important;box-shadow:none!important;background:transparent!important;appearance:none;flex:1;min-width:0;height:100%;font-size:var(--font-size-md);margin-left:7px;color:var(--text-primary)}.global-search input::placeholder{color:var(--text-muted)}.global-search kbd{height:20px;min-width:30px;padding:0 5px;border:1px solid var(--border-subtle);border-radius:5px;background:var(--surface-2);color:var(--text-muted);font:500 9px/18px var(--font-family-sans);text-align:center}.icon-btn{width:34px;height:34px;border:0;border-radius:var(--radius-md);background:transparent;position:relative;color:var(--text-secondary);font-size:17px;cursor:pointer}.icon-btn:hover{background:var(--surface-3);color:var(--brand-600)}.icon-btn em{position:absolute;width:6px;height:6px;background:var(--danger-500);border-radius:50%;right:6px;top:5px;border:1px solid var(--surface-1)}.profile{height:40px;display:flex;align-items:center;gap:8px;padding:0 5px 0 2px;border-radius:var(--radius-md);cursor:pointer}.profile:hover{background:var(--surface-2)}.avatar{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,var(--brand-100),var(--brand-300));color:var(--brand-600);font-weight:700}.user{display:flex;flex-direction:column;line-height:1.05}.user strong{font-size:var(--font-size-sm);color:var(--text-primary)}.user span{font-size:9px;color:var(--text-muted);margin-top:4px}.chevron{font-size:12px;color:var(--text-muted)}@media(max-width:980px){.global-search{width:220px}.user{display:none}}@media(max-width:760px){.global-search{display:none}}
</style>
