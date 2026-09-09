<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  price?: string
  originalPrice?: string
  stockText?: string
  buttonText?: string
  accentColor?: string
}
withDefaults(defineProps<Props>(), {
  title: '夏日限时秒杀', subtitle: '距结束仅剩', price: '99', originalPrice: '199', stockText: '仅剩 36 件', buttonText: '立即抢购', accentColor: '#ff4d4f',
})
</script>

<template>
  <section class="flash-sale" :style="{ '--accent': accentColor }">
    <div class="header"><div><strong>{{ title }}</strong><span>{{ subtitle }}</span></div><div class="timer"><b>01</b><i>:</i><b>28</b><i>:</i><b>45</b></div></div>
    <div class="body"><div class="price"><strong>¥{{ price }}</strong><del>¥{{ originalPrice }}</del><span>{{ stockText }}</span></div><button>{{ buttonText }}</button></div>
  </section>
</template>

<style scoped>
.flash-sale{margin:8px 12px;padding:12px;border-radius:12px;background:linear-gradient(135deg,#fff5f3,#ffe6e2);border:1px solid color-mix(in srgb,var(--accent) 20%,transparent)}
.header,.body{display:flex;align-items:center;justify-content:space-between}.header strong{display:block;color:#273b52;font-size:14px}.header span{font-size:10px;color:#9a6c69}.timer{display:flex;align-items:center;gap:3px}.timer b{min-width:25px;padding:4px;border-radius:5px;background:var(--accent);color:white;text-align:center;font-size:11px}.timer i{font-style:normal;color:var(--accent)}
.body{margin-top:10px}.price{display:flex;align-items:baseline;gap:7px}.price strong{font-size:22px;color:var(--accent)}.price del{font-size:10px;color:#a5afba}.price span{font-size:10px;color:#8b99aa}.body button{border:0;border-radius:17px;background:var(--accent);color:white;padding:8px 16px;font-size:11px;font-weight:650}
</style>
