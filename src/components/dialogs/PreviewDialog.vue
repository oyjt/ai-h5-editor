<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElDialog, ElMessage } from 'element-plus'
import { useClipboard } from '@vueuse/core'
import QRCode from 'qrcode'
import { useEditorStore } from '@/stores/editor'
import { generatePreviewURL } from '@/utils/export'
import PageRenderer from '@/components/renderer/PageRenderer.vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const editorStore = useEditorStore()
const visible = computed({ get: () => props.modelValue, set: value => emit('update:modelValue', value) })
const qrcodeDataUrl = ref('')
const scale = ref(.86)
const previewUrl = computed(() => generatePreviewURL(editorStore.currentPage))
const phoneStyle = computed(() => ({ transform: `scale(${scale.value})` }))
const { copy, copied } = useClipboard({ source: previewUrl })

async function generateQRCode() {
  try {
    qrcodeDataUrl.value = await QRCode.toDataURL(previewUrl.value, { width: 220, margin: 1 })
  }
  catch {
    qrcodeDataUrl.value = ''
  }
}
async function handleCopy() {
  try {
    await copy()
    ElMessage.success('预览链接已复制')
  }
  catch {
    ElMessage.error('复制失败')
  }
}
function zoom(delta: number) { scale.value = Math.min(1.1, Math.max(.65, Number((scale.value + delta).toFixed(2)))) }
watch([visible, () => editorStore.currentPage], ([show]) => { if (show) generateQRCode() }, { deep: true, immediate: true })
</script>

<template>
  <ElDialog v-model="visible" width="860px" :close-on-click-modal="false" align-center class="preview-dialog">
    <template #header>
      <div class="dialog-title">
        <div><strong>移动端预览</strong><span>扫码或打开链接查看当前页面效果</span></div>
        <div class="zoom-control"><button @click="zoom(-.1)">−</button><span>{{ Math.round(scale * 100) }}%</span><button @click="zoom(.1)">+</button></div>
      </div>
    </template>

    <div class="preview-body">
      <div class="phone-space">
        <div class="phone-wrap" :style="phoneStyle">
          <div class="phone-frame">
            <div class="phone-screen">
              <div class="status-bar"><strong>9:41</strong><span><i class="i-tabler-antenna-bars-5" /><i class="i-tabler-wifi" /><i class="i-tabler-battery-4" /></span></div>
              <div class="screen-content"><PageRenderer :schema="editorStore.currentPage" :is-editing="false" /></div>
            </div>
          </div>
        </div>
      </div>

      <aside class="share-panel">
        <div class="share-heading"><i class="i-tabler-qrcode" /><div><strong>扫码预览</strong><span>手机浏览器扫码打开</span></div></div>
        <div class="qr-wrap"><img v-if="qrcodeDataUrl" :src="qrcodeDataUrl" alt="预览二维码"><i v-else class="i-tabler-loader-2 spin" /></div>
        <label><span>预览链接</span><div class="link-field"><input :value="previewUrl" readonly><button @click="handleCopy"><i :class="copied ? 'i-tabler-check' : 'i-tabler-copy'" /></button></div></label>
        <a class="open-link" :href="previewUrl" target="_blank" rel="noreferrer"><i class="i-tabler-external-link" />在新窗口打开</a>
        <p><i class="i-tabler-info-circle" />链接包含当前页面 Schema，刷新独立预览页仍可恢复页面内容。</p>
      </aside>
    </div>
  </ElDialog>
</template>

<style scoped>
:global(.preview-dialog .el-dialog){border-radius:14px;overflow:hidden}:global(.preview-dialog .el-dialog__header){margin:0;padding:18px 22px;border-bottom:1px solid #edf1f5}:global(.preview-dialog .el-dialog__body){padding:0}.dialog-title{display:flex;align-items:center;justify-content:space-between;padding-right:34px}.dialog-title>div:first-child{display:flex;flex-direction:column;gap:4px}.dialog-title strong{font-size:15px;color:#213247}.dialog-title span{font-size:10px;color:#8d9bad}.zoom-control{height:34px;border:1px solid #e1e8f1;border-radius:7px;display:flex;align-items:center;overflow:hidden}.zoom-control button{width:32px;height:32px;border:0;background:#fff;color:#62748b;cursor:pointer}.zoom-control span{width:52px;text-align:center;color:#34465c;font-weight:700}.preview-body{height:650px;display:grid;grid-template-columns:1fr 310px;background:#eef3f9}.phone-space{display:flex;align-items:center;justify-content:center;overflow:hidden;background:radial-gradient(circle at 50% 45%,#fff 0,#eef4fb 42%,#e5edf7 100%)}.phone-wrap{transform-origin:center;transition:transform .18s ease}.phone-frame{width:400px;height:840px;border-radius:46px;padding:8px;background:linear-gradient(145deg,#f9fafc,#b7c0ca 48%,#eef2f7);box-shadow:0 22px 52px rgba(49,70,99,.24),0 0 0 1px rgba(108,120,136,.28)}.phone-screen{width:100%;height:100%;border-radius:38px;overflow:hidden;background:#fff;position:relative}.status-bar{position:absolute;left:0;right:0;top:0;height:38px;padding:12px 20px 0;display:flex;justify-content:space-between;color:#17344c;font-size:10px;z-index:10;pointer-events:none}.status-bar span{display:flex;gap:3px;font-size:12px}.screen-content{width:100%;height:100%;overflow:auto;scrollbar-width:none}.screen-content::-webkit-scrollbar{display:none}.share-panel{background:#fff;border-left:1px solid #e1e8f1;padding:28px 24px;display:flex;flex-direction:column}.share-heading{display:flex;gap:10px;align-items:center}.share-heading>i{width:38px;height:38px;border-radius:9px;background:#edf4ff;color:#1769ff;display:grid;place-items:center;font-size:20px}.share-heading>div{display:flex;flex-direction:column;gap:3px}.share-heading strong{font-size:13px;color:#26384f}.share-heading span{font-size:9px;color:#98a5b5}.qr-wrap{width:220px;height:220px;margin:25px auto 22px;border:1px solid #e4eaf2;border-radius:10px;padding:10px;display:grid;place-items:center}.qr-wrap img{width:100%;height:100%}.qr-wrap>i{font-size:24px;color:#1769ff}.share-panel label>span{display:block;margin-bottom:7px;font-size:10px;color:#607187}.link-field{height:34px;border:1px solid #dfe7f1;border-radius:7px;display:grid;grid-template-columns:1fr 34px;overflow:hidden}.link-field input{min-width:0;border:0;outline:0;padding:0 9px;color:#607187;font-size:9px}.link-field button{border:0;border-left:1px solid #e7edf4;background:#fff;color:#1769ff;cursor:pointer}.open-link{height:36px;margin-top:10px;border-radius:7px;background:#1769ff;color:#fff;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:6px;font-size:10px;font-weight:700}.share-panel p{margin:16px 0 0;padding:11px;border-radius:7px;background:#f7f9fc;color:#8391a3;font-size:9px;line-height:1.6}.share-panel p i{margin-right:4px;color:#709ce0}.spin{animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
</style>
