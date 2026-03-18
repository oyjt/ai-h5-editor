<script setup lang="ts">
/**
 * 模板市场页面
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTemplatesStore } from '@/stores/templates'
import { useEditorStore } from '@/stores/editor'
import { TemplateCategory } from '@/types/template'
import { ElInput, ElButton, ElCard, ElTag, ElEmpty, ElMessage } from 'element-plus'

const router = useRouter()
const templatesStore = useTemplatesStore()
const editorStore = useEditorStore()

// 搜索关键词
const searchKeyword = ref('')

// 当前分类
const currentCategory = ref<TemplateCategory | 'all'>('all')

// 分类列表
const categories = [
  { value: 'all', label: '全部模板', icon: 'i-tabler-layout-grid' },
  { value: TemplateCategory.Marketing, label: '营销活动', icon: 'i-tabler-speakerphone' },
  { value: TemplateCategory.Product, label: '产品展示', icon: 'i-tabler-shopping-cart' },
  { value: TemplateCategory.Form, label: '表单收集', icon: 'i-tabler-forms' },
  { value: TemplateCategory.Article, label: '文章资讯', icon: 'i-tabler-news' },
  { value: TemplateCategory.Other, label: '其他', icon: 'i-tabler-dots' },
]

// 过滤后的模板列表
const filteredTemplates = computed(() => {
  let list = templatesStore.getAllTemplatesList()

  // 按分类过滤
  if (currentCategory.value !== 'all') {
    list = list.filter(t => t.category === currentCategory.value)
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    list = templatesStore.searchTemplates(searchKeyword.value)
  }

  return list
})

// 应用模板
function applyTemplate(templateId: string) {
  const template = templatesStore.getTemplateById(templateId)
  if (!template) {
    ElMessage.error('模板不存在')
    return
  }

  // 应用模板到编辑器
  editorStore.setCurrentPage(template.schema)

  ElMessage.success(`已应用模板：${template.name}`)

  // 跳转到编辑器
  router.push('/')
}

// 页面加载时加载自定义模板
onMounted(() => {
  templatesStore.loadCustomTemplates()
})
</script>

<template>
  <div class="template-view">
    <!-- 顶部导航 -->
    <div class="template-header">
      <div class="header-left">
        <ElButton text @click="router.push('/')">
          <i class="i-tabler-arrow-left" />
          返回编辑器
        </ElButton>
      </div>
      <h2 class="header-title">
        模板市场
      </h2>
      <div class="header-right" />
    </div>

    <!-- 搜索和分类 -->
    <div class="template-filters">
      <div class="search-box">
        <ElInput
          v-model="searchKeyword"
          placeholder="搜索模板..."
          clearable
        >
          <template #prefix>
            <i class="i-tabler-search" />
          </template>
        </ElInput>
      </div>

      <div class="category-tabs">
        <div
          v-for="cat in categories"
          :key="cat.value"
          class="category-tab"
          :class="{ active: currentCategory === cat.value }"
          @click="currentCategory = cat.value"
        >
          <i :class="cat.icon" />
          <span>{{ cat.label }}</span>
        </div>
      </div>
    </div>

    <!-- 模板列表 -->
    <div class="template-content">
      <div v-if="filteredTemplates.length === 0" class="empty-state">
        <ElEmpty description="没有找到相关模板" />
      </div>

      <div v-else class="template-grid">
        <ElCard
          v-for="template in filteredTemplates"
          :key="template.id"
          class="template-card"
          shadow="hover"
        >
          <div class="card-thumbnail">
            <img :src="template.thumbnail" :alt="template.name">
            <div class="card-overlay">
              <ElButton type="primary" @click="applyTemplate(template.id)">
                使用模板
              </ElButton>
            </div>
          </div>

          <div class="card-content">
            <h3 class="card-title">
              {{ template.name }}
            </h3>
            <p class="card-description">
              {{ template.description }}
            </p>
            <div class="card-tags">
              <ElTag
                v-for="tag in template.tags"
                :key="tag"
                size="small"
                type="info"
              >
                {{ tag }}
              </ElTag>
            </div>
          </div>
        </ElCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.template-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.template-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.header-left,
.header-right {
  flex: 1;
}

.header-right {
  display: flex;
  justify-content: flex-end;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.template-filters {
  padding: 20px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.search-box {
  max-width: 400px;
  margin-bottom: 20px;
}

.category-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f5f7fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: #606266;
}

.category-tab:hover {
  background: #e4e7ed;
}

.category-tab.active {
  background: #409eff;
  color: #fff;
}

.category-tab i {
  font-size: 16px;
}

.template-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.template-card {
  cursor: pointer;
  transition: all 0.3s;
}

.template-card:hover {
  transform: translateY(-4px);
}

.card-thumbnail {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 4px;
  background: #f5f7fa;
}

.card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.template-card:hover .card-overlay {
  opacity: 1;
}

.card-content {
  padding: 16px 0 0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.card-description {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
</style>
