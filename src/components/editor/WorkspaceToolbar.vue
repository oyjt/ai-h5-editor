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
      <div class="page-title">{{ editorStore.currentPage.name || '夏日焕新 · 营销活动页' }} <button title="重命名" @click="handleRename"><i class="i-tabler-pencil" /></button></div>
      <div class="autosave" :class="{ saving }"><i :class="saving ? 'i-tabler-loader-2 spin' : 'i-tabler-cloud-check'" /> {{ saveStatus }} <span>{{ lastSavedAt }}</span></div>
    </div>

    <div class="editor-actions">
      <div class="history-actions">
        <ElTooltip content="撤销"><button :disabled="!historyStore.canUndo" @click="handleUndo"><i class="i-tabler-arrow-back-up" /></button></ElTooltip>
        <ElTooltip content="重做"><button :disabled="!historyStore.canRedo" @click="handleRedo"><i class="i-tabler-arrow-forward-up" /></button></ElTooltip>
      </div>
      <div class="device-switch">
        <button :class="{ active: editorStore.deviceMode === 'mobile' }" title="手机" @click="editorStore.setDeviceMode('mobile')"><i class="i-tabler-device-mobile" /></button>
        <button :class="{ active: editorStore.deviceMode === 'tablet' }" title="平板" @click="editorStore.setDeviceMode('tablet')"><i class="i-tabler-device-tablet" /></button>
      </div>
      <div class="zoom-control">
        <button title="缩小" @click="editorStore.setCanvasZoom(editorStore.canvasZoom - 10)">−</button>
        <span>{{ editorStore.canvasZoom }}%</span>
        <button title="放大" @click="editorStore.setCanvasZoom(editorStore.canvasZoom + 10)">+</button>
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
.workspace-toolbar{height:72px;flex:0 0 72px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:#fff;border-bottom:1px solid #e9eef5;position:relative;z-index:55}.page-title-wrap,.editor-actions,.history-actions,.device-switch,.zoom-control{display:flex;align-items:center}.page-title-wrap{gap:12px}.page-title{font-size:16px;font-weight:800;color:#17263a;display:flex;align-items:center;gap:7px}.page-title button{width:27px;height:27px;border:0;background:transparent;color:#53657a;display:grid;place-items:center;cursor:pointer;border-radius:6px}.page-title button:hover{background:#f3f6fa;color:#1769ff}.autosave{margin-left:8px;font-size:10px;color:#9aa8b9;display:flex;gap:4px;align-items:center;font-weight:400}.autosave span{margin-left:2px;color:#adb7c4}.autosave.saving{color:#1769ff}.spin{animation:spin .8s linear infinite}.editor-actions{gap:10px}.history-actions{gap:2px;margin-right:2px;padding-right:8px;border-right:1px solid #edf1f5}.history-actions button{width:32px;height:34px;border:0;background:transparent;color:#63758a;border-radius:7px;cursor:pointer;font-size:16px}.history-actions button:hover{background:#f4f7fb;color:#1769ff}.history-actions button:disabled{opacity:.28;cursor:not-allowed}.device-switch{height:38px;border:1px solid #e7edf5;border-radius:8px;background:#f8fafc;overflow:hidden}.device-switch button{width:42px;height:36px;border:0;background:transparent;color:#8a99ab;cursor:pointer;font-size:17px}.device-switch button.active{color:#1769ff;background:#fff;box-shadow:0 2px 7px rgba(53,82,120,.08)}.zoom-control{height:38px;border:1px solid #e7edf5;border-radius:8px;background:#fff;overflow:hidden}.zoom-control button{width:36px;height:36px;border:0;background:transparent;color:#718198;cursor:pointer;font-size:16px}.zoom-control button:hover{color:#1769ff;background:#f7faff}.zoom-control span{min-width:62px;text-align:center;color:#26364b;font-size:11px;font-weight:700}.action-button{height:38px;border-radius:8px;min-width:82px;border-color:#dce5f2;color:#34506f}.action-button.preview{color:#1769ff;border-color:#9fc0ff;background:#f8fbff}.publish-button{height:38px;border-radius:8px;min-width:96px;background:#1677ff;border-color:#1677ff;box-shadow:0 7px 16px rgba(23,105,255,.22)}@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:1500px){.workspace-toolbar{padding:0 18px;height:64px;flex-basis:64px}.page-title{font-size:14px}.autosave{display:none}.editor-actions{gap:7px}.action-button{min-width:68px}.publish-button{min-width:78px}}
</style>
