<script setup lang="ts">
/**
 * 文本组件 Widget
 */
import { computed } from 'vue'

interface Props {
  content?: string
  fontSize?: string
  color?: string
  fontWeight?: string
  textAlign?: string
  lineHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  content: '请输入文本',
  fontSize: '14px',
  color: '#333333',
  fontWeight: 'normal',
  textAlign: 'left',
  lineHeight: '1.5',
})

const textStyle = computed(() => ({
  fontSize: props.fontSize,
  color: props.color,
  fontWeight: props.fontWeight,
  textAlign: props.textAlign,
  lineHeight: props.lineHeight,
}))
</script>

<template>
  <div class="text-widget" :style="textStyle">
    {{ content }}
  </div>
</template>

<style scoped>
.text-widget {
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
