<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
interface Props { title?:string; subtitle?:string; price?:string; originalPrice?:string; stockText?:string; buttonText?:string; accentColor?:string }
const props=withDefaults(defineProps<Props>(),{title:'夏日限时秒杀',subtitle:'距结束仅剩',price:'99',originalPrice:'199',stockText:'仅剩 36 件',buttonText:'立即抢购',accentColor:'#ff4d4f'})
const seconds=ref(1*3600+28*60+45);const purchased=ref(false)
const timer=window.setInterval(()=>{if(seconds.value>0)seconds.value--},1000);onBeforeUnmount(()=>window.clearInterval(timer))
const time=computed(()=>{const h=Math.floor(seconds.value/3600);const m=Math.floor(seconds.value%3600/60);const s=seconds.value%60;return [h,m,s].map(v=>String(v).padStart(2,'0'))})
function buy(){if(seconds.value<=0)return;purchased.value=true;setTimeout(()=>purchased.value=false,1800)}
</script>

<template>
  <section class="flash-sale" :style="{'--accent':accentColor}">
    <div class="header"><div><strong>{{ title }}</strong><span>{{ seconds>0 ? subtitle : '本场秒杀已结束' }}</span></div><div class="timer"><template v-for="(item,index) in time" :key="index"><b>{{ item }}</b><i v-if="index<2">:</i></template></div></div>
    <div class="body"><div class="price"><strong>¥{{ price }}</strong><del>¥{{ originalPrice }}</del><span>{{ stockText }}</span></div><button :disabled="seconds<=0" @click.stop="buy"><i :class="purchased?'i-tabler-check':'i-tabler-bolt'"/>{{ purchased?'已加入抢购':buttonText }}</button></div>
  </section>
</template>

<style scoped>
.flash-sale{margin:8px 12px;padding:12px;border-radius:12px;background:linear-gradient(135deg,#fff5f3,#ffe6e2);border:1px solid color-mix(in srgb,var(--accent) 20%,transparent)}.header,.body{display:flex;align-items:center;justify-content:space-between}.header strong{display:block;color:#273b52;font-size:14px}.header span{font-size:10px;color:#9a6c69}.timer{display:flex;align-items:center;gap:3px}.timer b{min-width:25px;padding:4px;border-radius:5px;background:var(--accent);color:#fff;text-align:center;font-size:11px}.timer i{font-style:normal;color:var(--accent)}.body{margin-top:10px}.price{display:flex;align-items:baseline;gap:7px}.price strong{font-size:22px;color:var(--accent)}.price del{font-size:10px;color:#a5afba}.price span{font-size:10px;color:#8b99aa}.body button{display:flex;align-items:center;gap:4px;border:0;border-radius:17px;background:var(--accent);color:#fff;padding:8px 14px;font-size:11px;font-weight:650;cursor:pointer;transition:.16s}.body button:hover:not(:disabled){transform:translateY(-1px);filter:brightness(.98)}.body button:disabled{opacity:.45;cursor:not-allowed}
</style>
