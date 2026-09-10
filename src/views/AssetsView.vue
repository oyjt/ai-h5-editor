<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PlatformHeader from '@/components/platform/PlatformHeader.vue'

interface AssetItem {
  name: string
  type: string
  size: string
  src?: string
  icon?: string
  theme?: string
}

const keyword = ref('')
const category = ref('图片')
const page = ref(1)
const selectedName = ref('海岛夏日')
const categories = ['图片', '图标', '插画', '视频', '音频', '我的上传']

const assets = ref<AssetItem[]>([
  { name: '海岛夏日', type: '图片', size: '245 KB', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=82' },
  { name: '绿植光影', type: '图片', size: '186 KB', src: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=900&q=82' },
  { name: '咖啡甜点', type: '图片', size: '172 KB', src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=82' },
  { name: '建筑空间', type: '图片', size: '210 KB', src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=82' },
  { name: '城市夜景', type: '图片', size: '268 KB', src: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=82' },
  { name: '夏日饮品', type: '图片', size: '132 KB', src: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=82' },
  { name: '旅行风景', type: '图片', size: '320 KB', src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=82' },
  { name: '产品静物', type: '图片', size: '154 KB', src: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=82' },
  { name: '营销图标集', type: '图标', size: '32 KB', icon: 'i-tabler-icons', theme: 'violet' },
  { name: '节日插画包', type: '插画', size: '1.2 MB', icon: 'i-tabler-brush', theme: 'pink' },
  { name: '品牌宣传视频', type: '视频', size: '8.4 MB', icon: 'i-tabler-player-play-filled', theme: 'orange' },
  { name: '轻快背景音乐', type: '音频', size: '3.6 MB', icon: 'i-tabler-music', theme: 'blue' },
])

const filtered = computed(() => assets.value.filter((item) => {
  const matchType = category.value === '我的上传' ? true : item.type === category.value
  return matchType && item.name.includes(keyword.value.trim())
}))

function upload() {
  ElMessage.success('已添加到素材库（演示）')
}

function selectAsset(item: AssetItem) {
  selectedName.value = item.name
}

function previewAsset(item: AssetItem) {
  ElMessage.info(`预览：${item.name}`)
}

function addAsset(item: AssetItem) {
  ElMessage.success(`已添加到当前页面：${item.name}`)
}
</script>

<template>
  <div class="shell">
    <PlatformHeader />
    <main class="page">
      <div class="page-head">
        <div><h1>素材管理</h1><p>统一管理 H5 页面使用的图片、图标、插画、视频与音频资源</p></div>
        <button class="primary" @click="upload"><i class="i-tabler-upload" /> 上传素材</button>
      </div>

      <section class="panel">
        <div class="toolbar">
          <div class="tabs">
            <button v-for="item in categories" :key="item" :class="{ active: category === item }" @click="category = item; page = 1">{{ item }}</button>
          </div>
          <label class="search ds-search-field"><i class="i-tabler-search" /><input v-model="keyword" placeholder="搜索素材..." /></label>
        </div>

        <div v-if="filtered.length" class="grid">
          <article
            v-for="item in filtered"
            :key="`${item.type}-${item.name}`"
            class="asset-card"
            :class="{ selected: selectedName === item.name }"
            @click="selectAsset(item)"
          >
            <div class="preview" :class="item.theme">
              <img v-if="item.src" :src="item.src" :alt="item.name" loading="lazy">
              <i v-else :class="item.icon" class="type-icon" />

              <span v-if="selectedName === item.name" class="asset-check"><i class="i-tabler-check" /></span>

              <div class="hover-actions" @click.stop>
                <button type="button" title="预览素材" aria-label="预览素材" @click="previewAsset(item)"><i class="i-tabler-eye" /></button>
                <button type="button" title="添加到页面" aria-label="添加到页面" @click="addAsset(item)"><i class="i-tabler-plus" /></button>
              </div>
            </div>
            <div class="meta"><strong>{{ item.name }}</strong><span>{{ item.type }} · {{ item.size }}</span></div>
            <button class="more" aria-label="更多操作" @click.stop>•••</button>
          </article>

          <button class="upload-card" @click="upload"><i class="i-tabler-cloud-upload" /><strong>上传新素材</strong><span>支持 JPG、PNG、SVG、MP4、MP3</span></button>
        </div>

        <div v-else class="empty"><i class="i-tabler-photo-off" /><strong>暂无相关素材</strong><span>尝试切换分类或上传新的素材</span></div>

        <div class="pagination"><span>共 124 项</span><div><button :disabled="page === 1" @click="page--"><i class="i-tabler-chevron-left" /></button><button v-for="n in 5" :key="n" :class="{ active: page === n }" @click="page = n">{{ n }}</button><em>…</em><button @click="page = 20">20</button><button :disabled="page === 20" @click="page++"><i class="i-tabler-chevron-right" /></button></div></div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.shell{min-height:100%;background:var(--surface-0)}.page{max-width:1380px;margin:auto;padding:24px 28px 44px}.page-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.page-head h1{font-size:22px;margin:0 0 5px;color:var(--text-strong)}.page-head p{margin:0;color:var(--text-muted);font-size:var(--font-size-md)}.primary{height:36px;border:0;border-radius:var(--radius-md);background:var(--brand-600);color:#fff;padding:0 14px;box-shadow:var(--shadow-brand);cursor:pointer;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600}.primary:hover{background:var(--brand-500)}.panel{background:var(--surface-1);border:1px solid var(--border-subtle);border-radius:var(--radius-xl);padding:0 18px 16px;box-shadow:var(--shadow-xs)}.toolbar{min-height:58px;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;gap:20px}.tabs{display:flex;align-self:stretch;gap:20px;min-width:0}.tabs button{height:58px;border:0;border-bottom:2px solid transparent;background:transparent;color:var(--text-secondary);font-size:12px;cursor:pointer;padding:0 2px}.tabs button:hover{color:var(--brand-600)}.tabs button.active{border-bottom-color:var(--brand-600);color:var(--brand-600);font-weight:600}.search{width:244px;min-width:200px;height:34px;display:flex;align-items:center;padding:0 10px;color:var(--text-muted);flex:0 0 244px}.search input{width:100%;margin-left:6px;font-size:12px!important;line-height:1.4!important}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;padding:16px 0}.asset-card,.upload-card{border:1px solid var(--border-subtle);border-radius:var(--radius-lg);overflow:hidden;background:var(--surface-1);position:relative;transition:border-color var(--motion-base) var(--ease-standard),box-shadow var(--motion-base) var(--ease-standard),transform var(--motion-base) var(--ease-standard)}.asset-card{cursor:pointer}.asset-card:hover{transform:translateY(-2px);border-color:var(--border-brand);box-shadow:var(--shadow-sm)}.asset-card.selected{border-color:var(--brand-400);box-shadow:0 0 0 1px var(--brand-100)}.preview{height:148px;position:relative;display:grid;place-items:center;font-size:32px;color:#fff;overflow:hidden;background:var(--surface-3)}.preview img{width:100%;height:100%;display:block;object-fit:cover;transition:transform var(--motion-slow) var(--ease-standard)}.asset-card:hover .preview img{transform:scale(1.025)}.preview.violet{background:linear-gradient(145deg,#7d6cf0,#c7bcff)}.preview.pink{background:linear-gradient(145deg,#ff92b6,#ffd2a8)}.preview.orange{background:linear-gradient(145deg,#ff8774,#ffcab0)}.preview.blue{background:linear-gradient(145deg,#5c7dff,#a7b7ff)}.type-icon{font-size:34px;line-height:1}.asset-check{position:absolute;right:8px;top:8px;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:var(--brand-600);border:2px solid rgba(255,255,255,.96);font-size:11px;z-index:4;box-shadow:0 2px 8px rgba(23,105,255,.22)}.asset-check i{font-size:11px;line-height:1}.hover-actions{position:absolute;inset:0;background:rgba(24,39,62,.30);display:flex;align-items:center;justify-content:center;gap:8px;opacity:0;pointer-events:none;transition:opacity var(--motion-base) var(--ease-standard);z-index:3}.asset-card:hover .hover-actions{opacity:1;pointer-events:auto}.hover-actions button{width:36px;height:36px;padding:0;border:1px solid rgba(255,255,255,.78);border-radius:var(--radius-md);background:rgba(255,255,255,.96);color:var(--brand-600);cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;box-shadow:0 5px 14px rgba(24,39,62,.14);transition:transform var(--motion-fast),background-color var(--motion-fast),color var(--motion-fast)}.hover-actions button:hover{background:#fff;color:var(--brand-700);transform:translateY(-1px)}.hover-actions button i{font-size:18px;line-height:1;display:block}.meta{padding:11px 12px;display:flex;flex-direction:column;min-height:54px}.meta strong{font-size:12px;color:var(--text-primary);font-weight:600;line-height:1.35}.meta span{font-size:10px;color:var(--text-muted);margin-top:4px}.more{position:absolute;right:8px;bottom:12px;border:0;background:transparent;color:var(--text-muted);cursor:pointer;width:28px;height:28px;border-radius:var(--radius-sm);line-height:1}.more:hover{background:var(--surface-3);color:var(--text-secondary)}.upload-card{min-height:202px;border-style:dashed;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-muted);cursor:pointer}.upload-card:hover{background:var(--brand-50);border-color:var(--border-brand)}.upload-card i{font-size:29px;color:var(--brand-600)}.upload-card strong{margin-top:8px;font-size:12px;color:var(--text-secondary)}.upload-card span{font-size:10px;margin-top:4px}.empty{height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-muted)}.empty i{font-size:36px;color:var(--brand-300)}.empty strong{margin-top:9px;color:var(--text-secondary);font-size:13px}.empty span{font-size:10px;margin-top:4px}.pagination{padding-top:13px;border-top:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;color:var(--text-muted);font-size:10px}.pagination>div{display:flex;gap:5px;align-items:center}.pagination button{min-width:30px;height:30px;border:1px solid var(--border-default);border-radius:var(--radius-sm);background:var(--surface-1);color:var(--text-secondary);cursor:pointer}.pagination button:hover:not(:disabled),.pagination button.active{border-color:var(--border-brand);background:var(--brand-50);color:var(--brand-600)}.pagination button:disabled{opacity:.35;cursor:not-allowed}.pagination em{font-style:normal;padding:0 3px}@media(max-width:1180px){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}.tabs{gap:14px}.search{width:220px;flex-basis:220px}}@media(max-width:900px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.toolbar{align-items:flex-start;gap:12px;flex-direction:column;padding:12px 0}.tabs{width:100%;overflow:auto}.tabs button{height:38px;white-space:nowrap}.search{width:100%;min-width:0;flex-basis:auto}.page{padding:22px 20px}}
</style>
