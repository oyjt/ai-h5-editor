<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  description?: string
  namePlaceholder?: string
  phonePlaceholder?: string
  buttonText?: string
  accentColor?: string
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '立即报名 领取专属福利',
  description: '填写信息，获取活动详情与限时优惠',
  namePlaceholder: '请输入您的姓名',
  phonePlaceholder: '请输入手机号',
  buttonText: '立即提交',
  accentColor: '#2878ff',
  backgroundColor: '#eef5ff',
})

const widgetStyle = computed(() => ({
  '--form-accent': props.accentColor,
  '--form-bg': props.backgroundColor,
}))
</script>

<template>
  <section class="marketing-form" :style="widgetStyle">
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
.marketing-form{margin:9px 10px 8px;padding:14px 12px 13px;border-radius:12px;text-align:center;background:linear-gradient(180deg,color-mix(in srgb,var(--form-bg) 82%,#d9eaff) 0%,color-mix(in srgb,var(--form-bg) 92%,#fff) 100%);box-shadow:inset 0 0 0 1px rgba(90,151,255,.07)}.marketing-form h3{margin:0;color:#234b95;font-size:13px;line-height:19px;font-weight:800}.marketing-form p{margin:3px 0 10px;color:#8798b0;font-size:8px;line-height:13px}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}.form-row label{height:36px;border:1px solid #e1e9f4;border-radius:7px;background:#fff;display:flex;align-items:center;padding:0 9px;gap:5px;color:#a0adbc;box-shadow:0 2px 6px rgba(69,98,138,.03)}.form-row i{font-size:12px}.form-row input{width:100%;min-width:0;border:0;background:transparent;color:#64748b;outline:none;font-size:8px}.marketing-form button{width:100%;height:36px;margin-top:9px;border:0;border-radius:18px;color:#fff;font-size:10px;font-weight:800;box-shadow:0 5px 12px color-mix(in srgb,var(--form-accent) 22%,transparent);cursor:pointer}.marketing-form button:hover{filter:brightness(.98)}
</style>
