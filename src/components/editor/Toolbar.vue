<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElMessage, ElMessageBox, ElTooltip } from 'element-plus'
import { useEditorStore } from '@/stores/editor'
import { useHistoryStore } from '@/stores/history'
import { useThemeStore } from '@/stores/theme'
import PublishDialog from '@/components/dialogs/PublishDialog.vue'
import AIGenerateDialog from '@/components/dialogs/AIGenerateDialog.vue'
import PreviewDialog from '@/components/dialogs/PreviewDialog.vue'

const router = useRouter()
const editorStore = useEditorStore()
const historyStore = useHistoryStore()
const themeStore = useThemeStore()

const showPublishDialog = ref(false)
const showAIGenerateDialog = ref(false)
const showPreviewDialog = ref(false)
const zoom = ref(100)
const device = ref<'mobile' | 'tablet'>('mobile')
const themeIcon = computed(() => themeStore.theme === 'dark' ? 'i-tabler-sun' : 'i-tabler-moon')

function handleUndo() { const page = historyStore.undo(); if (page) editorStore.currentPage = page }
function handleRedo() { const page = historyStore.redo(); if (page) editorStore.currentPage = page }
function handleSave() {
  const success = editorStore.savePage()
  if (success) ElMessage.success('保存成功')
  else ElMessage.error('保存失败')
}
function handleClear() {
  ElMessageBox.confirm('确定要清空页面吗？此操作不可恢复。', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => { editorStore.clearPage(); ElMessage.success('已清空') })
    .catch(() => {})
}
</script>

<template>
  <header class="editor-header">
    <div class="brand-area">
      <button class="brand" aria-label="营销搭建平台">
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
      <label class="global-search"><i class="i-tabler-search" /><input placeholder="搜索模板、组件或功能..." /></label>
      <ElTooltip content="帮助中心"><button class="header-icon"><i class="i-tabler-help-circle" /></button></ElTooltip>
      <ElTooltip content="AI 生成"><button class="header-icon" @click="showAIGenerateDialog = true"><i class="i-tabler-sparkles" /></button></ElTooltip>
      <ElTooltip :content="themeStore.theme === 'dark' ? '切换亮色' : '切换深色'"><button class="header-icon" @click="themeStore.toggleTheme()"><i :class="themeIcon" /></button></ElTooltip>
      <button class="header-icon notice"><i class="i-tabler-bell" /><em /></button>
      <div class="avatar"><i class="i-tabler-user" /></div>
      <div class="user-copy"><strong>产品设计师</strong><span>企业版</span></div>
      <i class="i-tabler-chevron-down user-chevron" />
    </div>
  </header>

  <div class="workspace-toolbar">
    <div class="page-title-wrap">
      <div class="page-title">{{ editorStore.currentPage.name || '夏日焕新 · 营销活动页' }} <button><i class="i-tabler-pencil" /></button></div>
      <div class="autosave"><i class="i-tabler-cloud-check" /> 已自动保存 <span>10:24:36</span></div>
    </div>

    <div class="editor-actions">
      <div class="history-actions">
        <button :disabled="!historyStore.canUndo" @click="handleUndo"><i class="i-tabler-arrow-back-up" /></button>
        <button :disabled="!historyStore.canRedo" @click="handleRedo"><i class="i-tabler-arrow-forward-up" /></button>
      </div>
      <div class="device-switch">
        <button :class="{ active: device === 'mobile' }" @click="device = 'mobile'"><i class="i-tabler-device-mobile" /></button>
        <button :class="{ active: device === 'tablet' }" @click="device = 'tablet'"><i class="i-tabler-device-tablet" /></button>
      </div>
      <div class="zoom-control"><button @click="zoom = Math.max(50, zoom - 10)">−</button><span>{{ zoom }}%</span><button @click="zoom = Math.min(150, zoom + 10)"><i class="i-tabler-chevron-down" /></button></div>
      <ElButton class="action-button preview" @click="showPreviewDialog = true"><i class="i-tabler-player-play mr-6px" />预览</ElButton>
      <ElButton class="action-button" @click="handleSave">保存</ElButton>
      <ElButton class="publish-button" type="primary" @click="showPublishDialog = true"><i class="i-tabler-send mr-6px" />发布</ElButton>
      <ElTooltip content="清空页面"><button class="header-icon danger" @click="handleClear"><i class="i-tabler-trash" /></button></ElTooltip>
    </div>
  </div>

  <PublishDialog v-model="showPublishDialog" />
  <AIGenerateDialog v-model="showAIGenerateDialog" />
  <PreviewDialog v-model="showPreviewDialog" />
</template>

