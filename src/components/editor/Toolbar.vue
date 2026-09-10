<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElTooltip } from 'element-plus'

const router = useRouter()

const navItems = [
  { label: '工作台', icon: 'i-tabler-home', path: '/workspace' },
  { label: '模板中心', icon: 'i-tabler-template', path: '/templates' },
  { label: '我的作品', icon: 'i-tabler-folder', path: '/projects' },
  { label: '素材管理', icon: 'i-tabler-photo', path: '/assets' },
]
</script>

<template>
  <header class="editor-header">
    <div class="brand-area">
      <button class="brand" aria-label="H5 营销平台" @click="router.push('/workspace')">
        <span class="brand-mark"><i class="i-tabler-sparkles" /></span>
        <span class="brand-copy"><strong>H5 营销平台</strong><small>让营销更简单</small></span>
      </button>
      <nav class="top-nav" aria-label="平台导航">
        <button v-for="item in navItems" :key="item.path" @click="router.push(item.path)">
          <i :class="item.icon" />
          <span>{{ item.label }}</span>
        </button>
      </nav>
    </div>

    <div class="user-area">
      <ElTooltip content="帮助中心"><button class="header-icon"><i class="i-tabler-help-circle" /></button></ElTooltip>
      <button class="header-icon notice"><i class="i-tabler-bell" /><em /></button>
      <span class="header-divider" />
      <div class="avatar">管</div>
      <div class="user-copy"><strong>管理员</strong><span>企业版</span></div>
      <button class="user-entry" title="账户" @click="router.push('/login')"><i class="i-tabler-chevron-down user-chevron" /></button>
    </div>
  </header>
</template>

<style scoped>
.editor-header{height:64px;flex:0 0 64px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;background:var(--surface-1);border-bottom:1px solid var(--border-subtle);position:relative;z-index:60;box-shadow:var(--shadow-xs)}.brand-area,.user-area,.top-nav{display:flex;align-items:center}.brand{border:0;background:transparent;display:flex;align-items:center;cursor:pointer;padding:0}.brand-mark{width:38px;height:38px;border-radius:var(--radius-lg);display:grid;place-items:center;background:linear-gradient(135deg,var(--brand-600),var(--brand-400));color:var(--text-inverse);font-size:19px;box-shadow:var(--shadow-brand)}.brand-copy{display:flex;flex-direction:column;align-items:flex-start;margin-left:10px;min-width:145px}.brand-copy strong{font-size:16px;color:var(--text-strong);line-height:1.18;letter-spacing:.2px}.brand-copy small{font-size:9px;color:var(--text-muted);margin-top:4px;letter-spacing:2px}.top-nav{gap:6px;margin-left:24px}.top-nav button{height:36px;padding:0 12px;border:0;background:transparent;color:var(--text-secondary);border-radius:var(--radius-md);cursor:pointer;font-size:13px;display:flex;align-items:center;gap:6px;transition:all var(--motion-base) var(--ease-standard)}.top-nav button i{font-size:14px}.top-nav button:hover{color:var(--brand-600);background:var(--brand-50)}.user-area{gap:8px}.header-icon,.user-entry{width:34px;height:34px;border:0;background:transparent;color:var(--text-secondary);border-radius:var(--radius-md);display:grid;place-items:center;cursor:pointer;font-size:18px;position:relative;transition:all var(--motion-base) var(--ease-standard)}.header-icon:hover,.user-entry:hover{background:var(--surface-3);color:var(--brand-600)}.notice em{position:absolute;right:6px;top:5px;width:6px;height:6px;border-radius:50%;background:var(--danger-500);border:1px solid var(--surface-1)}.header-divider{width:1px;height:23px;background:var(--border-subtle);margin:0 5px}.avatar{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,var(--brand-100),var(--brand-300));color:var(--brand-600);font-size:12px;font-weight:800}.user-copy{display:flex;flex-direction:column;line-height:1.1;min-width:58px}.user-copy strong{color:var(--text-primary);font-size:11px;font-weight:700}.user-copy span{font-size:9px;color:var(--text-muted);margin-top:3px}.user-chevron{color:var(--text-muted);font-size:12px}@media(max-width:1380px){.brand-copy{min-width:126px}.top-nav{margin-left:14px}.top-nav button{padding:0 9px}.user-copy{display:none}}@media(max-width:1180px){.top-nav button span{display:none}.top-nav button{width:36px;padding:0;justify-content:center}.top-nav button i{font-size:16px}}
</style>
