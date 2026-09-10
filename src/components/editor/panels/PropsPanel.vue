<script setup lang="ts">
import type { ComponentSchema } from '@/types/schema'
import type { ComponentConfig } from '@/types/component'
import FormItem from '../FormItem.vue'

interface Props { component: ComponentSchema; config: ComponentConfig }
defineProps<Props>()
const emit = defineEmits<{ updateProp: [key: string, value: any] }>()
</script>

<template>
  <div class="props-panel">
    <section class="meta-card">
      <div class="meta-icon"><i :class="config.icon" /></div>
      <div class="meta-main"><strong>{{ config.name || component.type }}</strong><span>{{ component.type }}</span></div>
      <div class="meta-id" :title="component.id">{{ component.id.slice(0, 8) }}</div>
    </section>

    <section v-if="config.propSchema.length" class="section">
      <div class="section-head"><div><strong>内容属性</strong><span>配置当前组件的数据与展示内容</span></div><em>{{ config.propSchema.length }}</em></div>
      <FormItem v-for="propSchema in config.propSchema" :key="propSchema.key" :schema="propSchema" :model-value="component.props[propSchema.key]" @update:model-value="emit('updateProp', propSchema.key, $event)" />
    </section>
    <div v-else class="empty-props"><i class="i-tabler-adjustments-off" /><strong>暂无可配置内容</strong><span>该组件暂未定义内容属性，可前往样式或交互面板继续配置。</span></div>
  </div>
</template>

<style scoped>
.props-panel{padding:14px 0}.meta-card{height:58px;margin-bottom:16px;padding:0 11px;display:grid;grid-template-columns:34px 1fr auto;gap:9px;align-items:center;border:1px solid var(--border-subtle);border-radius:var(--radius-lg);background:var(--surface-2)}.meta-icon{width:34px;height:34px;border-radius:var(--radius-md);display:grid;place-items:center;background:var(--brand-100);color:var(--brand-600);font-size:17px}.meta-main{min-width:0}.meta-main strong{display:block;font-size:var(--font-size-md);color:var(--text-primary)}.meta-main span{display:block;margin-top:3px;font-size:var(--font-size-xs);color:var(--text-muted)}.meta-id{max-width:74px;padding:4px 6px;border-radius:var(--radius-sm);background:var(--surface-1);color:var(--text-muted);font:10px ui-monospace,SFMono-Regular,Menlo,monospace;overflow:hidden;text-overflow:ellipsis}.section-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px}.section-head>div{display:flex;flex-direction:column;gap:3px}.section-head strong{font-size:var(--font-size-md);color:var(--text-primary)}.section-head span{font-size:var(--font-size-xs);color:var(--text-muted)}.section-head em{min-width:22px;height:22px;padding:0 6px;border-radius:11px;background:var(--brand-50);color:var(--brand-600);font-size:var(--font-size-xs);font-style:normal;display:grid;place-items:center}.empty-props{min-height:210px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:var(--text-muted)}.empty-props i{font-size:30px;color:var(--brand-300);margin-bottom:9px}.empty-props strong{font-size:var(--font-size-md);color:var(--text-secondary)}.empty-props span{max-width:220px;margin-top:5px;font-size:var(--font-size-xs);line-height:1.6}
</style>
