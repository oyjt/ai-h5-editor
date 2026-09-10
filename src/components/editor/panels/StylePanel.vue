<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ComponentSchema } from '@/types/schema'
import { ElCollapse, ElCollapseItem, ElColorPicker, ElInput, ElInputNumber, ElOption, ElSelect, ElSlider } from 'element-plus'

interface Props { component: ComponentSchema }
const props = defineProps<Props>()
const emit = defineEmits<{ updateStyle: [key: string, value: any] }>()
const activeNames = ref(['layout','size','appearance'])
const styles = computed(() => props.component.styles || {})
const displayOptions=[{label:'块级 Block',value:'block'},{label:'弹性 Flex',value:'flex'},{label:'行内 Inline',value:'inline'},{label:'行内块 Inline Block',value:'inline-block'},{label:'隐藏 None',value:'none'}]
const flexDirectionOptions=[{label:'横向',value:'row'},{label:'纵向',value:'column'},{label:'横向反转',value:'row-reverse'},{label:'纵向反转',value:'column-reverse'}]
const justifyContentOptions=[{label:'起始',value:'flex-start'},{label:'居中',value:'center'},{label:'结束',value:'flex-end'},{label:'两端对齐',value:'space-between'},{label:'环绕',value:'space-around'},{label:'平均分布',value:'space-evenly'}]
const alignItemsOptions=[{label:'起始',value:'flex-start'},{label:'居中',value:'center'},{label:'结束',value:'flex-end'},{label:'拉伸',value:'stretch'},{label:'基线',value:'baseline'}]
const positionOptions=[{label:'默认 Static',value:'static'},{label:'相对 Relative',value:'relative'},{label:'绝对 Absolute',value:'absolute'},{label:'固定 Fixed',value:'fixed'},{label:'吸附 Sticky',value:'sticky'}]
const opacityPercent=computed({get:()=>Math.round(Number(styles.value.opacity ?? 1)*100),set:(v:number)=>emit('updateStyle','opacity',Math.max(0,Math.min(100,v))/100)})
const update=(key:string,value:any)=>emit('updateStyle',key,value)
</script>

