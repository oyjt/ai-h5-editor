/**
 * 组件 Catalog 定义
 * 使用 Zod 定义组件的 props schema，用于 AI 生成和验证
 */

import { z } from 'zod'

// 基础组件
export const TextPropsSchema = z.object({
  content: z.string().describe('文本内容'),
  fontSize: z.string().default('14px').describe('字体大小，如 14px, 1rem'),
  color: z.string().default('#333333').describe('文字颜色，十六进制格式'),
  fontWeight: z.enum(['normal', 'bold', 'lighter']).default('normal').describe('字体粗细'),
  textAlign: z.enum(['left', 'center', 'right']).default('left').describe('对齐方式'),
})

export const ImagePropsSchema = z.object({
  src: z.string().url().describe('图片 URL，使用 https://picsum.photos/seed/[关键词]/[宽]/[高] 格式'),
  alt: z.string().default('图片').describe('替代文本'),
  width: z.string().default('100%').describe('宽度，如 100%, 300px'),
  height: z.string().default('auto').describe('高度，如 auto, 200px'),
  objectFit: z.enum(['cover', 'contain', 'fill', 'none']).default('cover').describe('填充方式'),
  borderRadius: z.string().default('0').describe('圆角，如 0, 8px, 50%'),
})

export const ButtonPropsSchema = z.object({
  text: z.string().describe('按钮文字'),
  type: z.enum(['default', 'primary', 'success', 'warning', 'danger']).default('primary').describe('按钮类型'),
  size: z.enum(['large', 'normal', 'small', 'mini']).default('normal').describe('按钮大小'),
  block: z.boolean().default(false).describe('是否为块级按钮'),
  round: z.boolean().default(false).describe('是否为圆角按钮'),
})

// 表单组件
export const InputPropsSchema = z.object({
  placeholder: z.string().default('请输入内容').describe('占位文本'),
  type: z.enum(['text', 'number', 'password', 'tel', 'email']).default('text').describe('输入类型'),
})

export const RadioPropsSchema = z.object({
  options: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).describe('选项列表'),
  value: z.string().describe('当前选中值'),
  direction: z.enum(['horizontal', 'vertical']).default('horizontal').describe('排列方向'),
})

export const CheckboxPropsSchema = z.object({
  options: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).describe('选项列表'),
  value: z.array(z.string()).describe('当前选中值数组'),
  direction: z.enum(['horizontal', 'vertical']).default('horizontal').describe('排列方向'),
})

export const SwitchPropsSchema = z.object({
  value: z.boolean().default(false).describe('开关状态'),
  activeColor: z.string().default('#409eff').describe('开启颜色'),
  inactiveColor: z.string().default('#dcdfe6').describe('关闭颜色'),
})

// 展示组件
export const DividerPropsSchema = z.object({
  text: z.string().default('').describe('分割线文字'),
  textPosition: z.enum(['left', 'center', 'right']).default('center').describe('文字位置'),
  borderStyle: z.enum(['solid', 'dashed', 'dotted']).default('solid').describe('线条样式'),
  borderColor: z.string().default('#dcdfe6').describe('线条颜色'),
})

export const CardPropsSchema = z.object({
  title: z.string().describe('卡片标题'),
  content: z.string().describe('卡片内容'),
  imageUrl: z.string().default('').describe('卡片图片 URL，可选'),
  shadow: z.enum(['always', 'hover', 'never']).default('hover').describe('阴影效果'),
  borderRadius: z.string().default('8px').describe('圆角'),
})

export const TagPropsSchema = z.object({
  text: z.string().describe('标签文字'),
  type: z.enum(['primary', 'success', 'warning', 'danger', 'info']).default('primary').describe('标签类型'),
  size: z.enum(['large', 'medium', 'small']).default('medium').describe('标签大小'),
  plain: z.boolean().default(false).describe('是否为朴素标签'),
  round: z.boolean().default(false).describe('是否为圆角标签'),
})

export const ProgressPropsSchema = z.object({
  percentage: z.number().min(0).max(100).describe('进度百分比 0-100'),
  strokeWidth: z.number().default(8).describe('进度条高度'),
  color: z.string().default('#409eff').describe('进度条颜色'),
  showText: z.boolean().default(true).describe('是否显示文字'),
})

