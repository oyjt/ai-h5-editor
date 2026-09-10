<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElTooltip } from 'element-plus'

const route = useRoute()
const router = useRouter()

const navItems = [
  { label: '工作台', icon: 'i-tabler-home', path: '/workspace' },
  { label: '模板中心', icon: 'i-tabler-template', path: '/templates' },
  { label: '我的作品', icon: 'i-tabler-folder', path: '/projects' },
  { label: '素材管理', icon: 'i-tabler-photo', path: '/assets' },
]

const activePath = computed(() => route.path)
</script>

<template>
  <header class="platform-header">
    <div class="header-left">
      <button class="brand" aria-label="H5 营销平台" @click="router.push('/workspace')">
        <span class="brand-mark"><i class="i-tabler-sparkles" /></span>
        <span class="brand-copy"><strong>H5 营销平台</strong><small>让营销更简单</small></span>
      </button>

      <nav class="top-nav" aria-label="平台导航">
        <button
          v-for="item in navItems"
          :key="item.path"
          :class="{ active: activePath === item.path }"
          @click="router.push(item.path)"
        >
          <i :class="item.icon" />
          <span>{{ item.label }}</span>
        </button>
      </nav>
    </div>

    <div class="header-right">
      <label class="global-search ds-search-field">
        <i class="i-tabler-search" />
        <input placeholder="搜索模板、作品或素材...">
        <kbd>⌘ K</kbd>
      </label>

      <div class="header-actions">
        <ElTooltip content="帮助中心">
          <button class="header-icon" aria-label="帮助中心"><i class="i-tabler-help-circle" /></button>
        </ElTooltip>
        <button class="header-icon notice" aria-label="通知"><i class="i-tabler-bell" /><em /></button>
        <span class="header-divider" />
        <div class="avatar">管</div>
        <div class="user-copy"><strong>管理员</strong><span>企业版</span></div>
        <button class="user-entry" title="账户" @click="router.push('/login')"><i class="i-tabler-chevron-down" /></button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.platform-header{height:64px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 24px;background:var(--surface-1);border-bottom:1px solid var(--border-subtle);box-shadow:var(--shadow-xs);position:sticky;top:0;z-index:60}.header-left,.header-right,.top-nav,.header-actions{display:flex;align-items:center}.header-left{min-width:0}.brand{border:0;background:transparent;display:flex;align-items:center;cursor:pointer;padding:0;flex:0 0 auto}.brand-mark{width:38px;height:38px;border-radius:var(--radius-lg);display:grid;place-items:center;background:linear-gradient(135deg,var(--brand-600),var(--brand-400));color:var(--text-inverse);font-size:19px;box-shadow:var(--shadow-brand)}.brand-copy{display:flex;flex-direction:column;align-items:flex-start;margin-left:10px;min-width:145px}.brand-copy strong{font-size:16px;color:var(--text-strong);line-height:1.18;letter-spacing:.2px}.brand-copy small{font-size:9px;color:var(--text-muted);margin-top:4px;letter-spacing:2px}.top-nav{gap:6px;margin-left:24px;white-space:nowrap}.top-nav button{height:36px;padding:0 12px;border:0;border-radius:var(--radius-md);background:transparent;color:var(--text-secondary);cursor:pointer;font-size:13px;display:flex;align-items:center;gap:6px;position:relative;transition:background-color var(--motion-base) var(--ease-standard),color var(--motion-base) var(--ease-standard)}.top-nav button i{font-size:14px}.top-nav button:hover{color:var(--brand-600);background:var(--brand-50)}.top-nav button.active{color:var(--brand-600);background:var(--brand-50);font-weight:var(--font-weight-semibold)}.top-nav button.active::after{content:'';position:absolute;left:12px;right:12px;bottom:-14px;height:2px;border-radius:2px;background:var(--brand-600)}.header-right{flex:1;min-width:0;justify-content:flex-end;gap:14px}.global-search{width:min(320px,26vw);min-width:190px;height:36px;flex:0 1 320px}.global-search kbd{height:20px;min-width:30px;padding:0 5px;border:1px solid var(--border-subtle);border-radius:5px;background:var(--surface-2);color:var(--text-muted);font:500 9px/18px var(--font-family-sans);text-align:center;flex:0 0 auto}.header-actions{gap:8px;flex:0 0 auto}.header-icon,.user-entry{width:34px;height:34px;border:0;background:transparent;color:var(--text-secondary);border-radius:var(--radius-md);display:grid;place-items:center;cursor:pointer;font-size:18px;position:relative;transition:all var(--motion-base) var(--ease-standard)}.header-icon:hover,.user-entry:hover{background:var(--surface-3);color:var(--brand-600)}.notice em{position:absolute;right:6px;top:5px;width:6px;height:6px;border-radius:50%;background:var(--danger-500);border:1px solid var(--surface-1)}.header-divider{width:1px;height:23px;background:var(--border-subtle);margin:0 5px}.avatar{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,var(--brand-100),var(--brand-300));color:var(--brand-600);font-size:12px;font-weight:800}.user-copy{display:flex;flex-direction:column;line-height:1.1;min-width:58px}.user-copy strong{color:var(--text-primary);font-size:11px;font-weight:700}.user-copy span{font-size:9px;color:var(--text-muted);margin-top:3px}.user-entry i{font-size:12px}@media(max-width:1320px){.platform-header{gap:16px;padding:0 18px}.brand-copy{min-width:126px}.top-nav{margin-left:14px}.top-nav button{padding:0 9px}.global-search{width:220px;flex-basis:220px}.global-search kbd{display:none}.user-copy{display:none}}@media(max-width:1080px){.brand-copy small{display:none}.brand-copy{min-width:116px}.top-nav button{padding:0 8px}.global-search{min-width:150px;flex-basis:180px}.header-divider{display:none}}@media(max-width:900px){.global-search{display:none}.platform-header{gap:10px}.top-nav{margin-left:10px;gap:2px}.top-nav button span{display:none}.top-nav button{width:36px;padding:0;justify-content:center}.top-nav button i{font-size:16px}.top-nav button.active::after{left:8px;right:8px}}
</style>
