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

function handleUndo() {
  const page = historyStore.undo()
  if (page) editorStore.currentPage = page
}

function handleRedo() {
  const page = historyStore.redo()
  if (page) editorStore.currentPage = page
}

function handleSave() {
  ElMessage[editorStore.savePage() ? 'success' : 'error'](editorStore.savePage() ? '保存成功' : '保存失败')
}

function handleClear() {
  ElMessageBox.confirm('确定要清空页面吗？此操作不可恢复。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    editorStore.clearPage()
    ElMessage.success('已清空')
  }).catch(() => {})
}
</script>

<template>
  <header class="editor-header">
    <div class="brand-area">
      <div class="brand-mark"><i class="i-tabler-layout-dashboard" /></div>
      <div class="brand-copy">
        <strong>营销搭建平台</strong>
        <span>让营销更简单</span>
      </div>
      <nav class="top-nav">
        <button class="active">工作台</button>
        <button @click="router.push('/templates')">模板中心</button>
        <button>我的项目</button>
        <button>资源管理</button>
        <button>数据中心</button>
      </nav>
    </div>

    <div class="user-area">
      <ElTooltip content="AI 生成">
        <button class="icon-button" @click="showAIGenerateDialog = true"><i class="i-tabler-sparkles" /></button>
      </ElTooltip>
      <ElTooltip :content="themeStore.theme === 'dark' ? '切换亮色' : '切换深色'">
        <button class="icon-button" @click="themeStore.toggleTheme()"><i :class="themeIcon" /></button>
      </ElTooltip>
      <button class="icon-button"><i class="i-tabler-bell" /></button>
      <div class="avatar">产</div>
      <div class="user-copy"><strong>产品设计师</strong><span>企业版</span></div>
      <i class="i-tabler-chevron-down user-chevron" />
    </div>
  </header>

  <div class="workspace-toolbar">
    <div class="page-title-wrap">
      <button class="back-button" @click="router.push('/templates')"><i class="i-tabler-chevron-left" /></button>
      <div>
        <div class="page-title">{{ editorStore.currentPage.name || '夏日焕新 · 营销活动页' }} <i class="i-tabler-pencil" /></div>
        <div class="autosave"><i class="i-tabler-cloud-check" /> 已自动保存</div>
      </div>
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

      <div class="zoom-control"><button @click="zoom = Math.max(50, zoom - 10)">−</button><span>{{ zoom }}%</span><button @click="zoom = Math.min(150, zoom + 10)">+</button></div>

      <ElButton class="action-button" @click="showPreviewDialog = true"><i class="i-tabler-player-play mr-6px" />预览</ElButton>
      <ElButton class="action-button" @click="handleSave"><i class="i-tabler-device-floppy mr-6px" />保存</ElButton>
      <ElButton class="publish-button" type="primary" @click="showPublishDialog = true"><i class="i-tabler-send mr-6px" />发布</ElButton>
      <ElTooltip content="清空页面"><button class="icon-button danger" @click="handleClear"><i class="i-tabler-trash" /></button></ElTooltip>
    </div>
  </div>

  <PublishDialog v-model="showPublishDialog" />
  <AIGenerateDialog v-model="showAIGenerateDialog" />
  <PreviewDialog v-model="showPreviewDialog" />
</template>

<style scoped>
.editor-header { height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; background: var(--editor-bg-tertiary); border-bottom: 1px solid var(--border-color); position: relative; z-index: 60; }
.brand-area,.user-area,.top-nav,.editor-actions,.page-title-wrap,.history-actions,.device-switch,.zoom-control { display:flex; align-items:center; }
.brand-mark { width:38px; height:38px; border-radius:11px; display:grid; place-items:center; background:linear-gradient(135deg,#1769ff,#58a6ff); color:white; font-size:21px; box-shadow:0 8px 18px rgba(23,105,255,.22); }
.brand-copy { display:flex; flex-direction:column; margin-left:10px; min-width:128px; }
.brand-copy strong { font-size:16px; color:var(--text-primary); line-height:1.25; }
.brand-copy span,.user-copy span { font-size:11px; color:var(--text-tertiary); margin-top:2px; }
.top-nav { gap:4px; margin-left:28px; }
.top-nav button { height:36px; padding:0 14px; border:0; background:transparent; color:var(--text-secondary); border-radius:8px; cursor:pointer; font-size:14px; }
.top-nav button:hover,.top-nav button.active { color:#1769ff; background:rgba(23,105,255,.08); }
.user-area { gap:8px; }
.icon-button { width:34px; height:34px; border:0; background:transparent; color:var(--text-secondary); border-radius:8px; display:grid; place-items:center; cursor:pointer; font-size:18px; }
.icon-button:hover { background:var(--editor-bg-primary); color:#1769ff; }
.icon-button.danger:hover { color:#ef4444; }
.avatar { width:32px; height:32px; border-radius:50%; display:grid; place-items:center; background:linear-gradient(135deg,#bde4ff,#4fa7ff); color:white; font-size:13px; margin-left:6px; }
.user-copy { display:flex; flex-direction:column; line-height:1.1; }
.user-copy strong { color:var(--text-primary); font-size:13px; font-weight:600; }
.user-chevron { color:var(--text-tertiary); font-size:14px; }
.workspace-toolbar { height:66px; display:flex; align-items:center; justify-content:space-between; padding:0 22px; background:var(--editor-bg-tertiary); border-bottom:1px solid var(--border-color); position:relative; z-index:55; }
.page-title-wrap { gap:9px; }
.back-button { width:30px; height:30px; border:0; border-radius:7px; background:var(--editor-bg-primary); color:var(--text-secondary); cursor:pointer; }
.page-title { font-size:15px; font-weight:650; color:var(--text-primary); display:flex; gap:8px; align-items:center; }
.autosave { margin-top:3px; font-size:11px; color:var(--text-tertiary); display:flex; gap:4px; align-items:center; }
.editor-actions { gap:10px; }
.history-actions,.device-switch,.zoom-control { height:36px; border:1px solid var(--border-color); border-radius:8px; background:var(--editor-bg-secondary); overflow:hidden; }
.history-actions button,.device-switch button,.zoom-control button { width:36px; height:34px; border:0; background:transparent; color:var(--text-secondary); cursor:pointer; }
.history-actions button:disabled { opacity:.35; cursor:not-allowed; }
.device-switch button.active { color:#1769ff; background:rgba(23,105,255,.10); }
.zoom-control span { min-width:54px; text-align:center; color:var(--text-primary); font-size:12px; font-weight:600; }
.action-button { border-radius:8px; min-width:78px; }
.publish-button { border-radius:8px; min-width:88px; box-shadow:0 6px 16px rgba(64,158,255,.25); }
@media (max-width:1500px) { .top-nav button:nth-child(n+4){display:none}.user-copy{display:none}.brand-copy{min-width:116px}.top-nav{margin-left:16px} }
</style>
