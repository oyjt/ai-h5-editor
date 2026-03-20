<script setup lang="ts">
/**
 * 工具栏组件
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEditorStore } from '@/stores/editor'
import { useHistoryStore } from '@/stores/history'
import { useThemeStore } from '@/stores/theme'
import { ElButton, ElButtonGroup, ElTooltip, ElMessage, ElMessageBox } from 'element-plus'
import PublishDialog from '@/components/dialogs/PublishDialog.vue'
import AIGenerateDialog from '@/components/dialogs/AIGenerateDialog.vue'
import PreviewDialog from '@/components/dialogs/PreviewDialog.vue'

const router = useRouter()
const editorStore = useEditorStore()
const historyStore = useHistoryStore()
const themeStore = useThemeStore()

// 主题图标
const themeIcon = computed(() => themeStore.theme === 'dark' ? 'i-tabler-sun' : 'i-tabler-moon')

// 发布对话框显示状态
const showPublishDialog = ref(false)

// AI 生成对话框显示状态
const showAIGenerateDialog = ref(false)

// 预览对话框显示状态
const showPreviewDialog = ref(false)

// 撤销
function handleUndo() {
  const prevPage = historyStore.undo()
  if (prevPage) {
    editorStore.currentPage = prevPage
  }
}

// 重做
function handleRedo() {
  const nextPage = historyStore.redo()
  if (nextPage) {
    editorStore.currentPage = nextPage
  }
}

// 预览
function handlePreview() {
  showPreviewDialog.value = true
}

// 保存
function handleSave() {
  const success = editorStore.savePage()
  if (success) {
    ElMessage.success('保存成功')
  }
  else {
    ElMessage.error('保存失败')
  }
}

// 清空
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

// 打开模板市场
function handleOpenTemplates() {
  router.push('/templates')
}

// 发布
function handlePublish() {
  showPublishDialog.value = true
}

// AI 生成
function handleAIGenerate() {
  showAIGenerateDialog.value = true
}

// 切换主题
function handleToggleTheme() {
  themeStore.toggleTheme()
  ElMessage.success(`已切换到${themeStore.theme === 'dark' ? '深色' : '亮色'}模式`)
}
</script>

<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <h2 class="title">
        H5 编辑器
      </h2>
    </div>

    <div class="toolbar-center">
      <ElButtonGroup>
        <ElTooltip content="撤销 (Ctrl+Z)">
          <ElButton
            :disabled="!historyStore.canUndo"
            @click="handleUndo"
          >
            <i class="i-tabler-arrow-back-up" />
          </ElButton>
        </ElTooltip>

        <ElTooltip content="重做 (Ctrl+Y)">
          <ElButton
            :disabled="!historyStore.canRedo"
            @click="handleRedo"
          >
            <i class="i-tabler-arrow-forward-up" />
          </ElButton>
        </ElTooltip>
      </ElButtonGroup>

      <ElButton @click="handleOpenTemplates">
        <i class="i-tabler-template" />
        模板
      </ElButton>

      <ElButton @click="handleAIGenerate">
        <i class="i-tabler-sparkles" />
        AI 生成
      </ElButton>

      <ElButton @click="handlePreview">
        <i class="i-tabler-device-mobile" />
        预览
      </ElButton>

      <ElButton type="primary" @click="handleSave">
        <i class="i-tabler-device-floppy" />
        保存
      </ElButton>

      <ElButton type="success" @click="handlePublish">
        <i class="i-tabler-rocket" />
        发布
      </ElButton>

      <ElButton type="danger" @click="handleClear">
        <i class="i-tabler-trash" />
        清空
      </ElButton>
    </div>

    <div class="toolbar-right">
      <ElTooltip :content="`切换到${themeStore.theme === 'dark' ? '亮色' : '深色'}模式`">
        <ElButton text @click="handleToggleTheme">
          <i :class="themeIcon" />
        </ElButton>
      </ElTooltip>
      <ElButton text>
        <i class="i-tabler-settings" />
      </ElButton>
    </div>

    <!-- 发布对话框 -->
    <PublishDialog v-model="showPublishDialog" />

    <!-- AI 生成对话框 -->
    <AIGenerateDialog v-model="showAIGenerateDialog" />

    <!-- 预览对话框 -->
    <PreviewDialog v-model="showPreviewDialog" />
  </div>
</template>

<style scoped>
.toolbar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: var(--editor-bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-toolbar);
  position: relative;
  z-index: 50;
}

.toolbar-left {
  flex: 1;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.toolbar-center {
  display: flex;
  gap: 12px;
  align-items: center;
}

.toolbar-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.el-button i {
  font-size: 18px;
}

/* 按钮圆角规范 */
:deep(.el-button) {
  border-radius: var(--radius-button);
}
</style>
