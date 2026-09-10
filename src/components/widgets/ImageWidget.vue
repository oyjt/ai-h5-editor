<script setup lang="ts">
import { computed } from 'vue'
import { Image as VanImage } from 'vant'

interface Props {
  src?: string
  alt?: string
  width?: string
  height?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  objectPosition?: string
  borderRadius?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: 'https://picsum.photos/seed/image1/300/200',
  alt: '图片',
  width: '100%',
  height: 'auto',
  objectFit: 'cover',
  objectPosition: 'center center',
  borderRadius: '0',
})

const imageStyle = computed(() => ({
  '--image-object-position': props.objectPosition,
}))
</script>

<template>
  <VanImage
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :fit="objectFit"
    :radius="borderRadius"
    :style="imageStyle"
  />
</template>

<style scoped>
:deep(.van-image__img){object-position:var(--image-object-position,center center)}
</style>
