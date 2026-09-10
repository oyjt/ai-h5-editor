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
const canZoomOut = computed(() => scale.value > .65)
const canZoomIn = computed(() => scale.value < 1.1)

async function generateQRCode() {
  try { qrcodeDataUrl.value = await QRCode.toDataURL(previewUrl.value, { width: 220, margin: 1 }) }
  catch { qrcodeDataUrl.value = '' }
}
async function handleCopy() {
  try { await copy(); ElMessage.success('预览链接已复制') }
  catch { ElMessage.error('复制失败') }
}
function zoom(delta: number) { scale.value = Math.min(1.1, Math.max(.65, Number((scale.value + delta).toFixed(2)))) }
watch([visible, () => editorStore.currentPage], ([show]) => { if (show) generateQRCode() }, { deep: true, immediate: true })
</script>

<template>
  <ElDialog v-model="visible" width="880px" :close-on-click-modal="false" align-center class="preview-dialog">
    <template #header>
      <div class="dialog-title">
        <div class="title-copy"><span class="head-icon"><i class="i-tabler-device-mobile" /></span><div><strong>移动端预览</strong><span>扫码或打开链接查看当前页面效果</span></div></div>
        <div class="zoom-control">
          <button :disabled="!canZoomOut" title="缩小" @click="zoom(-.1)">−</button>
          <span>{{ Math.round(scale * 100) }}%</span>
          <button :disabled="!canZoomIn" title="放大" @click="zoom(.1)">+</button>
        </div>
      </div>
    </template>

    <div class="preview-body">
      <div class="phone-space">
        <div class="preview-tip"><i class="i-tabler-info-circle" /> 当前为实时预览，编辑内容保存后会同步更新</div>
        <div class="phone-wrap" :style="phoneStyle">
          <div class="phone-frame">
            <div class="side-key volume-up" /><div class="side-key volume-down" />
            <div class="phone-screen">
              <div class="notch"><i /><span /></div>
              <div class="status-bar"><strong>9:41</strong><span><i class="i-tabler-antenna-bars-5" /><i class="i-tabler-wifi" /><i class="i-tabler-battery-4" /></span></div>
              <div class="screen-content"><PageRenderer :schema="editorStore.currentPage" :is-editing="false" /></div>
            </div>
          </div>
        </div>
      </div>

      <aside class="share-panel">
        <div class="share-heading"><span class="share-icon"><i class="i-tabler-qrcode" /></span><div><strong>扫码预览</strong><span>使用手机浏览器扫码打开</span></div></div>
        <div class="qr-wrap"><img v-if="qrcodeDataUrl" :src="qrcodeDataUrl" alt="预览二维码"><i v-else class="i-tabler-loader-2 spin" /></div>
        <label class="field-label"><span>预览链接</span><div class="link-field"><input :value="previewUrl" readonly><button title="复制链接" @click="handleCopy"><i :class="copied ? 'i-tabler-check' : 'i-tabler-copy'" /></button></div></label>
        <a class="open-link" :href="previewUrl" target="_blank" rel="noreferrer"><i class="i-tabler-external-link" />在新窗口打开</a>
        <div class="info-card"><i class="i-tabler-shield-check" /><span>预览链接仅用于查看当前页面效果，不会触发正式发布。</span></div>
      </aside>
    </div>
  </ElDialog>
</template>

