<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PlatformHeader from '@/components/platform/PlatformHeader.vue'
import { auditTokens, generateCode } from '@/design/codegen'
import { validatePage } from '@/design/spec-validator'
import { useEditorStore } from '@/stores/editor'
import { generatePreviewURL, inlineAssets } from '@/utils/export'
import type { ComponentSchema, PageSchema } from '@/types/schema'

const editor = useEditorStore()
// 直接打开本页（刷新）时编辑器 store 还是空的，先从本地存储恢复项目
function ensureProjectLoaded() {
  const editor = useEditorStore()
  if (editor.pages.length === 1 && editor.currentPage.components.length === 0) editor.loadPage()
}
ensureProjectLoaded()
const picked = ref(editor.currentPageIndex)
const tab = ref<'vue' | 'css' | 'dsl'>('vue')

const pages = computed<PageSchema[]>(() => editor.pages.map((page, index) => (index === editor.currentPageIndex ? editor.currentPage : page)))
const page = computed(() => pages.value[Math.min(picked.value, pages.value.length - 1)])
const code = computed(() => generateCode(page.value))
const audit = computed(() => auditTokens(page.value))
const violations = computed(() => validatePage(page.value))

const count = (list: ComponentSchema[]): number => list.reduce((sum, item) => sum + 1 + count(item.children ?? []), 0)
const FILE: Record<typeof tab.value, { name: string, mime: string }> = {
  vue: { name: 'Page.vue', mime: 'text/plain' },
  css: { name: 'page.css', mime: 'text/css' },
  dsl: { name: 'page.dsl.json', mime: 'application/json' },
}

const checks = computed(() => [
  { ok: violations.value.length === 0, label: violations.value.length ? `${violations.value.length} 处不符合风格库` : '全部取值符合风格库' },
  { ok: audit.value.hardcoded === 0, label: audit.value.hardcoded ? `${audit.value.hardcoded} 处硬编码颜色` : '无硬编码颜色' },
  { ok: audit.value.refs > 0, label: `${audit.value.refs} 处 Token 引用` },
])

async function copy() {
  try {
    await navigator.clipboard.writeText(code.value[tab.value])
    ElMessage.success('已复制')
  }
  catch { ElMessage.error('复制失败，请手动选择文本') }
}
function download() {
  const file = FILE[tab.value]
  const url = URL.createObjectURL(new Blob([code.value[tab.value]], { type: file.mime }))
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  link.click()
  URL.revokeObjectURL(url)
}
async function preview() {
  window.open(generatePreviewURL(await inlineAssets(page.value)), '_blank')
}
</script>

<template>
  <div class="shell">
    <PlatformHeader />
    <main class="page">
      <header class="head">
        <div><h1>设计转代码</h1><p>当前项目的页面，按风格库 Token 生成 Vue 组件、CSS 与 Design DSL</p></div>
        <div class="actions">
          <button type="button" class="ghost" @click="download">下载 {{ FILE[tab].name }}</button>
          <button type="button" class="solid" @click="preview">在新窗口预览</button>
        </div>
      </header>

      <div class="cols">
        <section class="pages">
          <small>页面与组件</small>
          <button v-for="(p, index) in pages" :key="p.id" type="button" :class="{ on: index === picked }" @click="picked = index">
            <span>{{ p.name }}</span><em>{{ count(p.components) }} 个组件</em>
          </button>
          <div class="card"><strong>映射规则</strong><p>每个组件生成一个 Ud 前缀的 Vue 组件标签，样式里的 Token 保留为 CSS 变量，未登记的取值会在走查里标出。</p></div>
        </section>

        <section class="code">
          <div class="tabs" role="tablist" aria-label="输出格式">
            <button v-for="t in (['vue', 'css', 'dsl'] as const)" :key="t" role="tab" type="button" :aria-selected="tab === t" :class="{ on: tab === t }" @click="tab = t">{{ t === 'dsl' ? 'DSL' : t === 'css' ? 'CSS' : 'Vue' }}</button>
          </div>
          <pre><code>{{ code[tab] }}</code></pre>
          <footer><span>由页面 Schema 生成，节点与风格库 Token 一一对应</span><button type="button" class="ghost" @click="copy">复制代码</button></footer>
        </section>

        <section class="rail">
          <div class="card">
            <strong>走查清单</strong>
            <div v-for="c in checks" :key="c.label" class="check" :class="{ bad: !c.ok }"><i :class="c.ok ? 'i-tabler-check' : 'i-tabler-alert-triangle'" />{{ c.label }}</div>
            <small v-if="violations.length">可以到编辑器的 AI 面板一键修正偏离项。</small>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.shell{min-height:100%;background:var(--surface-0,#f5f5f5)}
.page{max-width:1380px;margin:auto;padding:20px 28px 44px;display:flex;flex-direction:column;gap:16px}
.head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}.head h1{margin:0;font-size:20px}.head p{margin:4px 0 0;color:#8c8c8c;font-size:12px}.actions{display:flex;gap:8px}
.ghost{border:1px solid #d9d9d9;background:#fff;color:#434343;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:13px}
.solid{border:0;background:#1677ff;color:#fff;border-radius:6px;padding:6px 14px;font-weight:600;cursor:pointer;font-size:13px}
.cols{display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start}
.pages{flex:0 0 260px;display:flex;flex-direction:column;gap:10px}.pages small{font-size:12px;color:#8c8c8c}
.pages>button{display:flex;justify-content:space-between;gap:8px;border:1px solid #f0f0f0;background:#fff;border-radius:12px;padding:10px 12px;cursor:pointer;text-align:left;font-size:13px;color:#434343}
.pages>button.on{background:#e6f4ff;color:#1f1f1f}.pages em{font-style:normal;font-size:12px;color:#8c8c8c}
.code{flex:1 1 480px;min-width:0;background:#fff;border:1px solid #f0f0f0;border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
.tabs{display:flex;gap:4px;padding:8px;border-bottom:1px solid #f0f0f0}.tabs button{border:0;background:transparent;border-radius:6px;padding:5px 14px;font-size:13px;color:#434343;cursor:pointer}.tabs button.on{background:#1677ff;color:#fff}
pre{margin:0;padding:16px;overflow:auto;max-height:620px;font:13px/1.65 ui-monospace,SFMono-Regular,Menlo,monospace;color:#434343}
.code footer{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px 14px;border-top:1px solid #f0f0f0;font-size:12px;color:#8c8c8c}.code footer .ghost{padding:3px 12px;font-size:12px}
.rail{flex:0 1 300px;min-width:260px;display:flex;flex-direction:column;gap:12px}
.card{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:8px;font-size:13px;color:#434343}.card strong{color:#1f1f1f}.card p{margin:0}.card small{color:#8c8c8c;font-size:12px}
.check{display:flex;align-items:center;gap:8px;color:#237804}.check.bad{color:#ad6800}
</style>
