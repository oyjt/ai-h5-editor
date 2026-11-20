<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { exportProjectFile, importProjectFile } from '@/utils/project-file'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
const fileInput = ref<HTMLInputElement | null>(null)
const busy = ref(false)

const sourceOptions = [
  { value: 'auto', label: '自动', hint: '优先用外链，加载失败时自动换成本地示例图' },
  { value: 'remote', label: '外链', hint: '始终使用 picsum / unsplash 外链，需要联网' },
  { value: 'local', label: '本地', hint: '全部使用仓库内置的本地示例图，离线可用' },
] as const

async function exportFile() {
  busy.value = true
  try { await exportProjectFile(); ElMessage.success('项目文件已导出') }
  catch (error) { console.error(error); ElMessage.error('导出失败，请重试') }
  finally { busy.value = false }
}
async function onImport(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  ;(event.target as HTMLInputElement).value = ''
  if (!file) return
  try {
    await ElMessageBox.confirm('导入会覆盖当前浏览器里的项目数据，确定继续吗？', '导入项目文件', { type: 'warning', confirmButtonText: '覆盖并导入', cancelButtonText: '取消' })
  }
  catch { return }
  busy.value = true
  try { await importProjectFile(file); ElMessage.success('导入成功，正在刷新'); setTimeout(() => location.reload(), 600) }
  catch (error) { console.error(error); ElMessage.error(error instanceof Error ? error.message : '导入失败') }
  finally { busy.value = false }
}
</script>

<template>
  <ElDialog v-model="settings.dialogVisible" title="设置" width="520px" append-to-body>
    <section class="block">
      <h4>示例图来源</h4>
      <div class="options" role="radiogroup" aria-label="示例图来源">
        <label v-for="item in sourceOptions" :key="item.value" :class="{ active: settings.imageSource === item.value }">
          <input v-model="settings.imageSource" type="radio" name="image-source" :value="item.value">
          <strong>{{ item.label }}</strong>
          <span>{{ item.hint }}</span>
        </label>
      </div>
      <p class="note">你上传的图片始终保存在本机浏览器里，不会上传到服务器。</p>
    </section>

    <section class="block">
      <h4>AI 模型接入</h4>
      <p class="note">不填时使用内置的本地规划器，无需联网。填写后会改用你自己的模型服务（OpenAI 兼容的 chat completions 接口）。</p>
      <label class="field"><span>接口地址</span><input v-model="settings.llmEndpoint" placeholder="https://your-gateway.example.com/v1/chat/completions"></label>
      <label class="field"><span>模型名</span><input v-model="settings.llmModel" placeholder="例如 gpt-4o-mini"></label>
      <label class="field"><span>API Key</span><input v-model="settings.llmApiKey" type="password" autocomplete="off" placeholder="只保存在本机浏览器"></label>
      <p class="note warn">Key 存在本机浏览器里，请求会从浏览器直接发往你填写的地址，请勿在公共电脑上保存。更稳妥的做法是自建一个转发服务来持有 Key。</p>
    </section>

    <section class="block">
      <h4>数据</h4>
      <p class="note">所有项目和素材只存在当前浏览器。换设备或清理缓存前，请先导出项目文件。</p>
      <div class="row">
        <ElButton :loading="busy" @click="exportFile">导出项目文件</ElButton>
        <ElButton :loading="busy" @click="fileInput?.click()">导入项目文件</ElButton>
        <input ref="fileInput" class="hidden" type="file" accept=".json,application/json" @change="onImport">
      </div>
    </section>
  </ElDialog>
</template>

<style scoped>
.block{padding:4px 0 14px}.block+.block{border-top:1px solid var(--border-subtle);padding-top:14px}
h4{margin:0 0 8px;font-size:14px;color:var(--text-strong)}
.options{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.options label{display:flex;flex-direction:column;gap:4px;padding:10px;border:1px solid var(--border-default);border-radius:var(--radius-md);cursor:pointer;font-size:12px;color:var(--text-secondary)}
.options label.active{border-color:var(--brand-600);background:var(--brand-50)}.options input{position:absolute;opacity:0;pointer-events:none}.options label:focus-within{outline:2px solid var(--brand-600);outline-offset:1px}
.options strong{color:var(--text-strong);font-size:13px}
.note{margin:8px 0;font-size:12px;color:var(--text-muted);line-height:1.6}.note.warn{color:var(--warning-700)}
.field{display:flex;flex-direction:column;gap:4px;margin-bottom:8px;font-size:12px;color:var(--text-secondary)}
.field input{height:32px;border:1px solid var(--border-default);border-radius:var(--radius-md);padding:0 10px;font:inherit;background:var(--surface-1);color:var(--text-primary)}.field input:focus-visible{outline:2px solid var(--brand-600);outline-offset:1px}
.row{display:flex;gap:8px}.hidden{display:none}
</style>
