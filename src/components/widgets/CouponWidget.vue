<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  amounts?: string
  thresholds?: string
  buttonText?: string
  accentColor?: string
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '限时优惠券',
  amounts: '20,50,100',
  thresholds: '199,300,500',
  buttonText: '立即领取',
  accentColor: '#ff4d4f',
  backgroundColor: '#fff1ef',
})

const coupons = computed(() => {
  const amounts = props.amounts.split(',').map(item => item.trim()).filter(Boolean)
  const thresholds = props.thresholds.split(',').map(item => item.trim())
  return amounts.slice(0, 3).map((amount, index) => ({ amount, threshold: thresholds[index] || thresholds[thresholds.length - 1] || '0' }))
})
</script>

<template>
  <section class="coupon-widget" :style="{ backgroundColor }" :aria-label="title">
    <div class="coupon-row">
      <div v-for="item in coupons" :key="`${item.amount}-${item.threshold}`" class="coupon-card">
        <strong :style="{ color: accentColor }"><small>¥</small>{{ item.amount }}</strong>
        <span>满{{ item.threshold }}可用</span>
        <i class="notch notch-left" /><i class="notch notch-right" />
      </div>
      <button class="coupon-action" :style="{ backgroundColor: accentColor }"><span>{{ buttonText.slice(0, 2) }}</span><span>{{ buttonText.slice(2) }}</span></button>
    </div>
  </section>
</template>

<style scoped>
.coupon-widget{margin:0 10px;padding:7px;border-radius:11px;background:linear-gradient(135deg,#ffd7d2 0%,#ffaaa2 100%)!important;box-shadow:inset 0 0 0 1px rgba(255,126,114,.14),0 3px 10px rgba(255,103,94,.06)}.coupon-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr)) 58px;gap:5px}.coupon-card{position:relative;min-width:0;height:57px;padding:7px 3px;border-radius:7px;background:#fff7ee;text-align:center;border:1px solid rgba(255,129,116,.32);display:flex;flex-direction:column;align-items:center;justify-content:center}.coupon-card strong{display:block;font-size:18px;line-height:1;font-weight:800;letter-spacing:-.4px}.coupon-card strong small{font-size:10px;margin-right:1px}.coupon-card span{display:block;margin-top:5px;color:#986a65;font-size:8px;white-space:nowrap}.notch{position:absolute;top:50%;width:6px;height:6px;margin-top:-3px;border-radius:50%;background:#ffc1b8}.notch-left{left:-4px}.notch-right{right:-4px}.coupon-action{border:0;border-radius:8px;color:#fff;font-size:10px;font-weight:700;padding:0 4px;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.35;box-shadow:0 5px 10px rgba(238,62,67,.16);cursor:pointer}
</style>
