<script setup lang="ts">
/**
 * 独立预览页面
 */
import { ref, onMounted } from 'vue'
import { parsePreviewURL } from '@/utils/export'
import type { PageSchema } from '@/types/schema'
import PageRenderer from '@/components/renderer/PageRenderer.vue'
import { ElEmpty } from 'element-plus'

// 页面数据
const pageSchema = ref<PageSchema | null>(null)

// 加载页面数据
onMounted(() => {
  // 从 URL 参数解析页面数据
  const data = parsePreviewURL()
  if (data) {
    pageSchema.value = data
  }
})
</script>

<template>
  <div class="preview-view">
    <div v-if="!pageSchema" class="empty-state">
      <ElEmpty description="无效的预览链接" />
    </div>

    <div v-else class="preview-container">
      <PageRenderer
        :schema="pageSchema"
        :is-editing="false"
      />
    </div>
  </div>
</template>

<style scoped>
.preview-view {
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  padding: 40px;
}

.preview-container {
  width: 100%;
  max-width: 750px;
  min-height: 100vh;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 750px) {
  .preview-container {
    max-width: 100%;
    box-shadow: none;
  }
}
</style>
