<script setup lang="ts">
/**
 * 宫格组件 Widget
 */
import { Grid as VanGrid, GridItem as VanGridItem } from 'vant'

interface Props {
  items?: Array<{ icon: string, text: string }>
  columnNum?: number
  iconSize?: string
  gutter?: number
  square?: boolean
  center?: boolean
  border?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { icon: 'i-tabler-home', text: '首页' },
    { icon: 'i-tabler-user', text: '我的' },
    { icon: 'i-tabler-shopping-cart', text: '购物车' },
    { icon: 'i-tabler-heart', text: '收藏' },
  ],
  columnNum: 4,
  iconSize: '28px',
  gutter: 0,
  square: false,
  center: true,
  border: true,
  clickable: true,
})

const emit = defineEmits<{
  'item-click': [item: { icon: string, text: string }, index: number]
}>()
</script>

<template>
  <VanGrid
    :column-num="columnNum"
    :gutter="gutter"
    :square="square"
    :center="center"
    :border="border"
    :clickable="clickable"
  >
    <VanGridItem
      v-for="(item, index) in items"
      :key="index"
      :text="item.text"
      @click="emit('item-click', item, index)"
    >
      <template #icon>
        <div :class="item.icon" :style="{ fontSize: iconSize }" />
      </template>
    </VanGridItem>
  </VanGrid>
</template>

<style scoped>
</style>
