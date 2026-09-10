<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElTooltip } from 'element-plus'

const router = useRouter()
</script>

<template>
  <header class="editor-header">
    <div class="brand-area">
      <button class="brand" aria-label="营销搭建平台" @click="router.push('/workspace')">
        <span class="brand-mark"><i class="i-tabler-sparkles" /></span>
        <span class="brand-copy"><strong>H5 营销平台</strong><small>让营销更简单</small></span>
      </button>
      <nav class="top-nav">
        <button @click="router.push('/workspace')"><i class="i-tabler-home" />工作台</button>
        <button @click="router.push('/templates')"><i class="i-tabler-template" />模板中心</button>
        <button @click="router.push('/projects')"><i class="i-tabler-folder" />我的作品</button>
        <button @click="router.push('/assets')"><i class="i-tabler-photo" />素材管理</button>
        <button @click="router.push('/analytics')"><i class="i-tabler-chart-bar" />数据分析</button>
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
.editor-header{height:64px;flex:0 0 64px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;background:#fff;border-bottom:1px solid #e9eef5;position:relative;z-index:60;box-shadow:0 1px 8px rgba(35,63,106,.04)}.brand-area,.user-area,.top-nav{display:flex;align-items:center}.brand{border:0;background:transparent;display:flex;align-items:center;cursor:pointer;padding:0}.brand-mark{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(135deg,#2868ff 0%,#58a1ff 100%);color:#fff;font-size:19px;box-shadow:0 8px 16px rgba(48,108,255,.18)}.brand-copy{display:flex;flex-direction:column;align-items:flex-start;margin-left:10px;min-width:145px}.brand-copy strong{font-size:16px;color:#17253a;line-height:1.18;letter-spacing:.2px}.brand-copy small{font-size:9px;color:#a0aec0;margin-top:4px;letter-spacing:2px}.top-nav{gap:6px;margin-left:24px}.top-nav button{height:36px;padding:0 12px;border:0;background:transparent;color:#58677b;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:6px}.top-nav button i{font-size:14px}.top-nav button:hover{color:#245ff5;background:#f3f7ff}.user-area{gap:8px}.header-icon,.user-entry{width:34px;height:34px;border:0;background:transparent;color:#607086;border-radius:8px;display:grid;place-items:center;cursor:pointer;font-size:18px;position:relative}.header-icon:hover,.user-entry:hover{background:#f5f8fc;color:#1769ff}.notice em{position:absolute;right:6px;top:5px;width:6px;height:6px;border-radius:50%;background:#ff4d4f;border:1px solid white}.header-divider{width:1px;height:23px;background:#edf1f5;margin:0 5px}.avatar{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#d8f0ff,#8ac4ff);color:#1769ff;font-size:12px;font-weight:800}.user-copy{display:flex;flex-direction:column;line-height:1.1;min-width:58px}.user-copy strong{color:#26364b;font-size:11px;font-weight:700}.user-copy span{font-size:9px;color:#9aa7b7;margin-top:3px}.user-chevron{color:#8f9bad;font-size:12px}@media(max-width:1500px){.top-nav button:nth-child(n+4){display:none}.brand-copy{min-width:122px}.top-nav{margin-left:14px}.user-copy{display:none}}
</style>