<template>
  <div class="style-panel">
    <ElCollapse v-model="activeNames" class="style-collapse">
      <ElCollapseItem title="布局与间距" name="layout">
        <div class="form-item"><label>布局模式</label><ElSelect :model-value="styles.display || 'block'" @update:model-value="update('display',$event)"><ElOption v-for="option in displayOptions" :key="option.value" :label="option.label" :value="option.value" /></ElSelect></div>
        <template v-if="styles.display === 'flex'">
          <div class="two-col"><div class="form-item"><label>排列方向</label><ElSelect :model-value="styles.flexDirection || 'row'" @update:model-value="update('flexDirection',$event)"><ElOption v-for="option in flexDirectionOptions" :key="option.value" :label="option.label" :value="option.value" /></ElSelect></div><div class="form-item"><label>元素间距</label><ElInput :model-value="styles.gap || ''" placeholder="8px" @update:model-value="update('gap',$event)" /></div></div>
          <div class="two-col"><div class="form-item"><label>主轴对齐</label><ElSelect :model-value="styles.justifyContent || 'flex-start'" @update:model-value="update('justifyContent',$event)"><ElOption v-for="option in justifyContentOptions" :key="option.value" :label="option.label" :value="option.value" /></ElSelect></div><div class="form-item"><label>交叉轴</label><ElSelect :model-value="styles.alignItems || 'stretch'" @update:model-value="update('alignItems',$event)"><ElOption v-for="option in alignItemsOptions" :key="option.value" :label="option.label" :value="option.value" /></ElSelect></div></div>
        </template>
        <div class="form-item"><label>内边距 Padding</label><ElInput :model-value="styles.padding || ''" placeholder="8px 16px" @update:model-value="update('padding',$event)" /></div>
        <div class="form-item"><label>外边距 Margin</label><ElInput :model-value="styles.margin || ''" placeholder="8px 16px" @update:model-value="update('margin',$event)" /></div>
      </ElCollapseItem>

      <ElCollapseItem title="尺寸" name="size">
        <div class="two-col"><div class="form-item"><label>宽度</label><ElInput :model-value="styles.width || ''" placeholder="100%" @update:model-value="update('width',$event)" /></div><div class="form-item"><label>高度</label><ElInput :model-value="styles.height || ''" placeholder="auto" @update:model-value="update('height',$event)" /></div></div>
        <div class="two-col"><div class="form-item"><label>最小宽度</label><ElInput :model-value="styles.minWidth || ''" placeholder="100px" @update:model-value="update('minWidth',$event)" /></div><div class="form-item"><label>最大宽度</label><ElInput :model-value="styles.maxWidth || ''" placeholder="100%" @update:model-value="update('maxWidth',$event)" /></div></div>
      </ElCollapseItem>

      <ElCollapseItem title="定位" name="position">
        <div class="form-item"><label>定位方式</label><ElSelect :model-value="styles.position || 'static'" @update:model-value="update('position',$event)"><ElOption v-for="option in positionOptions" :key="option.value" :label="option.label" :value="option.value" /></ElSelect></div>
        <template v-if="styles.position && styles.position !== 'static'">
          <div class="four-grid"><div class="form-item"><label>Top</label><ElInput :model-value="styles.top || ''" placeholder="0" @update:model-value="update('top',$event)" /></div><div class="form-item"><label>Right</label><ElInput :model-value="styles.right || ''" placeholder="0" @update:model-value="update('right',$event)" /></div><div class="form-item"><label>Bottom</label><ElInput :model-value="styles.bottom || ''" placeholder="0" @update:model-value="update('bottom',$event)" /></div><div class="form-item"><label>Left</label><ElInput :model-value="styles.left || ''" placeholder="0" @update:model-value="update('left',$event)" /></div></div>
          <div class="form-item"><label>层级 Z-Index</label><ElInputNumber :model-value="styles.zIndex || 0" :min="0" :max="9999" controls-position="right" @update:model-value="update('zIndex',$event)" /></div>
        </template>
      </ElCollapseItem>

      <ElCollapseItem title="外观" name="appearance">
        <div class="color-grid"><div class="form-item"><label>背景颜色</label><div class="color-field"><ElColorPicker :model-value="styles.backgroundColor || ''" show-alpha @update:model-value="update('backgroundColor',$event)" /><span>{{ styles.backgroundColor || '未设置' }}</span></div></div><div class="form-item"><label>文字颜色</label><div class="color-field"><ElColorPicker :model-value="styles.color || ''" show-alpha @update:model-value="update('color',$event)" /><span>{{ styles.color || '未设置' }}</span></div></div></div>
        <div class="form-item"><label>字体大小</label><ElInput :model-value="styles.fontSize || ''" placeholder="14px" @update:model-value="update('fontSize',$event)" /></div>
        <div class="form-item"><label>边框</label><ElInput :model-value="styles.border || ''" placeholder="1px solid #e9eef5" @update:model-value="update('border',$event)" /></div>
        <div class="two-col"><div class="form-item"><label>圆角</label><ElInput :model-value="styles.borderRadius || ''" placeholder="8px" @update:model-value="update('borderRadius',$event)" /></div><div class="form-item"><label>阴影</label><ElInput :model-value="styles.boxShadow || ''" placeholder="0 6px 16px ..." @update:model-value="update('boxShadow',$event)" /></div></div>
        <div class="form-item"><div class="label-row"><label>透明度</label><span>{{ opacityPercent }}%</span></div><div class="slider-wrap"><ElSlider v-model="opacityPercent" :min="0" :max="100" :step="1" /><ElInputNumber v-model="opacityPercent" :min="0" :max="100" :step="1" controls-position="right" /></div></div>
      </ElCollapseItem>
    </ElCollapse>
  </div>
</template>

<style scoped>
.style-panel{padding:2px 0 10px}.style-collapse{border:0}.style-collapse :deep(.el-collapse-item__header){height:44px;padding:0 2px;border-bottom:1px solid var(--border-subtle);background:transparent;color:var(--text-primary);font-size:var(--font-size-md);font-weight:700}.style-collapse :deep(.el-collapse-item__wrap){border-bottom:1px solid var(--border-subtle);background:transparent}.style-collapse :deep(.el-collapse-item__content){padding:14px 0 16px}.form-item{margin-bottom:14px}.form-item:last-child{margin-bottom:0}.form-item>label,.label-row label{display:block;margin-bottom:7px;color:var(--text-secondary);font-size:var(--font-size-sm);font-weight:600}.two-col{display:grid;grid-template-columns:1fr 1fr;gap:10px}.four-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.color-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.color-field{height:var(--control-height-md);display:flex;align-items:center;gap:7px;padding:0 8px;border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--surface-1)}.color-field span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-muted);font-size:var(--font-size-xs)}.color-field :deep(.el-color-picker__trigger){width:26px;height:24px;padding:2px;border:0}.form-item :deep(.el-input-number),.form-item :deep(.el-select){width:100%}.label-row{display:flex;align-items:center;justify-content:space-between}.label-row label{margin:0}.label-row span{font-size:var(--font-size-xs);color:var(--text-muted)}.slider-wrap{display:grid;grid-template-columns:1fr 92px;gap:12px;align-items:center}.slider-wrap :deep(.el-slider){padding:0 5px}.slider-wrap :deep(.el-input-number){width:92px}
</style>
