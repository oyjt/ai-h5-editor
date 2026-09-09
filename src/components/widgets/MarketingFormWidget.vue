<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  namePlaceholder?: string
  phonePlaceholder?: string
  buttonText?: string
  accentColor?: string
  backgroundColor?: string
}

withDefaults(defineProps<Props>(), {
  title: '立即报名 领取专属福利',
  description: '填写信息，获取活动详情与限时优惠',
  namePlaceholder: '请输入您的姓名',
  phonePlaceholder: '请输入手机号',
  buttonText: '立即提交',
  accentColor: '#2878ff',
  backgroundColor: '#eef5ff',
})
</script>

<template>
  <section class="marketing-form" :style="{ backgroundColor }">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <div class="form-row">
      <input :placeholder="namePlaceholder" readonly>
      <input :placeholder="phonePlaceholder" readonly>
    </div>
    <button :style="{ backgroundColor: accentColor }">{{ buttonText }}</button>
  </section>
</template>

<style scoped>
.marketing-form { padding:14px; border-radius:14px; text-align:center; }
.marketing-form h3 { margin:0; color:#23407d; font-size:15px; font-weight:700; }
.marketing-form p { margin:5px 0 10px; color:#7b8cae; font-size:10px; }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:7px; }
.form-row input { width:100%; min-width:0; height:34px; border:1px solid #e3eaf5; border-radius:8px; background:#fff; padding:0 9px; color:#64748b; outline:none; font-size:10px; }
.marketing-form button { width:100%; height:36px; margin-top:9px; border:0; border-radius:18px; color:#fff; font-size:12px; font-weight:700; }
</style>
