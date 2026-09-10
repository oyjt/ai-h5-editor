<script setup lang="ts">
import { ref } from 'vue'
interface Props { title?:string; productOneName?:string; productOnePrice?:string; productOneOriginalPrice?:string; productOneImage?:string; productTwoName?:string; productTwoPrice?:string; productTwoOriginalPrice?:string; productTwoImage?:string; accentColor?:string }
withDefaults(defineProps<Props>(),{title:'热门推荐',productOneName:'安热沙防晒霜 SPF50+',productOnePrice:'159',productOneOriginalPrice:'199',productOneImage:'',productTwoName:'新品蓝牙耳机 轻盈舒适',productTwoPrice:'299',productTwoOriginalPrice:'399',productTwoImage:'',accentColor:'#ff4d4f'})
const cart=ref<number[]>([])
function toggleCart(index:number){cart.value=cart.value.includes(index)?cart.value.filter(i=>i!==index):[...cart.value,index]}
</script>

<template>
  <section class="goods-widget">
    <div class="goods-heading"><strong>{{ title }}</strong><span>更多 <i class="i-tabler-chevron-right"/></span></div>
    <div class="goods-grid">
      <article v-for="(item,index) in [{name:productOneName,price:productOnePrice,original:productOneOriginalPrice,image:productOneImage,icon:'i-tabler-bottle'},{name:productTwoName,price:productTwoPrice,original:productTwoOriginalPrice,image:productTwoImage,icon:'i-tabler-headphones'}]" :key="index" class="goods-card">
        <div class="image-wrap" :class="{pink:index===1}"><img v-if="item.image" :src="item.image" :alt="item.name"><div v-else class="image-placeholder" :class="{second:index===1}"><i :class="item.icon"/></div><span class="sale-tag">热卖</span></div>
        <h4>{{ item.name }}</h4>
        <div class="price-row"><strong :style="{color:accentColor}">¥{{ item.price }}</strong><del>¥{{ item.original }}</del><button :class="{active:cart.includes(index)}" :aria-label="cart.includes(index)?'移出购物车':'加入购物车'" @click.stop="toggleCart(index)"><i :class="cart.includes(index)?'i-tabler-check':'i-tabler-shopping-cart'"/></button></div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.goods-widget{padding:3px 10px 8px;background:#fff}.goods-heading{height:38px;display:flex;align-items:center;justify-content:center;position:relative;color:#173159}.goods-heading strong{font-size:13px;font-weight:800;letter-spacing:.2px}.goods-heading strong::before,.goods-heading strong::after{content:'·';margin:0 6px}.goods-heading span{position:absolute;right:1px;display:flex;align-items:center;color:#93a0b1;font-size:9px}.goods-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.goods-card{min-width:0;border-radius:10px;overflow:hidden;background:#fff;box-shadow:0 4px 14px rgba(54,78,118,.07);border:1px solid #edf1f5;transition:.16s}.goods-card:hover{transform:translateY(-1px);box-shadow:0 8px 18px rgba(54,78,118,.10)}.image-wrap{position:relative;height:112px;overflow:hidden;background:linear-gradient(180deg,#eef8ff,#e4f4ff)}.image-wrap.pink{background:linear-gradient(180deg,#fff0f5,#ffe7ef)}.goods-card img,.image-placeholder{width:100%;height:100%;object-fit:cover;display:grid;place-items:center}.image-placeholder{color:#6398c8;font-size:36px}.image-placeholder.second{color:#d887aa}.sale-tag{position:absolute;left:7px;top:7px;padding:3px 6px;border-radius:8px;background:rgba(255,77,79,.92);color:#fff;font-size:7px;font-weight:700}.goods-card h4{margin:7px 8px 3px;font-size:9px;line-height:1.35;font-weight:550;color:#3c485b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.price-row{display:flex;align-items:center;gap:4px;padding:0 8px 8px}.price-row strong{font-size:13px;line-height:19px}.price-row del{font-size:8px;color:#b4bdc9}.price-row button{margin-left:auto;width:22px;height:22px;border:1px solid #ffd8dc;border-radius:50%;display:grid;place-items:center;background:#fff7f8;color:#ff7580;font-size:10px;padding:0;cursor:pointer;transition:.16s}.price-row button:hover{transform:scale(1.05)}.price-row button.active{background:#ff4d4f;border-color:#ff4d4f;color:#fff}.price-row button i{font-size:10px}
</style>
