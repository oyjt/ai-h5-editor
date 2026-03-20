<script setup lang="ts">
/**
 * 步骤条组件 Widget
 */
import { Steps as VanSteps, Step as VanStep } from 'vant'

interface Step {
  text: string
  desc?: string
}

interface Props {
  steps?: Step[]
  active?: number
  direction?: 'horizontal' | 'vertical'
  activeColor?: string
  inactiveColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  steps: () => [
    { text: '步骤一', desc: '描述信息' },
    { text: '步骤二', desc: '描述信息' },
    { text: '步骤三', desc: '描述信息' },
  ],
  active: 0,
  direction: 'horizontal',
  activeColor: '#07c160',
  inactiveColor: '#969799',
})
</script>

<template>
  <VanSteps
    :active="active"
    :direction="direction"
    :active-color="activeColor"
    :inactive-color="inactiveColor"
  >
    <VanStep v-for="(step, index) in steps" :key="index">
      {{ step.text }}
      <template v-if="step.desc" #description>
        {{ step.desc }}
      </template>
    </VanStep>
  </VanSteps>
</template>

<style scoped>
</style>
