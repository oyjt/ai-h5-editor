<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ComponentSchema } from '@/types/schema'
import { ElInput, ElOption, ElSelect } from 'element-plus'

interface Props { component: ComponentSchema }
const props = defineProps<Props>()
const emit = defineEmits<{ updateEvent: [key: string, value: any] }>()
const events = computed(() => props.component.events || {})
const clickActionType = ref(events.value.clickAction?.type || 'none')
const clickActionConfig = ref({ url: events.value.clickAction?.url || '', phone: events.value.clickAction?.phone || '', customJs: events.value.clickAction?.customJs || '' })
const urlError = computed(() => clickActionType.value === 'navigate' && !!clickActionConfig.value.url && !/^(https?:\/\/|\/)/.test(clickActionConfig.value.url))
const phoneError = computed(() => clickActionType.value === 'call' && !!clickActionConfig.value.phone && !/^\+?[\d\s-]{6,20}$/.test(clickActionConfig.value.phone))
const actionTypeOptions = [
  { label: '无操作', value: 'none', icon: 'i-tabler-ban' }, { label: '跳转链接', value: 'navigate', icon: 'i-tabler-link' },
  { label: '拨打电话', value: 'call', icon: 'i-tabler-phone' }, { label: '提交表单', value: 'submit', icon: 'i-tabler-forms' },
  { label: '自定义 JS', value: 'custom', icon: 'i-tabler-code' },
]
function updateClickAction() {
  if (clickActionType.value === 'none') return emit('updateEvent', 'clickAction', null)
  const action: any = { type: clickActionType.value }
  if (clickActionType.value === 'navigate') action.url = clickActionConfig.value.url
  if (clickActionType.value === 'call') action.phone = clickActionConfig.value.phone
  if (clickActionType.value === 'custom') action.customJs = clickActionConfig.value.customJs
  emit('updateEvent', 'clickAction', action)
}
watch(() => props.component.id, () => {
  clickActionType.value = events.value.clickAction?.type || 'none'
  clickActionConfig.value = { url: events.value.clickAction?.url || '', phone: events.value.clickAction?.phone || '', customJs: events.value.clickAction?.customJs || '' }
})
</script>

<template>
  <div class="event-panel">
    <section>
      <div class="section-head"><div><strong>点击行为</strong><span>设置用户点击组件后的动作</span></div><i class="i-tabler-pointer" /></div>
      <div class="form-item"><label>行为类型</label><ElSelect v-model="clickActionType" @change="updateClickAction"><ElOption v-for="option in actionTypeOptions" :key="option.value" :label="option.label" :value="option.value"><span class="option-row"><i :class="option.icon" />{{ option.label }}</span></ElOption></ElSelect></div>
      <template v-if="clickActionType === 'navigate'">
        <div class="form-item" :class="{ invalid: urlError }"><label>链接地址</label><ElInput v-model="clickActionConfig.url" placeholder="https://example.com 或 /activity" @blur="updateClickAction"><template #prefix><i class="i-tabler-link" /></template></ElInput><small v-if="urlError">请输入 http(s) 链接或以 / 开头的内部路径</small></div>
        <div class="tip"><i class="i-tabler-info-circle" /><span>支持站内路由和外部 HTTPS 链接。</span></div>
      </template>
      <template v-else-if="clickActionType === 'call'">
        <div class="form-item" :class="{ invalid: phoneError }"><label>电话号码</label><ElInput v-model="clickActionConfig.phone" placeholder="13800138000" @blur="updateClickAction"><template #prefix><i class="i-tabler-phone" /></template></ElInput><small v-if="phoneError">请输入有效电话号码</small></div>
        <div class="tip"><i class="i-tabler-info-circle" /><span>移动端点击后会调用系统拨号能力。</span></div>
      </template>
      <div v-else-if="clickActionType === 'submit'" class="tip success"><i class="i-tabler-circle-check" /><span>该组件将触发表单提交，可用于报名、领取优惠券等场景。</span></div>
      <template v-else-if="clickActionType === 'custom'">
        <div class="form-item"><label>JavaScript</label><ElInput v-model="clickActionConfig.customJs" type="textarea" :rows="6" placeholder="console.log('interaction')" @blur="updateClickAction" /></div>
        <div class="tip warning"><i class="i-tabler-alert-triangle" /><span>自定义脚本仅用于受信任页面，请避免写入敏感信息。</span></div>
      </template>
    </section>
    <section>
      <div class="section-head"><div><strong>状态反馈</strong><span>编辑器默认提供点击与禁用反馈</span></div><i class="i-tabler-click" /></div>
      <div class="state-grid"><div><i class="i-tabler-hand-click" /><strong>点击</strong><span>按压反馈</span></div><div><i class="i-tabler-focus-2" /><strong>焦点</strong><span>品牌色焦点环</span></div><div><i class="i-tabler-ban" /><strong>禁用</strong><span>降低对比度</span></div></div>
    </section>
  </div>
</template>

<style scoped>
.event-panel{padding:14px 0}.event-panel section{padding-bottom:18px;margin-bottom:18px;border-bottom:1px solid var(--border-subtle)}.event-panel section:last-child{border-bottom:0;margin-bottom:0}.section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}.section-head>div{display:flex;flex-direction:column;gap:3px}.section-head strong{font-size:var(--font-size-md);color:var(--text-primary)}.section-head span{font-size:var(--font-size-xs);color:var(--text-muted)}.section-head>i{font-size:17px;color:var(--brand-400)}.form-item{margin-bottom:14px}.form-item>label{display:block;margin-bottom:7px;font-size:var(--font-size-sm);font-weight:600;color:var(--text-secondary)}.form-item>small{display:block;margin-top:5px;font-size:var(--font-size-xs);color:var(--danger-500)}.form-item.invalid :deep(.el-input__wrapper){box-shadow:0 0 0 1px var(--danger-500) inset,0 0 0 3px rgba(239,68,68,.08)}.option-row{display:flex;align-items:center;gap:7px}.tip{display:flex;align-items:flex-start;gap:7px;padding:9px 10px;border-radius:var(--radius-md);background:var(--brand-50);color:var(--text-secondary);font-size:var(--font-size-xs);line-height:1.55}.tip i{flex:0 0 auto;margin-top:1px;color:var(--brand-600)}.tip.warning{background:var(--warning-50)}.tip.warning i{color:var(--warning-500)}.tip.success{background:var(--success-50)}.tip.success i{color:var(--success-500)}.state-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.state-grid div{min-width:0;padding:11px 8px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--surface-2);text-align:center}.state-grid i{display:block;font-size:18px;color:var(--brand-500);margin-bottom:5px}.state-grid strong{display:block;font-size:var(--font-size-xs);color:var(--text-primary)}.state-grid span{display:block;margin-top:3px;font-size:9px;color:var(--text-muted)}
</style>
