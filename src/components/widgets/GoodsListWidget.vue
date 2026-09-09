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
    <div class="goods-heading"><strong>· {{ title }} ·</strong><span>更多 <i class="i-tabler-chevron-right" /></span></div>
    <div class="goods-grid">
      <article class="goods-card">
        <img v-if="productOneImage" :src="productOneImage" :alt="productOneName">
        <div v-else class="image-placeholder"><i class="i-tabler-bottle" /></div>
        <h4>{{ productOneName }}</h4>
        <div class="price-row"><strong :style="{ color: accentColor }">¥{{ productOnePrice }}</strong><del>¥{{ productOneOriginalPrice }}</del><i class="i-tabler-shopping-cart" /></div>
      </article>
      <article class="goods-card">
        <img v-if="productTwoImage" :src="productTwoImage" :alt="productTwoName">
        <div v-else class="image-placeholder second"><i class="i-tabler-headphones" /></div>
        <h4>{{ productTwoName }}</h4>
        <div class="price-row"><strong :style="{ color: accentColor }">¥{{ productTwoPrice }}</strong><del>¥{{ productTwoOriginalPrice }}</del><i class="i-tabler-shopping-cart" /></div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.goods-widget{padding:5px 10px 4px;background:#fff}.goods-heading{height:32px;display:flex;align-items:center;justify-content:center;position:relative;color:#24314d}.goods-heading strong{font-size:12px;letter-spacing:.3px}.goods-heading span{position:absolute;right:0;display:flex;align-items:center;color:#9aa6b5;font-size:9px}.goods-heading i{font-size:10px}.goods-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.goods-card{min-width:0;border-radius:9px;overflow:hidden;background:#fff;box-shadow:0 4px 13px rgba(54,78,118,.06);border:1px solid #edf1f5}.goods-card img,.image-placeholder{width:100%;height:94px;object-fit:cover;display:grid;place-items:center;background:#f5f8fb}.image-placeholder{background:linear-gradient(145deg,#daf0ff,#f6fbff);color:#6398c8;font-size:34px}.image-placeholder.second{background:linear-gradient(145deg,#ffe6ef,#fff7fa);color:#d887aa}.goods-card h4{margin:6px 7px 4px;font-size:9px;line-height:1.35;font-weight:500;color:#3c485b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.price-row{display:flex;align-items:center;gap:3px;padding:0 7px 7px}.price-row strong{font-size:12px}.price-row del{font-size:8px;color:#b4bdc9}.price-row i{margin-left:auto;width:18px;height:18px;border-radius:50%;display:grid;place-items:center;background:#fff1f2;color:#ff7580;font-size:10px}
</style>
