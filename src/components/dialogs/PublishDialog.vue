<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import QRCode from 'qrcode'
import { ElDialog, ElInput, ElMessage } from 'element-plus'
import { useEditorStore } from '@/stores/editor'

interface Props { modelValue: boolean }
const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue':[value:boolean] }>()
const editorStore = useEditorStore()
const visible = computed({ get:()=>props.modelValue, set:value=>emit('update:modelValue',value) })
const step = ref(1)
const pageName = ref('')
const description = ref('')
const slug = ref('summer-sale')
const accessMode = ref<'public'|'password'>('public')
const accessPassword = ref('')
const publishing = ref(false)
const publishedUrl = ref('')
const qrCode = ref('')
const slugInvalid = computed(() => !!slug.value && !/^[a-z0-9-]+$/.test(slug.value))
const canContinue = computed(() => pageName.value.trim().length > 0)
const canPublish = computed(() => !!slug.value.trim() && !slugInvalid.value && (accessMode.value === 'public' || accessPassword.value.length >= 4))

watch(visible, value => {
  if (!value) return
  step.value = 1
  pageName.value = editorStore.currentPage.name || '夏日焕新营销页'
  description.value = '夏日焕新限时营销活动'
  slug.value = 'summer-sale'
  accessMode.value = 'public'
  accessPassword.value = ''
  publishedUrl.value = ''
  qrCode.value = ''
})

async function publish() {
  if (!canPublish.value) return
  publishing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 650))
    const base = window.location.origin + import.meta.env.BASE_URL
    publishedUrl.value = `${base}preview?from=${encodeURIComponent(slug.value || 'campaign')}`
    qrCode.value = await QRCode.toDataURL(publishedUrl.value, { width: 180, margin: 1 })
    editorStore.currentPage.name = pageName.value.trim()
    editorStore.savePage()
    step.value = 3
    ElMessage.success('页面发布成功')
  }
  finally { publishing.value = false }
}
async function copyUrl() {
  try { await navigator.clipboard?.writeText(publishedUrl.value); ElMessage.success('链接已复制') }
  catch { ElMessage.error('复制失败，请手动复制') }
}
</script>

