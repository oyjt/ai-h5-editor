<script setup lang="ts">
/**
 * 标签页组件 Widget
 */
import { ref, watch } from 'vue'
import { Tabs as VanTabs, Tab as VanTab } from 'vant'

interface Tab {
  name: string
  title: string
  content?: string
}

interface Props {
  tabs?: Tab[]
  active?: string
  color?: string
  type?: 'line' | 'card'
  duration?: number
  swipeable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [
    { name: 'tab1', title: '标签1', content: '内容1' },
    { name: 'tab2', title: '标签2', content: '内容2' },
    { name: 'tab3', title: '标签3', content: '内容3' },
  ],
  active: 'tab1',
  color: '#1989fa',
  type: 'line',
  duration: 0.3,
  swipeable: false,
})

const emit = defineEmits<{
  'update:active': [name: string]
  'change': [name: string]
}>()

const currentActive = ref(props.active)

watch(() => props.active, (val) => {
  currentActive.value = val
})

function handleChange(name: string | number) {
  emit('update:active', String(name))
  emit('change', String(name))
}
</script>

<template>
  <VanTabs
    v-model:active="currentActive"
    :color="color"
    :type="type"
    :duration="duration"
    :swipeable="swipeable"
    @change="handleChange"
  >
    <VanTab
      v-for="tab in tabs"
      :key="tab.name"
      :name="tab.name"
      :title="tab.title"
    >
      {{ tab.content }}
    </VanTab>
  </VanTabs>
</template>

<style scoped>
</style>
