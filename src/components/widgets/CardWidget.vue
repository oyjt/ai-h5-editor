<script setup lang="ts">
/**
 * 卡片组件 Widget
 */
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
    <img v-if="imageUrl" :src="imageUrl" class="card-image" alt="card">
    <div class="card-body">
      <h3 v-if="title" class="card-title">
        {{ title }}
      </h3>
      <p class="card-content">
        {{ content }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.card-widget {
  background: #fff;
  border: 1px solid #ebeef5;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.card-shadow-always {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-shadow-hover:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.card-body {
  padding: 16px;
}

.card-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.card-content {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}
</style>
