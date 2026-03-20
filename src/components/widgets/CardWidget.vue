<script setup lang="ts">
/**
 * 卡片组件 Widget
 */
import { Card as VanCard } from 'vant'

interface Props {
  title?: string
  content?: string
  imageUrl?: string
  shadow?: 'always' | 'hover' | 'never'
  borderRadius?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '卡片标题',
  content: '这是卡片内容',
  imageUrl: '',
  shadow: 'hover',
  borderRadius: '8px',
})
</script>

<template>
  <div
    class="card-widget"
    :class="`card-shadow-${shadow}`"
    :style="{ borderRadius }"
  >
    <VanCard
      :title="title"
      :desc="content"
      :thumb="imageUrl"
    />
  </div>
</template>

<style scoped>
.card-widget {
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.card-shadow-always {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-shadow-hover:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
