<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElTooltip } from 'element-plus'

const router = useRouter()
</script>

<template>
  <header class="editor-header">
    <div class="brand-area">
      <button class="brand" aria-label="营销搭建平台" @click="router.push('/')">
        <span class="brand-mark"><i class="i-tabler-link" /></span>
        <span class="brand-copy"><strong>营销搭建平台</strong><small>让营销更简单</small></span>
      </button>
      <nav class="top-nav">
        <button class="active"><i class="i-tabler-home" />工作台</button>
        <button @click="router.push('/templates')"><i class="i-tabler-template" />模板中心</button>
        <button><i class="i-tabler-folder" />我的项目</button>
        <button><i class="i-tabler-photo" />资源管理</button>
        <button><i class="i-tabler-chart-bar" />数据中心</button>
      </nav>
    </div>

    <div class="user-area">
      <ElTooltip content="帮助中心"><button class="header-icon"><i class="i-tabler-help-circle" /></button></ElTooltip>
      <button class="header-icon notice"><i class="i-tabler-bell" /><em /></button>
      <span class="header-divider" />
      <div class="avatar"><i class="i-tabler-user" /></div>
      <div class="user-copy"><strong>产品设计师</strong><span>企业版</span></div>
      <i class="i-tabler-chevron-down user-chevron" />
    </div>
  </header>
</template>

<style scoped>
.editor-header{height:72px;flex:0 0 72px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:#fff;border-bottom:1px solid #edf1f6;position:relative;z-index:60}.brand-area,.user-area,.top-nav{display:flex;align-items:center}.brand{border:0;background:transparent;display:flex;align-items:center;cursor:pointer;padding:0}.brand-mark{width:42px;height:42px;border-radius:11px;display:grid;place-items:center;background:linear-gradient(135deg,#2f6dff 0%,#4f9fff 100%);color:#fff;font-size:22px;box-shadow:0 8px 16px rgba(48,108,255,.18)}.brand-copy{display:flex;flex-direction:column;align-items:flex-start;margin-left:11px;min-width:150px}.brand-copy strong{font-size:17px;color:#13233a;line-height:1.18;letter-spacing:.2px}.brand-copy small{font-size:10px;color:#a0aec0;margin-top:4px;letter-spacing:2px}.top-nav{gap:12px;margin-left:36px}.top-nav button{height:38px;padding:0 13px;border:0;background:transparent;color:#506177;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:6px}.top-nav button i{font-size:14px}.top-nav button:hover,.top-nav button.active{color:#245ff5;background:#f4f7ff}.user-area{gap:8px}.header-icon{width:34px;height:34px;border:0;background:transparent;color:#607086;border-radius:8px;display:grid;place-items:center;cursor:pointer;font-size:18px;position:relative}.header-icon:hover{background:#f5f8fc;color:#1769ff}.notice em{position:absolute;right:6px;top:5px;width:6px;height:6px;border-radius:50%;background:#ff4d4f;border:1px solid white}.header-divider{width:1px;height:23px;background:#edf1f5;margin:0 5px}.avatar{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#d8f0ff,#74b7ff);color:#1769ff;font-size:16px}.user-copy{display:flex;flex-direction:column;line-height:1.1;min-width:58px}.user-copy strong{color:#26364b;font-size:11px;font-weight:700}.user-copy span{font-size:9px;color:#9aa7b7;margin-top:3px}.user-chevron{color:#8f9bad;font-size:12px}
@media(max-width:1500px){.editor-header{height:64px;flex-basis:64px;padding:0 20px}.top-nav button:nth-child(n+4){display:none}.brand-copy{min-width:122px}.top-nav{margin-left:14px;gap:6px}.user-copy{display:none}}
</style>
