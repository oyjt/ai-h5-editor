<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  buttonText?: string
  prizeOne?: string
  prizeTwo?: string
  prizeThree?: string
  accentColor?: string
}
withDefaults(defineProps<Props>(), {
  title: '幸运抽奖', description: '每天 3 次机会，100% 有奖', buttonText: '立即抽奖', prizeOne: '5 元券', prizeTwo: '会员月卡', prizeThree: '神秘好礼', accentColor: '#8b5cf6',
})
</script>

<template>
  <section class="lottery" :style="{ '--accent': accentColor }">
    <div class="copy"><strong>{{ title }}</strong><span>{{ description }}</span></div>
    <div class="prizes"><span>{{ prizeOne }}</span><span>{{ prizeTwo }}</span><span>{{ prizeThree }}</span></div>
    <button>{{ buttonText }}</button>
  </section>
</template>

<style scoped>
.lottery{margin:8px 12px;padding:14px;border-radius:14px;background:linear-gradient(135deg,#f6f0ff,#efe7ff);border:1px solid color-mix(in srgb,var(--accent) 22%,transparent);text-align:center}.copy strong{display:block;font-size:15px;color:#2f3750}.copy span{display:block;margin-top:3px;font-size:10px;color:#7d8496}.prizes{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:12px 0}.prizes span{padding:10px 4px;border-radius:9px;background:#fff;color:var(--accent);font-size:10px;font-weight:650;box-shadow:0 4px 10px rgba(77,54,120,.07)}.lottery button{width:100%;height:34px;border:0;border-radius:17px;background:linear-gradient(90deg,var(--accent),#a78bfa);color:white;font-size:11px;font-weight:700}
</style>
