<script setup lang="ts">
/**
 * 轮播图组件 Widget
 */
import { ref, onMounted, onUnmounted } from 'vue'

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

const currentIndex = ref(0)
let timer: number | null = null

function next() {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

function goTo(index: number) {
  currentIndex.value = index
}

function startAutoplay() {
  if (props.autoplay && props.images.length > 1) {
    timer = window.setInterval(next, props.interval)
  }
}

function stopAutoplay() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<template>
  <div
    class="swiper-widget"
    :style="{ height }"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <div class="swiper-container">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="swiper-item"
        :class="{ active: index === currentIndex }"
      >
        <img :src="image" :alt="`Slide ${index + 1}`">
      </div>
    </div>
    <div v-if="showIndicators" class="swiper-indicators">
      <span
        v-for="(_, index) in images"
        :key="index"
        class="indicator"
        :class="{ active: index === currentIndex }"
        @click="goTo(index)"
      />
    </div>
  </div>
</template>

<style scoped>
.swiper-widget {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.swiper-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.swiper-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.swiper-item.active {
  opacity: 1;
}

.swiper-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-indicators {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.indicator.active {
  width: 24px;
  border-radius: 4px;
  background-color: #fff;
}
</style>