<style scoped>
:global(.preview-dialog .el-dialog__body){padding:0}.dialog-title{display:flex;align-items:center;justify-content:space-between;padding-right:34px}.title-copy{display:flex;align-items:center;gap:11px}.head-icon,.share-icon{width:38px;height:38px;border-radius:var(--radius-lg);display:grid;place-items:center;background:var(--brand-50);color:var(--brand-600);font-size:19px}.title-copy>div,.share-heading>div{display:flex;flex-direction:column;gap:3px}.dialog-title strong,.share-heading strong{font-size:var(--font-size-base);color:var(--text-primary)}.dialog-title span,.share-heading span{font-size:var(--font-size-xs);color:var(--text-muted)}.zoom-control{height:var(--control-height-md);border:1px solid var(--border-default);border-radius:var(--radius-md);display:flex;align-items:center;overflow:hidden;background:var(--surface-1)}.zoom-control button{width:34px;height:32px;border:0;background:var(--surface-1);color:var(--text-secondary);cursor:pointer}.zoom-control button:hover:not(:disabled){background:var(--brand-50);color:var(--brand-600)}.zoom-control button:disabled{color:var(--text-disabled);cursor:not-allowed}.zoom-control span{width:54px;text-align:center;color:var(--text-primary);font-weight:var(--font-weight-bold);border-left:1px solid var(--border-subtle);border-right:1px solid var(--border-subtle)}.preview-body{height:650px;display:grid;grid-template-columns:1fr 320px;background:var(--surface-0)}.phone-space{position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;background:radial-gradient(circle at 50% 45%,#fff 0,#f3f7fc 44%,#eaf0f7 100%)}.preview-tip{position:absolute;left:20px;top:18px;height:30px;padding:0 10px;border:1px solid var(--border-subtle);border-radius:999px;background:rgba(255,255,255,.88);backdrop-filter:blur(8px);display:flex;align-items:center;gap:5px;color:var(--text-muted);font-size:9px;box-shadow:var(--shadow-xs)}.preview-tip i{color:var(--brand-600)}.phone-wrap{transform-origin:center;transition:transform var(--motion-slow) var(--ease-standard)}.phone-frame{position:relative;width:390px;height:844px;border-radius:49px;padding:8px;background:linear-gradient(145deg,#242933,#0d1117 48%,#343b46);box-shadow:0 26px 60px rgba(38,58,88,.28),0 0 0 1px rgba(13,17,23,.9)}.side-key{position:absolute;left:-3px;width:3px;border-radius:3px 0 0 3px;background:#0e131a}.volume-up{top:172px;height:54px}.volume-down{top:237px;height:54px}.phone-screen{width:100%;height:100%;border-radius:41px;overflow:hidden;background:#fff;position:relative}.notch{position:absolute;top:7px;left:50%;transform:translateX(-50%);width:116px;height:25px;border-radius:0 0 15px 15px;background:#11151b;z-index:20;display:flex;justify-content:center;gap:9px;padding-top:7px}.notch span{width:42px;height:4px;border-radius:3px;background:#2f343b}.notch i{width:7px;height:7px;border-radius:50%;background:#182b43;box-shadow:inset 0 0 0 2px #23384f}.status-bar{position:absolute;left:0;right:0;top:0;height:38px;padding:12px 20px 0;display:flex;justify-content:space-between;color:#17344c;font-size:10px;z-index:10;pointer-events:none}.status-bar span{display:flex;gap:3px;font-size:12px}.screen-content{width:100%;height:100%;overflow:auto;scrollbar-width:none}.screen-content::-webkit-scrollbar{display:none}.share-panel{background:var(--surface-1);border-left:1px solid var(--border-subtle);padding:28px 24px;display:flex;flex-direction:column}.share-heading{display:flex;gap:10px;align-items:center}.qr-wrap{width:220px;height:220px;margin:25px auto 22px;border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:10px;display:grid;place-items:center;background:#fff;box-shadow:var(--shadow-xs)}.qr-wrap img{width:100%;height:100%}.qr-wrap>i{font-size:24px;color:var(--brand-600)}.field-label>span{display:block;margin-bottom:7px;font-size:var(--font-size-xs);color:var(--text-secondary)}.link-field{height:var(--control-height-md);border:1px solid var(--border-default);border-radius:var(--radius-md);display:grid;grid-template-columns:1fr 36px;overflow:hidden;background:var(--surface-1)}.link-field:focus-within{border-color:var(--brand-600);box-shadow:var(--focus-ring)}.link-field input{min-width:0;border:0;outline:0;padding:0 9px;color:var(--text-secondary);font-size:9px;background:transparent}.link-field button{border:0;border-left:1px solid var(--border-subtle);background:var(--surface-1);color:var(--brand-600);cursor:pointer}.link-field button:hover{background:var(--brand-50)}.open-link{height:36px;margin-top:10px;border-radius:var(--radius-md);background:var(--brand-600);color:#fff;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:6px;font-size:var(--font-size-xs);font-weight:var(--font-weight-bold);box-shadow:var(--shadow-brand);transition:all var(--motion-base) var(--ease-standard)}.open-link:hover{background:var(--brand-500);transform:translateY(-1px)}.info-card{margin-top:16px;padding:11px;border-radius:var(--radius-md);background:var(--surface-2);color:var(--text-muted);font-size:9px;line-height:1.6;display:flex;gap:6px}.info-card i{color:var(--success-500);font-size:13px}.spin{animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
</style>
