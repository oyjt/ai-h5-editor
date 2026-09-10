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
const publishing = ref(false)
const publishedUrl = ref('')
const qrCode = ref('')

watch(visible, value => { if(value){ step.value=1; pageName.value=editorStore.currentPage.name||'夏日焕新营销页'; description.value='夏日焕新限时营销活动'; publishedUrl.value=''; qrCode.value='' } })

async function publish(){
  publishing.value=true
  try{
    await new Promise(resolve=>setTimeout(resolve,650))
    const base = window.location.origin + import.meta.env.BASE_URL
    publishedUrl.value = `${base}preview?from=${encodeURIComponent(slug.value||'campaign')}`
    qrCode.value = await QRCode.toDataURL(publishedUrl.value,{width:180,margin:1})
    editorStore.savePage()
    step.value=3
    ElMessage.success('页面发布成功')
  } finally { publishing.value=false }
}
async function copyUrl(){ await navigator.clipboard?.writeText(publishedUrl.value); ElMessage.success('链接已复制') }
</script>

<template>
  <ElDialog v-model="visible" width="620px" :close-on-click-modal="false" align-center class="publish-dialog">
    <template #header><div class="dialog-head"><span class="head-icon"><i class="i-tabler-rocket"/></span><div><h3>发布页面</h3><p>完成基础信息与发布设置后生成访问链接</p></div></div></template>
    <div class="steps"><div v-for="item in 3" :key="item" :class="{active:step>=item}"><span>{{step>item?'✓':item}}</span><em>{{['基础信息','发布设置','发布完成'][item-1]}}</em></div></div>
    <section v-if="step===1" class="step-body"><label>页面名称</label><ElInput v-model="pageName" maxlength="30" show-word-limit/><label>页面描述</label><ElInput v-model="description" type="textarea" :rows="3" maxlength="80" show-word-limit/><div class="tip"><i class="i-tabler-info-circle"/> 页面信息会用于分享卡片和项目管理。</div></section>
    <section v-else-if="step===2" class="step-body"><label>访问路径</label><div class="url-input"><span>{{window?.location?.host || 'example.com'}}/</span><ElInput v-model="slug" placeholder="summer-sale"/></div><label>访问权限</label><div class="radio-grid"><button class="selected"><i class="i-tabler-world"/><strong>公开访问</strong><small>任何获得链接的人都可访问</small></button><button><i class="i-tabler-lock"/><strong>密码访问</strong><small>适合内部预览与审核</small></button></div><label>发布检查</label><div class="checks"><span><i class="i-tabler-circle-check"/> 页面内容已保存</span><span><i class="i-tabler-circle-check"/> 移动端适配正常</span><span><i class="i-tabler-circle-check"/> 素材资源可访问</span></div></section>
    <section v-else class="success"><span class="success-icon"><i class="i-tabler-check"/></span><h2>页面已发布成功！</h2><p>现在可以复制链接或扫码在手机端查看。</p><div class="published-url"><span>{{publishedUrl}}</span><button @click="copyUrl"><i class="i-tabler-copy"/> 复制</button></div><img v-if="qrCode" :src="qrCode" alt="发布二维码"/><small>扫码预览</small><div class="success-actions"><button @click="visible=false">继续编辑</button><button class="primary" @click="window.open(publishedUrl,'_blank')">查看页面</button></div></section>
    <template #footer><div v-if="step<3" class="footer"><button @click="visible=false">取消</button><div><button v-if="step===2" @click="step=1">上一步</button><button v-if="step===1" class="primary" :disabled="!pageName.trim()" @click="step=2">下一步</button><button v-else class="primary" :disabled="!slug.trim()||publishing" @click="publish">{{publishing?'发布中...':'确认发布'}}</button></div></div></template>
  </ElDialog>
</template>

<style scoped>
.dialog-head{display:flex;align-items:center;gap:11px}.head-icon{width:40px;height:40px;border-radius:11px;background:#edf4ff;color:#2868ff;display:grid;place-items:center;font-size:20px}.dialog-head h3{margin:0;font-size:17px;color:#203047}.dialog-head p{margin:4px 0 0;font-size:10px;color:#98a4b3}.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-bottom:24px}.steps div{position:relative;display:flex;flex-direction:column;align-items:center;color:#a0acbb}.steps div:before{content:'';position:absolute;top:13px;left:-50%;width:100%;height:1px;background:#e4eaf1}.steps div:first-child:before{display:none}.steps span{width:26px;height:26px;border-radius:50%;background:#eef2f6;display:grid;place-items:center;font-size:10px;z-index:1}.steps em{font-style:normal;font-size:10px;margin-top:7px}.steps .active{color:#2868ff}.steps .active span{background:#2868ff;color:#fff}.steps .active:before{background:#8db2ff}.step-body{display:flex;flex-direction:column;gap:9px;min-height:280px}.step-body label{font-size:11px;font-weight:600;color:#506075;margin-top:3px}.tip{font-size:10px;color:#7f8d9e;background:#f7f9fc;border-radius:8px;padding:10px}.url-input{display:flex;align-items:center;border:1px solid #dfe6ef;border-radius:8px;overflow:hidden;padding-left:10px}.url-input span{font-size:10px;color:#8e9bac}.url-input :deep(.el-input__wrapper){box-shadow:none}.radio-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.radio-grid button{height:92px;border:1px solid #e1e7ef;background:#fff;border-radius:10px;display:flex;flex-direction:column;align-items:flex-start;padding:14px;color:#718095}.radio-grid button.selected{border-color:#7fa9ff;background:#f5f8ff;color:#2868ff}.radio-grid i{font-size:18px}.radio-grid strong{font-size:11px;color:#435269;margin-top:6px}.radio-grid small{font-size:9px;margin-top:3px}.checks{background:#f7f9fc;border-radius:9px;padding:11px;display:grid;gap:7px}.checks span{font-size:10px;color:#617087}.checks i{color:#20a56e;margin-right:5px}.footer{display:flex;justify-content:space-between}.footer>div{display:flex;gap:8px}.footer button,.success-actions button{height:36px;border:1px solid #dde5ef;background:#fff;color:#54647a;border-radius:8px;padding:0 15px}.footer .primary,.success-actions .primary{background:#2868ff;border-color:#2868ff;color:#fff}.success{display:flex;flex-direction:column;align-items:center;padding:10px 20px 22px}.success-icon{width:52px;height:52px;border-radius:50%;background:#e8faf2;color:#20aa73;display:grid;place-items:center;font-size:25px}.success h2{font-size:18px;margin:13px 0 5px;color:#203047}.success>p{font-size:10px;color:#93a0b0;margin:0 0 15px}.published-url{width:100%;height:40px;border:1px solid #e1e7ef;background:#f8fafd;border-radius:8px;display:flex;align-items:center;padding-left:11px}.published-url span{flex:1;font-size:10px;color:#66758a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.published-url button{height:30px;border:0;background:transparent;color:#2868ff}.success img{width:132px;height:132px;margin-top:16px}.success>small{font-size:9px;color:#9ba7b6}.success-actions{display:flex;gap:9px;margin-top:17px}
</style>
