<script setup lang="ts">
/**
 * 分割线组件 Widget
 */
import { Divider as VanDivider } from 'vant'

interface Props {
  text?: string
  textPosition?: 'left' | 'center' | 'right'
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  borderColor?: string
  borderWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  textPosition: 'center',
  borderStyle: 'solid',
  borderColor: '#dcdfe6',
  borderWidth: '1px',
})
</script>

<template>
  <VanDivider
    :content-position="textPosition"
    :style="{
      borderColor: borderColor,
      borderStyle: borderStyle,
    }"
  >
    {{ text }}
  </VanDivider>
</template>

<style scoped>
</style>
