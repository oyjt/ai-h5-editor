<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAgentStore } from '@/stores/agent'

const agent = useAgentStore()
const router = useRouter()
const route = useRoute()
const lingering = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const running = computed(() => agent.sessions.find(item => item.running))
const info = computed(() => {
  const session = running.value ?? agent.active
  const reply = [...session.messages].reverse().find(item => item.role === 'agent')
  const steps = reply?.steps ?? []
  const done = steps.filter(step => step.done).length
  return {
    session,
    done,
    total: steps.length,
    percent: steps.length ? Math.round(done / steps.length * 100) : 8,
    failed: reply?.status === 'error',
  }
})

watch(running, (value, old) => {
  if (value) { lingering.value = false; clearTimeout(timer) }
  else if (old) {
    lingering.value = true
    timer = setTimeout(() => { lingering.value = false }, 6000)
  }
})

const visible = computed(() => !!running.value || lingering.value)

function open() {
  agent.switchSession(info.value.session.id)
  if (route.path !== '/') void router.push('/')
}
</script>

<template>
  <button v-if="visible" type="button" class="island" :aria-label="running ? '生成中，点击查看' : '任务已结束，点击查看'" @click="open">
    <span class="dot" :class="{ spin: running, fail: !running && info.failed }">
      <i :class="running ? 'i-tabler-loader-2' : info.failed ? 'i-tabler-x' : 'i-tabler-check'" />
    </span>
    <span class="text">
      <template v-if="running">生成中 · {{ info.done }}/{{ info.total || '…' }}</template>
      <template v-else>{{ info.failed ? '执行失败' : '已完成' }} · {{ info.session.title }}</template>
    </span>
    <i v-if="running" class="bar"><b :style="{ width: `${info.percent}%` }" /></i>
  </button>
</template>

<style scoped>
.island{position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:2900;display:flex;align-items:center;gap:10px;background:#141414;color:#fff;border:0;border-radius:999px;padding:6px 16px 6px 8px;box-shadow:0 6px 16px rgba(0,0,0,.25);cursor:pointer;font-size:13px;font-weight:500;max-width:calc(100vw - 32px)}
.dot{width:22px;height:22px;border-radius:50%;background:#1677ff;display:grid;place-items:center;flex:none}.dot.fail{background:#ff4d4f}.dot i{font-size:12px}
.dot.spin i{animation:spin 1s linear infinite}
.text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bar{width:64px;height:4px;border-radius:2px;background:#434343;overflow:hidden;flex:none}.bar b{display:block;height:100%;background:#1677ff;transition:width .2s}
@keyframes spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.dot.spin i{animation:none}}
</style>
