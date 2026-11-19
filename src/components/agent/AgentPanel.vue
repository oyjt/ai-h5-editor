<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { RULE_LABELS } from '@/design/spec-validator'
import { useAgentStore } from '@/stores/agent'
import { useEditorStore } from '@/stores/editor'
import { getComponentConfig } from '@/config/component-registry'
import { findComponentById } from '@/utils/schema-generator'

const agent = useAgentStore()
const editor = useEditorStore()
const input = ref('')
const listRef = ref<HTMLElement | null>(null)
const showViolations = ref(false)

const modeHint = computed(() => agent.mode === 'spec'
  ? '与风格库冲突时，以规范为准'
  : '你的描述优先，偏离规范的项会记入偏离清单')
const scopeNames = computed(() => {
  const ids = editor.agentSelectionIds.length ? editor.agentSelectionIds : (editor.selectedComponentId ? [editor.selectedComponentId] : [])
  return ids
    .map(id => findComponentById(editor.currentPage.components, id))
    .filter((item): item is NonNullable<typeof item> => !!item)
    .map(item => getComponentConfig(item.type)?.name ?? item.type)
})
const examples = ['做一个冬促服饰频道：聚合页、店铺页、详情页，冬促标签用蓝色', '做一个新品报名页，主色用紫色']

function scrollToEnd() {
  nextTick(() => { if (listRef.value) listRef.value.scrollTop = listRef.value.scrollHeight })
}
watch(() => agent.active.messages.map(item => `${item.id}${item.steps?.filter(step => step.done).length}${item.status}`).join(), scrollToEnd, { flush: 'post' })

async function submit(text = input.value) {
  if (!text.trim() || agent.active.running) return
  input.value = ''
  await agent.send(text)
}
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) { event.preventDefault(); submit() }
}
function fixAll() {
  const fixed = agent.autofixViolations()
  ElMessage.success(fixed ? `已修正 ${fixed} 处，可用撤销回到修正前` : '没有需要修正的内容')
}
function focusViolation(componentId: string) {
  if (componentId !== 'page') editor.selectComponent(componentId)
}
function clearScope() { editor.setAgentSelection([]); editor.selectComponent(null) }
</script>

