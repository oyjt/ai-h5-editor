/**
 * 组件库配置和注册
 */

import type { ComponentRegistry } from '@/types/component'
import { ComponentCategory, PropType } from '@/types/component'
import TextWidget from '@/components/widgets/TextWidget.vue'
import ImageWidget from '@/components/widgets/ImageWidget.vue'
import ButtonWidget from '@/components/widgets/ButtonWidget.vue'
import InputWidget from '@/components/widgets/InputWidget.vue'
import RadioWidget from '@/components/widgets/RadioWidget.vue'
import CheckboxWidget from '@/components/widgets/CheckboxWidget.vue'
import SwitchWidget from '@/components/widgets/SwitchWidget.vue'
import DividerWidget from '@/components/widgets/DividerWidget.vue'
import CardWidget from '@/components/widgets/CardWidget.vue'
import TagWidget from '@/components/widgets/TagWidget.vue'
import ProgressWidget from '@/components/widgets/ProgressWidget.vue'
import ContainerWidget from '@/components/widgets/ContainerWidget.vue'
import SpacerWidget from '@/components/widgets/SpacerWidget.vue'
import SwiperWidget from '@/components/widgets/SwiperWidget.vue'
import CountdownWidget from '@/components/widgets/CountdownWidget.vue'
import NoticeWidget from '@/components/widgets/NoticeWidget.vue'

