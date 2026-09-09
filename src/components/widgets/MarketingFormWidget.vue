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
.marketing-form{margin:8px 10px 7px;padding:12px 11px 11px;border-radius:11px;text-align:center;background:linear-gradient(180deg,#e8f3ff 0%,#f5f9ff 100%)!important;box-shadow:inset 0 0 0 1px rgba(90,151,255,.05)}.marketing-form h3{margin:0;color:#244c96;font-size:12px;line-height:18px;font-weight:700}.marketing-form p{margin:2px 0 9px;color:#8798b0;font-size:8px;line-height:13px}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:7px}.form-row label{height:32px;border:1px solid #e1e9f4;border-radius:6px;background:#fff;display:flex;align-items:center;padding:0 8px;gap:4px;color:#a0adbc;box-shadow:0 2px 6px rgba(69,98,138,.03)}.form-row i{font-size:11px}.form-row input{width:100%;min-width:0;border:0;background:transparent;color:#64748b;outline:none;font-size:8px}.marketing-form button{width:100%;height:33px;margin-top:8px;border:0;border-radius:17px;color:#fff;font-size:10px;font-weight:700;box-shadow:0 5px 12px rgba(40,120,255,.16)}
</style>
