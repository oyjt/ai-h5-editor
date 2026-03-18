<script setup lang="ts">
/**
 * 分割线组件 Widget
 */
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
  <div class="divider-widget" :class="`divider-${textPosition}`">
    <span
      v-if="text"
      class="divider-text"
      :style="{
        borderTopStyle: borderStyle,
        borderTopColor: borderColor,
        borderTopWidth: borderWidth,
      }"
    >
      {{ text }}
    </span>
    <div
      v-else
      class="divider-line"
      :style="{
        borderTopStyle: borderStyle,
        borderTopColor: borderColor,
        borderTopWidth: borderWidth,
      }"
    />
  </div>
</template>

<style scoped>
.divider-widget {
  width: 100%;
  display: flex;
  align-items: center;
  margin: 16px 0;
}

.divider-line {
  width: 100%;
  border-top: 1px solid #dcdfe6;
}

.divider-text {
  position: relative;
  padding: 0 16px;
  color: #909399;
  font-size: 14px;
  white-space: nowrap;
}

.divider-text::before,
.divider-text::after {
  content: '';
  position: absolute;
  top: 50%;
  border-top: inherit;
}

.divider-left .divider-text::before {
  left: 100%;
  width: 1000px;
  margin-left: 16px;
}

.divider-center .divider-text::before {
  right: 100%;
  width: 1000px;
  margin-right: 16px;
}

.divider-center .divider-text::after {
  left: 100%;
  width: 1000px;
  margin-left: 16px;
}

.divider-right .divider-text::after {
  right: 100%;
  width: 1000px;
  margin-right: 16px;
}
</style>