<template>
  <ElDialog v-model="visible" width="640px" :close-on-click-modal="false" align-center class="publish-dialog">
    <template #header>
      <div class="dialog-head"><span class="head-icon"><i class="i-tabler-rocket" /></span><div><h3>发布页面</h3><p>完成基础信息和发布设置后生成访问链接</p></div></div>
    </template>

    <div class="steps">
      <div v-for="item in 3" :key="item" :class="{ active: step >= item, current: step === item }"><span>{{ step > item ? '✓' : item }}</span><em>{{ ['基础信息','发布设置','发布完成'][item - 1] }}</em></div>
    </div>

    <section v-if="step === 1" class="step-body">
      <div class="form-field"><label>页面名称 <em>*</em></label><ElInput v-model="pageName" maxlength="30" show-word-limit placeholder="请输入页面名称" /><small>用于作品管理、浏览器标题和分享卡片。</small></div>
      <div class="form-field"><label>页面描述</label><ElInput v-model="description" type="textarea" :rows="3" maxlength="80" show-word-limit resize="none" placeholder="请输入页面描述" /><small>建议描述页面主题、活动时间或核心权益。</small></div>
      <div class="tip"><i class="i-tabler-info-circle" /><span>页面信息不会改变画布内容，可在发布前随时返回修改。</span></div>
    </section>

    <section v-else-if="step === 2" class="step-body">
      <div class="form-field"><label>访问路径 <em>*</em></label><div class="url-input" :class="{ error: slugInvalid }"><span>{{ window?.location?.host || 'example.com' }}/</span><input v-model="slug" placeholder="summer-sale" /></div><small v-if="slugInvalid" class="error-text">仅支持小写字母、数字和连字符</small><small v-else>发布后将作为页面唯一访问路径。</small></div>
      <div class="form-field"><label>访问权限</label><div class="radio-grid"><button :class="{ selected: accessMode === 'public' }" @click="accessMode = 'public'"><i class="i-tabler-world" /><strong>公开访问</strong><small>任何获得链接的人都可访问</small><span class="check"><i class="i-tabler-check" /></span></button><button :class="{ selected: accessMode === 'password' }" @click="accessMode = 'password'"><i class="i-tabler-lock" /><strong>密码访问</strong><small>适合内部预览与审核</small><span class="check"><i class="i-tabler-check" /></span></button></div></div>
      <div v-if="accessMode === 'password'" class="form-field password-field"><label>访问密码 <em>*</em></label><ElInput v-model="accessPassword" type="password" show-password maxlength="20" placeholder="至少 4 位" /><small :class="{ 'error-text': accessPassword.length > 0 && accessPassword.length < 4 }">访问者需要输入密码后才能查看页面。</small></div>
      <div class="form-field"><label>发布检查</label><div class="checks"><span><i class="i-tabler-circle-check" />页面内容已保存</span><span><i class="i-tabler-circle-check" />移动端适配正常</span><span><i class="i-tabler-circle-check" />素材资源可访问</span></div></div>
    </section>

    <section v-else class="success">
      <span class="success-icon"><i class="i-tabler-check" /></span><h2>页面已发布成功</h2><p>现在可以复制链接或扫码在手机端查看。</p>
      <div class="published-url"><span>{{ publishedUrl }}</span><button @click="copyUrl"><i class="i-tabler-copy" />复制</button></div>
      <img v-if="qrCode" :src="qrCode" alt="发布二维码"><small>扫码预览</small>
      <div class="success-actions"><button @click="visible = false">继续编辑</button><button class="primary" @click="window.open(publishedUrl,'_blank')">查看页面</button></div>
    </section>

    <template #footer>
      <div v-if="step < 3" class="footer"><button class="ghost" @click="visible = false">取消</button><div><button v-if="step === 2" class="ghost" @click="step = 1">上一步</button><button v-if="step === 1" class="primary" :disabled="!canContinue" @click="step = 2">下一步</button><button v-else class="primary" :disabled="!canPublish || publishing" @click="publish"><i v-if="publishing" class="i-tabler-loader-2 spin" />{{ publishing ? '发布中...' : '确认发布' }}</button></div></div>
    </template>
  </ElDialog>
</template>

