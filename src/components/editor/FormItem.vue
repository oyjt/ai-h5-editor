<script setup lang="ts">
import { computed } from 'vue'
import type { PropSchema } from '@/types/component'
import { PropType } from '@/types/component'
import {
  ElButton,
  ElCheckbox,
  ElCheckboxGroup,
  ElColorPicker,
  ElInput,
  ElInputNumber,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElSelect,
  ElSlider,
  ElSwitch,
} from 'element-plus'
import ImageListEditor from './ImageListEditor.vue'

interface Props { schema: PropSchema; modelValue: any }
const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: any] }>()
const value = computed({ get: () => props.modelValue, set: val => emit('update:modelValue', val) })
</script>

<template>
  <div class="form-item">
    <label class="form-label">
      <span>{{ schema.label }}</span>
      <small v-if="schema.description">{{ schema.description }}</small>
    </label>
    <div class="form-control">
      <ElInput v-if="schema.type === PropType.Text" v-model="value" :placeholder="schema.placeholder" clearable />
      <ElInput v-else-if="schema.type === PropType.Textarea" v-model="value" type="textarea" :placeholder="schema.placeholder" :rows="3" />
      <ElInputNumber v-else-if="schema.type === PropType.Number" v-model="value" :min="schema.min" :max="schema.max" :step="schema.step" :placeholder="schema.placeholder" controls-position="right" />
      <div v-else-if="schema.type === PropType.Color" class="color-row"><ElColorPicker v-model="value" show-alpha /><span>{{ value || '未设置' }}</span></div>
      <ElSelect v-else-if="schema.type === PropType.Select" v-model="value" :placeholder="schema.placeholder"><ElOption v-for="option in schema.options" :key="option.value" :label="option.label" :value="option.value" /></ElSelect>
      <ElRadioGroup v-else-if="schema.type === PropType.Radio" v-model="value" class="choice-group"><ElRadio v-for="option in schema.options" :key="option.value" :value="option.value">{{ option.label }}</ElRadio></ElRadioGroup>
      <ElCheckboxGroup v-else-if="schema.type === PropType.Checkbox" v-model="value" class="choice-group"><ElCheckbox v-for="option in schema.options" :key="option.value" :value="option.value">{{ option.label }}</ElCheckbox></ElCheckboxGroup>
      <div v-else-if="schema.type === PropType.Switch" class="switch-row"><ElSwitch v-model="value" /><span>{{ value ? '已开启' : '已关闭' }}</span></div>
      <div v-else-if="schema.type === PropType.Slider" class="slider-row"><ElSlider v-model="value" :min="schema.min" :max="schema.max" :step="schema.step" /><span>{{ value }}</span></div>
      <ElInput v-else-if="schema.type === PropType.Image" v-model="value" :placeholder="schema.placeholder || '请输入图片 URL'" clearable><template #append><ElButton>选择</ElButton></template></ElInput>
      <ImageListEditor v-else-if="schema.type === PropType.ImageList" v-model="value" />
      <div v-else class="unknown-type"><i class="i-tabler-alert-circle" />不支持的属性类型：{{ schema.type }}</div>
    </div>
  </div>
</template>

<style scoped>
.form-item{margin-bottom:16px}.form-item:last-child{margin-bottom:0}.form-label{display:flex;flex-direction:column;gap:4px;margin-bottom:7px;color:var(--text-secondary);font-size:var(--font-size-sm);font-weight:600}.form-label small{font-size:var(--font-size-xs);line-height:1.55;color:var(--text-muted);font-weight:400}.form-control{width:100%}.form-control :deep(.el-input-number),.form-control :deep(.el-select){width:100%}.choice-group{width:100%;display:grid!important;grid-template-columns:1fr 1fr;gap:8px}.choice-group :deep(.el-radio),.choice-group :deep(.el-checkbox){margin:0;height:34px;padding:0 10px;border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--surface-1);transition:all var(--motion-base) var(--ease-standard)}.choice-group :deep(.el-radio:hover),.choice-group :deep(.el-checkbox:hover){border-color:var(--border-brand);background:var(--brand-50)}.switch-row,.slider-row,.color-row{display:flex;align-items:center;gap:10px}.switch-row span,.slider-row span,.color-row span{font-size:var(--font-size-xs);color:var(--text-muted)}.slider-row :deep(.el-slider){flex:1}.slider-row>span{min-width:34px;text-align:right;color:var(--text-secondary);font-weight:600}.color-row{height:var(--control-height-md);padding:0 9px;border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--surface-1)}.color-row :deep(.el-color-picker){height:26px}.color-row :deep(.el-color-picker__trigger){width:28px;height:26px;border:0;padding:2px}.unknown-type{display:flex;align-items:center;gap:6px;padding:9px 10px;border:1px solid var(--warning-200);border-radius:var(--radius-md);background:var(--warning-50);color:var(--warning-700);font-size:var(--font-size-xs)}
</style>
