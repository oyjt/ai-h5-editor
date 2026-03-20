<script setup lang="ts">
/**
 * 间距组件 Widget
 */
import { Space as VanSpace } from 'vant'
import { computed } from 'vue'

interface Props {
  height?: string
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '20px',
  backgroundColor: 'transparent',
})

// 将 height 转换为数字（去掉 px）
const sizeValue = computed(() => {
  const match = props.height.match(/^(\d+)/)
  return match ? Number(match[1]) : 20
})
</script>

<template>
  <div
    class="spacer-widget"
    :style="{ backgroundColor }"
  >
    <VanSpace :size="sizeValue" direction="vertical" fill>
      <div />
    </VanSpace>
  </div>
</template>

<style scoped>
.spacer-widget {
  width: 100%;
}
</style>
