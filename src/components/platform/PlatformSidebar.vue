<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const items = [
  { label: '工作台', icon: 'i-tabler-home', path: '/workspace' },
  { label: '我的作品', icon: 'i-tabler-folder', path: '/projects' },
  { label: '模板中心', icon: 'i-tabler-template', path: '/templates' },
  { label: '素材管理', icon: 'i-tabler-photo', path: '/assets' },
]

const activePath = computed(() => route.path)
</script>

<template>
  <aside class="platform-sidebar">
    <nav class="sidebar-nav" aria-label="平台导航">
      <button
        v-for="item in items"
        :key="item.path"
        :class="{ active: activePath === item.path }"
        @click="router.push(item.path)"
      >
        <span class="nav-icon"><i :class="item.icon" /></span>
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <div class="sidebar-bottom">
      <button @click="router.push('/')"><span class="nav-icon"><i class="i-tabler-pencil" /></span><span>进入编辑器</span></button>
      <button><span class="nav-icon"><i class="i-tabler-help-circle" /></span><span>帮助中心</span></button>
    </div>
  </aside>
</template>

<style scoped>
.platform-sidebar{width:176px;flex:0 0 176px;min-height:calc(100vh - 64px);background:var(--surface-1);border-right:1px solid var(--border-subtle);display:flex;flex-direction:column;padding:14px 10px 16px;position:sticky;top:64px;align-self:flex-start}.sidebar-nav{display:flex;flex-direction:column;gap:4px}.sidebar-nav button,.sidebar-bottom button{width:100%;height:40px;border:0;border-radius:var(--radius-md);background:transparent;color:var(--text-secondary);display:flex;align-items:center;gap:10px;padding:0 11px;font-size:var(--font-size-md);cursor:pointer;text-align:left;transition:background-color var(--motion-base) var(--ease-standard),color var(--motion-base) var(--ease-standard)}.sidebar-nav button:hover,.sidebar-bottom button:hover{background:var(--surface-3);color:var(--text-primary)}.sidebar-nav button.active{background:var(--brand-50);color:var(--brand-600);font-weight:var(--font-weight-semibold)}.nav-icon{width:24px;height:24px;border-radius:var(--radius-sm);display:grid;place-items:center;font-size:15px}.sidebar-nav button.active .nav-icon{background:var(--brand-100)}.sidebar-bottom{margin-top:auto;padding-top:12px;border-top:1px solid var(--border-subtle);display:flex;flex-direction:column;gap:4px}@media(max-width:1180px){.platform-sidebar{width:72px;flex-basis:72px;padding-inline:8px}.sidebar-nav button,.sidebar-bottom button{justify-content:center;padding:0}.sidebar-nav button>span:last-child,.sidebar-bottom button>span:last-child{display:none}.nav-icon{width:28px;height:28px}}
</style>
