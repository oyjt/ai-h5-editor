<script setup lang="ts">
/**
 * 轮播图组件 Widget - 使用 Vant Swipe
 */
import { Swipe, SwipeItem } from 'vant'

interface Props {
  images?: string[]
  height?: string
  autoplay?: boolean
  interval?: number
  showIndicators?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [
    'https://picsum.photos/seed/slide1/375/200',
    'https://picsum.photos/seed/slide2/375/200',
    'https://picsum.photos/seed/slide3/375/200',
  ],
  height: '200px',
  autoplay: true,
  interval: 3000,
  showIndicators: true,
})
</script>

<template>
  <div class="swiper-widget" :style="{ height }">
    <Swipe
      :autoplay="autoplay ? interval : 0"
      :show-indicators="showIndicators"
      indicator-color="#fff"
      class="swiper-container"
    >
      <SwipeItem v-for="(image, index) in images" :key="index">
        <img :src="image" :alt="`Slide ${index + 1}`" class="swiper-image">
      </SwipeItem>
    </Swipe>
  </div>
</template>

<style scoped>
.swiper-widget {
  width: 100%;
  overflow: hidden;
}

.swiper-container {
  width: 100%;
  height: 100%;
}

.swiper-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 自定义指示器样式 */
:deep(.van-swipe__indicator) {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s;
}

:deep(.van-swipe__indicator--active) {
  width: 24px;
  border-radius: 4px;
  background-color: #fff;
}
</style>
