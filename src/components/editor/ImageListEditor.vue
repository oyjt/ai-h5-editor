<script setup lang="ts">
/**
 * 图片列表编辑器 - 支持添加、删除、排序图片
 */
import { ref, watch } from 'vue'
import { ElButton, ElInput, ElMessage } from 'element-plus'
import { VueDraggable } from 'vue-draggable-plus'

interface Props {
  modelValue: string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

// 本地图片列表
const images = ref<string[]>([...props.modelValue])

// 监听外部变化
watch(() => props.modelValue, (newVal) => {
  images.value = [...newVal]
}, { deep: true })

// 新图片URL输入
const newImageUrl = ref('')

// 编辑状态
const editingIndex = ref<number | null>(null)
const editingUrl = ref('')

// 添加图片
function addImage() {
  const url = newImageUrl.value.trim()
  if (!url) {
    ElMessage.warning('请输入图片地址')
    return
  }

  images.value.push(url)
  newImageUrl.value = ''
  updateValue()
}

// 删除图片
function removeImage(index: number) {
  images.value.splice(index, 1)
  updateValue()
}

// 开始编辑
function startEdit(index: number) {
  editingIndex.value = index
  editingUrl.value = images.value[index]
}

// 保存编辑
function saveEdit() {
  if (editingIndex.value !== null) {
    const url = editingUrl.value.trim()
    if (url) {
      images.value[editingIndex.value] = url
      updateValue()
    }
    cancelEdit()
  }
}

// 取消编辑
function cancelEdit() {
  editingIndex.value = null
  editingUrl.value = ''
}

// 更新值
function updateValue() {
  emit('update:modelValue', [...images.value])
}

// 拖拽结束回调
function onDragEnd() {
  updateValue()
}

// 图片加载错误处理
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f5f5f5" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="14"%3E加载失败%3C/text%3E%3C/svg%3E'
}
</script>

<template>
  <div class="image-list-editor">
    <!-- 图片列表 -->
    <VueDraggable
      v-if="images.length > 0"
      v-model="images"
      :animation="150"
      handle=".drag-handle"
      class="image-list"
      @end="onDragEnd"
    >
      <div
        v-for="(url, index) in images"
        :key="index"
        class="image-item"
      >
        <!-- 拖拽手柄 -->
        <div class="drag-handle">
          <i class="i-tabler-grip-vertical" />
        </div>

        <!-- 图片预览 -->
        <div class="image-preview">
          <img :src="url" :alt="`图片 ${index + 1}`" @error="handleImageError">
        </div>

        <!-- 图片信息 -->
        <div class="image-info">
          <div v-if="editingIndex === index" class="edit-mode">
            <ElInput
              v-model="editingUrl"
              size="small"
              placeholder="图片地址"
              @keyup.enter="saveEdit"
              @keyup.esc="cancelEdit"
            />
            <div class="edit-actions">
              <ElButton size="small" type="primary" @click="saveEdit">
                保存
              </ElButton>
              <ElButton size="small" @click="cancelEdit">
                取消
              </ElButton>
            </div>
          </div>
          <div v-else class="view-mode">
            <div class="image-url" :title="url">
              {{ url }}
            </div>
            <div class="image-actions">
              <button class="action-btn" @click="startEdit(index)">
                <i class="i-tabler-edit" />
              </button>
              <button class="action-btn delete" @click="removeImage(index)">
                <i class="i-tabler-trash" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </VueDraggable>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <i class="i-tabler-photo-off" />
      <p>暂无图片</p>
    </div>

    <!-- 添加图片 -->
    <div class="add-image">
      <ElInput
        v-model="newImageUrl"
        placeholder="输入图片 URL 后按回车或点击添加"
        clearable
        @keyup.enter="addImage"
      >
        <template #prepend>
          <i class="i-tabler-link" />
        </template>
      </ElInput>
      <ElButton type="primary" :disabled="!newImageUrl.trim()" @click="addImage">
        <i class="i-tabler-plus mr-4px" />
        添加
      </ElButton>
    </div>

    <!-- 提示信息 -->
    <div class="tips">
      <i class="i-tabler-info-circle" />
      <span>拖拽图片可调整顺序</span>
    </div>
  </div>
</template>

<style scoped>
.image-list-editor {
  width: 100%;
}

.image-list {
  margin-bottom: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-button);
  overflow: hidden;
}

.image-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--editor-bg-primary);
  border-bottom: 1px solid var(--border-color);
  transition: background 0.2s;
}

.image-item:last-child {
  border-bottom: none;
}

.image-item:hover {
  background: var(--editor-bg-secondary);
}

.drag-handle {
  flex-shrink: 0;
  width: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  cursor: grab;
  font-size: 16px;
}

.drag-handle:active {
  cursor: grabbing;
}

.image-preview {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: var(--radius-button);
  overflow: hidden;
  background: var(--editor-bg-secondary);
  border: 1px solid var(--border-color);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-info {
  flex: 1;
  min-width: 0;
}

.view-mode {
  display: flex;
  align-items: center;
  gap: 8px;
}

.image-url {
  flex: 1;
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: var(--radius-button);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 16px;
}

.action-btn:hover {
  background: var(--editor-bg-tertiary);
  color: var(--text-primary);
}

.action-btn.delete:hover {
  background: #fef0f0;
  color: #f56c6c;
}

.edit-mode {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-actions {
  display: flex;
  gap: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-button);
  color: var(--text-tertiary);
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.add-image {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.add-image :deep(.el-input-group__prepend) {
  padding: 0 12px;
  background: var(--editor-bg-secondary);
}

.tips {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--editor-bg-secondary);
  border-radius: var(--radius-button);
  font-size: 12px;
  color: var(--text-tertiary);
}

.tips i {
  font-size: 14px;
}
</style>
