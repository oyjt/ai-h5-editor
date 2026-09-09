<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  groupPrice?: string
  originalPrice?: string
  participantText?: string
  buttonText?: string
  accentColor?: string
}
withDefaults(defineProps<Props>(), {
  title: '3 人拼团享低价', description: '邀请好友一起拼，成团立减', groupPrice: '129', originalPrice: '199', participantText: '已有 1286 人参团', buttonText: '去拼团', accentColor: '#ff6b35',
})
</script>

<template>
  <section class="group-buy" :style="{ '--accent': accentColor }">
    <div class="badge">拼团</div>
    <div class="copy"><strong>{{ title }}</strong><span>{{ description }}</span><small>{{ participantText }}</small></div>
    <div class="action"><div><strong>¥{{ groupPrice }}</strong><del>¥{{ originalPrice }}</del></div><button>{{ buttonText }}</button></div>
  </section>
</template>

<style scoped>
.group-buy{position:relative;margin:8px 12px;padding:14px 12px 12px 54px;border-radius:12px;background:linear-gradient(135deg,#fff8ef,#fff0e5);border:1px solid color-mix(in srgb,var(--accent) 22%,transparent);display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center}
.badge{position:absolute;left:10px;top:14px;width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:var(--accent);color:#fff;font-size:11px;font-weight:700}.copy strong{display:block;font-size:14px;color:#273b52}.copy span,.copy small{display:block;margin-top:3px;font-size:10px;color:#8b99aa}.action{text-align:right}.action>div{display:flex;align-items:baseline;justify-content:flex-end;gap:5px}.action strong{font-size:19px;color:var(--accent)}.action del{font-size:9px;color:#a5afba}.action button{margin-top:6px;border:0;border-radius:16px;background:var(--accent);color:#fff;padding:7px 15px;font-size:10px;font-weight:650}
</style>
