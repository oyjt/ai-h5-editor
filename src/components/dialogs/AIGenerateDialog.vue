<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElDialog, ElInput, ElMessage } from 'element-plus'
import { useEditorStore } from '@/stores/editor'
import { mockGeneratePage } from '@/ai/mock-generator'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const editorStore = useEditorStore()
const visible = computed({ get: () => props.modelValue, set: value => emit('update:modelValue', value) })
const prompt = ref('')
const isGenerating = ref(false)
const examplePrompts = [
  { title: '夏日促销活动', desc: 'Banner、优惠券、商品推荐与报名按钮', icon: 'i-tabler-sun-high' },
  { title: '新品发布页面', desc: '新品主视觉、卖点介绍和立即购买按钮', icon: 'i-tabler-sparkles' },
  { title: '线索收集页面', desc: '活动介绍、权益说明与报名表单', icon: 'i-tabler-forms' },
]

function useExample(example: string) { prompt.value = example }
async function handleGenerate() {
  if (!prompt.value.trim()) return ElMessage.warning('请输入页面描述')
  isGenerating.value = true
  try {
    const components = await mockGeneratePage(prompt.value)
    components.forEach(component => editorStore.addComponent(component))
    editorStore.savePage()
    ElMessage.success(`已生成 ${components.length} 个组件`)
    visible.value = false
    prompt.value = ''
  }
  catch (error) {
    console.error('生成失败:', error)
    ElMessage.error('生成失败，请重试')
  }
  finally { isGenerating.value = false }
}
</script>

<template>
  <ElDialog v-model="visible" width="640px" :close-on-click-modal="false" align-center class="ai-dialog">
    <template #header>
      <div class="dialog-head">
        <span class="head-icon"><i class="i-tabler-sparkles" /></span>
        <div><h3>AI 生成页面</h3><p>描述营销目标，快速生成可继续编辑的页面结构</p></div>
      </div>
    </template>

    <div class="ai-body">
      <section class="prompt-section">
        <div class="section-head"><div><strong>页面描述</strong><span>尽量说明主题、目标和需要的模块</span></div><em>AI</em></div>
        <ElInput v-model="prompt" type="textarea" :rows="5" maxlength="300" show-word-limit resize="none" :disabled="isGenerating" placeholder="例如：创建一个夏日防晒促销页面，包含活动主视觉、三张优惠券、两款商品、报名表单和底部导航。" />
        <div class="prompt-tip"><i class="i-tabler-bulb" /><span>描述越具体，生成结果越接近预期。生成后仍可拖拽排序并编辑全部属性。</span></div>
      </section>

      <section class="examples-section">
        <div class="section-head"><div><strong>快速开始</strong><span>选择常见营销场景自动填入描述</span></div></div>
        <div class="examples-grid">
          <button v-for="item in examplePrompts" :key="item.title" @click="useExample(item.title)">
            <span class="example-icon"><i :class="item.icon" /></span>
            <span class="example-copy"><strong>{{ item.title }}</strong><small>{{ item.desc }}</small></span>
            <i class="i-tabler-chevron-right" />
          </button>
        </div>
      </section>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <button class="secondary" :disabled="isGenerating" @click="visible = false">取消</button>
        <button class="primary" :disabled="!prompt.trim() || isGenerating" @click="handleGenerate">
          <i :class="isGenerating ? 'i-tabler-loader-2 spin' : 'i-tabler-sparkles'" />
          {{ isGenerating ? '正在生成...' : '生成页面' }}
        </button>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped>
.dialog-head{display:flex;align-items:center;gap:12px}.head-icon{width:42px;height:42px;border-radius:var(--radius-lg);display:grid;place-items:center;background:var(--brand-50);color:var(--brand-600);font-size:21px}.dialog-head h3{margin:0;color:var(--text-strong);font-size:var(--font-size-lg);font-weight:var(--font-weight-bold)}.dialog-head p{margin:4px 0 0;color:var(--text-muted);font-size:var(--font-size-xs)}.ai-body{display:flex;flex-direction:column;gap:24px}.prompt-section,.examples-section{display:flex;flex-direction:column;gap:12px}.section-head{display:flex;align-items:flex-start;justify-content:space-between}.section-head>div{display:flex;flex-direction:column;gap:3px}.section-head strong{font-size:var(--font-size-md);color:var(--text-primary)}.section-head span{font-size:var(--font-size-xs);color:var(--text-muted)}.section-head em{font-style:normal;padding:3px 7px;border-radius:999px;background:var(--brand-50);color:var(--brand-600);font-size:9px;font-weight:700}.prompt-tip{display:flex;align-items:flex-start;gap:7px;padding:10px 11px;border-radius:var(--radius-md);background:var(--surface-2);color:var(--text-muted);font-size:var(--font-size-xs);line-height:1.6}.prompt-tip i{color:var(--warning-500);font-size:14px;margin-top:1px}.examples-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.examples-grid button{min-height:70px;padding:11px;border:1px solid var(--border-subtle);border-radius:var(--radius-lg);background:var(--surface-1);display:grid;grid-template-columns:34px 1fr 14px;gap:9px;align-items:center;text-align:left;color:var(--text-secondary);cursor:pointer;transition:all var(--motion-base) var(--ease-standard)}.examples-grid button:hover{border-color:var(--border-brand);background:var(--brand-50);transform:translateY(-1px);box-shadow:var(--shadow-xs)}.example-icon{width:34px;height:34px;border-radius:var(--radius-md);display:grid;place-items:center;background:var(--surface-3);color:var(--brand-600);font-size:17px}.example-copy{display:flex;flex-direction:column;gap:4px;min-width:0}.example-copy strong{font-size:var(--font-size-sm);color:var(--text-primary)}.example-copy small{font-size:9px;color:var(--text-muted);line-height:1.45}.examples-grid button>i{font-size:12px;color:var(--text-muted)}.dialog-footer{display:flex;justify-content:flex-end;gap:8px}.dialog-footer button{height:var(--control-height-md);padding:0 16px;border-radius:var(--radius-md);font-size:var(--font-size-sm);font-weight:var(--font-weight-medium);cursor:pointer;transition:all var(--motion-base) var(--ease-standard)}.dialog-footer .secondary{background:var(--surface-1);border:1px solid var(--border-default);color:var(--text-secondary)}.dialog-footer .secondary:hover{border-color:var(--border-brand);color:var(--brand-600);background:var(--brand-50)}.dialog-footer .primary{border:1px solid var(--brand-600);background:var(--brand-600);color:#fff;display:flex;align-items:center;gap:6px;box-shadow:var(--shadow-brand)}.dialog-footer .primary:hover:not(:disabled){background:var(--brand-500);border-color:var(--brand-500)}.dialog-footer button:disabled{opacity:.5;cursor:not-allowed;box-shadow:none}.spin{animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:760px){.examples-grid{grid-template-columns:1fr}}
</style>
