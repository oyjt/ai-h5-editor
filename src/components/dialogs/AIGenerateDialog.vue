<script setup lang="ts">
/**
 * AI 生成对话框
 */
import { ref, computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { mockGeneratePage } from '@/ai/mock-generator'
import {
  ElDialog,
  ElButton,
  ElInput,
  ElMessage,
  ElAlert,
} from 'element-plus'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const editorStore = useEditorStore()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// 用户输入的提示词
const prompt = ref('')

// 生成状态
const isGenerating = ref(false)

// 示例提示词
const examplePrompts = [
  '产品介绍页面',
  '活动宣传页面',
  '个人简介页面',
]

// 使用示例
function useExample(example: string) {
  prompt.value = example
}

// 生成页面
async function handleGenerate() {
  if (!prompt.value.trim()) {
    ElMessage.warning('请输入页面描述')
    return
  }

  isGenerating.value = true

  try {
    const components = await mockGeneratePage(prompt.value)

    // 添加到编辑器
    components.forEach(comp => {
      editorStore.addComponent(comp)
    })

    ElMessage.success(`已生成 ${components.length} 个组件`)
    visible.value = false
    prompt.value = ''
  } catch (error) {
    console.error('生成失败:', error)
    ElMessage.error('生成失败，请重试')
  } finally {
    isGenerating.value = false
  }
}
</script>

<template>
  <ElDialog
    v-model="visible"
    title="AI 生成页面"
    width="600px"
    :close-on-click-modal="false"
  >
    <div class="ai-generate-dialog">
      <ElAlert
        title="提示"
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          描述您想要的页面，AI 将为您生成组件。当前为 Mock 模式，支持关键词：产品介绍、活动宣传。
        </template>
      </ElAlert>

      <div class="form-section">
        <label class="form-label">页面描述</label>
        <ElInput
          v-model="prompt"
          type="textarea"
          :rows="4"
          placeholder="例如：创建一个产品介绍页面，包含标题、产品图片、描述文字和购买按钮"
          :disabled="isGenerating"
        />
      </div>

      <div class="examples-section">
        <label class="form-label">示例提示词</label>
        <div class="examples-list">
          <ElButton
            v-for="example in examplePrompts"
            :key="example"
            size="small"
            @click="useExample(example)"
          >
            {{ example }}
          </ElButton>
        </div>
      </div>
    </div>

    <template #footer>
      <ElButton @click="visible = false" :disabled="isGenerating">
        取消
      </ElButton>
      <ElButton
        type="primary"
        :loading="isGenerating"
        @click="handleGenerate"
      >
        {{ isGenerating ? '生成中...' : '生成页面' }}
      </ElButton>
    </template>
  </ElDialog>
</template>

<style scoped>
.ai-generate-dialog {
  padding: 10px 0;
}

.form-section {
  margin-top: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.examples-section {
  margin-top: 20px;
}

.examples-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
