<script setup lang="ts">
/**
 * 样式配置面板
 */
import { ref, computed } from 'vue'
import type { ComponentSchema } from '@/types/schema'
import { ElInput, ElInputNumber, ElColorPicker, ElSelect, ElOption, ElCollapse, ElCollapseItem } from 'element-plus'

interface Props {
  component: ComponentSchema
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updateStyle: [key: string, value: any]
}>()

// 当前展开的折叠面板
const activeNames = ref(['layout', 'size', 'appearance'])

// 样式值
const styles = computed(() => props.component.styles || {})

// 处理样式更新
function handleUpdateStyle(key: string, value: any) {
  emit('updateStyle', key, value)
}

// Display选项
const displayOptions = [
  { label: 'Block', value: 'block' },
  { label: 'Flex', value: 'flex' },
  { label: 'Inline', value: 'inline' },
  { label: 'Inline Block', value: 'inline-block' },
  { label: 'None', value: 'none' },
]

// Flex Direction选项
const flexDirectionOptions = [
  { label: 'Row', value: 'row' },
  { label: 'Column', value: 'column' },
  { label: 'Row Reverse', value: 'row-reverse' },
  { label: 'Column Reverse', value: 'column-reverse' },
]

// Justify Content选项
const justifyContentOptions = [
  { label: 'Flex Start', value: 'flex-start' },
  { label: 'Center', value: 'center' },
  { label: 'Flex End', value: 'flex-end' },
  { label: 'Space Between', value: 'space-between' },
  { label: 'Space Around', value: 'space-around' },
  { label: 'Space Evenly', value: 'space-evenly' },
]

// Align Items选项
const alignItemsOptions = [
  { label: 'Flex Start', value: 'flex-start' },
  { label: 'Center', value: 'center' },
  { label: 'Flex End', value: 'flex-end' },
  { label: 'Stretch', value: 'stretch' },
  { label: 'Baseline', value: 'baseline' },
]

// Position选项
const positionOptions = [
  { label: 'Static', value: 'static' },
  { label: 'Relative', value: 'relative' },
  { label: 'Absolute', value: 'absolute' },
  { label: 'Fixed', value: 'fixed' },
  { label: 'Sticky', value: 'sticky' },
]
</script>

