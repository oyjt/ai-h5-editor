<script setup lang="ts">
/**
 * 公告栏组件 Widget
 */
import { NoticeBar as VanNoticeBar } from 'vant'

interface Props {
  text?: string
  speed?: number
  backgroundColor?: string
  color?: string
  icon?: string
  scrollable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '这是一条公告信息',
  speed: 60,
  backgroundColor: '#fffbe8',
  color: '#ed6a0c',
  icon: 'volume-o',
  scrollable: true,
})
</script>

<template>
  <VanNoticeBar
    :text="text"
    :speed="speed"
    :background="backgroundColor"
    :color="color"
    :left-icon="icon"
    :scrollable="scrollable"
  />
</template>

<style scoped>
</style>
