<script setup lang="ts">
/**
 * 事件配置面板
 */
import { ref, computed } from 'vue'
import type { ComponentSchema } from '@/types/schema'
import { ElSelect, ElOption, ElInput, ElButton, ElRadioGroup, ElRadio } from 'element-plus'

interface Props {
  component: ComponentSchema
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updateEvent: [key: string, value: any]
}>()

// 事件配置
const events = computed(() => props.component.events || {})

// 点击行为类型
const clickActionType = ref(events.value.clickAction?.type || 'none')

// 点击行为配置
const clickActionConfig = ref({
  url: events.value.clickAction?.url || '',
  phone: events.value.clickAction?.phone || '',
  customJs: events.value.clickAction?.customJs || '',
})

// 行为类型选项
const actionTypeOptions = [
  { label: '无操作', value: 'none' },
  { label: '跳转链接', value: 'navigate' },
  { label: '拨打电话', value: 'call' },
  { label: '提交表单', value: 'submit' },
  { label: '自定义JS', value: 'custom' },
]

// 更新点击行为
function updateClickAction() {
  const action: any = {
    type: clickActionType.value,
  }

  if (clickActionType.value === 'navigate') {
    action.url = clickActionConfig.value.url
  } else if (clickActionType.value === 'call') {
    action.phone = clickActionConfig.value.phone
  } else if (clickActionType.value === 'custom') {
    action.customJs = clickActionConfig.value.customJs
  }

  emit('updateEvent', 'clickAction', action)
}

// 清除事件
function clearEvent(eventName: string) {
  emit('updateEvent', eventName, null)
}
</script>

<template>
  <div class="event-panel">
    <div class="section">
      <h4 class="section-title">点击事件</h4>

      <div class="form-item">
        <label class="form-label">点击行为</label>
        <ElSelect
          v-model="clickActionType"
          placeholder="选择点击行为"
          @change="updateClickAction"
        >
          <ElOption
            v-for="option in actionTypeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </ElSelect>
      </div>

      <!-- 跳转链接 -->
      <template v-if="clickActionType === 'navigate'">
        <div class="form-item">
          <label class="form-label">链接地址</label>
          <ElInput
            v-model="clickActionConfig.url"
            placeholder="https://example.com"
            @blur="updateClickAction"
          >
            <template #prepend>
              <i class="i-tabler-link" />
            </template>
          </ElInput>
        </div>
        <div class="tip">
          <i class="i-tabler-info-circle" />
          <span>支持外部链接和内部路由</span>
        </div>
      </template>

      <!-- 拨打电话 -->
      <template v-if="clickActionType === 'call'">
        <div class="form-item">
          <label class="form-label">电话号码</label>
          <ElInput
            v-model="clickActionConfig.phone"
            placeholder="13800138000"
            @blur="updateClickAction"
          >
            <template #prepend>
              <i class="i-tabler-phone" />
            </template>
          </ElInput>
        </div>
        <div class="tip">
          <i class="i-tabler-info-circle" />
          <span>点击后将调用系统拨号功能</span>
        </div>
      </template>

      <!-- 提交表单 -->
      <template v-if="clickActionType === 'submit'">
        <div class="tip">
          <i class="i-tabler-info-circle" />
          <span>点击后将触发表单提交事件</span>
        </div>
      </template>

      <!-- 自定义JS -->
      <template v-if="clickActionType === 'custom'">
        <div class="form-item">
          <label class="form-label">自定义JavaScript代码</label>
          <ElInput
            v-model="clickActionConfig.customJs"
            type="textarea"
            :rows="6"
            placeholder="console.log('Hello World')"
            @blur="updateClickAction"
          />
        </div>
        <div class="tip warning">
          <i class="i-tabler-alert-triangle" />
          <span>注意：自定义JS代码需谨慎使用，确保代码安全</span>
        </div>
      </template>
    </div>

    <div class="section">
      <h4 class="section-title">表单验证</h4>
      <div class="empty-state">
        <i class="i-tabler-forms" />
        <p>表单验证规则配置</p>
        <span class="text-secondary">即将推出...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-panel {
  padding: 20px;
}

.section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.section:last-child {
  border-bottom: none;
}

.section-title {
  margin: 0 0 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.form-item {
  margin-bottom: 16px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: var(--editor-bg-secondary);
  border-radius: var(--radius-button);
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 12px;
}

.tip.warning {
  background: #fef0f0;
  color: #f56c6c;
}

.tip i {
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 1px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-state i {
  font-size: 48px;
  color: var(--text-tertiary);
  margin-bottom: 12px;
}

.empty-state p {
  margin: 0 0 4px;
  font-size: 14px;
  color: var(--text-secondary);
}

.empty-state .text-secondary {
  font-size: 12px;
  color: var(--text-tertiary);
}
</style>
