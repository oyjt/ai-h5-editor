<script setup lang="ts">
/**
 * 图片组件 Widget
 */
import { computed } from 'vue'

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

const imageStyle = computed(() => ({
  width: props.width,
  height: props.height,
  objectFit: props.objectFit,
  borderRadius: props.borderRadius,
}))
</script>

<template>
  <div class="image-widget">
    <img :src="src" :alt="alt" :style="imageStyle">
  </div>
</template>

<style scoped>
.image-widget {
  display: block;
  overflow: hidden;
}

.image-widget img {
  display: block;
  max-width: 100%;
}
</style>
