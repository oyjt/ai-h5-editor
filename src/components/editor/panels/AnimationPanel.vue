<script setup lang="ts">
import { computed } from 'vue'
import type { ComponentSchema } from '@/types/schema'
import { ElButton, ElInputNumber, ElOption, ElSelect } from 'element-plus'

interface Props { component: ComponentSchema }
const props = defineProps<Props>()
const emit = defineEmits<{ updateStyle: [key: string, value: any] }>()
const animationConfig = computed(() => {
  const styles = props.component.styles || {}
  return {
    animationName: styles.animationName || 'none', animationDuration: styles.animationDuration || '1s',
    animationDelay: styles.animationDelay || '0s', animationIterationCount: styles.animationIterationCount || '1',
    animationTimingFunction: styles.animationTimingFunction || 'ease',
  }
})
const animationOptions = [
  { label:'无动画',value:'none'},{label:'淡入',value:'fadeIn'},{label:'从下淡入',value:'fadeInUp'},{label:'从上淡入',value:'fadeInDown'},
  {label:'从左淡入',value:'fadeInLeft'},{label:'从右淡入',value:'fadeInRight'},{label:'从下滑入',value:'slideInUp'},
  {label:'从上滑入',value:'slideInDown'},{label:'弹跳进入',value:'bounceIn'},{label:'放大进入',value:'zoomIn'},{label:'旋转进入',value:'rotateIn'},
]
const timingFunctionOptions=[{label:'自然',value:'ease'},{label:'匀速',value:'linear'},{label:'缓入',value:'ease-in'},{label:'缓出',value:'ease-out'},{label:'缓入缓出',value:'ease-in-out'}]
const iterationCountOptions=[{label:'1 次',value:'1'},{label:'2 次',value:'2'},{label:'3 次',value:'3'},{label:'无限循环',value:'infinite'}]
const duration=computed({get:()=>parseFloat(animationConfig.value.animationDuration)||1,set:(v:number)=>emit('updateStyle','animationDuration',`${v}s`)})
const delay=computed({get:()=>parseFloat(animationConfig.value.animationDelay)||0,set:(v:number)=>emit('updateStyle','animationDelay',`${v}s`)})
function updateAnimationName(value:string){ if(value==='none'){['animationName','animationDuration','animationDelay','animationIterationCount','animationTimingFunction'].forEach(key=>emit('updateStyle',key,''))}else emit('updateStyle','animationName',value) }
function previewAnimation(){ const el=document.querySelector(`[data-component-id="${props.component.id}"]`) as HTMLElement|null;if(!el)return;el.style.animation='none';requestAnimationFrame(()=>{el.style.animation='';void el.offsetWidth}) }
</script>

<template>
  <div class="animation-panel">
    <section>
      <div class="section-head"><div><strong>入场动画</strong><span>控制组件首次出现时的动效</span></div><i class="i-tabler-sparkles" /></div>
      <div class="animation-preview" :class="{ active: animationConfig.animationName !== 'none' }"><span><i class="i-tabler-box" /></span><div><strong>{{ animationOptions.find(item => item.value === animationConfig.animationName)?.label || '无动画' }}</strong><small>{{ animationConfig.animationName === 'none' ? '当前组件不会播放入场动画' : `${duration}s · 延迟 ${delay}s` }}</small></div><ElButton size="small" :disabled="animationConfig.animationName === 'none'" @click="previewAnimation"><i class="i-tabler-player-play" /> 预览</ElButton></div>
      <div class="form-item"><label>动画类型</label><ElSelect :model-value="animationConfig.animationName" @update:model-value="updateAnimationName"><ElOption v-for="option in animationOptions" :key="option.value" :label="option.label" :value="option.value" /></ElSelect></div>
      <template v-if="animationConfig.animationName !== 'none' && animationConfig.animationName">
        <div class="two-col"><div class="form-item"><label>持续时间</label><ElInputNumber v-model="duration" :min="0.1" :max="10" :step="0.1" controls-position="right" /></div><div class="form-item"><label>延迟时间</label><ElInputNumber v-model="delay" :min="0" :max="10" :step="0.1" controls-position="right" /></div></div>
        <div class="form-item"><label>节奏曲线</label><ElSelect :model-value="animationConfig.animationTimingFunction" @update:model-value="emit('updateStyle','animationTimingFunction',$event)"><ElOption v-for="option in timingFunctionOptions" :key="option.value" :label="option.label" :value="option.value" /></ElSelect></div>
        <div class="form-item"><label>循环次数</label><ElSelect :model-value="animationConfig.animationIterationCount" @update:model-value="emit('updateStyle','animationIterationCount',$event)"><ElOption v-for="option in iterationCountOptions" :key="option.value" :label="option.label" :value="option.value" /></ElSelect></div>
      </template>
    </section>
    <div class="tip"><i class="i-tabler-info-circle" /><span>编辑器中的“预览”只重播当前组件；最终效果请在移动端预览中检查。</span></div>
  </div>
</template>

<style scoped>
.animation-panel{padding:14px 0}.section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:13px}.section-head>div{display:flex;flex-direction:column;gap:3px}.section-head strong{font-size:var(--font-size-md);color:var(--text-primary)}.section-head span{font-size:var(--font-size-xs);color:var(--text-muted)}.section-head>i{font-size:18px;color:var(--brand-500)}.animation-preview{min-height:58px;margin-bottom:16px;padding:9px 10px;display:grid;grid-template-columns:34px 1fr auto;gap:9px;align-items:center;border:1px solid var(--border-subtle);border-radius:var(--radius-lg);background:var(--surface-2)}.animation-preview.active{border-color:var(--brand-200);background:var(--brand-50)}.animation-preview>span{width:34px;height:34px;border-radius:var(--radius-md);display:grid;place-items:center;background:var(--surface-1);color:var(--brand-600);box-shadow:var(--shadow-xs)}.animation-preview div{min-width:0}.animation-preview strong{display:block;font-size:var(--font-size-sm);color:var(--text-primary)}.animation-preview small{display:block;margin-top:3px;font-size:var(--font-size-xs);color:var(--text-muted)}.form-item{margin-bottom:14px}.form-item label{display:block;margin-bottom:7px;font-size:var(--font-size-sm);font-weight:600;color:var(--text-secondary)}.form-item :deep(.el-input-number),.form-item :deep(.el-select){width:100%}.two-col{display:grid;grid-template-columns:1fr 1fr;gap:10px}.tip{display:flex;gap:7px;padding:9px 10px;border-radius:var(--radius-md);background:var(--surface-2);color:var(--text-muted);font-size:var(--font-size-xs);line-height:1.55}.tip i{flex:0 0 auto;color:var(--brand-500);margin-top:1px}
</style>
