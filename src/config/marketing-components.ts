import type { ComponentRegistry } from '@/types/component'
import { ComponentCategory, PropType } from '@/types/component'
import CouponWidget from '@/components/widgets/CouponWidget.vue'
import GoodsListWidget from '@/components/widgets/GoodsListWidget.vue'
import MarketingFormWidget from '@/components/widgets/MarketingFormWidget.vue'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export const marketingComponentRegistry: ComponentRegistry = {
  coupon: {
    name: '优惠券',
    type: 'coupon',
    icon: 'i-tabler-ticket',
    category: ComponentCategory.Business,
    component: CouponWidget,
    defaultProps: {
      title: '限时优惠券',
      amounts: '20,50,100',
      thresholds: '199,300,500',
      buttonText: '立即领取',
      accentColor: '#ff4d4f',
      backgroundColor: '#fff1ef',
    },
    defaultStyles: { margin: '8px 12px' },
    propSchema: [
      { key: 'title', label: '标题', type: PropType.Text, defaultValue: '限时优惠券' },
      { key: 'amounts', label: '优惠金额', type: PropType.Text, defaultValue: '20,50,100', description: '使用英文逗号分隔，最多展示 3 张' },
      { key: 'thresholds', label: '使用门槛', type: PropType.Text, defaultValue: '199,300,500', description: '与优惠金额按顺序对应' },
      { key: 'buttonText', label: '按钮文案', type: PropType.Text, defaultValue: '立即领取' },
      { key: 'accentColor', label: '强调色', type: PropType.Color, defaultValue: '#ff4d4f' },
      { key: 'backgroundColor', label: '背景色', type: PropType.Color, defaultValue: '#fff1ef' },
    ],
  },

  goodsList: {
    name: '商品列表',
    type: 'goodsList',
    icon: 'i-tabler-shopping-bag',
    category: ComponentCategory.Business,
    component: GoodsListWidget,
    defaultProps: {
      title: '热门推荐',
      productOneName: '安热沙防晒霜 SPF50+',
      productOnePrice: '159',
      productOneOriginalPrice: '199',
      productOneImage: asset('marketing/product-sunscreen.svg'),
      productTwoName: '新品蓝牙耳机 轻盈舒适',
      productTwoPrice: '299',
      productTwoOriginalPrice: '399',
      productTwoImage: asset('marketing/product-headphones.svg'),
      accentColor: '#ff4d4f',
    },
    defaultStyles: { margin: '0' },
    propSchema: [
      { key: 'title', label: '区块标题', type: PropType.Text, defaultValue: '热门推荐' },
      { key: 'productOneName', label: '商品 1 名称', type: PropType.Text, defaultValue: '安热沙防晒霜 SPF50+' },
      { key: 'productOnePrice', label: '商品 1 价格', type: PropType.Text, defaultValue: '159' },
      { key: 'productOneOriginalPrice', label: '商品 1 原价', type: PropType.Text, defaultValue: '199' },
      { key: 'productOneImage', label: '商品 1 图片', type: PropType.Image, defaultValue: asset('marketing/product-sunscreen.svg') },
      { key: 'productTwoName', label: '商品 2 名称', type: PropType.Text, defaultValue: '新品蓝牙耳机 轻盈舒适' },
      { key: 'productTwoPrice', label: '商品 2 价格', type: PropType.Text, defaultValue: '299' },
      { key: 'productTwoOriginalPrice', label: '商品 2 原价', type: PropType.Text, defaultValue: '399' },
      { key: 'productTwoImage', label: '商品 2 图片', type: PropType.Image, defaultValue: asset('marketing/product-headphones.svg') },
      { key: 'accentColor', label: '价格强调色', type: PropType.Color, defaultValue: '#ff4d4f' },
    ],
  },

  marketingForm: {
    name: '营销表单',
    type: 'marketingForm',
    icon: 'i-tabler-forms',
    category: ComponentCategory.Business,
    component: MarketingFormWidget,
    defaultProps: {
      title: '立即报名 领取专属福利',
      description: '填写信息，获取活动详情与限时优惠',
      namePlaceholder: '请输入您的姓名',
      phonePlaceholder: '请输入手机号',
      buttonText: '立即提交',
      accentColor: '#2878ff',
      backgroundColor: '#eef5ff',
    },
    defaultStyles: { margin: '8px 12px' },
    propSchema: [
      { key: 'title', label: '标题', type: PropType.Text, defaultValue: '立即报名 领取专属福利' },
      { key: 'description', label: '描述', type: PropType.Text, defaultValue: '填写信息，获取活动详情与限时优惠' },
      { key: 'namePlaceholder', label: '姓名提示', type: PropType.Text, defaultValue: '请输入您的姓名' },
      { key: 'phonePlaceholder', label: '手机提示', type: PropType.Text, defaultValue: '请输入手机号' },
      { key: 'buttonText', label: '按钮文案', type: PropType.Text, defaultValue: '立即提交' },
      { key: 'accentColor', label: '按钮颜色', type: PropType.Color, defaultValue: '#2878ff' },
      { key: 'backgroundColor', label: '背景颜色', type: PropType.Color, defaultValue: '#eef5ff' },
    ],
  },
}
