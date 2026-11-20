<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PlatformHeader from '@/components/platform/PlatformHeader.vue'
import { getTokensByGroup } from '@/design/tokens'
import { useEditorStore } from '@/stores/editor'
import { KIND_LABEL, useStyleLibraryStore, versionOf } from '@/stores/style-library'
import type { CandidateKind } from '@/stores/style-library'

const store = useStyleLibraryStore()
const tab = ref<'all' | CandidateKind>('all')

// 直接打开本页（刷新）时编辑器 store 还是空的，先从本地存储恢复项目
function ensureProjectLoaded() {
  const editor = useEditorStore()
  if (editor.pages.length === 1 && editor.currentPage.components.length === 0) editor.loadPage()
}
onMounted(() => { ensureProjectLoaded(); store.rescan() })

const tabs: { id: 'all' | CandidateKind, label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'color', label: '颜色' },
  { id: 'radius', label: '圆角' },
  { id: 'font-size', label: '字号' },
]
const shown = computed(() => store.candidates.filter(item => tab.value === 'all' || item.kind === tab.value))
const releaseTitle = computed(() => `${store.active.name} · 二次蒸馏`)
const nextVersion = computed(() => `v${store.active.major}.${store.active.minor + 1}`)

const swatches = computed(() => {
  const wanted = ['color.primary', 'color.success', 'color.warning', 'color.error', 'color.price', 'color.text', 'color.bg-layout']
  const base = getTokensByGroup('color').filter(token => wanted.includes(token.path))
  const extra = store.active.extras.filter(item => item.kind === 'color').map(item => ({ label: item.value, value: item.value }))
  return [...base.map(token => ({ label: token.path.replace('color.', ''), value: token.value })), ...extra]
})

const pipeline = computed(() => [
  { label: '读取来源', note: `${store.stats.pageCount} 个页面`, state: 'done' },
  { label: '提取取值', note: `${store.stats.componentCount} 个组件`, state: 'done' },
  { label: `与 ${versionOf(store.active)} 对比`, note: `${store.candidates.length} 项差异`, state: 'done' },
  { label: '人工确认', note: store.stats.pending ? `待处理 ${store.stats.pending}` : '可发布', state: store.stats.pending ? 'doing' : 'done' },
])

async function createLibrary() {
  try {
    const { value } = await ElMessageBox.prompt('风格库名称', '新建风格库', { confirmButtonText: '创建', cancelButtonText: '取消', inputPattern: /\S+/, inputErrorMessage: '请输入名称' })
    store.create(value)
    ElMessage.success('已创建，初始 v1.0')
  }
  catch {}
}

function publish() {
  if (!store.candidates.length) return ElMessage.info('没有需要发布的差异')
  if (!store.publish()) return ElMessage.warning(`还有 ${store.stats.pending} 项待处理，发布前需要全部确认`)
  ElMessage.success(`已发布 ${versionOf(store.active)}`)
}
function formatTime(at: number) { return new Date(at).toLocaleString('zh-CN', { hour12: false }) }
</script>