<style scoped>
.dialog-head{display:flex;align-items:center;gap:11px}.head-icon{width:40px;height:40px;border-radius:var(--radius-lg);background:var(--brand-50);color:var(--brand-600);display:grid;place-items:center;font-size:20px}.dialog-head h3{margin:0;font-size:var(--font-size-lg);color:var(--text-strong)}.dialog-head p{margin:4px 0 0;font-size:var(--font-size-xs);color:var(--text-muted)}.steps{display:grid;grid-template-columns:repeat(3,1fr);margin-bottom:24px}.steps div{position:relative;display:flex;flex-direction:column;align-items:center;color:var(--text-muted)}.steps div:before{content:'';position:absolute;top:13px;left:-50%;width:100%;height:1px;background:var(--border-default)}.steps div:first-child:before{display:none}.steps span{width:26px;height:26px;border-radius:50%;background:var(--surface-3);display:grid;place-items:center;font-size:var(--font-size-xs);z-index:1;border:1px solid var(--border-subtle)}.steps em{font-style:normal;font-size:var(--font-size-xs);margin-top:7px}.steps .active{color:var(--brand-600)}.steps .active span{background:var(--brand-600);border-color:var(--brand-600);color:#fff}.steps .active:before{background:var(--brand-300)}.steps .current em{font-weight:var(--font-weight-semibold)}.step-body{display:flex;flex-direction:column;gap:18px;min-height:300px}.form-field{display:flex;flex-direction:column;gap:7px}.form-field label{font-size:var(--font-size-sm);font-weight:var(--font-weight-semibold);color:var(--text-secondary)}.form-field label em{font-style:normal;color:var(--danger-500)}.form-field>small{font-size:9px;color:var(--text-muted);line-height:1.5}.tip{font-size:var(--font-size-xs);color:var(--text-secondary);background:var(--surface-2);border-radius:var(--radius-md);padding:10px;display:flex;gap:6px}.tip i{color:var(--brand-600);font-size:14px}.url-input{height:var(--control-height-md);display:flex;align-items:center;border:1px solid var(--border-default);border-radius:var(--radius-md);overflow:hidden;padding-left:10px;background:var(--surface-1);transition:all var(--motion-base) var(--ease-standard)}.url-input:focus-within{border-color:var(--brand-600);box-shadow:var(--focus-ring)}.url-input.error{border-color:var(--danger-500);box-shadow:0 0 0 3px rgba(239,68,68,.08)}.url-input span{font-size:var(--font-size-xs);color:var(--text-muted);white-space:nowrap}.url-input input{flex:1;height:100%;min-width:0;border:0;outline:0;padding:0 7px;background:transparent;color:var(--text-primary);font-size:var(--font-size-sm)}.error-text{color:var(--danger-500)!important}.radio-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.radio-grid button{position:relative;min-height:92px;border:1px solid var(--border-default);background:var(--surface-1);border-radius:var(--radius-lg);display:flex;flex-direction:column;align-items:flex-start;padding:14px;color:var(--text-secondary);cursor:pointer;transition:all var(--motion-base) var(--ease-standard)}.radio-grid button:hover{border-color:var(--border-brand);background:var(--brand-50)}.radio-grid button.selected{border-color:var(--brand-500);background:var(--brand-50);box-shadow:0 0 0 2px rgba(23,105,255,.06)}.radio-grid>button>i{font-size:18px;color:var(--brand-600)}.radio-grid strong{font-size:var(--font-size-sm);color:var(--text-primary);margin-top:6px}.radio-grid small{font-size:9px;color:var(--text-muted);margin-top:3px}.radio-grid .check{position:absolute;right:9px;top:9px;width:18px;height:18px;border:1px solid var(--border-default);border-radius:50%;display:grid;place-items:center;color:transparent;font-size:10px}.radio-grid button.selected .check{background:var(--brand-600);border-color:var(--brand-600);color:#fff}.checks{background:var(--surface-2);border-radius:var(--radius-md);padding:11px;display:grid;gap:8px;border:1px solid var(--border-subtle)}.checks span{font-size:var(--font-size-xs);color:var(--text-secondary)}.checks i{color:var(--success-500);margin-right:5px}.footer{display:flex;justify-content:space-between}.footer>div{display:flex;gap:8px}.footer button,.success-actions button{height:var(--control-height-md);border-radius:var(--radius-md);padding:0 16px;font-size:var(--font-size-sm);font-weight:var(--font-weight-medium);cursor:pointer;transition:all var(--motion-base) var(--ease-standard)}.footer .ghost,.success-actions button{border:1px solid var(--border-default);background:var(--surface-1);color:var(--text-secondary)}.footer .ghost:hover,.success-actions button:hover{border-color:var(--border-brand);color:var(--brand-600);background:var(--brand-50)}.footer .primary,.success-actions .primary{border:1px solid var(--brand-600);background:var(--brand-600);color:#fff;box-shadow:var(--shadow-brand)}.footer .primary:hover:not(:disabled),.success-actions .primary:hover{background:var(--brand-500);border-color:var(--brand-500)}.footer button:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.success{display:flex;flex-direction:column;align-items:center;padding:10px 20px 22px}.success-icon{width:52px;height:52px;border-radius:50%;background:var(--success-50);color:var(--success-500);display:grid;place-items:center;font-size:25px}.success h2{font-size:18px;margin:13px 0 5px;color:var(--text-strong)}.success>p{font-size:var(--font-size-xs);color:var(--text-muted);margin:0 0 15px}.published-url{width:100%;height:40px;border:1px solid var(--border-subtle);background:var(--surface-2);border-radius:var(--radius-md);display:flex;align-items:center;padding-left:11px}.published-url span{flex:1;font-size:var(--font-size-xs);color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.published-url button{height:30px;border:0;background:transparent;color:var(--brand-600);cursor:pointer;padding:0 10px}.published-url button:hover{background:var(--brand-50)}.success img{width:132px;height:132px;margin-top:16px}.success>small{font-size:9px;color:var(--text-muted)}.success-actions{display:flex;gap:9px;margin-top:17px}.spin{animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
</style>
