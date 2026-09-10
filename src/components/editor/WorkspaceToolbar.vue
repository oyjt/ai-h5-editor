<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { ElButton, ElMessage, ElMessageBox, ElTooltip } from 'element-plus'
import { useEditorStore } from '@/stores/editor'
import { useHistoryStore } from '@/stores/history'
import PublishDialog from '@/components/dialogs/PublishDialog.vue'
import PreviewDialog from '@/components/dialogs/PreviewDialog.vue'

const editorStore = useEditorStore()
const historyStore = useHistoryStore()
const showPublishDialog = ref(false)
const showPreviewDialog = ref(false)
const lastSavedAt = ref(formatTime(new Date()))
const saving = ref(false)
const saveStatus = computed(() => saving.value ? '正在保存' : '已自动保存')

function formatTime(date: Date) {
  return date.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
function persistPage(showMessage = false) {
  saving.value = true
  const success = editorStore.savePage()
  saving.value = false
  if (success) {
    lastSavedAt.value = formatTime(new Date())
    if (showMessage) ElMessage.success('保存成功')
  }
  else if (showMessage) ElMessage.error('保存失败')
  return success
}
const autoSave = useDebounceFn(() => persistPage(false), 900)
watch(() => editorStore.currentPage, () => autoSave(), { deep: true })

function handleUndo() { const page = historyStore.undo(); if (page) editorStore.currentPage = page }
function handleRedo() { const page = historyStore.redo(); if (page) editorStore.currentPage = page }
function handleSave() { persistPage(true) }
async function handleRename() {
  try {
    const { value } = await ElMessageBox.prompt('请输入页面名称', '重命名页面', {
      inputValue: editorStore.currentPage.name || '夏日焕新 · 营销活动页',
      inputPattern: /\S+/,
      inputErrorMessage: '页面名称不能为空',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
    editorStore.currentPage.name = value.trim()
    persistPage(false)
  }
  catch {}
}
</script>

<template>
  <div class="workspace-toolbar">
    <div class="page-title-wrap">
      <div class="page-title">
        {{ editorStore.currentPage.name || '夏日焕新 · 营销活动页' }}
        <button title="重命名" @click="handleRename"><i class="i-tabler-pencil" /></button>
      </div>
      <div class="autosave" :class="{ saving }">
        <i :class="saving ? 'i-tabler-loader-2 spin' : 'i-tabler-cloud-check'" />
        {{ saveStatus }} <span>{{ lastSavedAt }}</span>
      </div>
    </div>

    <div class="editor-actions">
      <div class="history-actions">
        <ElTooltip content="撤销" placement="bottom"><button :disabled="!historyStore.canUndo" @click="handleUndo"><i class="i-tabler-arrow-back-up" /></button></ElTooltip>
        <ElTooltip content="重做" placement="bottom"><button :disabled="!historyStore.canRedo" @click="handleRedo"><i class="i-tabler-arrow-forward-up" /></button></ElTooltip>
      </div>
      <div class="device-switch">
        <ElTooltip content="手机预览" placement="bottom"><button :class="{ active: editorStore.deviceMode === 'mobile' }" @click="editorStore.setDeviceMode('mobile')"><i class="i-tabler-device-mobile" /></button></ElTooltip>
        <ElTooltip content="平板预览" placement="bottom"><button :class="{ active: editorStore.deviceMode === 'tablet' }" @click="editorStore.setDeviceMode('tablet')"><i class="i-tabler-device-tablet" /></button></ElTooltip>
      </div>
      <div class="zoom-control">
        <button title="缩小" :disabled="editorStore.canvasZoom <= 50" @click="editorStore.setCanvasZoom(editorStore.canvasZoom - 10)">−</button>
        <span>{{ editorStore.canvasZoom }}%</span>
        <button title="放大" :disabled="editorStore.canvasZoom >= 150" @click="editorStore.setCanvasZoom(editorStore.canvasZoom + 10)">+</button>
      </div>
      <ElButton class="action-button preview" @click="showPreviewDialog = true"><i class="i-tabler-player-play mr-6px" />预览</ElButton>
      <ElButton class="action-button" @click="handleSave">保存</ElButton>
      <ElButton class="publish-button" type="primary" @click="showPublishDialog = true"><i class="i-tabler-send mr-6px" />发布</ElButton>
    </div>
  </div>

  <PublishDialog v-model="showPublishDialog" />
  <PreviewDialog v-model="showPreviewDialog" />
</template>

<style scoped>
.workspace-toolbar{height:var(--workspace-toolbar-height);flex:0 0 var(--workspace-toolbar-height);display:flex;align-items:center;justify-content:space-between;padding:0 24px;background:var(--surface-1);border-bottom:1px solid var(--border-subtle);position:relative;z-index:55}.page-title-wrap,.editor-actions,.history-actions,.device-switch,.zoom-control{display:flex;align-items:center}.page-title-wrap{gap:12px;min-width:0}.page-title{font-size:14px;font-weight:var(--font-weight-bold);color:var(--text-strong);display:flex;align-items:center;gap:6px;white-space:nowrap}.page-title button{width:28px;height:28px;border:0;background:transparent;color:var(--text-secondary);display:grid;place-items:center;cursor:pointer;border-radius:var(--radius-sm);transition:all var(--motion-fast) var(--ease-standard)}.page-title button:hover{background:var(--surface-3);color:var(--brand-600)}.autosave{margin-left:4px;font-size:var(--font-size-xs);color:var(--text-muted);display:flex;gap:4px;align-items:center}.autosave span{margin-left:2px;color:var(--text-disabled)}.autosave.saving{color:var(--brand-600)}.spin{animation:spin .8s linear infinite}.editor-actions{gap:8px}.history-actions{gap:2px;margin-right:2px;padding-right:8px;border-right:1px solid var(--border-subtle)}.history-actions button,.device-switch button,.zoom-control button{height:var(--toolbar-control-height);border:0;background:transparent;cursor:pointer;transition:all var(--motion-fast) var(--ease-standard)}.history-actions button{width:34px;color:var(--text-secondary);border-radius:var(--radius-sm);font-size:16px}.history-actions button:hover{background:var(--brand-50);color:var(--brand-600)}.history-actions button:disabled,.zoom-control button:disabled{opacity:.32;cursor:not-allowed;background:transparent;color:var(--text-disabled)}.device-switch{height:var(--toolbar-control-height);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--surface-2);overflow:hidden}.device-switch button{width:40px;color:var(--text-muted);font-size:16px}.device-switch button:hover{color:var(--brand-600);background:var(--brand-50)}.device-switch button.active{color:var(--brand-600);background:var(--surface-1);box-shadow:var(--shadow-xs)}.zoom-control{height:var(--toolbar-control-height);border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--surface-1);overflow:hidden}.zoom-control button{width:34px;color:var(--text-secondary);font-size:15px}.zoom-control button:hover:not(:disabled){color:var(--brand-600);background:var(--brand-50)}.zoom-control span{min-width:56px;text-align:center;color:var(--text-primary);font-size:var(--font-size-sm);font-weight:var(--font-weight-semibold);border-left:1px solid var(--border-subtle);border-right:1px solid var(--border-subtle);line-height:var(--toolbar-control-height)}.action-button,.publish-button{height:var(--toolbar-control-height);border-radius:var(--radius-md);min-width:76px;font-size:var(--font-size-md);font-weight:var(--font-weight-medium)}.action-button{border-color:var(--border-default);color:var(--text-primary);background:var(--surface-1)}.action-button:hover{border-color:var(--brand-300);color:var(--brand-600);background:var(--brand-50)}.action-button.preview{color:var(--brand-600);border-color:var(--brand-300);background:var(--brand-50)}.publish-button{min-width:88px;background:var(--brand-600);border-color:var(--brand-600);box-shadow:var(--shadow-brand)}.publish-button:hover{background:var(--brand-700);border-color:var(--brand-700)}@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:1500px){.workspace-toolbar{padding:0 16px}.page-title{font-size:13px}.autosave{display:none}.editor-actions{gap:6px}.action-button{min-width:66px}.publish-button{min-width:76px}.zoom-control span{min-width:50px}}
</style>
