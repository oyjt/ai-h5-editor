<script setup lang="ts">
/**
 * 动作栏组件 Widget
 */
import { ActionBar, ActionBarIcon, ActionBarButton } from 'vant'

interface ActionIcon {
  icon: string
  text: string
}

interface ActionButton {
  text: string
  type?: 'default' | 'primary' | 'warning' | 'danger'
}

interface Props {
  icons?: ActionIcon[]
  buttons?: ActionButton[]
  safeAreaInsetBottom?: boolean
  placeholder?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icons: () => [
    { icon: 'i-tabler-shopping-cart', text: '购物车' },
    { icon: 'i-tabler-heart', text: '收藏' },
  ],
  buttons: () => [
    { text: '加入购物车', type: 'warning' },
    { text: '立即购买', type: 'danger' },
  ],
  safeAreaInsetBottom: true,
  placeholder: false,
})

const emit = defineEmits<{
  iconClick: [index: number]
  buttonClick: [index: number]
}>()

function handleIconClick(index: number) {
  emit('iconClick', index)
}

function handleButtonClick(index: number) {
  emit('buttonClick', index)
}
</script>

<template>
  <div class="action-bar-widget">
    <ActionBar :placeholder="placeholder" :safe-area-inset-bottom="safeAreaInsetBottom">
      <ActionBarIcon
        v-for="(icon, index) in icons"
        :key="index"
        :text="icon.text"
        @click="handleIconClick(index)"
      >
        <template #icon>
          <i :class="icon.icon" class="text-18px" />
        </template>
      </ActionBarIcon>
      <ActionBarButton
        v-for="(button, index) in buttons"
        :key="index"
        :type="button.type"
        :text="button.text"
        @click="handleButtonClick(index)"
      />
    </ActionBar>
  </div>
</template>

<style scoped>
.action-bar-widget {
  position: relative;
}
</style>
