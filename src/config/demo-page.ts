import type { PageSchema } from '@/types/schema'
import { createEmptyPageSchema, createComponentSchema } from '@/utils/schema-generator'
import { getComponentConfig } from './component-registry'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

function createFromRegistry(type: string, props: Record<string, unknown> = {}, styles: Record<string, unknown> = {}) {
  const config = getComponentConfig(type)
  if (!config)
    throw new Error(`Unknown component type: ${type}`)

  return createComponentSchema(
    type,
    { ...config.defaultProps, ...props },
    { ...config.defaultStyles, ...styles },
  )
}

export function createMarketingDemoPage(): PageSchema {
  const page = createEmptyPageSchema('夏日焕新 · 营销活动页')

  page.meta = {
    title: '夏日焕新 · 营销活动页',
    description: '夏日焕新营销活动可视化搭建示例',
    keywords: ['夏日焕新', '营销活动', 'H5'],
    createTime: page.meta?.createTime ?? Date.now(),
    updateTime: Date.now(),
  }
  page.globalStyles = { backgroundColor: '#ffffff' }

  page.components = [
    createFromRegistry('image', {
      src: asset('marketing/summer-hero.jpg'),
      alt: '夏日焕新季',
      width: '100%',
      height: '246px',
      objectFit: 'cover',
      borderRadius: '11px',
    }, {
      margin: '0 10px 7px',
    }),
    createFromRegistry('coupon', {}, { margin: '0' }),
    createFromRegistry('goodsList', {
      productOneImage: asset('marketing/product-sunscreen.jpg'),
      productTwoImage: asset('marketing/product-headphones.jpg'),
    }, { margin: '0' }),
    createFromRegistry('marketingForm', {}, { margin: '0' }),
    createFromRegistry('tabbar', {
      tabs: [
        { name: 'home', text: '首页', icon: 'i-tabler-home', activeIcon: 'i-tabler-home-filled' },
        { name: 'activity', text: '活动', icon: 'i-tabler-heart', activeIcon: 'i-tabler-heart-filled' },
        { name: 'goods', text: '好物', icon: 'i-tabler-shopping-bag', activeIcon: 'i-tabler-shopping-bag-filled' },
        { name: 'user', text: '我的', icon: 'i-tabler-user', activeIcon: 'i-tabler-user-filled' },
      ],
      active: 'home',
      fixed: false,
      placeholder: false,
      safeAreaInsetBottom: false,
      activeColor: '#1769ff',
      inactiveColor: '#8b99aa',
    }, { margin: '0' }),
  ]

  return page
}
