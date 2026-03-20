<script setup lang="ts">
/**
 * 骨架屏组件 Widget
 */
import { Skeleton as VanSkeleton, SkeletonTitle as VanSkeletonTitle, SkeletonAvatar as VanSkeletonAvatar, SkeletonParagraph as VanSkeletonParagraph } from 'vant'

interface Props {
  row?: number
  rowWidth?: string | string[]
  title?: boolean
  avatar?: boolean
  avatarSize?: string
  avatarShape?: 'round' | 'square'
  loading?: boolean
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  row: 3,
  rowWidth: '100%',
  title: false,
  avatar: false,
  avatarSize: '32px',
  avatarShape: 'round',
  loading: true,
  animate: true,
})
</script>

<template>
  <VanSkeleton :loading="loading" :animate="animate">
    <template #template>
      <div style="display: flex; align-items: flex-start; padding: 16px;">
        <VanSkeletonAvatar
          v-if="avatar"
          :avatar-size="avatarSize"
          :avatar-shape="avatarShape"
          style="margin-right: 16px;"
        />
        <div style="flex: 1;">
          <VanSkeletonTitle v-if="title" />
          <VanSkeletonParagraph
            v-for="i in row"
            :key="i"
            :row-width="Array.isArray(rowWidth) ? (rowWidth[i - 1] || '100%') : rowWidth"
          />
        </div>
      </div>
    </template>
    <slot />
  </VanSkeleton>
</template>

<style scoped>
</style>