<template>
  <section class="agent-panel" aria-label="AI 对话">
    <header class="agent-head">
      <div class="session-row">
        <select :value="agent.activeId" aria-label="切换会话" @change="agent.switchSession(($event.target as HTMLSelectElement).value)">
          <option v-for="item in agent.sessions" :key="item.id" :value="item.id">{{ item.running ? '● ' : '' }}{{ item.title }}</option>
        </select>
        <button class="icon-btn" title="新建会话" @click="agent.newSession()"><i class="i-tabler-plus" /></button>
      </div>
      <div class="mode-row">
        <div class="segmented" role="group" aria-label="生成模式">
          <button :class="{ active: agent.mode === 'spec' }" :aria-pressed="agent.mode === 'spec'" @click="agent.setMode('spec')">规范优先</button>
          <button :class="{ active: agent.mode === 'prompt' }" :aria-pressed="agent.mode === 'prompt'" @click="agent.setMode('prompt')">Prompt 优先</button>
        </div>
        <span class="mode-hint">{{ modeHint }}</span>
      </div>
    </header>

    <div ref="listRef" class="message-list">
      <div v-if="!agent.active.messages.length" class="empty">
        <strong>用一句话描述要做的页面</strong>
        <span>也可以先在画布上框选或点选组件，再说怎么改。</span>
        <button v-for="item in examples" :key="item" @click="submit(item)">{{ item }}</button>
      </div>

      <template v-for="message in agent.active.messages" :key="message.id">
        <div v-if="message.role === 'user'" class="bubble user">
          <span v-if="message.scope" class="scope">{{ message.scope }}</span>
          {{ message.text }}
        </div>
        <div v-else class="bubble agent" :class="message.status">
          <ul v-if="message.steps?.length" class="steps">
            <li v-for="step in message.steps" :key="step.label" :class="{ done: step.done }">
              <i :class="step.done ? 'i-tabler-check' : 'i-tabler-loader-2 spin'" />{{ step.label }}
            </li>
          </ul>
          <p>{{ message.text }}</p>
          <div v-if="message.deviations?.length" class="deviations">
            <strong>偏离清单</strong>
            <span v-for="item in message.deviations" :key="item.text" :class="item.kind">{{ item.text }}</span>
          </div>
          <div v-else-if="message.status === 'done' && message.deviations" class="deviations ok"><strong>偏离清单</strong><span>无偏离项，遵守当前风格库</span></div>
          <div v-if="message.followUps?.length" class="chips">
            <button v-for="item in message.followUps" :key="item" :disabled="agent.active.running" @click="submit(item)">{{ item }}</button>
          </div>
        </div>
      </template>
    </div>

    <div class="spec-card" :class="{ warn: agent.violations.length }">
      <button class="spec-head" :aria-expanded="showViolations" @click="showViolations = !showViolations">
        <i :class="agent.violations.length ? 'i-tabler-alert-triangle' : 'i-tabler-circle-check'" />
        <span>{{ agent.violations.length ? `规范校验：${agent.violations.length} 处偏离` : '规范校验：当前页面全部通过' }}</span>
        <i :class="showViolations ? 'i-tabler-chevron-down' : 'i-tabler-chevron-up'" />
      </button>
      <div v-if="showViolations && agent.violations.length" class="spec-body">
        <ul>
          <li v-for="item in agent.violations.slice(0, 40)" :key="item.id">
            <button @click="focusViolation(item.componentId)">
              <em>{{ RULE_LABELS[item.rule] }}</em>{{ item.message }}
            </button>
          </li>
        </ul>
        <button class="fix-all" @click="fixAll">一键修正全部</button>
      </div>
    </div>

    <footer class="composer">
      <div v-if="scopeNames.length" class="scope-chip">
        <span>选区：{{ scopeNames.join('、') }}</span>
        <button title="取消选区" @click="clearScope"><i class="i-tabler-x" /></button>
      </div>
      <textarea v-model="input" rows="3" :disabled="agent.active.running" aria-label="描述需求" placeholder="描述需求，或先选中组件再说怎么改（⌘/Ctrl + Enter 发送）" @keydown="onKeydown" />
      <div class="composer-foot">
        <span>{{ agent.providerName }}</span>
        <button class="send" :disabled="!input.trim() || agent.active.running" aria-label="发送" @click="submit()"><i class="i-tabler-arrow-up" /></button>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.agent-panel{height:100%;min-height:0;display:flex;flex-direction:column;background:var(--surface-1);font-size:13px;color:var(--text-primary)}
