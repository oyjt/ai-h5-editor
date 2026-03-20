<script setup lang="ts">
/**
 * 单元格组件 Widget
 */
import { Cell as VanCell } from 'vant'

interface Props {
  title?: string
  value?: string
  label?: string
  icon?: string
  isLink?: boolean
  border?: boolean
  center?: boolean
  size?: 'normal' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  title: '单元格',
  value: '',
  label: '',
  icon: '',
  isLink: false,
  border: true,
  center: false,
  size: 'normal',
})
</script>

<template>
  <VanCell
    :title="title"
    :value="value"
    :label="label"
    :icon="icon"
    :is-link="isLink"
    :border="border"
    :center="center"
    :size="size"
  />
</template>

<style scoped>
</style>
