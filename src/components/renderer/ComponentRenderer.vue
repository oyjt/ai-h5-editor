<script setup lang="ts">
import { computed } from 'vue'
import type { ComponentSchema } from '@/types/schema'
import { getComponentConfig } from '@/config/component-registry'

interface Props { schema: ComponentSchema; isEditing?: boolean; selectedId?: string | null; hoveredId?: string | null }
const props = withDefaults(defineProps<Props>(), { isEditing:false, selectedId:null, hoveredId:null })
const emit = defineEmits<{ select:[id:string]; hover:[id:string|null] }>()
const componentConfig=computed(()=>getComponentConfig(props.schema.type))
const mergedStyles=computed(()=>({ ...props.schema.styles }))
const isSelected=computed(()=>props.isEditing&&props.selectedId===props.schema.id)
const isHovered=computed(()=>props.isEditing&&props.hoveredId===props.schema.id&&!isSelected.value)

function executeRuntimeAction(e:Event){
  const action=props.schema.events?.clickAction as any
  if(!action||action.type==='none') return
  if(action.type==='navigate'&&action.url){
    const url=String(action.url)
    if(/^https?:\/\//i.test(url)) window.open(url,'_blank','noopener,noreferrer')
    else window.location.href=url
    return
  }
  if(action.type==='call'&&action.phone){ window.location.href=`tel:${String(action.phone).replace(/[^+\d]/g,'')}`;return }
  if(action.type==='submit'){
    e.currentTarget?.dispatchEvent(new CustomEvent('h5:submit',{bubbles:true,detail:{componentId:props.schema.id}}))
    return
  }
  if(action.type==='custom'){
    window.dispatchEvent(new CustomEvent('h5:custom-action',{detail:{componentId:props.schema.id,code:action.customJs||''}}))
    console.info('[H5 Editor] custom action dispatched; arbitrary JavaScript is not executed for security.')
  }
}
function handleClick(e:Event){ if(props.isEditing){e.stopPropagation();emit('select',props.schema.id);return} executeRuntimeAction(e) }
function handleMouseEnter(){if(props.isEditing)emit('hover',props.schema.id)}
function handleMouseLeave(){if(props.isEditing)emit('hover',null)}
</script>

<template>
  <div class="component-renderer" :class="{ 'is-selected':isSelected,'is-hovered':isHovered,'is-interactive':!isEditing&&schema.events?.clickAction?.type&&schema.events?.clickAction?.type!=='none' }" :style="mergedStyles" :data-component-id="schema.id" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <template v-if="isSelected"><i v-for="n in 8" :key="n" class="resize-handle" :class="`handle-${n}`" /></template>
    <component :is="componentConfig?.component" v-if="componentConfig" v-bind="schema.props" />
    <div v-else class="unknown-component"><i class="i-tabler-alert-circle" />未知组件类型：{{ schema.type }}</div>
    <ComponentRenderer v-for="child in schema.children" :key="child.id" :schema="child" :is-editing="isEditing" :selected-id="selectedId" :hovered-id="hoveredId" @select="emit('select',$event)" @hover="emit('hover',$event)" />
  </div>
</template>

<style scoped>
.component-renderer{position:relative;transition:outline-color var(--motion-fast) var(--ease-standard),box-shadow var(--motion-fast) var(--ease-standard),background-color var(--motion-fast) var(--ease-standard);isolation:isolate;cursor:default}.component-renderer.is-interactive{cursor:pointer}.component-renderer.is-hovered{outline:1px dashed var(--brand-500);outline-offset:-1px;background:rgba(23,105,255,.015)}.component-renderer.is-selected{outline:2px solid var(--brand-600);outline-offset:-2px;z-index:8;box-shadow:0 0 0 1px rgba(23,105,255,.03)}.resize-handle{position:absolute;z-index:1001;width:8px;height:8px;border:2px solid var(--brand-600);border-radius:50%;background:var(--surface-1);box-shadow:0 1px 3px rgba(23,105,255,.2);pointer-events:none}.handle-1{left:-4px;top:-4px}.handle-2{left:50%;top:-4px;transform:translateX(-50%)}.handle-3{right:-4px;top:-4px}.handle-4{right:-4px;top:50%;transform:translateY(-50%)}.handle-5{right:-4px;bottom:-4px}.handle-6{left:50%;bottom:-4px;transform:translateX(-50%)}.handle-7{left:-4px;bottom:-4px}.handle-8{left:-4px;top:50%;transform:translateY(-50%)}.unknown-component{display:flex;align-items:center;justify-content:center;gap:6px;padding:20px;background:var(--surface-2);border:1px dashed var(--border-strong);border-radius:var(--radius-md);text-align:center;color:var(--text-muted);font-size:var(--font-size-md)}
</style>
