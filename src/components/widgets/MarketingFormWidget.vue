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
      <label><i class="i-tabler-user" /><input :placeholder="namePlaceholder" readonly></label>
      <label><i class="i-tabler-device-mobile" /><input :placeholder="phonePlaceholder" readonly></label>
    </div>
    <button :style="{ backgroundColor: accentColor }">{{ buttonText }}</button>
  </section>
</template>

<style scoped>
.marketing-form{margin:7px 10px 6px;padding:11px;border-radius:11px;text-align:center;background:linear-gradient(180deg,#eaf4ff,#f6fbff)!important}.marketing-form h3{margin:0;color:#234b95;font-size:12px;font-weight:700}.marketing-form p{margin:3px 0 8px;color:#8b9ab2;font-size:8px}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:6px}.form-row label{height:30px;border:1px solid #e4ebf4;border-radius:6px;background:#fff;display:flex;align-items:center;padding:0 7px;gap:4px;color:#a3afbd}.form-row i{font-size:11px}.form-row input{width:100%;min-width:0;border:0;background:transparent;color:#64748b;outline:none;font-size:8px}.marketing-form button{width:100%;height:32px;margin-top:7px;border:0;border-radius:16px;color:#fff;font-size:10px;font-weight:700;box-shadow:0 5px 12px rgba(40,120,255,.15)}
</style>
