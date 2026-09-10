<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PlatformHeader from '@/components/platform/PlatformHeader.vue'

const keyword = ref('')
const category = ref('图片')
const page = ref(1)
const categories = ['图片', '图标', '插画', '视频', '音频', '我的上传']
const assets = ref([
  { name: '海岛夏日', type: '图片', size: '245 KB', theme: 'sea' },
  { name: '绿植光影', type: '图片', size: '186 KB', theme: 'green' },
  { name: '咖啡甜点', type: '图片', size: '172 KB', theme: 'coffee' },
  { name: '建筑空间', type: '图片', size: '210 KB', theme: 'building' },
  { name: '城市夜景', type: '图片', size: '268 KB', theme: 'city' },
  { name: '夏日饮品', type: '图片', size: '132 KB', theme: 'drink' },
  { name: '旅行风景', type: '图片', size: '320 KB', theme: 'travel' },
  { name: '产品静物', type: '图片', size: '154 KB', theme: 'product' },
  { name: '营销图标集', type: '图标', size: '32 KB', theme: 'icon' },
  { name: '节日插画包', type: '插画', size: '1.2 MB', theme: 'illustration' },
  { name: '品牌宣传视频', type: '视频', size: '8.4 MB', theme: 'video' },
  { name: '轻快背景音乐', type: '音频', size: '3.6 MB', theme: 'audio' },
])

const filtered = computed(() => assets.value.filter((item) => {
  const matchType = category.value === '我的上传' ? true : item.type === category.value
  return matchType && item.name.includes(keyword.value.trim())
}))