.agent-head{padding:12px;border-bottom:1px solid var(--border-subtle);display:flex;flex-direction:column;gap:10px}
.session-row{display:flex;gap:8px}.session-row select{flex:1;min-width:0;height:32px;border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--surface-1);padding:0 8px;color:var(--text-primary)}
.icon-btn{width:32px;height:32px;border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--surface-1);cursor:pointer;color:var(--text-secondary)}.icon-btn:hover{color:var(--brand-600);border-color:var(--brand-300)}
.mode-row{display:flex;flex-direction:column;gap:6px}.segmented{display:flex;padding:2px;background:var(--surface-3);border-radius:var(--radius-md)}
.segmented button{flex:1;height:28px;border:0;border-radius:var(--radius-sm);background:transparent;color:var(--text-secondary);cursor:pointer}.segmented button.active{background:var(--surface-1);color:var(--brand-600);font-weight:600;box-shadow:var(--shadow-xs)}
.mode-hint{font-size:12px;color:var(--text-muted)}
.message-list{flex:1;min-height:0;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:12px}
.empty{display:flex;flex-direction:column;gap:8px;color:var(--text-muted)}.empty strong{color:var(--text-strong)}.empty button{text-align:left;border:1px dashed var(--border-default);border-radius:var(--radius-md);background:var(--surface-2);padding:8px 10px;color:var(--text-secondary);cursor:pointer}.empty button:hover{border-color:var(--brand-400);color:var(--brand-600)}
.bubble{max-width:100%;border-radius:var(--radius-lg);padding:8px 12px;line-height:1.6;word-break:break-word}
.bubble.user{align-self:flex-end;background:var(--brand-50);border:1px solid var(--brand-200)}.scope{display:block;font-size:12px;color:var(--brand-700);margin-bottom:2px}
.bubble.agent{background:var(--surface-2);border:1px solid var(--border-subtle)}.bubble.agent p{margin:0}.bubble.error{border-color:var(--danger-200);background:var(--danger-50)}
.steps{list-style:none;margin:0 0 6px;padding:0;display:flex;flex-direction:column;gap:2px;color:var(--text-secondary)}.steps li{display:flex;align-items:center;gap:6px}.steps li.done i{color:var(--success-500)}
.deviations{margin-top:8px;padding:6px 8px;border-radius:var(--radius-md);background:var(--warning-50);display:flex;flex-direction:column;gap:2px;font-size:12px}.deviations.ok{background:var(--success-50)}.deviations strong{color:var(--text-strong)}.deviations .kept{color:var(--warning-700)}.deviations .ignored{color:var(--text-secondary)}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.chips button{border:1px solid var(--border-default);border-radius:999px;background:var(--surface-1);padding:2px 10px;font-size:12px;color:var(--text-secondary);cursor:pointer}.chips button:hover:not(:disabled){border-color:var(--brand-400);color:var(--brand-600)}.chips button:disabled{opacity:.5;cursor:not-allowed}
.spec-card{margin:0 12px 8px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--success-50)}.spec-card.warn{background:var(--warning-50);border-color:var(--warning-200)}
.spec-head{width:100%;display:flex;align-items:center;gap:6px;height:32px;padding:0 10px;border:0;background:transparent;cursor:pointer;color:var(--text-primary);text-align:left}.spec-head span{flex:1}
.spec-body{padding:0 10px 10px;max-height:180px;overflow:auto}.spec-body ul{list-style:none;margin:0 0 8px;padding:0;display:flex;flex-direction:column;gap:2px}.spec-body li button{width:100%;text-align:left;border:0;background:transparent;padding:3px 0;font-size:12px;color:var(--text-secondary);cursor:pointer}.spec-body li button:hover{color:var(--brand-600)}.spec-body em{font-style:normal;margin-right:6px;padding:0 6px;border-radius:var(--radius-xs);background:var(--surface-1);color:var(--warning-700)}
.fix-all{width:100%;height:30px;border:0;border-radius:var(--radius-md);background:var(--brand-600);color:var(--text-inverse);cursor:pointer}.fix-all:hover{background:var(--brand-700)}
.composer{padding:8px 12px 12px;border-top:1px solid var(--border-subtle);display:flex;flex-direction:column;gap:6px}
.scope-chip{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:2px 8px;border-radius:var(--radius-sm);background:var(--brand-50);color:var(--brand-700);font-size:12px}.scope-chip button{border:0;background:transparent;cursor:pointer;color:inherit}
.composer textarea{width:100%;box-sizing:border-box;resize:none;border:1px solid var(--border-default);border-radius:var(--radius-md);padding:8px 10px;font:inherit;color:var(--text-primary);background:var(--surface-1)}.composer textarea:focus-visible{outline:2px solid var(--brand-600);outline-offset:1px}.composer textarea:disabled{background:var(--surface-3)}
.composer-foot{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--text-muted)}.send{width:32px;height:32px;border:0;border-radius:50%;background:var(--brand-600);color:var(--text-inverse);cursor:pointer}.send:disabled{background:var(--border-default);cursor:not-allowed}
.spin{animation:agent-spin 1s linear infinite}@keyframes agent-spin{to{transform:rotate(360deg)}}
</style>
