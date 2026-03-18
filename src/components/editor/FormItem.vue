<script setup lang="ts">
/**
 * 动态表单项组件 - 根据属性类型渲染不同的输入控件
 */
import { computed } from 'vue'
import type { PropSchema } from '@/types/component'
import { PropType } from '@/types/component'
import {
  ElInput,
  ElInputNumber,
  ElColorPicker,
  ElSelect,
  ElOption,
  ElRadioGroup,
  ElRadio,
  ElCheckboxGroup,
  ElCheckbox,
  ElSwitch,
  ElSlider,
} from 'element-plus'

interface Props {
  schema: PropSchema
  modelValue: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<template>
  <div class="form-item">
    <label class="form-label">
      {{ schema.label }}
      <span v-if="schema.description" class="form-description">
        {{ schema.description }}
      </span>
    </label>

    <div class="form-control">
      <!-- 文本输入 -->
      <ElInput
        v-if="schema.type === PropType.Text"
        v-model="value"
        :placeholder="schema.placeholder"
        clearable
      />

      <!-- 多行文本 -->
      <ElInput
        v-else-if="schema.type === PropType.Textarea"
        v-model="value"
        type="textarea"
        :placeholder="schema.placeholder"
        :rows="3"
      />

      <!-- 数字输入 -->
      <ElInputNumber
        v-else-if="schema.type === PropType.Number"
        v-model="value"
        :min="schema.min"
        :max="schema.max"
        :step="schema.step"
        :placeholder="schema.placeholder"
        controls-position="right"
      />

      <!-- 颜色选择器 -->
      <ElColorPicker
        v-else-if="schema.type === PropType.Color"
        v-model="value"
        show-alpha
      />

      <!-- 下拉选择 -->
      <ElSelect
        v-else-if="schema.type === PropType.Select"
        v-model="value"
        :placeholder="schema.placeholder"
      >
        <ElOption
          v-for="option in schema.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </ElSelect>

      <!-- 单选 -->
      <ElRadioGroup
        v-else-if="schema.type === PropType.Radio"
        v-model="value"
      >
        <ElRadio
          v-for="option in schema.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </ElRadio>
      </ElRadioGroup>

      <!-- 多选 -->
      <ElCheckboxGroup
        v-else-if="schema.type === PropType.Checkbox"
        v-model="value"
      >
        <ElCheckbox
          v-for="option in schema.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </ElCheckbox>
      </ElCheckboxGroup>

      <!-- 开关 -->
      <ElSwitch
        v-else-if="schema.type === PropType.Switch"
        v-model="value"
      />

      <!-- 滑块 -->
      <ElSlider
        v-else-if="schema.type === PropType.Slider"
        v-model="value"
        :min="schema.min"
        :max="schema.max"
        :step="schema.step"
      />

      <!-- 图片上传 -->
      <ElInput
        v-else-if="schema.type === PropType.Image"
        v-model="value"
        :placeholder="schema.placeholder || '请输入图片 URL'"
        clearable
      >
        <template #append>
          <el-button>选择</el-button>
        </template>
      </ElInput>

      <!-- 未知类型 -->
      <div v-else class="unknown-type">
        不支持的属性类型: {{ schema.type }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-item {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #606266;
}

.form-description {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  font-weight: normal;
  color: #909399;
}

.form-control {
  width: 100%;
}

.unknown-type {
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  color: #909399;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-color-picker) {
  width: 100%;
}

:deep(.el-radio-group),
:deep(.el-checkbox-group) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