function upload() {
  ElMessage.success('已添加到素材库（演示）')
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
          <div class="tabs"><button v-for="item in categories" :key="item" :class="{ active: category === item }" @click="category = item; page = 1">{{ item }}</button></div>
          <label class="search"><i class="i-tabler-search" /><input v-model="keyword" placeholder="搜索素材..." /></label>
        </div>

        <div v-if="filtered.length" class="grid">
          <article v-for="item in filtered" :key="`${item.type}-${item.name}`" class="asset-card">
            <div class="preview" :class="item.theme">
              <i v-if="item.type !== '图片'" :class="item.type === '视频' ? 'i-tabler-player-play-filled' : item.type === '音频' ? 'i-tabler-music' : item.type === '插画' ? 'i-tabler-brush' : 'i-tabler-icons'" />
              <div class="asset-check"><i class="i-tabler-check" /></div>
              <div class="hover-actions"><button title="预览"><i class="i-tabler-eye" /></button><button title="添加到页面"><i class="i-tabler-plus" /></button></div>
            </div>
            <div class="meta"><strong>{{ item.name }}</strong><span>{{ item.type }} · {{ item.size }}</span></div>
            <button class="more" aria-label="更多操作">•••</button>
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
.shell{min-height:100%;background:var(--surface-0)}.page{max-width:1380px;margin:auto;padding:28px 32px 48px}.page-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}.page-head h1{font-size:24px;margin:0 0 6px;color:var(--text-strong)}.page-head p{margin:0;color:var(--text-muted);font-size:var(--font-size-md)}.primary{height:var(--control-height-lg);border:0;border-radius:var(--radius-md);background:var(--brand-600);color:#fff;padding:0 16px;box-shadow:var(--shadow-brand);cursor:pointer}.panel{background:var(--surface-1);border:1px solid var(--border-subtle);border-radius:var(--radius-xl);padding:0 20px 18px;box-shadow:var(--shadow-xs)}.toolbar{min-height:64px;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center}.tabs{display:flex;align-self:stretch;gap:24px}.tabs button{height:64px;border:0;border-bottom:2px solid transparent;background:transparent;color:var(--text-secondary);font-size:var(--font-size-md);cursor:pointer}.tabs button:hover{color:var(--brand-600)}.tabs button.active{border-bottom-color:var(--brand-600);color:var(--brand-600);font-weight:600}.search{width:230px;height:var(--control-height-md);border:1px solid var(--border-default);border-radius:var(--radius-md);display:flex;align-items:center;padding:0 10px;color:var(--text-muted);background:var(--surface-2);transition:all var(--motion-base) var(--ease-standard)}.search:focus-within{background:var(--surface-1);border-color:var(--border-brand);box-shadow:var(--focus-ring)}.search input{border:0;outline:0;width:100%;margin-left:6px;background:transparent;color:var(--text-primary);font-size:var(--font-size-md)}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:18px 0}.asset-card,.upload-card{border:1px solid var(--border-subtle);border-radius:var(--radius-lg);overflow:hidden;background:var(--surface-1);position:relative;transition:all var(--motion-base) var(--ease-standard)}.asset-card:hover{transform:translateY(-2px);border-color:var(--border-brand);box-shadow:var(--shadow-sm)}.preview{height:154px;position:relative;display:grid;place-items:center;font-size:32px;color:#fff;overflow:hidden;background:linear-gradient(145deg,#79cbff,#bceee2)}.preview.sea{background:linear-gradient(145deg,#59c8ff,#bdeeff 52%,#ffe2a2)}.preview.green{background:linear-gradient(145deg,#4f8d5a,#c3dfb4)}.preview.coffee{background:linear-gradient(145deg,#7f593e,#e6c5a0)}.preview.building{background:linear-gradient(145deg,#7f9db6,#d7e2eb)}.preview.city{background:linear-gradient(145deg,#293b63,#8e73bc)}.preview.drink{background:linear-gradient(145deg,#f3a65a,#ffe1a9)}.preview.travel{background:linear-gradient(145deg,#68b8e8,#a8dbbb)}.preview.product{background:linear-gradient(145deg,#f0ece7,#d5c7b9)}.preview.icon{background:linear-gradient(145deg,#7d6cf0,#c7bcff)}.preview.illustration{background:linear-gradient(145deg,#ff92b6,#ffd2a8)}.preview.video{background:linear-gradient(145deg,#ff8774,#ffcab0)}.preview.audio{background:linear-gradient(145deg,#5c7dff,#a7b7ff)}.asset-check{position:absolute;right:8px;top:8px;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:var(--brand-600);border:2px solid #fff;opacity:0;transform:scale(.8);transition:all var(--motion-base) var(--ease-standard);font-size:11px}.asset-card:hover .asset-check{opacity:1;transform:scale(1)}.hover-actions{position:absolute;inset:0;background:rgba(27,44,70,.34);display:flex;align-items:center;justify-content:center;gap:8px;opacity:0;transition:opacity var(--motion-base) var(--ease-standard)}.asset-card:hover .hover-actions{opacity:1}.hover-actions button{width:34px;height:34px;border:1px solid rgba(255,255,255,.7);border-radius:var(--radius-md);background:rgba(255,255,255,.92);color:var(--brand-600);cursor:pointer}.meta{padding:12px;display:flex;flex-direction:column}.meta strong{font-size:var(--font-size-base);color:var(--text-primary)}.meta span{font-size:var(--font-size-xs);color:var(--text-muted);margin-top:4px}.more{position:absolute;right:8px;bottom:13px;border:0;background:transparent;color:var(--text-muted);cursor:pointer}.upload-card{min-height:210px;border-style:dashed;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-muted);cursor:pointer}.upload-card:hover{background:var(--brand-50);border-color:var(--border-brand)}.upload-card i{font-size:30px;color:var(--brand-600)}.upload-card strong{margin-top:8px;font-size:var(--font-size-base);color:var(--text-secondary)}.upload-card span{font-size:var(--font-size-xs);margin-top:4px}.empty{height:320px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-muted)}.empty i{font-size:36px;color:var(--brand-300)}.empty strong{margin-top:9px;color:var(--text-secondary);font-size:13px}.empty span{font-size:10px;margin-top:4px}.pagination{padding-top:14px;border-top:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;color:var(--text-muted);font-size:var(--font-size-xs)}.pagination>div{display:flex;gap:5px;align-items:center}.pagination button{min-width:30px;height:30px;border:1px solid var(--border-default);border-radius:var(--radius-sm);background:var(--surface-1);color:var(--text-secondary);cursor:pointer}.pagination button:hover:not(:disabled),.pagination button.active{border-color:var(--border-brand);background:var(--brand-50);color:var(--brand-600)}.pagination button:disabled{opacity:.35;cursor:not-allowed}.pagination em{font-style:normal;padding:0 3px}@media(max-width:1180px){.grid{grid-template-columns:repeat(3,1fr)}.tabs{gap:14px}}@media(max-width:900px){.grid{grid-template-columns:repeat(2,1fr)}.toolbar{align-items:flex-start;gap:12px;flex-direction:column;padding:12px 0}.tabs{width:100%;overflow:auto}.tabs button{height:38px;white-space:nowrap}.search{width:100%}.page{padding:24px 20px}}
</style>
