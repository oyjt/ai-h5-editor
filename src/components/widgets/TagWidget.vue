<script setup lang="ts">
/**
 * 标签组件 Widget
 */
import { Tag as VanTag } from 'vant'

interface Props {
  text?: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'default'
  size?: 'large' | 'medium'
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
  <VanTag
    :type="type"
    :size="size"
    :plain="plain"
    :round="round"
  >
    {{ text }}
  </VanTag>
</template>

<style scoped>
</style>
