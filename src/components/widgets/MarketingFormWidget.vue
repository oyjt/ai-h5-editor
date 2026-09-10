<script setup lang="ts">
import { computed, ref } from 'vue'
interface Props { title?:string; description?:string; namePlaceholder?:string; phonePlaceholder?:string; buttonText?:string; accentColor?:string; backgroundColor?:string }
const props=withDefaults(defineProps<Props>(),{title:'立即报名 领取专属福利',description:'填写信息，获取活动详情与限时优惠',namePlaceholder:'请输入您的姓名',phonePlaceholder:'请输入手机号',buttonText:'立即提交',accentColor:'#2878ff',backgroundColor:'#eef5ff'})
const widgetStyle=computed(()=>({'--form-accent':props.accentColor,'--form-bg':props.backgroundColor}))
const name=ref('');const phone=ref('');const submitted=ref(false);const touched=ref(false)
const nameError=computed(()=>touched.value&&!name.value.trim())
const phoneError=computed(()=>touched.value&&!/^1\d{10}$/.test(phone.value.trim()))
function submit(){touched.value=true;if(nameError.value||phoneError.value)return;submitted.value=true;setTimeout(()=>submitted.value=false,2400)}
</script>

<template>
  <form class="marketing-form" :style="widgetStyle" @submit.prevent.stop="submit">
    <div v-if="submitted" class="success-mask"><i class="i-tabler-circle-check-filled"/><strong>提交成功</strong><span>我们会尽快与您联系</span></div>
    <h3>{{ title }}</h3><p>{{ description }}</p>
    <div class="form-row">
      <label :class="{invalid:nameError}"><i class="i-tabler-user"/><input v-model="name" :placeholder="namePlaceholder" @blur="touched=true"><span v-if="nameError">请输入姓名</span></label>
      <label :class="{invalid:phoneError}"><i class="i-tabler-device-mobile"/><input v-model="phone" inputmode="numeric" maxlength="11" :placeholder="phonePlaceholder" @blur="touched=true"><span v-if="phoneError">手机号格式不正确</span></label>
    </div>
    <button type="submit">{{ buttonText }}</button>
  </form>
</template>

<style scoped>
.marketing-form{position:relative;margin:9px 10px 8px;padding:14px 12px 13px;border-radius:12px;text-align:center;background:linear-gradient(180deg,color-mix(in srgb,var(--form-bg) 82%,#d9eaff) 0%,color-mix(in srgb,var(--form-bg) 92%,#fff) 100%);box-shadow:inset 0 0 0 1px rgba(90,151,255,.07);overflow:hidden}.marketing-form h3{margin:0;color:#234b95;font-size:13px;line-height:19px;font-weight:800}.marketing-form p{margin:3px 0 10px;color:#8798b0;font-size:8px;line-height:13px}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}.form-row label{position:relative;height:36px;border:1px solid #e1e9f4;border-radius:7px;background:#fff;display:flex;align-items:center;padding:0 9px;gap:5px;color:#a0adbc;box-shadow:0 2px 6px rgba(69,98,138,.03);transition:.16s}.form-row label:focus-within{border-color:var(--form-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--form-accent) 10%,transparent)}.form-row label.invalid{border-color:#ef4444}.form-row label>span{position:absolute;left:2px;top:39px;color:#ef4444;font-size:7px}.form-row i{font-size:12px}.form-row input{width:100%;min-width:0;border:0;background:transparent;color:#64748b;outline:none;font-size:8px}.marketing-form button{width:100%;height:36px;margin-top:12px;border:0;border-radius:18px;background:var(--form-accent);color:#fff;font-size:10px;font-weight:800;box-shadow:0 5px 12px color-mix(in srgb,var(--form-accent) 22%,transparent);cursor:pointer;transition:.16s}.marketing-form button:hover{filter:brightness(.98);transform:translateY(-1px)}.marketing-form button:active{transform:none}.success-mask{position:absolute;inset:0;z-index:3;background:rgba(255,255,255,.94);backdrop-filter:blur(3px);display:flex;flex-direction:column;align-items:center;justify-content:center}.success-mask i{font-size:30px;color:#22a06b}.success-mask strong{margin-top:6px;color:#26364b;font-size:13px}.success-mask span{margin-top:3px;color:#98a5b5;font-size:8px}
</style>
