<script setup lang="ts">
/**
 * 折叠面板组件 Widget
 */
import { ref, watch } from 'vue'
import { Collapse as VanCollapse, CollapseItem as VanCollapseItem } from 'vant'

interface CollapseItem {
  name: string
  title: string
  content: string
}

interface Props {
  items?: CollapseItem[]
  accordion?: boolean
  border?: boolean
  activeNames?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { name: 'item1', title: '标题1', content: '内容1' },
    { name: 'item2', title: '标题2', content: '内容2' },
    { name: 'item3', title: '标题3', content: '内容3' },
  ],
  accordion: false,
  border: true,
  activeNames: () => [],
})

const emit = defineEmits<{
  'update:activeNames': [names: string[]]
  'change': [names: string[]]
}>()

const currentActiveNames = ref<string | string[]>(
  props.accordion ? (props.activeNames[0] ?? '') : [...props.activeNames],
)

watch(() => props.activeNames, (val) => {
  currentActiveNames.value = props.accordion ? (val[0] ?? '') : [...val]
}, { deep: true })

function handleChange(val: string | string[]) {
  const names = Array.isArray(val) ? val : (val ? [val] : [])
  emit('update:activeNames', names)
  emit('change', names)
}
</script>

<template>
  <VanCollapse
    v-model="currentActiveNames"
    :accordion="accordion"
    :border="border"
    @change="handleChange"
  >
    <VanCollapseItem
      v-for="item in items"
      :key="item.name"
      :name="item.name"
      :title="item.title"
    >
      {{ item.content }}
    </VanCollapseItem>
  </VanCollapse>
</template>

<style scoped>
</style>
