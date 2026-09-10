<script setup lang="ts">
import { ref } from 'vue'
interface Props { title?:string; description?:string; buttonText?:string; prizeOne?:string; prizeTwo?:string; prizeThree?:string; accentColor?:string }
const props=withDefaults(defineProps<Props>(),{title:'幸运抽奖',description:'每天 3 次机会，100% 有奖',buttonText:'立即抽奖',prizeOne:'5 元券',prizeTwo:'会员月卡',prizeThree:'神秘好礼',accentColor:'#8b5cf6'})
const attempts=ref(3);const result=ref('');const drawing=ref(false)
function draw(){if(drawing.value||attempts.value<=0)return;drawing.value=true;result.value='';setTimeout(()=>{const prizes=[props.prizeOne,props.prizeTwo,props.prizeThree];result.value=prizes[Math.floor(Math.random()*prizes.length)]||props.prizeOne;attempts.value--;drawing.value=false},650)}
</script>

<template>
  <section class="lottery" :style="{'--accent':accentColor}">
    <div class="copy"><strong>{{ title }}</strong><span>{{ description }}</span></div>
    <div class="prizes"><span>{{ prizeOne }}</span><span>{{ prizeTwo }}</span><span>{{ prizeThree }}</span></div>
    <div v-if="result" class="result"><i class="i-tabler-confetti"/>恭喜获得 {{ result }}</div>
    <button :disabled="attempts<=0||drawing" @click.stop="draw"><i :class="drawing?'i-tabler-loader-2 spinning':'i-tabler-gift'"/>{{ drawing?'抽奖中...':attempts>0?`${buttonText} · 剩余 ${attempts} 次`:'今日机会已用完' }}</button>
  </section>
</template>

<style scoped>
.lottery{margin:8px 12px;padding:14px;border-radius:14px;background:linear-gradient(135deg,#f6f0ff,#efe7ff);border:1px solid color-mix(in srgb,var(--accent) 22%,transparent);text-align:center}.copy strong{display:block;font-size:15px;color:#2f3750}.copy span{display:block;margin-top:3px;font-size:10px;color:#7d8496}.prizes{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:12px 0}.prizes span{padding:10px 4px;border-radius:9px;background:#fff;color:var(--accent);font-size:10px;font-weight:650;box-shadow:0 4px 10px rgba(77,54,120,.07)}.result{margin:-2px 0 9px;padding:7px 8px;border-radius:8px;background:rgba(255,255,255,.78);color:var(--accent);font-size:9px;font-weight:700}.result i{margin-right:4px}.lottery button{width:100%;height:36px;border:0;border-radius:18px;background:linear-gradient(90deg,var(--accent),#a78bfa);color:#fff;font-size:11px;font-weight:700;cursor:pointer;transition:.16s}.lottery button:hover:not(:disabled){transform:translateY(-1px);filter:brightness(.98)}.lottery button:disabled{opacity:.48;cursor:not-allowed}.spinning{animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
</style>
