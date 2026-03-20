<script setup lang="ts">
/**
 * 属性配置面板
 */
import { computed } from 'vue'
import type { ComponentSchema } from '@/types/schema'
import type { ComponentConfig } from '@/types/component'
import FormItem from '../FormItem.vue'

interface Props {
  component: ComponentSchema
  config: ComponentConfig
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updateProp: [key: string, value: any]
}>()

// 处理属性更新
function handleUpdateProp(key: string, value: any) {
  emit('updateProp', key, value)
}
</script>

<template>
  <div class="props-panel">
    <!-- 基本信息 -->
    <div class="section">
      <h4 class="section-title">基本信息</h4>
      <div class="info-item">
        <label class="info-label">组件类型</label>
        <div class="info-value">
          {{ config.name || component.type }}
        </div>
      </div>
      <div class="info-item">
        <label class="info-label">组件 ID</label>
        <div class="info-value font-mono">
          {{ component.id }}
        </div>
      </div>
    </div>

    <!-- 属性配置 -->
    <div v-if="config.propSchema.length" class="section">
      <h4 class="section-title">属性配置</h4>
      <FormItem
        v-for="propSchema in config.propSchema"
        :key="propSchema.key"
        :schema="propSchema"
        :model-value="component.props[propSchema.key]"
        @update:model-value="handleUpdateProp(propSchema.key, $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.props-panel {
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

.info-item {
  margin-bottom: 12px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.info-value {
  padding: 8px 12px;
  background: var(--editor-bg-secondary);
  border-radius: var(--radius-button);
  font-size: 13px;
  color: var(--text-primary);
  word-break: break-all;
}
</style>
