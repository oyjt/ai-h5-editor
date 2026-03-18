<script setup lang="ts">
/**
 * 标签组件 Widget
 */
interface Props {
  text?: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'large' | 'medium' | 'small'
  plain?: boolean
  round?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '标签',
  type: 'primary',
  size: 'medium',
  plain: false,
  round: false,
})
</script>

<template>
  <span
    class="tag-widget"
    :class="[
      `tag-${type}`,
      `tag-${size}`,
      { 'tag-plain': plain, 'tag-round': round },
    ]"
  >
    {{ text }}
  </span>
</template>

<style scoped>
.tag-widget {
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  height: 28px;
  font-size: 12px;
  line-height: 1;
  border: 1px solid transparent;
  border-radius: 4px;
  white-space: nowrap;
}

.tag-large {
  height: 32px;
  padding: 0 12px;
  font-size: 14px;
}

.tag-small {
  height: 24px;
  padding: 0 8px;
  font-size: 12px;
}

.tag-round {
  border-radius: 14px;
}

.tag-primary {
  background-color: #ecf5ff;
  border-color: #d9ecff;
  color: #409eff;
}

.tag-success {
  background-color: #f0f9ff;
  border-color: #c6f6d5;
  color: #67c23a;
}

.tag-warning {
  background-color: #fdf6ec;
  border-color: #faecd8;
  color: #e6a23c;
}

.tag-danger {
  background-color: #fef0f0;
  border-color: #fde2e2;
  color: #f56c6c;
}

.tag-info {
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
}

.tag-plain.tag-primary {
  background-color: #fff;
  border-color: #b3d8ff;
  color: #409eff;
}

.tag-plain.tag-success {
  background-color: #fff;
  border-color: #c2e7b0;
  color: #67c23a;
}

.tag-plain.tag-warning {
  background-color: #fff;
  border-color: #f5dab1;
  color: #e6a23c;
}

.tag-plain.tag-danger {
  background-color: #fff;
  border-color: #fbc4c4;
  color: #f56c6c;
}

.tag-plain.tag-info {
  background-color: #fff;
  border-color: #d3d4d6;
  color: #909399;
}
</style>
