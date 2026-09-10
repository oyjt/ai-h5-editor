<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { PageSchema } from '@/types/schema'
import { useEditorStore } from '@/stores/editor'

const editorStore = useEditorStore()
const fallbackHeroUrl = `${import.meta.env.BASE_URL}marketing/summer-hero.jpg`
const pages = computed(() => editorStore.pages)

function pageThumbnail(page: PageSchema) {
  const image = page.components.find(component => component.type === 'image' && component.props?.src)
  return String(image?.props?.src || fallbackHeroUrl)
}
function handleAddPage() { editorStore.addPage(); ElMessage.success('已新增页面') }
function handleDuplicate(index: number, event: Event) { event.stopPropagation(); editorStore.duplicatePage(index); ElMessage.success('页面已复制') }
function handleMove(index: number, direction: 'up' | 'down', event: Event) {
  event.stopPropagation()
  if (editorStore.movePage(index, direction)) ElMessage.success(direction === 'up' ? '页面已上移' : '页面已下移')
}
async function handleRename(index: number, event?: Event) {
  event?.stopPropagation()
  const page = editorStore.pages[index]
  if (!page) return
  try {
    const { value } = await ElMessageBox.prompt('输入新的页面名称', '重命名页面', {
      inputValue: page.name || `页面 ${index + 1}`,
      inputPattern: /\S+/,
      inputErrorMessage: '页面名称不能为空',
      confirmButtonText: '保存',
      cancelButtonText: '取消',
    })
    editorStore.renamePage(index, value)
    ElMessage.success('页面名称已更新')
  }
  catch {}
}
async function handleDelete(index: number, event: Event) {
  event.stopPropagation()
  if (editorStore.pages.length <= 1) return ElMessage.warning('至少保留一个页面')
  try {
    await ElMessageBox.confirm(`确定删除“${editorStore.pages[index]?.name || `页面 ${index + 1}`}”吗？`, '删除页面', {
      type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消',
    })
    editorStore.deletePage(index)
    ElMessage.success('页面已删除')
  }
  catch {}
}
</script>

<template>
  <aside class="page-manager-panel">
    <div class="panel-head">
      <div><strong>页面管理</strong><span>{{ pages.length }} 个页面</span></div>
      <button title="新增页面" @click="handleAddPage"><i class="i-tabler-plus" /></button>
    </div>

    <div class="page-list">
      <div v-for="(page, index) in pages" :key="page.id" class="page-card" :class="{ active: editorStore.currentPageIndex === index }" @click="editorStore.switchPage(index)" @dblclick="handleRename(index)">
        <span class="page-number">{{ index + 1 }}</span>
        <div class="thumb-shell">
          <div class="thumb-preview" :class="{ empty: page.components.length === 0 }">
            <img v-if="page.components.length" :src="pageThumbnail(page)" alt="页面缩略图">
            <template v-if="page.components.length">
              <div class="thumb-coupon"><i /><i /><i /></div>
              <div class="thumb-product"><i /><i /></div>
              <div class="thumb-form" />
            </template>
            <i v-else class="i-tabler-file-plus empty-icon" />
          </div>
          <div class="thumb-overlay">
            <button title="编辑页面" @click.stop="editorStore.switchPage(index)"><i class="i-tabler-pencil" /></button>
          </div>
        </div>
        <strong class="page-name" :title="page.name || `页面 ${index + 1}`">{{ page.name || `页面 ${index + 1}` }}</strong>
        <span class="page-meta">{{ page.components.length }} 个组件</span>
        <div class="page-actions">
          <button title="上移" :disabled="index === 0" @click="handleMove(index, 'up', $event)"><i class="i-tabler-arrow-up" /></button>
          <button title="下移" :disabled="index === pages.length - 1" @click="handleMove(index, 'down', $event)"><i class="i-tabler-arrow-down" /></button>
          <button title="重命名" @click="handleRename(index, $event)"><i class="i-tabler-pencil" /></button>
          <button title="复制页面" @click="handleDuplicate(index, $event)"><i class="i-tabler-copy" /></button>
          <button class="danger" title="删除页面" :disabled="pages.length <= 1" @click="handleDelete(index, $event)"><i class="i-tabler-trash" /></button>
        </div>
      </div>
    </div>

    <button class="add-page-card" @click="handleAddPage"><span class="add-icon"><i class="i-tabler-plus" /></span><span>新增页面</span><small>创建空白 H5 页面</small></button>
  </aside>
</template>

