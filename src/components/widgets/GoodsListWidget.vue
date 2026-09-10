<script setup lang="ts">
interface Props {
  title?: string
  productOneName?: string
  productOnePrice?: string
  productOneOriginalPrice?: string
  productOneImage?: string
  productTwoName?: string
  productTwoPrice?: string
  productTwoOriginalPrice?: string
  productTwoImage?: string
  accentColor?: string
}

withDefaults(defineProps<Props>(), {
  title: '热门推荐',
  productOneName: '安热沙防晒霜 SPF50+',
  productOnePrice: '159',
  productOneOriginalPrice: '199',
  productOneImage: '',
  productTwoName: '新品蓝牙耳机 轻盈舒适',
  productTwoPrice: '299',
  productTwoOriginalPrice: '399',
  productTwoImage: '',
  accentColor: '#ff4d4f',
})
</script>

<template>
  <section class="goods-widget">
    <div class="goods-heading">
      <strong>{{ title }}</strong>
      <span>更多 <i class="i-tabler-chevron-right" /></span>
    </div>
    <div class="goods-grid">
      <article class="goods-card">
        <div class="image-wrap">
          <img v-if="productOneImage" :src="productOneImage" :alt="productOneName">
          <div v-else class="image-placeholder"><i class="i-tabler-bottle" /></div>
        </div>
        <h4>{{ productOneName }}</h4>
        <div class="price-row"><strong :style="{ color: accentColor }">¥{{ productOnePrice }}</strong><del>¥{{ productOneOriginalPrice }}</del><button aria-label="加入购物车"><i class="i-tabler-shopping-cart" /></button></div>
      </article>
      <article class="goods-card">
        <div class="image-wrap pink">
          <img v-if="productTwoImage" :src="productTwoImage" :alt="productTwoName">
          <div v-else class="image-placeholder second"><i class="i-tabler-headphones" /></div>
        </div>
        <h4>{{ productTwoName }}</h4>
        <div class="price-row"><strong :style="{ color: accentColor }">¥{{ productTwoPrice }}</strong><del>¥{{ productTwoOriginalPrice }}</del><button aria-label="加入购物车"><i class="i-tabler-shopping-cart" /></button></div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.goods-widget{padding:3px 10px 8px;background:#fff}.goods-heading{height:38px;display:flex;align-items:center;justify-content:center;position:relative;color:#173159}.goods-heading strong{font-size:13px;font-weight:800;letter-spacing:.2px}.goods-heading strong::before,.goods-heading strong::after{content:'·';margin:0 6px;color:#173159}.goods-heading span{position:absolute;right:1px;display:flex;align-items:center;color:#93a0b1;font-size:9px}.goods-heading i{font-size:10px}.goods-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.goods-card{min-width:0;border-radius:10px;overflow:hidden;background:#fff;box-shadow:0 4px 14px rgba(54,78,118,.07);border:1px solid #edf1f5}.image-wrap{height:112px;overflow:hidden;background:linear-gradient(180deg,#eef8ff,#e4f4ff)}.image-wrap.pink{background:linear-gradient(180deg,#fff0f5,#ffe7ef)}.goods-card img,.image-placeholder{width:100%;height:100%;object-fit:cover;display:grid;place-items:center}.image-placeholder{color:#6398c8;font-size:36px}.image-placeholder.second{color:#d887aa}.goods-card h4{margin:7px 8px 3px;font-size:9px;line-height:1.35;font-weight:550;color:#3c485b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.price-row{display:flex;align-items:center;gap:4px;padding:0 8px 8px}.price-row strong{font-size:13px;line-height:19px}.price-row del{font-size:8px;color:#b4bdc9}.price-row button{margin-left:auto;width:20px;height:20px;border:1px solid #ffd8dc;border-radius:50%;display:grid;place-items:center;background:#fff7f8;color:#ff7580;font-size:10px;padding:0;cursor:pointer}.price-row button:hover{background:#ffeff1}.price-row button i{font-size:10px}
</style>
