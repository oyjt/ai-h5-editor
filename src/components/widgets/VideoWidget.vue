<script setup lang="ts">
interface Props {
  src?: string
  poster?: string
  controls?: boolean
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
}

withDefaults(defineProps<Props>(), {
  src: '',
  poster: '',
  controls: true,
  autoplay: false,
  muted: false,
  loop: false,
})
</script>

<template>
  <div class="video-widget">
    <video v-if="src" :src="src" :poster="poster" :controls="controls" :autoplay="autoplay" :muted="muted" :loop="loop" playsinline />
    <div v-else class="video-placeholder"><i class="i-tabler-player-play-filled" /><span>视频组件</span></div>
  </div>
</template>

<style scoped>
.video-widget{width:100%;overflow:hidden;border-radius:10px;background:#eef3f8}.video-widget video{display:block;width:100%;height:auto;min-height:180px;object-fit:cover}.video-placeholder{height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:linear-gradient(145deg,#eaf2ff,#f7f9fc);color:#5184dd;font-size:12px}.video-placeholder i{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:#fff;box-shadow:0 6px 18px rgba(48,94,166,.12);font-size:20px}
</style>
