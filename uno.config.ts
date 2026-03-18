import { defineConfig, presetAttributify, presetIcons, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(), // Tailwind CSS v4 兼容预设
    presetAttributify(), // 属性化模式
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        tabler: () => import('@iconify-json/tabler/icons.json').then(i => i.default),
      },
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  shortcuts: {
    // 自定义快捷方式
    'flex-center': 'flex items-center justify-center',
    'flex-col-center': 'flex flex-col items-center justify-center',
    'absolute-center': 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  },
  theme: {
    colors: {
      primary: '#409eff',
      success: '#67c23a',
      warning: '#e6a23c',
      danger: '#f56c6c',
      info: '#909399',
    },
  },
  // 配置内容扫描，包括 TypeScript 配置文件
  content: {
    filesystem: [
      'src/**/*.{vue,js,ts,jsx,tsx}',
      'src/config/**/*.ts',
    ],
  },
  // 安全列表：确保动态使用的图标类名被生成
  safelist: [
    // 组件配置中使用的图标
    'i-tabler-txt',
    'i-tabler-photo',
    'i-tabler-click',
    'i-tabler-forms',
    'i-tabler-circle-dot',
    'i-tabler-checkbox',
    'i-tabler-toggle-right',
    'i-tabler-separator-horizontal',
    'i-tabler-layout-cards',
    'i-tabler-tag',
    'i-tabler-progress',
    'i-tabler-box',
    'i-tabler-space',
    'i-tabler-carousel-horizontal',
    'i-tabler-clock',
    'i-tabler-speakerphone',
    'i-tabler-volume',
    // 分类图标
    'i-tabler-layout-grid',
    'i-tabler-layout',
  ],
})
