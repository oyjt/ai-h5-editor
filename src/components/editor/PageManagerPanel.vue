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

function handleAddPage() {
  editorStore.addPage()
  ElMessage.success('已新增页面')
}

function handleDuplicate(index: number, event: Event) {
  event.stopPropagation()
  editorStore.duplicatePage(index)
  ElMessage.success('页面已复制')
}

async function handleDelete(index: number, event: Event) {
  event.stopPropagation()
  if (editorStore.pages.length <= 1) {
    ElMessage.warning('至少保留一个页面')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定删除“${editorStore.pages[index]?.name || `页面 ${index + 1}`}”吗？`,
      '删除页面',
      { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' },
    )
    editorStore.deletePage(index)
    ElMessage.success('页面已删除')
  }
  catch {}
}
</script>

<template>
  <aside class="page-manager-panel">
    <div class="panel-head">
      <div>
        <strong>页面管理</strong>
        <span>{{ pages.length }} 个页面</span>
      </div>
      <button title="新增页面" @click="handleAddPage">
        <i class="i-tabler-plus" />
      </button>
    </div>

    <div class="page-list">
      <button
        v-for="(page, index) in pages"
        :key="page.id"
        class="page-card"
        :class="{ active: editorStore.currentPageIndex === index }"
        @click="editorStore.switchPage(index)"
      >
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
        </div>
        <strong class="page-name">{{ page.name || `页面 ${index + 1}` }}</strong>
        <span class="page-actions">
          <i class="i-tabler-copy" title="复制页面" @click="handleDuplicate(index, $event)" />
          <i class="i-tabler-trash" title="删除页面" @click="handleDelete(index, $event)" />
        </span>
      </button>
    </div>

    <button class="add-page-card" @click="handleAddPage">
      <i class="i-tabler-plus" />
      <span>新增页面</span>
    </button>
  </aside>
</template>

<style scoped>
.page-manager-panel{width:124px;min-width:124px;height:100%;display:flex;flex-direction:column;background:#fff;border-right:1px solid #e7edf5;box-shadow:3px 0 12px rgba(44,67,96,.025);position:relative;z-index:12}.panel-head{height:52px;flex:0 0 52px;padding:0 12px 0 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #edf1f6}.panel-head>div{min-width:0;display:flex;flex-direction:column}.panel-head strong{font-size:12px;line-height:18px;color:#203149;font-weight:700}.panel-head span{font-size:9px;color:#98a5b5;margin-top:1px}.panel-head button{width:26px;height:26px;border:0;border-radius:6px;background:#f3f7fc;color:#66768a;display:grid;place-items:center;cursor:pointer}.panel-head button:hover{background:#eaf2ff;color:#1769ff}.page-list{flex:1;min-height:0;overflow:auto;padding:12px 10px 6px;display:flex;flex-direction:column;gap:11px;scrollbar-width:none}.page-list::-webkit-scrollbar{width:0}.page-card{position:relative;width:100%;padding:5px 5px 7px;border:1px solid transparent;border-radius:8px;background:transparent;cursor:pointer;text-align:center;transition:border-color .15s ease,background .15s ease,box-shadow .15s ease}.page-card:hover{background:#f8faff;border-color:#dbe7f6}.page-card.active{background:#f5f9ff;border-color:#73a8ff;box-shadow:0 0 0 2px rgba(23,105,255,.08)}.page-number{position:absolute;left:-7px;top:9px;width:16px;height:16px;border-radius:4px;background:#eef3f9;color:#7b8ba0;font-size:8px;line-height:16px;z-index:2}.page-card.active .page-number{background:#1769ff;color:#fff}.thumb-shell{padding:2px;border-radius:5px;background:#fff;border:1px solid #e8edf4;box-shadow:0 2px 7px rgba(46,65,88,.04)}.thumb-preview{height:116px;border-radius:3px;overflow:hidden;background:#fff;padding:2px}.thumb-preview.empty{display:grid;place-items:center;background:#f7f9fc}.empty-icon{font-size:22px;color:#a8b5c5}.thumb-preview img{display:block;width:100%;height:48px;object-fit:cover;border-radius:2px}.thumb-coupon{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:2px}.thumb-coupon i{height:14px;border-radius:2px;background:#ffe0d9}.thumb-product{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-top:2px}.thumb-product i{height:27px;border-radius:2px;background:#eaf1f8}.thumb-form{height:18px;margin-top:2px;border-radius:2px;background:#e7f1ff}.page-name{display:block;margin-top:6px;padding:0 12px;font-size:9px;line-height:14px;font-weight:500;color:#53657a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.page-card.active .page-name{color:#1769ff;font-weight:600}.page-actions{position:absolute;right:5px;bottom:5px;display:flex;gap:3px;opacity:0;transform:translateY(2px);transition:.15s ease}.page-card:hover .page-actions{opacity:1;transform:none}.page-actions i{width:18px;height:18px;border-radius:4px;background:rgba(255,255,255,.94);border:1px solid #e4eaf2;color:#738398;display:grid;place-items:center;font-size:10px}.page-actions i:hover{color:#1769ff;border-color:#a9c9ff}.page-actions .i-tabler-trash:hover{color:#ef4444;border-color:#ffcaca}.add-page-card{height:72px;flex:0 0 72px;margin:8px 10px 12px;border:1px dashed #cbd6e3;border-radius:8px;background:#fbfcfe;color:#8795a8;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;font-size:9px}.add-page-card i{font-size:19px}.add-page-card:hover{background:#f4f8ff;border-color:#82aff9;color:#1769ff}@media(max-width:1440px){.page-manager-panel{width:108px;min-width:108px}.page-list{padding-left:7px;padding-right:7px}.thumb-preview{height:102px}.thumb-preview img{height:43px}.thumb-product i{height:23px}.add-page-card{margin-left:7px;margin-right:7px}}
</style>
