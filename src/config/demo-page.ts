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
    ...page.meta,
    title: '夏日焕新 · 营销活动页',
    description: '夏日焕新营销活动可视化搭建示例',
  }
  page.globalStyles = {
    backgroundColor: '#ffffff',
  }

  page.components = [
    createFromRegistry('image', {
      src: asset('marketing/summer-hero.svg'),
      alt: '夏日焕新季',
      width: '100%',
      height: 'auto',
      objectFit: 'cover',
      borderRadius: '12px',
    }, {
      margin: '10px 12px 8px',
    }),
    createFromRegistry('coupon'),
    createFromRegistry('goodsList'),
    createFromRegistry('marketingForm'),
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
    }),
  ]

  return page
}
