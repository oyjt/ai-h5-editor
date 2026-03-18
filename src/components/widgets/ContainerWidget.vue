<script setup lang="ts">
/**
 * 容器组件 Widget
 */
interface Props {
  backgroundColor?: string
  padding?: string
  borderRadius?: string
  border?: string
  minHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: '#ffffff',
  padding: '16px',
  borderRadius: '0',
  border: 'none',
  minHeight: '100px',
})
</script>

<template>
  <div
    class="container-widget"
    :style="{
      backgroundColor,
      padding,
      borderRadius,
      border,
      minHeight,
    }"
  >
    <slot>
      <div class="container-placeholder">
        拖拽组件到此处
      </div>
    </slot>
  </div>
</template>

<style scoped>
.container-widget {
  width: 100%;
  box-sizing: border-box;
}

.container-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  color: #909399;
  font-size: 14px;
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
}
</style>
