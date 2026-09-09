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
  return amounts.slice(0, 3).map((amount, index) => ({
    amount,
    threshold: thresholds[index] || thresholds[thresholds.length - 1] || '0',
  }))
})
</script>

<template>
  <section class="coupon-widget" :style="{ backgroundColor }">
    <div class="coupon-heading">
      <strong>{{ title }}</strong>
      <span>限时专享</span>
    </div>
    <div class="coupon-row">
      <div v-for="item in coupons" :key="`${item.amount}-${item.threshold}`" class="coupon-card">
        <strong :style="{ color: accentColor }"><small>¥</small>{{ item.amount }}</strong>
        <span>满{{ item.threshold }}可用</span>
      </div>
      <button class="coupon-action" :style="{ backgroundColor: accentColor }">{{ buttonText }}</button>
    </div>
  </section>
</template>

<style scoped>
.coupon-widget {
  padding: 12px;
  border-radius: 14px;
}

.coupon-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #25324b;
}

.coupon-heading strong {
  font-size: 14px;
}

.coupon-heading span {
  font-size: 10px;
  color: #a66a62;
}

.coupon-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr) 62px;
  gap: 6px;
}

.coupon-card {
  min-width: 0;
  padding: 9px 4px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.88);
  text-align: center;
  box-shadow: inset 0 0 0 1px rgba(255, 117, 117, 0.18);
}

.coupon-card strong {
  display: block;
  font-size: 20px;
  line-height: 1;
}

.coupon-card strong small {
  font-size: 11px;
  margin-right: 1px;
}

.coupon-card span {
  display: block;
  margin-top: 5px;
  color: #8f6b68;
  font-size: 9px;
  white-space: nowrap;
}

.coupon-action {
  border: 0;
  border-radius: 9px;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 0 6px;
}
</style>