// 组件注册表
export const componentRegistry: ComponentRegistry = {
  text: {
    name: '文本',
    type: 'text',
    icon: 'i-tabler-txt',
    category: ComponentCategory.Basic,
    component: TextWidget,
    defaultProps: {
      content: '这是一段文本',
      fontSize: '14px',
      color: '#333333',
      fontWeight: 'normal',
      textAlign: 'left',
      lineHeight: '1.5',
    },
    defaultStyles: {
      padding: '8px 16px',
    },
    propSchema: [
      {
        key: 'content',
        label: '文本内容',
        type: PropType.Textarea,
        defaultValue: '这是一段文本',
        placeholder: '请输入文本内容',
      },
      {
        key: 'fontSize',
        label: '字体大小',
        type: PropType.Text,
        defaultValue: '14px',
        placeholder: '如：14px, 1rem',
      },
      {
        key: 'color',
        label: '文字颜色',
        type: PropType.Color,
        defaultValue: '#333333',
      },
      {
        key: 'fontWeight',
        label: '字体粗细',
        type: PropType.Select,
        defaultValue: 'normal',
        options: [
          { label: '正常', value: 'normal' },
          { label: '粗体', value: 'bold' },
          { label: '细体', value: 'lighter' },
        ],
      },
      {
        key: 'textAlign',
        label: '对齐方式',
        type: PropType.Select,
        defaultValue: 'left',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'right' },
        ],
      },
    ],
  },

  image: {
    name: '图片',
    type: 'image',
    icon: 'i-tabler-photo',
    category: ComponentCategory.Basic,
    component: ImageWidget,
    defaultProps: {
      src: 'https://picsum.photos/seed/image1/300/200',
      alt: '图片',
      width: '100%',
      height: 'auto',
      objectFit: 'cover',
      borderRadius: '0',
    },
    defaultStyles: {
      margin: '0',
    },
    propSchema: [
      {
        key: 'src',
        label: '图片地址',
        type: PropType.Image,
        defaultValue: 'https://picsum.photos/seed/image1/300/200',
        placeholder: '请输入图片 URL',
      },
      {
        key: 'alt',
        label: '替代文本',
        type: PropType.Text,
        defaultValue: '图片',
        placeholder: '图片加载失败时显示',
      },
      {
        key: 'width',
        label: '宽度',
        type: PropType.Text,
        defaultValue: '100%',
        placeholder: '如：100%, 300px',
      },
      {
        key: 'height',
        label: '高度',
        type: PropType.Text,
        defaultValue: 'auto',
        placeholder: '如：auto, 200px',
      },
      {
        key: 'objectFit',
        label: '填充方式',
        type: PropType.Select,
        defaultValue: 'cover',
        options: [
          { label: '覆盖', value: 'cover' },
          { label: '包含', value: 'contain' },
          { label: '填充', value: 'fill' },
          { label: '原始', value: 'none' },
        ],
      },
      {
        key: 'borderRadius',
        label: '圆角',
        type: PropType.Text,
        defaultValue: '0',
        placeholder: '如：0, 8px, 50%',
      },
    ],
  },

  button: {
    name: '按钮',
    type: 'button',
    icon: 'i-tabler-click',
    category: ComponentCategory.Basic,
    component: ButtonWidget,
    defaultProps: {
      text: '按钮',
      type: 'primary',
      size: 'normal',
      block: false,
      round: false,
      plain: false,
      disabled: false,
    },
    defaultStyles: {
      margin: '8px 16px',
    },
    propSchema: [
      {
        key: 'text',
        label: '按钮文字',
        type: PropType.Text,
        defaultValue: '按钮',
        placeholder: '请输入按钮文字',
      },
      {
        key: 'type',
        label: '按钮类型',
        type: PropType.Select,
        defaultValue: 'primary',
        options: [
          { label: '默认', value: 'default' },
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '警告', value: 'warning' },
          { label: '危险', value: 'danger' },
        ],
      },
      {
        key: 'size',
        label: '按钮大小',
        type: PropType.Select,
        defaultValue: 'normal',
        options: [
          { label: '大', value: 'large' },
          { label: '正常', value: 'normal' },
          { label: '小', value: 'small' },
          { label: '迷你', value: 'mini' },
        ],
      },
      {
        key: 'block',
        label: '块级按钮',
        type: PropType.Switch,
        defaultValue: false,
        description: '按钮宽度是否撑满父元素',
      },
      {
        key: 'round',
        label: '圆角按钮',
        type: PropType.Switch,
        defaultValue: false,
      },
      {
        key: 'plain',
        label: '朴素按钮',
        type: PropType.Switch,
        defaultValue: false,
      },
      {
        key: 'disabled',
        label: '禁用状态',
        type: PropType.Switch,
        defaultValue: false,
      },
    ],
  },

  // 表单组件
  input: {
    name: '输入框',
    type: 'input',
    icon: 'i-tabler-forms',
    category: ComponentCategory.Form,
    component: InputWidget,
    defaultProps: {
      placeholder: '请输入内容',
      value: '',
      type: 'text',
      disabled: false,
      readonly: false,
    },
    defaultStyles: {
      margin: '8px 16px',
    },
    propSchema: [
      {
        key: 'placeholder',
        label: '占位文本',
        type: PropType.Text,
        defaultValue: '请输入内容',
      },
      {
        key: 'type',
        label: '输入类型',
        type: PropType.Select,
        defaultValue: 'text',
        options: [
          { label: '文本', value: 'text' },
          { label: '数字', value: 'number' },
          { label: '密码', value: 'password' },
          { label: '电话', value: 'tel' },
          { label: '邮箱', value: 'email' },
        ],
      },
      {
        key: 'disabled',
        label: '禁用',
        type: PropType.Switch,
        defaultValue: false,
      },
      {
        key: 'readonly',
        label: '只读',
        type: PropType.Switch,
        defaultValue: false,
      },
    ],
  },

  radio: {
    name: '单选框',
    type: 'radio',
    icon: 'i-tabler-circle-dot',
    category: ComponentCategory.Form,
    component: RadioWidget,
    defaultProps: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
      ],
      value: '1',
      direction: 'horizontal',
      disabled: false,
    },
    defaultStyles: {
      margin: '8px 16px',
    },
    propSchema: [
      {
        key: 'direction',
        label: '排列方向',
        type: PropType.Select,
        defaultValue: 'horizontal',
        options: [
          { label: '水平', value: 'horizontal' },
          { label: '垂直', value: 'vertical' },
        ],
      },
      {
        key: 'disabled',
        label: '禁用',
        type: PropType.Switch,
        defaultValue: false,
      },
    ],
  },

  checkbox: {
    name: '复选框',
    type: 'checkbox',
    icon: 'i-tabler-checkbox',
    category: ComponentCategory.Form,
    component: CheckboxWidget,
    defaultProps: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' },
      ],
      value: ['1'],
      direction: 'horizontal',
      disabled: false,
    },
    defaultStyles: {
      margin: '8px 16px',
    },
    propSchema: [
      {
        key: 'direction',
        label: '排列方向',
        type: PropType.Select,
        defaultValue: 'horizontal',
        options: [
          { label: '水平', value: 'horizontal' },
          { label: '垂直', value: 'vertical' },
        ],
      },
      {
        key: 'disabled',
        label: '禁用',
        type: PropType.Switch,
        defaultValue: false,
      },
    ],
  },

  switch: {
    name: '开关',
    type: 'switch',
    icon: 'i-tabler-toggle-right',
    category: ComponentCategory.Form,
    component: SwitchWidget,
    defaultProps: {
      value: false,
      activeText: '',
      inactiveText: '',
      activeColor: '#409eff',
      inactiveColor: '#dcdfe6',
      disabled: false,
    },
    defaultStyles: {
      margin: '8px 16px',
    },
    propSchema: [
      {
        key: 'activeText',
        label: '开启文字',
        type: PropType.Text,
        defaultValue: '',
      },
      {
        key: 'inactiveText',
        label: '关闭文字',
        type: PropType.Text,
        defaultValue: '',
      },
      {
        key: 'activeColor',
        label: '开启颜色',
        type: PropType.Color,
        defaultValue: '#409eff',
      },
      {
        key: 'inactiveColor',
        label: '关闭颜色',
        type: PropType.Color,
        defaultValue: '#dcdfe6',
      },
      {
        key: 'disabled',
        label: '禁用',
        type: PropType.Switch,
        defaultValue: false,
      },
    ],
  },

  // 展示组件
  divider: {
    name: '分割线',
    type: 'divider',
    icon: 'i-tabler-separator-horizontal',
    category: ComponentCategory.Display,
    component: DividerWidget,
    defaultProps: {
      text: '',
      textPosition: 'center',
      borderStyle: 'solid',
      borderColor: '#dcdfe6',
      borderWidth: '1px',
    },
    defaultStyles: {
      margin: '16px 0',
    },
    propSchema: [
      {
        key: 'text',
        label: '分割线文字',
        type: PropType.Text,
        defaultValue: '',
      },
      {
        key: 'textPosition',
        label: '文字位置',
        type: PropType.Select,
        defaultValue: 'center',
        options: [
          { label: '左侧', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右侧', value: 'right' },
        ],
      },
      {
        key: 'borderStyle',
        label: '线条样式',
        type: PropType.Select,
        defaultValue: 'solid',
        options: [
          { label: '实线', value: 'solid' },
          { label: '虚线', value: 'dashed' },
          { label: '点线', value: 'dotted' },
        ],
      },
      {
        key: 'borderColor',
        label: '线条颜色',
        type: PropType.Color,
        defaultValue: '#dcdfe6',
      },
    ],
  },

  card: {
    name: '卡片',
    type: 'card',
    icon: 'i-tabler-layout-cards',
    category: ComponentCategory.Display,
    component: CardWidget,
    defaultProps: {
      title: '卡片标题',
      content: '这是卡片内容',
      imageUrl: '',
      shadow: 'hover',
      borderRadius: '8px',
    },
    defaultStyles: {
      margin: '8px 16px',
    },
    propSchema: [
      {
        key: 'title',
        label: '卡片标题',
        type: PropType.Text,
        defaultValue: '卡片标题',
      },
      {
        key: 'content',
        label: '卡片内容',
        type: PropType.Textarea,
        defaultValue: '这是卡片内容',
      },
      {
        key: 'imageUrl',
        label: '卡片图片',
        type: PropType.Image,
        defaultValue: '',
      },
      {
        key: 'shadow',
        label: '阴影效果',
        type: PropType.Select,
        defaultValue: 'hover',
        options: [
          { label: '总是显示', value: 'always' },
          { label: '悬停显示', value: 'hover' },
          { label: '不显示', value: 'never' },
        ],
      },
      {
        key: 'borderRadius',
        label: '圆角',
        type: PropType.Text,
        defaultValue: '8px',
      },
    ],
  },

  tag: {
    name: '标签',
    type: 'tag',
    icon: 'i-tabler-tag',
    category: ComponentCategory.Display,
    component: TagWidget,
    defaultProps: {
      text: '标签',
      type: 'primary',
      size: 'medium',
      plain: false,
      round: false,
    },
    defaultStyles: {
      margin: '8px 16px',
    },
    propSchema: [
      {
        key: 'text',
        label: '标签文字',
        type: PropType.Text,
        defaultValue: '标签',
      },
      {
        key: 'type',
        label: '标签类型',
        type: PropType.Select,
        defaultValue: 'primary',
        options: [
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '警告', value: 'warning' },
          { label: '危险', value: 'danger' },
          { label: '信息', value: 'info' },
        ],
      },
      {
        key: 'size',
        label: '标签大小',
        type: PropType.Select,
        defaultValue: 'medium',
        options: [
          { label: '大', value: 'large' },
          { label: '中', value: 'medium' },
          { label: '小', value: 'small' },
        ],
      },
      {
        key: 'plain',
        label: '朴素标签',
        type: PropType.Switch,
        defaultValue: false,
      },
      {
        key: 'round',
        label: '圆角标签',
        type: PropType.Switch,
        defaultValue: false,
      },
    ],
  },

  progress: {
    name: '进度条',
    type: 'progress',
    icon: 'i-tabler-progress',
    category: ComponentCategory.Display,
    component: ProgressWidget,
    defaultProps: {
      percentage: 50,
      strokeWidth: 8,
      color: '#409eff',
      showText: true,
      textInside: false,
    },
    defaultStyles: {
      margin: '8px 16px',
    },
    propSchema: [
      {
        key: 'percentage',
        label: '进度百分比',
        type: PropType.Number,
        defaultValue: 50,
        min: 0,
        max: 100,
      },
      {
        key: 'strokeWidth',
        label: '进度条高度',
        type: PropType.Number,
        defaultValue: 8,
        min: 4,
        max: 20,
      },
      {
        key: 'color',
        label: '进度条颜色',
        type: PropType.Color,
        defaultValue: '#409eff',
      },
      {
        key: 'showText',
        label: '显示文字',
        type: PropType.Switch,
        defaultValue: true,
      },
      {
        key: 'textInside',
        label: '文字内置',
        type: PropType.Switch,
        defaultValue: false,
      },
    ],
  },

  // 布局组件
  container: {
    name: '容器',
    type: 'container',
    icon: 'i-tabler-box',
    category: ComponentCategory.Layout,
    component: ContainerWidget,
    defaultProps: {
      backgroundColor: '#ffffff',
      padding: '16px',
      borderRadius: '0',
      border: 'none',
      minHeight: '100px',
    },
    defaultStyles: {},
    propSchema: [
      {
        key: 'backgroundColor',
        label: '背景颜色',
        type: PropType.Color,
        defaultValue: '#ffffff',
      },
      {
        key: 'padding',
        label: '内边距',
        type: PropType.Text,
        defaultValue: '16px',
      },
      {
        key: 'borderRadius',
        label: '圆角',
        type: PropType.Text,
        defaultValue: '0',
      },
      {
        key: 'border',
        label: '边框',
        type: PropType.Text,
        defaultValue: 'none',
        placeholder: '如：1px solid #ddd',
      },
      {
        key: 'minHeight',
        label: '最小高度',
        type: PropType.Text,
        defaultValue: '100px',
      },
    ],
  },

  spacer: {
    name: '间距',
    type: 'spacer',
    icon: 'i-tabler-space',
    category: ComponentCategory.Layout,
    component: SpacerWidget,
    defaultProps: {
      height: '20px',
      backgroundColor: 'transparent',
    },
    defaultStyles: {},
    propSchema: [
      {
        key: 'height',
        label: '间距高度',
        type: PropType.Text,
        defaultValue: '20px',
      },
      {
        key: 'backgroundColor',
        label: '背景颜色',
        type: PropType.Color,
        defaultValue: 'transparent',
      },
    ],
  },

  // 营销组件
  swiper: {
    name: '轮播图',
    type: 'swiper',
    icon: 'i-tabler-carousel-horizontal',
    category: ComponentCategory.Marketing,
    component: SwiperWidget,
    defaultProps: {
      images: [
        'https://picsum.photos/seed/slide1/375/200',
        'https://picsum.photos/seed/slide2/375/200',
        'https://picsum.photos/seed/slide3/375/200',
      ],
      height: '200px',
      autoplay: true,
      interval: 3000,
      showIndicators: true,
    },
    defaultStyles: {
      margin: '0',
    },
    propSchema: [
      {
        key: 'height',
        label: '轮播图高度',
        type: PropType.Text,
        defaultValue: '200px',
      },
      {
        key: 'autoplay',
        label: '自动播放',
        type: PropType.Switch,
        defaultValue: true,
      },
      {
        key: 'interval',
        label: '切换间隔(ms)',
        type: PropType.Number,
        defaultValue: 3000,
        min: 1000,
        max: 10000,
      },
      {
        key: 'showIndicators',
        label: '显示指示器',
        type: PropType.Switch,
        defaultValue: true,
      },
    ],
  },

  countdown: {
    name: '倒计时',
    type: 'countdown',
    icon: 'i-tabler-clock',
    category: ComponentCategory.Marketing,
    component: CountdownWidget,
    defaultProps: {
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      format: 'DD:HH:mm:ss',
      fontSize: '24px',
      color: '#f56c6c',
    },
    defaultStyles: {
      margin: '8px 16px',
    },
    propSchema: [
      {
        key: 'format',
        label: '显示格式',
        type: PropType.Select,
        defaultValue: 'DD:HH:mm:ss',
        options: [
          { label: '天:时:分:秒', value: 'DD:HH:mm:ss' },
          { label: '时:分:秒', value: 'HH:mm:ss' },
          { label: '分:秒', value: 'mm:ss' },
        ],
      },
      {
        key: 'fontSize',
        label: '字体大小',
        type: PropType.Text,
        defaultValue: '24px',
      },
      {
        key: 'color',
        label: '文字颜色',
        type: PropType.Color,
        defaultValue: '#f56c6c',
      },
    ],
  },

  notice: {
    name: '公告栏',
    type: 'notice',
    icon: 'i-tabler-speakerphone',
    category: ComponentCategory.Marketing,
    component: NoticeWidget,
    defaultProps: {
      text: '这是一条公告信息',
      speed: 50,
      backgroundColor: '#fff7e6',
      color: '#ed6a0c',
      icon: 'i-tabler-volume',
      scrollable: true,
    },
    defaultStyles: {
      margin: '0',
    },
    propSchema: [
      {
        key: 'text',
        label: '公告内容',
        type: PropType.Textarea,
        defaultValue: '这是一条公告信息',
      },
      {
        key: 'backgroundColor',
        label: '背景颜色',
        type: PropType.Color,
        defaultValue: '#fff7e6',
      },
      {
        key: 'color',
        label: '文字颜色',
        type: PropType.Color,
        defaultValue: '#ed6a0c',
      },
      {
        key: 'scrollable',
        label: '滚动播放',
        type: PropType.Switch,
        defaultValue: true,
      },
    ],
  },
}

// 根据类型获取组件配置
export function getComponentConfig(type: string) {
  return componentRegistry[type]
}

// 根据分类获取组件列表
export function getComponentsByCategory(category: ComponentCategory) {
  return Object.values(componentRegistry).filter(comp => comp.category === category)
}

// 获取所有组件列表
export function getAllComponents() {
  return Object.values(componentRegistry)
}