<style scoped>
.editor-header{height:62px;display:flex;align-items:center;justify-content:space-between;padding:0 22px;background:#fff;border-bottom:1px solid #edf1f6;position:relative;z-index:60}.brand-area,.user-area,.top-nav,.editor-actions,.page-title-wrap,.history-actions,.device-switch,.zoom-control{display:flex;align-items:center}.brand{border:0;background:transparent;display:flex;align-items:center;cursor:pointer}.brand-mark{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(135deg,#2f6dff 0%,#4f9fff 100%);color:#fff;font-size:20px;box-shadow:0 8px 16px rgba(48,108,255,.18)}.brand-copy{display:flex;flex-direction:column;align-items:flex-start;margin-left:10px;min-width:138px}.brand-copy strong{font-size:16px;color:#13233a;line-height:1.18;letter-spacing:.2px}.brand-copy small{font-size:10px;color:#a0aec0;margin-top:3px;letter-spacing:1px}.top-nav{gap:7px;margin-left:22px}.top-nav button{height:34px;padding:0 11px;border:0;background:transparent;color:#506177;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:6px}.top-nav button i{font-size:14px}.top-nav button:hover,.top-nav button.active{color:#245ff5;background:#f4f7ff}.user-area{gap:7px}.global-search{width:185px;height:34px;border:1px solid #edf1f6;border-radius:9px;background:#f8fafc;display:flex;align-items:center;gap:7px;padding:0 10px;color:#a5b0bf}.global-search input{border:0;outline:0;background:transparent;width:100%;font-size:11px;color:#56677c}.header-icon{width:32px;height:32px;border:0;background:transparent;color:#607086;border-radius:8px;display:grid;place-items:center;cursor:pointer;font-size:17px;position:relative}.header-icon:hover{background:#f5f8fc;color:#1769ff}.header-icon.danger:hover{color:#ef4444}.notice em{position:absolute;right:6px;top:5px;width:6px;height:6px;border-radius:50%;background:#ff4d4f;border:1px solid white}.avatar{width:31px;height:31px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#d8f0ff,#74b7ff);color:#1769ff;font-size:15px;margin-left:4px}.user-copy{display:flex;flex-direction:column;line-height:1.1}.user-copy strong{color:#26364b;font-size:11px;font-weight:650}.user-copy span{font-size:9px;color:#9aa7b7;margin-top:3px}.user-chevron{color:#8f9bad;font-size:12px}
.workspace-toolbar{height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;background:#fff;border-bottom:1px solid #e9eef5;position:relative;z-index:55}.page-title-wrap{gap:10px}.page-title{font-size:15px;font-weight:700;color:#17263a;display:flex;align-items:center;gap:7px}.page-title button{width:25px;height:25px;border:0;background:transparent;color:#53657a;display:grid;place-items:center;cursor:pointer}.autosave{margin-left:10px;font-size:10px;color:#a0adbc;display:flex;gap:4px;align-items:center;font-weight:400}.autosave span{margin-left:2px;color:#adb7c4}.editor-actions{gap:10px}.history-actions{gap:2px;margin-right:2px}.history-actions button{width:30px;height:32px;border:0;background:transparent;color:#63758a;border-radius:7px;cursor:pointer;font-size:16px}.history-actions button:hover{background:#f4f7fb;color:#1769ff}.history-actions button:disabled{opacity:.28;cursor:not-allowed}.device-switch{height:36px;border:1px solid #e7edf5;border-radius:8px;background:#f8fafc;overflow:hidden}.device-switch button{width:38px;height:34px;border:0;background:transparent;color:#8a99ab;cursor:pointer;font-size:16px}.device-switch button.active{color:#1769ff;background:#fff;box-shadow:0 2px 7px rgba(53,82,120,.08)}.zoom-control{height:36px;border:1px solid #e7edf5;border-radius:8px;background:#fff;overflow:hidden}.zoom-control button{width:34px;height:34px;border:0;background:transparent;color:#718198;cursor:pointer}.zoom-control span{min-width:56px;text-align:center;color:#26364b;font-size:11px;font-weight:650}.action-button{height:36px;border-radius:8px;min-width:78px;border-color:#dce5f2;color:#34506f}.action-button.preview{color:#1769ff;border-color:#9fc0ff;background:#f8fbff}.publish-button{height:36px;border-radius:8px;min-width:90px;background:#1677ff;border-color:#1677ff;box-shadow:0 7px 16px rgba(23,105,255,.22)}
@media(max-width:1500px){.top-nav button:nth-child(n+4){display:none}.global-search{display:none}.user-copy{display:none}.brand-copy{min-width:120px}.top-nav{margin-left:12px}}
</style>
