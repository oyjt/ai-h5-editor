<script setup lang="ts">
/**
 * 发布对话框
 */
import { ref, computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { downloadJSON, downloadHTML, generatePreviewURL } from '@/utils/export'
import {
  ElDialog,
  ElButton,
  ElRadioGroup,
  ElRadio,
  ElInput,
  ElMessage,
  ElDivider,
} from 'element-plus'
import QRCode from 'qrcode'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const editorStore = useEditorStore()

// 对话框显示状态
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// 导出格式
const exportFormat = ref<'html' | 'json'>('html')

// 文件名
const filename = ref('page')

// 预览链接
const previewURL = ref('')

// 二维码
const qrCodeDataURL = ref('')

// 生成预览链接
async function handleGeneratePreview() {
  try {
    previewURL.value = generatePreviewURL(editorStore.currentPage)

    // 生成二维码
    qrCodeDataURL.value = await QRCode.toDataURL(previewURL.value, {
      width: 200,
      margin: 1,
    })

    ElMessage.success('预览链接已生成')
  }
  catch (error) {
    console.error('生成预览链接失败:', error)
    ElMessage.error('生成预览链接失败')
  }
}

// 复制预览链接
function handleCopyURL() {
  if (!previewURL.value) {
    ElMessage.warning('请先生成预览链接')
    return
  }

  navigator.clipboard.writeText(previewURL.value).then(() => {
    ElMessage.success('链接已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

// 导出文件
function handleExport() {
  const fullFilename = `${filename.value}.${exportFormat.value}`

  if (exportFormat.value === 'html') {
    downloadHTML(editorStore.currentPage, fullFilename)
    ElMessage.success('HTML 文件已下载')
  }
  else {
    downloadJSON(editorStore.currentPage, fullFilename)
    ElMessage.success('JSON 文件已下载')
  }
}
</script>

<template>
  <ElDialog
    v-model="visible"
    title="发布页面"
    width="600px"
    :close-on-click-modal="false"
  >
    <div class="publish-dialog">
      <!-- 导出文件 -->
      <div class="section">
        <h3 class="section-title">
          导出文件
        </h3>

        <div class="form-item">
          <label>导出格式</label>
          <ElRadioGroup v-model="exportFormat">
            <ElRadio value="html">
              HTML（可独立运行）
            </ElRadio>
            <ElRadio value="json">
              JSON（可导入编辑器）
            </ElRadio>
          </ElRadioGroup>
        </div>

        <div class="form-item">
          <label>文件名</label>
          <ElInput
            v-model="filename"
            placeholder="请输入文件名"
          >
            <template #append>
              .{{ exportFormat }}
            </template>
          </ElInput>
        </div>

        <ElButton type="primary" block @click="handleExport">
          <i class="i-tabler-download" />
          下载文件
        </ElButton>
      </div>

      <ElDivider />

      <!-- 在线预览 -->
      <div class="section">
        <h3 class="section-title">
          在线预览
        </h3>

        <ElButton block @click="handleGeneratePreview">
          <i class="i-tabler-link" />
          生成预览链接
        </ElButton>

        <div v-if="previewURL" class="preview-result">
          <div class="form-item">
            <label>预览链接</label>
            <ElInput
              :model-value="previewURL"
              readonly
            >
              <template #append>
                <el-button @click="handleCopyURL">
                  复制
                </el-button>
              </template>
            </ElInput>
          </div>

          <div class="qrcode-container">
            <p class="qrcode-label">
              扫码预览
            </p>
            <img v-if="qrCodeDataURL" :src="qrCodeDataURL" alt="二维码" class="qrcode">
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <ElButton @click="visible = false">
        关闭
      </ElButton>
    </template>
  </ElDialog>
</template>

<style scoped>
.publish-dialog {
  padding: 10px 0;
}

.section {
  margin-bottom: 20px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.form-item {
  margin-bottom: 16px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.preview-result {
  margin-top: 20px;
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.qrcode-label {
  font-size: 14px;
  color: #606266;
  margin: 0 0 12px 0;
}

.qrcode {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  background: #fff;
  padding: 10px;
}

:deep(.el-radio-group) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