<template>
  <div class="shell">
    <PlatformHeader />
    <main class="page">
      <aside class="side">
        <h2>风格库</h2>
        <button v-for="lib in store.libraries" :key="lib.id" type="button" class="lib" :class="{ on: lib.id === store.activeId }" @click="store.select(lib.id)">
          <span>{{ lib.name }}</span><em>{{ versionOf(lib) }}</em>
        </button>
        <button type="button" class="new" @click="createLibrary">新建风格库</button>
        <h3>来源</h3>
        <ul>
          <li><span>页面</span><b>{{ store.stats.pageCount }}</b></li>
          <li><span>组件</span><b>{{ store.stats.componentCount }}</b></li>
          <li><span>Token</span><b>{{ store.stats.tokenCount }}</b></li>
          <li><span>已发布版本</span><b>{{ store.active.releases.length }}</b></li>
        </ul>
      </aside>

      <section class="main">
        <header class="head">
          <div>
            <h1>{{ releaseTitle }}</h1>
            <p>扫描当前项目的所有页面，对比 {{ versionOf(store.active) }}，候选 {{ nextVersion }}</p>
          </div>
          <div class="actions">
            <button type="button" class="ghost" :disabled="!store.candidates.length" @click="store.rejectAll()">全部驳回</button>
            <button type="button" class="solid" :disabled="!store.candidates.length" @click="publish">确认并发布 {{ nextVersion }}</button>
          </div>
        </header>

        <div class="body">
          <div class="diffs">
            <div class="tabs" role="tablist" aria-label="差异分类">
              <button v-for="t in tabs" :key="t.id" role="tab" type="button" :aria-selected="tab === t.id" :class="{ on: tab === t.id }" @click="tab = t.id">{{ t.label }}</button>
              <button type="button" class="rescan" @click="store.rescan(); ElMessage.success('已重新扫描')">重新扫描</button>
            </div>

            <div v-if="!shown.length" class="empty">
              <strong>没有待确认的差异</strong>
              <span>页面里的颜色、圆角、字号都已在风格库内。在编辑器里使用风格库之外的取值后，这里会出现候选项。</span>
            </div>

            <article v-for="item in shown" :key="item.key" class="diff" :class="item.decision">
              <header>
                <strong>{{ item.title }}</strong>
                <span class="kind">{{ KIND_LABEL[item.kind] }}</span>
              </header>
              <div class="cols">
                <div class="before"><small>{{ versionOf(store.active) }}</small>{{ item.before }}</div>
                <div class="after"><small>候选 {{ nextVersion }}</small>{{ item.after }}</div>
              </div>
              <footer>
                <span><i v-if="item.kind === 'color'" class="sw" :style="{ background: item.value }" />来源：{{ item.pages.join('、') }}，共 {{ item.count }} 处</span>
                <div>
                  <button type="button" class="ghost" :class="{ picked: item.decision === 'reject' }" @click="store.decide(item.key, item.decision === 'reject' ? undefined : 'reject')">驳回</button>
                  <button type="button" class="adopt" :class="{ picked: item.decision === 'adopt' }" @click="store.decide(item.key, item.decision === 'adopt' ? undefined : 'adopt')">采纳</button>
                </div>
              </footer>
            </article>
          </div>

          <div class="rail">
            <div class="card">
              <strong>蒸馏进度</strong>
              <div v-for="step in pipeline" :key="step.label" class="step"><i :class="step.state" /><span>{{ step.label }}</span><em>{{ step.note }}</em></div>
            </div>
            <div class="card">
              <strong>Token 预览</strong>
              <div class="swatches"><div v-for="s in swatches" :key="s.label" class="swatch" :style="{ background: s.value }" :title="s.value"><span>{{ s.label }}</span></div></div>
              <small>间距基准 4px；圆角与字号取自 {{ store.active.name }} 刻度</small>
            </div>
            <div class="card">
              <strong>发布说明</strong>
              <p>发布前需人工确认全部差异。已采纳 {{ store.stats.adopted }} 项，已驳回 {{ store.stats.rejected }} 项，待处理 {{ store.stats.pending }} 项。</p>
              <ul v-if="store.active.releases.length" class="releases">
                <li v-for="r in store.active.releases.slice(0, 4)" :key="r.at"><b>{{ r.version }}</b> {{ r.note }}<small>{{ formatTime(r.at) }}</small></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.shell{min-height:100%;background:var(--surface-0,#f5f5f5)}
.page{max-width:1380px;margin:auto;padding:20px 28px 44px;display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start}
.side{flex:0 0 232px;background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:16px 12px;display:flex;flex-direction:column;gap:6px}
.side h2,.side h3{margin:0 0 4px;padding:0 8px;font-size:12px;color:#8c8c8c;font-weight:500}.side h3{margin-top:14px}
.lib{display:flex;justify-content:space-between;gap:8px;border:0;background:transparent;border-radius:6px;padding:8px 10px;cursor:pointer;text-align:left;color:#434343;font-size:13px}
.lib.on{background:#e6f4ff;color:#1f1f1f}.lib em{font-style:normal;font-size:12px;color:#8c8c8c}
.new{border:1px dashed #91caff;background:transparent;color:#1677ff;border-radius:6px;padding:8px 12px;cursor:pointer;margin-top:6px}
.side ul{list-style:none;margin:0;padding:0 8px;display:flex;flex-direction:column;gap:6px;color:#434343;font-size:13px}.side li{display:flex;justify-content:space-between}.side li b{font-weight:500;color:#8c8c8c}
.main{flex:1 1 640px;min-width:0;display:flex;flex-direction:column;gap:16px}
.head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}.head h1{margin:0;font-size:20px}.head p{margin:4px 0 0;color:#8c8c8c;font-size:12px}
.actions{display:flex;gap:8px}
.ghost{border:1px solid #d9d9d9;background:#fff;color:#434343;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:13px}
.solid{border:0;background:#1677ff;color:#fff;border-radius:6px;padding:6px 14px;font-weight:600;cursor:pointer;font-size:13px}
.ghost:disabled,.solid:disabled{opacity:.45;cursor:not-allowed}
.body{display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start}
.diffs{flex:1 1 420px;min-width:0;display:flex;flex-direction:column;gap:12px}
.tabs{display:flex;gap:4px;background:#fff;border:1px solid #f0f0f0;border-radius:6px;padding:3px;align-self:flex-start;align-items:center}
.tabs button{border:0;background:transparent;border-radius:6px;padding:5px 14px;font-size:13px;color:#434343;cursor:pointer}.tabs button.on{background:#1677ff;color:#fff}
.tabs .rescan{color:#1677ff;margin-left:6px}
.empty{background:#fff;border:1px dashed #d9d9d9;border-radius:12px;padding:28px;display:flex;flex-direction:column;gap:6px;color:#8c8c8c;font-size:13px}.empty strong{color:#434343}
.diff{background:#fff;border:1px solid #f0f0f0;border-radius:12px;overflow:hidden}.diff.adopt{border-color:#b7eb8f}.diff.reject{opacity:.62}
.diff header,.diff footer{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px 14px}.diff header{border-bottom:1px solid #f0f0f0}.diff footer{border-top:1px solid #f0f0f0;font-size:12px;color:#8c8c8c}
.kind{font-size:12px;border-radius:6px;padding:1px 8px;background:rgba(22,119,255,.12);color:#0958d9}
.cols{display:flex;flex-wrap:wrap}.cols>div{flex:1 1 200px;min-width:0;padding:12px 14px;font-size:13px}.cols small{display:block;font-size:12px;color:#8c8c8c}
.before{background:rgba(255,77,79,.08);border-right:1px solid #f0f0f0}.after{background:rgba(82,196,26,.08)}
.sw{display:inline-block;width:12px;height:12px;border-radius:3px;border:1px solid #d9d9d9;vertical-align:-2px;margin-right:6px}
footer>div{display:flex;gap:6px}.diff footer button{padding:3px 12px;font-size:12px}
.adopt{border:0;background:rgba(82,196,26,.18);color:#237804;border-radius:6px;cursor:pointer}.adopt.picked{background:#52c41a;color:#fff}.ghost.picked{background:#fff1f0;border-color:#ff7875;color:#cf1322}
.rail{flex:0 1 340px;min-width:280px;display:flex;flex-direction:column;gap:12px}
.card{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:8px;font-size:13px;color:#434343}.card>strong{color:#1f1f1f}
.step{display:flex;align-items:center;gap:8px}.step i{width:8px;height:8px;border-radius:50%;background:#52c41a}.step i.doing{background:#1677ff}.step span{flex:1}.step em{font-style:normal;font-size:12px;color:#8c8c8c}
.swatches{display:flex;flex-wrap:wrap;gap:8px}.swatch{width:56px;height:56px;border-radius:6px;display:flex;align-items:flex-end;padding:4px;box-sizing:border-box;border:1px solid #f0f0f0}.swatch span{font-size:10px;background:rgba(255,255,255,.85);border-radius:3px;padding:0 3px;color:#1f1f1f;max-width:100%;overflow:hidden;text-overflow:ellipsis}
.card small{font-size:12px;color:#8c8c8c}.card p{margin:0}
.releases{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;font-size:12px}.releases small{display:block}
</style>