<style scoped>
.page-manager-panel{width:132px;min-width:132px;height:100%;display:flex;flex-direction:column;background:var(--surface-1,#fff);border-right:1px solid var(--border-subtle,#e7edf5);box-shadow:var(--shadow-sidebar,3px 0 12px rgba(44,67,96,.025));position:relative;z-index:12}.panel-head{height:56px;flex:0 0 56px;padding:0 12px 0 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border-subtle,#edf1f6)}.panel-head>div{min-width:0;display:flex;flex-direction:column}.panel-head strong{font-size:12px;line-height:18px;color:var(--text-strong,#203149);font-weight:700}.panel-head span{font-size:9px;color:var(--text-muted,#98a5b5);margin-top:1px}.panel-head button{width:28px;height:28px;border:1px solid transparent;border-radius:7px;background:var(--fill-soft,#f3f7fc);color:#66768a;display:grid;place-items:center;cursor:pointer;transition:.16s ease}.panel-head button:hover{background:#eaf2ff;color:#1769ff;border-color:#cfe0ff}.page-list{flex:1;min-height:0;overflow:auto;padding:12px 9px 8px;display:flex;flex-direction:column;gap:10px;scrollbar-width:none}.page-list::-webkit-scrollbar{width:0}.page-card{position:relative;width:100%;padding:6px 6px 8px;border:1px solid transparent;border-radius:10px;background:transparent;cursor:pointer;text-align:center;transition:background .16s ease,border-color .16s ease,box-shadow .16s ease,transform .16s ease}.page-card:hover{background:#f8faff;border-color:#dbe7f6}.page-card.active{background:#f5f9ff;border-color:#73a8ff;box-shadow:0 0 0 2px rgba(23,105,255,.08)}.page-number{position:absolute;left:-6px;top:10px;min-width:18px;height:18px;padding:0 3px;border-radius:5px;background:#eef3f9;color:#7b8ba0;font-size:8px;line-height:18px;z-index:3}.page-card.active .page-number{background:#1769ff;color:#fff}.thumb-shell{position:relative;padding:2px;border-radius:6px;background:#fff;border:1px solid #e8edf4;box-shadow:0 2px 7px rgba(46,65,88,.04);overflow:hidden}.thumb-preview{height:120px;border-radius:4px;overflow:hidden;background:#fff;padding:2px}.thumb-preview.empty{display:grid;place-items:center;background:#f7f9fc}.empty-icon{font-size:22px;color:#a8b5c5}.thumb-preview img{display:block;width:100%;height:49px;object-fit:cover;border-radius:2px}.thumb-coupon{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:2px}.thumb-coupon i{height:14px;border-radius:2px;background:#ffe0d9}.thumb-product{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-top:2px}.thumb-product i{height:28px;border-radius:2px;background:#eaf1f8}.thumb-form{height:19px;margin-top:2px;border-radius:2px;background:#e7f1ff}.thumb-overlay{position:absolute;inset:0;display:grid;place-items:center;background:rgba(19,36,60,.48);opacity:0;transition:.16s ease}.page-card:hover .thumb-overlay{opacity:1}.thumb-overlay button{width:28px;height:28px;border:0;border-radius:50%;background:#fff;color:#1769ff;display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 14px rgba(20,40,70,.18)}.page-name{display:block;margin-top:6px;padding:0 4px;font-size:9px;line-height:14px;font-weight:600;color:#53657a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-card.active .page-name{color:#1769ff}.page-meta{display:block;font-size:8px;color:#a0adbd;margin-top:1px}.page-actions{position:absolute;left:6px;right:6px;bottom:6px;height:26px;padding:3px;display:flex;align-items:center;justify-content:center;gap:2px;border:1px solid #e7edf5;border-radius:7px;background:rgba(255,255,255,.97);box-shadow:0 8px 18px rgba(44,67,96,.12);opacity:0;transform:translateY(4px);pointer-events:none;transition:.16s ease}.page-card:hover .page-actions,.page-card.active:focus-within .page-actions{opacity:1;transform:none;pointer-events:auto}.page-actions button{width:20px;height:20px;border:0;border-radius:4px;background:transparent;color:#738398;display:grid;place-items:center;font-size:10px;cursor:pointer}.page-actions button:hover{background:#eef5ff;color:#1769ff}.page-actions button.danger:hover{background:#fff0f0;color:#ef4444}.page-actions button:disabled{opacity:.28;cursor:not-allowed;background:transparent;color:#9aa7b7}.add-page-card{height:82px;flex:0 0 82px;margin:8px 9px 12px;border:1px dashed #cbd6e3;border-radius:10px;background:#fbfcfe;color:#75869a;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;cursor:pointer;font-size:9px;transition:.16s ease}.add-page-card .add-icon{width:24px;height:24px;border-radius:7px;background:#eef4ff;color:#1769ff;display:grid;place-items:center;margin-bottom:1px}.add-page-card small{font-size:8px;color:#a2afbf}.add-page-card:hover{background:#f4f8ff;border-color:#82aff9;color:#1769ff;transform:translateY(-1px)}@media(max-width:1440px){.page-manager-panel{width:114px;min-width:114px}.page-list{padding-left:7px;padding-right:7px}.thumb-preview{height:104px}.thumb-preview img{height:44px}.thumb-product i{height:23px}.page-actions{left:4px;right:4px}.page-actions button{width:17px}.add-page-card{margin-left:7px;margin-right:7px}}@media(max-height:780px){.panel-head{height:50px;flex-basis:50px}.thumb-preview{height:94px}.thumb-preview img{height:40px}.thumb-product i{height:20px}.add-page-card{height:66px;flex-basis:66px}.add-page-card small{display:none}}
</style>
