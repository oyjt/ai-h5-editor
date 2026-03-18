<script setup lang="ts">
/**
 * 间距组件 Widget
 */
interface Props {
  height?: string
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '20px',
  backgroundColor: 'transparent',
})
</script>

<template>
  <div
    class="spacer-widget"
    :style="{
      height,
      backgroundColor,
    }"
  />
</template>

<style scoped>
.spacer-widget {
  width: 100%;
}
</style>