<template>
  <div class="style-panel">
    <ElCollapse v-model="activeNames">
      <!-- 布局 -->
      <ElCollapseItem title="布局" name="layout">
        <div class="form-item">
          <label class="form-label">Display</label>
          <ElSelect
            :model-value="styles.display || 'block'"
            placeholder="选择Display模式"
            @update:model-value="handleUpdateStyle('display', $event)"
          >
            <ElOption
              v-for="option in displayOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </div>

        <!-- Flex布局参数 -->
        <template v-if="styles.display === 'flex'">
          <div class="form-item">
            <label class="form-label">Flex Direction</label>
            <ElSelect
              :model-value="styles.flexDirection || 'row'"
              @update:model-value="handleUpdateStyle('flexDirection', $event)"
            >
              <ElOption
                v-for="option in flexDirectionOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
          </div>

          <div class="form-item">
            <label class="form-label">Justify Content</label>
            <ElSelect
              :model-value="styles.justifyContent || 'flex-start'"
              @update:model-value="handleUpdateStyle('justifyContent', $event)"
            >
              <ElOption
                v-for="option in justifyContentOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
          </div>

          <div class="form-item">
            <label class="form-label">Align Items</label>
            <ElSelect
              :model-value="styles.alignItems || 'stretch'"
              @update:model-value="handleUpdateStyle('alignItems', $event)"
            >
              <ElOption
                v-for="option in alignItemsOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
          </div>

          <div class="form-item">
            <label class="form-label">Gap</label>
            <ElInput
              :model-value="styles.gap || ''"
              placeholder="如：8px"
              @update:model-value="handleUpdateStyle('gap', $event)"
            />
          </div>
        </template>

        <!-- 间距 -->
        <div class="form-item">
          <label class="form-label">Padding (内边距)</label>
          <ElInput
            :model-value="styles.padding || ''"
            placeholder="如：8px 16px"
            @update:model-value="handleUpdateStyle('padding', $event)"
          />
        </div>

        <div class="form-item">
          <label class="form-label">Margin (外边距)</label>
          <ElInput
            :model-value="styles.margin || ''"
            placeholder="如：8px 16px"
            @update:model-value="handleUpdateStyle('margin', $event)"
          />
        </div>
      </ElCollapseItem>

      <!-- 尺寸 -->
      <ElCollapseItem title="尺寸" name="size">
        <div class="form-item">
          <label class="form-label">Width (宽度)</label>
          <ElInput
            :model-value="styles.width || ''"
            placeholder="如：100%, 300px, auto"
            @update:model-value="handleUpdateStyle('width', $event)"
          />
        </div>

        <div class="form-item">
          <label class="form-label">Height (高度)</label>
          <ElInput
            :model-value="styles.height || ''"
            placeholder="如：auto, 200px"
            @update:model-value="handleUpdateStyle('height', $event)"
          />
        </div>

        <div class="form-item">
          <label class="form-label">Min Width (最小宽度)</label>
          <ElInput
            :model-value="styles.minWidth || ''"
            placeholder="如：100px"
            @update:model-value="handleUpdateStyle('minWidth', $event)"
          />
        </div>

        <div class="form-item">
          <label class="form-label">Max Width (最大宽度)</label>
          <ElInput
            :model-value="styles.maxWidth || ''"
            placeholder="如：100%"
            @update:model-value="handleUpdateStyle('maxWidth', $event)"
          />
        </div>
      </ElCollapseItem>

      <!-- 定位 -->
      <ElCollapseItem title="定位" name="position">
        <div class="form-item">
          <label class="form-label">Position</label>
          <ElSelect
            :model-value="styles.position || 'static'"
            @update:model-value="handleUpdateStyle('position', $event)"
          >
            <ElOption
              v-for="option in positionOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </div>

        <template v-if="styles.position && styles.position !== 'static'">
          <div class="form-item">
            <label class="form-label">Top</label>
            <ElInput
              :model-value="styles.top || ''"
              placeholder="如：0, 10px"
              @update:model-value="handleUpdateStyle('top', $event)"
            />
          </div>

          <div class="form-item">
            <label class="form-label">Right</label>
            <ElInput
              :model-value="styles.right || ''"
              placeholder="如：0, 10px"
              @update:model-value="handleUpdateStyle('right', $event)"
            />
          </div>

          <div class="form-item">
            <label class="form-label">Bottom</label>
            <ElInput
              :model-value="styles.bottom || ''"
              placeholder="如：0, 10px"
              @update:model-value="handleUpdateStyle('bottom', $event)"
            />
          </div>

          <div class="form-item">
            <label class="form-label">Left</label>
            <ElInput
              :model-value="styles.left || ''"
              placeholder="如：0, 10px"
              @update:model-value="handleUpdateStyle('left', $event)"
            />
          </div>

          <div class="form-item">
            <label class="form-label">Z-Index</label>
            <ElInputNumber
              :model-value="styles.zIndex || 0"
              :min="0"
              :max="9999"
              controls-position="right"
              @update:model-value="handleUpdateStyle('zIndex', $event)"
            />
          </div>
        </template>
      </ElCollapseItem>

      <!-- 外观 -->
      <ElCollapseItem title="外观" name="appearance">
        <div class="form-item">
          <label class="form-label">Background Color (背景色)</label>
          <ElColorPicker
            :model-value="styles.backgroundColor || ''"
            show-alpha
            @update:model-value="handleUpdateStyle('backgroundColor', $event)"
          />
        </div>

        <div class="form-item">
          <label class="form-label">Color (文字颜色)</label>
          <ElColorPicker
            :model-value="styles.color || ''"
            show-alpha
            @update:model-value="handleUpdateStyle('color', $event)"
          />
        </div>

        <div class="form-item">
          <label class="form-label">Font Size (字体大小)</label>
          <ElInput
            :model-value="styles.fontSize || ''"
            placeholder="如：14px, 1rem"
            @update:model-value="handleUpdateStyle('fontSize', $event)"
          />
        </div>

        <div class="form-item">
          <label class="form-label">Border (边框)</label>
          <ElInput
            :model-value="styles.border || ''"
            placeholder="如：1px solid #ddd"
            @update:model-value="handleUpdateStyle('border', $event)"
          />
        </div>

        <div class="form-item">
          <label class="form-label">Border Radius (圆角)</label>
          <ElInput
            :model-value="styles.borderRadius || ''"
            placeholder="如：4px, 50%"
            @update:model-value="handleUpdateStyle('borderRadius', $event)"
          />
        </div>

        <div class="form-item">
          <label class="form-label">Box Shadow (阴影)</label>
          <ElInput
            :model-value="styles.boxShadow || ''"
            placeholder="如：0 2px 4px rgba(0,0,0,0.1)"
            @update:model-value="handleUpdateStyle('boxShadow', $event)"
          />
        </div>

        <div class="form-item">
          <label class="form-label">Opacity (透明度)</label>
          <ElInputNumber
            :model-value="styles.opacity !== undefined ? styles.opacity : 1"
            :min="0"
            :max="1"
            :step="0.1"
            controls-position="right"
            @update:model-value="handleUpdateStyle('opacity', $event)"
          />
        </div>
      </ElCollapseItem>
    </ElCollapse>
  </div>
</template>

<style scoped>
.style-panel {
  padding: 20px;
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

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-color-picker) {
  width: 100%;
}

:deep(.el-collapse-item__header) {
  font-weight: 600;
  color: var(--text-primary);
}

:deep(.el-collapse-item__content) {
  padding-bottom: 16px;
}
</style>
