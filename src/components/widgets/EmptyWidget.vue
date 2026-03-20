<script setup lang="ts">
/**
 * 空状态组件 Widget
 */
import { Empty as VanEmpty } from 'vant'

interface Props {
  image?: string
  imageSize?: string | number
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  image: 'default',
  imageSize: 160,
  description: '暂无数据',
})
</script>

<template>
  <VanEmpty
    :image="image"
    :image-size="imageSize"
    :description="description"
  />
</template>

<style scoped>
</style>
