<script setup lang="ts">
/**
 * 图片组件 Widget
 */
import { Image as VanImage } from 'vant'

interface Props {
  src?: string
  alt?: string
  width?: string
  height?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  borderRadius?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: 'https://picsum.photos/seed/image1/300/200',
  alt: '图片',
  width: '100%',
  height: 'auto',
  objectFit: 'cover',
  borderRadius: '0',
})
</script>

<template>
  <VanImage
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :fit="objectFit"
    :radius="borderRadius"
  />
</template>

<style scoped>
</style>