// 布局组件
export const ContainerPropsSchema = z.object({
  backgroundColor: z.string().default('#ffffff').describe('背景颜色'),
  padding: z.string().default('16px').describe('内边距'),
  borderRadius: z.string().default('0').describe('圆角'),
  border: z.string().default('none').describe('边框，如 1px solid #ddd'),
  minHeight: z.string().default('100px').describe('最小高度'),
})

export const SpacerPropsSchema = z.object({
  height: z.string().default('20px').describe('间距高度'),
  backgroundColor: z.string().default('transparent').describe('背景颜色'),
})

// 营销组件
export const SwiperPropsSchema = z.object({
  images: z.array(z.string().url()).describe('轮播图片 URL 数组，使用 picsum.photos'),
  height: z.string().default('200px').describe('轮播图高度'),
  autoplay: z.boolean().default(true).describe('是否自动播放'),
  interval: z.number().default(3000).describe('切换间隔(ms)'),
  showIndicators: z.boolean().default(true).describe('是否显示指示器'),
})

export const CountdownPropsSchema = z.object({
  endTime: z.string().describe('结束时间 ISO 格式'),
  format: z.enum(['DD:HH:mm:ss', 'HH:mm:ss', 'mm:ss']).default('DD:HH:mm:ss').describe('显示格式'),
  fontSize: z.string().default('24px').describe('字体大小'),
  color: z.string().default('#f56c6c').describe('文字颜色'),
})

export const NoticePropsSchema = z.object({
  text: z.string().describe('公告内容'),
  backgroundColor: z.string().default('#fff7e6').describe('背景颜色'),
  color: z.string().default('#ed6a0c').describe('文字颜色'),
  scrollable: z.boolean().default(true).describe('是否滚动播放'),
})

// 组件 Catalog
export const componentCatalog = {
  text: {
    name: '文本',
    description: '显示文本内容，支持自定义字体大小、颜色、粗细和对齐方式',
    category: 'basic',
    propsSchema: TextPropsSchema,
  },
  image: {
    name: '图片',
    description: '显示图片，支持自定义宽高、填充方式和圆角',
    category: 'basic',
    propsSchema: ImagePropsSchema,
  },
  button: {
    name: '按钮',
    description: '可点击的按钮，支持多种类型和尺寸',
    category: 'basic',
    propsSchema: ButtonPropsSchema,
  },
  input: {
    name: '输入框',
    description: '文本输入框，支持多种输入类型',
    category: 'form',
    propsSchema: InputPropsSchema,
  },
  radio: {
    name: '单选框',
    description: '单选框组，用于多个选项中选择一个',
    category: 'form',
    propsSchema: RadioPropsSchema,
  },
  checkbox: {
    name: '复选框',
    description: '复选框组，用于多个选项中选择多个',
    category: 'form',
    propsSchema: CheckboxPropsSchema,
  },
  switch: {
    name: '开关',
    description: '开关切换器，用于开启/关闭状态',
    category: 'form',
    propsSchema: SwitchPropsSchema,
  },
  divider: {
    name: '分割线',
    description: '内容分割线，可带文字',
    category: 'display',
    propsSchema: DividerPropsSchema,
  },
  card: {
    name: '卡片',
    description: '卡片容器，可包含标题、内容和图片',
    category: 'display',
    propsSchema: CardPropsSchema,
  },
  tag: {
    name: '标签',
    description: '标签组件，用于标记和分类',
    category: 'display',
    propsSchema: TagPropsSchema,
  },
  progress: {
    name: '进度条',
    description: '进度条，显示任务进度',
    category: 'display',
    propsSchema: ProgressPropsSchema,
  },
  container: {
    name: '容器',
    description: '布局容器，可包含其他组件',
    category: 'layout',
    propsSchema: ContainerPropsSchema,
  },
  spacer: {
    name: '间距',
    description: '空白间距，用于组件间隔',
    category: 'layout',
    propsSchema: SpacerPropsSchema,
  },
  swiper: {
    name: '轮播图',
    description: '图片轮播组件，支持自动播放',
    category: 'marketing',
    propsSchema: SwiperPropsSchema,
  },
  countdown: {
    name: '倒计时',
    description: '倒计时组件，用于活动截止时间',
    category: 'marketing',
    propsSchema: CountdownPropsSchema,
  },
  notice: {
    name: '公告栏',
    description: '滚动公告栏，用于通知信息',
    category: 'marketing',
    propsSchema: NoticePropsSchema,
  },
}

export type ComponentType = keyof typeof componentCatalog
