<script setup lang="ts">
/**
 * 按钮组件 Widget
 */
import { computed } from 'vue'
import { Button as VanButton } from 'vant'

interface Props {
  text?: string
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'large' | 'normal' | 'small' | 'mini'
  block?: boolean
  round?: boolean
  plain?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '按钮',
  type: 'primary',
  size: 'normal',
  block: false,
  round: false,
  plain: false,
  disabled: false,
})

const emit = defineEmits<{
  click: []
}>()

function handleClick() {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<template>
  <div class="button-widget" :class="{ 'is-block': block }">
    <VanButton
      :type="type"
      :size="size"
      :block="block"
      :round="round"
      :plain="plain"
      :disabled="disabled"
      @click="handleClick"
    >
      {{ text }}
    </VanButton>
  </div>
</template>

<style scoped>
.button-widget {
  display: inline-block;
}

.button-widget.is-block {
  display: block;
}
</style>
