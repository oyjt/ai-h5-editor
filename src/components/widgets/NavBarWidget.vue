<script setup lang="ts">
/**
 * 导航栏组件 Widget
 */
import { NavBar as VanNavBar } from 'vant'

interface Props {
  title?: string
  leftText?: string
  rightText?: string
  fixed?: boolean
  placeholder?: boolean
  zIndex?: number
  border?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '标题',
  leftText: '返回',
  rightText: '',
  fixed: false,
  placeholder: false,
  zIndex: 1,
  border: true,
})

const emit = defineEmits<{
  'click-left': []
  'click-right': []
}>()
</script>

<template>
  <VanNavBar
    :title="title"
    :left-text="leftText"
    :right-text="rightText"
    :fixed="fixed"
    :placeholder="placeholder"
    :z-index="zIndex"
    :border="border"
    left-arrow
    @click-left="emit('click-left')"
    @click-right="emit('click-right')"
  />
</template>

<style scoped>
</style>
