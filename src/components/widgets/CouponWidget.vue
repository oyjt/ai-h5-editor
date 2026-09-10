<script setup lang="ts">
import { computed, ref } from 'vue'
interface Props { title?:string; amounts?:string; thresholds?:string; buttonText?:string; accentColor?:string; backgroundColor?:string }
const props=withDefaults(defineProps<Props>(),{title:'限时优惠券',amounts:'20,50,100',thresholds:'199,300,500',buttonText:'立即领取',accentColor:'#ff4d4f',backgroundColor:'#fff1ef'})
const claimed=ref<number[]>([])
const coupons=computed(()=>{const amounts=props.amounts.split(',').map(i=>i.trim()).filter(Boolean);const thresholds=props.thresholds.split(',').map(i=>i.trim());return amounts.slice(0,3).map((amount,index)=>({amount,threshold:thresholds[index]||thresholds[thresholds.length-1]||'0'}))})
const widgetStyle=computed(()=>({'--coupon-accent':props.accentColor,'--coupon-bg':props.backgroundColor}))
function claim(index:number){if(!claimed.value.includes(index))claimed.value=[...claimed.value,index]}
</script>

<template>
  <section class="coupon-widget" :style="widgetStyle" :aria-label="title">
    <div class="title-row"><strong>{{ title }}</strong><span>{{ claimed.length ? `已领取 ${claimed.length} 张` : '限时可领' }}</span></div>
    <div class="coupon-row">
      <button v-for="(item,index) in coupons" :key="`${item.amount}-${item.threshold}`" class="coupon-card" :class="{claimed:claimed.includes(index)}" @click.stop="claim(index)">
        <strong><small>¥</small>{{ item.amount }}</strong><span>满{{ item.threshold }}可用</span><em>{{ claimed.includes(index) ? '已领取' : buttonText }}</em><i class="notch notch-left"/><i class="notch notch-right"/>
      </button>
    </div>
  </section>
</template>

<style scoped>
.coupon-widget{margin:0 10px;padding:10px;border-radius:12px;background:linear-gradient(135deg,color-mix(in srgb,var(--coupon-bg) 72%,#ffc6bf) 0%,color-mix(in srgb,var(--coupon-accent) 42%,#ffd8d3) 100%);box-shadow:inset 0 0 0 1px rgba(255,126,114,.14),0 3px 10px rgba(255,103,94,.06)}.title-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.title-row strong{font-size:11px;color:#8e5551}.title-row span{font-size:8px;color:#9d6c68}.coupon-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.coupon-card{position:relative;min-width:0;height:82px;padding:7px 3px;border-radius:8px;background:#fff9f1;text-align:center;border:1px solid rgba(255,129,116,.32);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:.16s ease}.coupon-card:hover{transform:translateY(-1px);box-shadow:0 5px 12px rgba(238,62,67,.10)}.coupon-card:active{transform:translateY(0)}.coupon-card strong{display:block;color:var(--coupon-accent);font-size:20px;line-height:1;font-weight:800;letter-spacing:-.4px}.coupon-card strong small{font-size:10px;margin-right:1px}.coupon-card span{display:block;margin-top:5px;color:#986a65;font-size:8px;white-space:nowrap}.coupon-card em{margin-top:6px;padding:3px 8px;border-radius:9px;background:var(--coupon-accent);color:#fff;font-size:8px;font-style:normal;font-weight:700}.coupon-card.claimed{opacity:.72;background:#fff}.coupon-card.claimed em{background:#c7cdd5}.notch{position:absolute;top:50%;width:7px;height:7px;margin-top:-3.5px;border-radius:50%;background:color-mix(in srgb,var(--coupon-accent) 24%,#ffd7d2)}.notch-left{left:-4px}.notch-right{right:-4px}
</style>
