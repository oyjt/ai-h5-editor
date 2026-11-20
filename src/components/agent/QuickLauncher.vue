<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAgentStore } from '@/stores/agent'
import { useStyleLibraryStore, versionOf } from '@/stores/style-library'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
const agent = useAgentStore()
const library = useStyleLibraryStore()
const router = useRouter()
const route = useRoute()

const text = ref('')
const input = ref<HTMLTextAreaElement | null>(null)

const tasks = computed(() => agent.sessions
  .filter(item => item.messages.length)
  .slice(0, 3)
  .map((session) => {
    const reply = [...session.messages].reverse().find(item => item.role === 'agent')
    const steps = reply?.steps ?? []
    const done = steps.filter(step => step.done).length
    return {
      id: session.id,
      title: session.title,
      running: session.running,
      percent: steps.length ? Math.round(done / steps.length * 100) : 0,
      label: session.running ? `${done}/${steps.length || '…'} 步` : reply?.status === 'error' ? '执行失败' : '已完成，点击查看',
    }
  }))

watch(() => ui.launcherVisible, async (visible) => {
  if (visible) {
    await nextTick()
    input.value?.focus()
  }
})

async function goEditor() {
  if (route.path !== '/') await router.push('/')
}

async function submit() {
  const prompt = text.value.trim()
  if (!prompt) return
  ui.toggleLauncher(false)
  text.value = ''
  agent.newSession()
  await goEditor()
  void agent.send(prompt)
}

async function openTask(id: string) {
  agent.switchSession(id)
  ui.toggleLauncher(false)
  await goEditor()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    void submit()
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="ui.launcherVisible" class="launcher-mask" @mousedown.self="ui.toggleLauncher(false)">
      <section class="launcher" role="dialog" aria-modal="true" aria-label="快速发起设计">
        <header>
          <strong>快速发起设计</strong>
          <span>Esc 关闭</span>
        </header>
        <textarea
          ref="input"
          v-model="text"
          rows="3"
          aria-label="描述你的设计需求"
          placeholder="例如：做一个冬促服饰聚合页，顶部是活动头图，下面是双列商品流，冬促标签用蓝色"
          @keydown="onKeydown"
        />
        <div class="launcher-bar">
          <div class="chips">
            <button type="button" @click="router.push('/styles'); ui.toggleLauncher(false)">风格库：{{ library.active.name }} {{ versionOf(library.active) }}</button>
            <button type="button" @click="agent.setMode(agent.mode === 'spec' ? 'prompt' : 'spec')">{{ agent.mode === 'spec' ? '规范优先' : 'Prompt 优先' }}</button>
            <button type="button" disabled>模型：{{ agent.providerName }}</button>
          </div>
          <button type="button" class="go" :disabled="!text.trim()" @click="submit">开始生成</button>
        </div>
      </section>

      <div v-if="tasks.length" class="task-cards">
        <button v-for="(task, index) in tasks" :key="task.id" type="button" class="task" @click="openTask(task.id)">
          <small>任务 {{ index + 1 }}</small>
          <strong>{{ task.title }}</strong>
          <i v-if="task.running" class="bar"><b :style="{ width: `${task.percent}%` }" /></i>
          <span :class="{ ok: !task.running }">{{ task.label }}</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.launcher-mask{position:fixed;inset:0;z-index:3000;background:rgba(0,0,0,.45);display:flex;flex-direction:column;align-items:center;padding-top:14vh;gap:16px}
.launcher{width:min(720px,calc(100vw - 32px));box-sizing:border-box;background:#fff;border-radius:8px;padding:16px;box-shadow:0 12px 32px rgba(0,0,0,.2);display:flex;flex-direction:column;gap:12px}
.launcher header{display:flex;justify-content:space-between;align-items:center}.launcher header span{font-size:12px;color:#8c8c8c}
textarea{width:100%;box-sizing:border-box;border:1px solid #d9d9d9;border-radius:6px;padding:8px 12px;resize:none;font:inherit;font-size:15px;color:#1f1f1f}
textarea:focus-visible{outline:2px solid #1677ff;outline-offset:1px}
.launcher-bar{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
.chips{display:flex;gap:6px;flex-wrap:wrap}
.chips button{border:1px solid #d9d9d9;background:#fff;color:#434343;border-radius:6px;padding:4px 12px;font-size:12px;cursor:pointer;min-height:28px}
.chips button:disabled{cursor:default;color:#8c8c8c}
.go{border:0;background:#1677ff;color:#fff;border-radius:6px;padding:6px 16px;font-weight:500;cursor:pointer}.go:disabled{opacity:.45;cursor:not-allowed}
.task-cards{width:min(720px,calc(100vw - 32px));display:flex;gap:12px;flex-wrap:wrap}
.task{flex:1 1 0;min-width:180px;text-align:left;background:#fff;border:0;border-radius:8px;padding:12px 14px;cursor:pointer;display:flex;flex-direction:column;gap:4px}
.task small{font-size:12px;color:#8c8c8c}.task strong{font-weight:500;color:#1f1f1f}.task span{font-size:12px;color:#8c8c8c}.task span.ok{color:#389e0d}
.bar{display:block;height:4px;border-radius:2px;background:#f0f0f0;overflow:hidden}.bar b{display:block;height:100%;background:#1677ff;transition:width .2s}
</style>
