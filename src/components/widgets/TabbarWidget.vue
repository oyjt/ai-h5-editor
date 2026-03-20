<script setup lang="ts">
/**
 * 标签栏组件 Widget
 */
import { ref } from 'vue'
import { Tabbar, TabbarItem } from 'vant'

interface TabItem {
  name: string
  text: string
  icon?: string
  badge?: string | number
  dot?: boolean
}

interface Props {
  tabs?: TabItem[]
  active?: string
  fixed?: boolean
  placeholder?: boolean
  safeAreaInsetBottom?: boolean
  activeColor?: string
  inactiveColor?: string
  border?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [
    { name: 'home', text: '首页', icon: 'i-tabler-home' },
    { name: 'category', text: '分类', icon: 'i-tabler-category' },
    { name: 'cart', text: '购物车', icon: 'i-tabler-shopping-cart', badge: 5 },
    { name: 'user', text: '我的', icon: 'i-tabler-user' },
  ],
  active: 'home',
  fixed: true,
  placeholder: true,
  safeAreaInsetBottom: true,
  activeColor: '#1989fa',
  inactiveColor: '#7d7e80',
  border: true,
})

const emit = defineEmits<{
  change: [name: string]
}>()

const currentActive = ref(props.active)

function handleChange(name: string | number) {
  currentActive.value = name as string
  emit('change', name as string)
}
</script>

<template>
  <div class="tabbar-widget">
    <Tabbar
      v-model="currentActive"
      :fixed="fixed"
      :placeholder="placeholder"
      :safe-area-inset-bottom="safeAreaInsetBottom"
      :active-color="activeColor"
      :inactive-color="inactiveColor"
      :border="border"
      @change="handleChange"
    >
      <TabbarItem
        v-for="tab in tabs"
        :key="tab.name"
        :name="tab.name"
        :badge="tab.badge"
        :dot="tab.dot"
      >
        {{ tab.text }}
        <template #icon>
          <i :class="tab.icon" class="text-20px" />
        </template>
      </TabbarItem>
    </Tabbar>
  </div>
</template>

<style scoped>
.tabbar-widget {
  position: relative;
}
</style>
