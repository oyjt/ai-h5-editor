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
import GridWidget from '@/components/widgets/GridWidget.vue'
import CellWidget from '@/components/widgets/CellWidget.vue'
import BadgeWidget from '@/components/widgets/BadgeWidget.vue'
import StepsWidget from '@/components/widgets/StepsWidget.vue'
import StepperWidget from '@/components/widgets/StepperWidget.vue'
import RateWidget from '@/components/widgets/RateWidget.vue'
import NavBarWidget from '@/components/widgets/NavBarWidget.vue'
import TabWidget from '@/components/widgets/TabWidget.vue'
import CollapseWidget from '@/components/widgets/CollapseWidget.vue'
import EmptyWidget from '@/components/widgets/EmptyWidget.vue'
import SkeletonWidget from '@/components/widgets/SkeletonWidget.vue'
import PopoverWidget from '@/components/widgets/PopoverWidget.vue'
import ActionBarWidget from '@/components/widgets/ActionBarWidget.vue'
import TabbarWidget from '@/components/widgets/TabbarWidget.vue'

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
    category: ComponentCategory.Display,
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
        key: 'images',
        label: '轮播图片',
        type: PropType.ImageList,
        defaultValue: [
          'https://picsum.photos/seed/slide1/375/200',
          'https://picsum.photos/seed/slide2/375/200',
          'https://picsum.photos/seed/slide3/375/200',
        ],
      },
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
    category: ComponentCategory.Display,
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
    category: ComponentCategory.Display,
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

  // 新增组件
  grid: {
    name: '宫格',
    type: 'grid',
    icon: 'i-tabler-grid-dots',
    category: ComponentCategory.Navigation,
    component: GridWidget,
    defaultProps: {
      columnNum: 4,
      iconSize: '28px',
      gutter: 0,
      square: false,
      center: true,
      border: true,
      clickable: true,
    },
    defaultStyles: {
      margin: '0',
    },
    propSchema: [
      {
        key: 'columnNum',
        label: '列数',
        type: PropType.Number,
        defaultValue: 4,
        min: 2,
        max: 6,
      },
      {
        key: 'iconSize',
        label: '图标大小',
        type: PropType.Text,
        defaultValue: '28px',
      },
      {
        key: 'gutter',
        label: '格子间距',
        type: PropType.Number,
        defaultValue: 0,
        min: 0,
        max: 20,
      },
      {
        key: 'square',
        label: '正方形格子',
        type: PropType.Switch,
        defaultValue: false,
      },
      {
        key: 'center',
        label: '内容居中',
        type: PropType.Switch,
        defaultValue: true,
      },
      {
        key: 'border',
        label: '显示边框',
        type: PropType.Switch,
        defaultValue: true,
      },
    ],
  },

  cell: {
    name: '单元格',
    type: 'cell',
    icon: 'i-tabler-list',
    category: ComponentCategory.Basic,
    component: CellWidget,
    defaultProps: {
      title: '单元格',
      value: '',
      label: '',
      icon: '',
      isLink: false,
      border: true,
      center: false,
      size: 'normal',
    },
    defaultStyles: {
      margin: '0',
    },
    propSchema: [
      {
        key: 'title',
        label: '标题',
        type: PropType.Text,
        defaultValue: '单元格',
      },
      {
        key: 'value',
        label: '右侧内容',
        type: PropType.Text,
        defaultValue: '',
      },
      {
        key: 'label',
        label: '描述信息',
        type: PropType.Text,
        defaultValue: '',
      },
      {
        key: 'isLink',
        label: '显示箭头',
        type: PropType.Switch,
        defaultValue: false,
      },
      {
        key: 'border',
        label: '显示边框',
        type: PropType.Switch,
        defaultValue: true,
      },
      {
        key: 'center',
        label: '垂直居中',
        type: PropType.Switch,
        defaultValue: false,
      },
      {
        key: 'size',
        label: '单元格大小',
        type: PropType.Select,
        defaultValue: 'normal',
        options: [
          { label: '正常', value: 'normal' },
          { label: '大', value: 'large' },
        ],
      },
    ],
  },

  badge: {
    name: '徽标',
    type: 'badge',
    icon: 'i-tabler-badge',
    category: ComponentCategory.Display,
    component: BadgeWidget,
    defaultProps: {
      content: 5,
      max: 99,
      dot: false,
      color: '#ee0a24',
      position: 'top-right',
      showZero: true,
      childContent: '内容',
      childIcon: '',
    },
    defaultStyles: {
      margin: '8px 16px',
    },
    propSchema: [
      {
        key: 'content',
        label: '徽标内容',
        type: PropType.Text,
        defaultValue: '5',
        description: '可以是数字或文字',
      },
      {
        key: 'max',
        label: '最大值',
        type: PropType.Number,
        defaultValue: 99,
        description: '超过最大值显示为 max+',
      },
      {
        key: 'dot',
        label: '圆点徽标',
        type: PropType.Switch,
        defaultValue: false,
      },
      {
        key: 'color',
        label: '徽标颜色',
        type: PropType.Color,
        defaultValue: '#ee0a24',
      },
      {
        key: 'position',
        label: '徽标位置',
        type: PropType.Select,
        defaultValue: 'top-right',
        options: [
          { label: '右上角', value: 'top-right' },
          { label: '左上角', value: 'top-left' },
          { label: '右下角', value: 'bottom-right' },
          { label: '左下角', value: 'bottom-left' },
        ],
      },
      {
        key: 'childContent',
        label: '子元素内容',
        type: PropType.Text,
        defaultValue: '内容',
      },
    ],
  },

  steps: {
    name: '步骤条',
    type: 'steps',
    icon: 'i-tabler-stairs',
    category: ComponentCategory.Display,
    component: StepsWidget,
    defaultProps: {
      active: 0,
      direction: 'horizontal',
      activeColor: '#07c160',
      inactiveColor: '#969799',
      activeIcon: 'i-tabler-check',
      inactiveIcon: '',
    },
    defaultStyles: {
      margin: '0',
    },
    propSchema: [
      {
        key: 'active',
        label: '当前步骤',
        type: PropType.Number,
        defaultValue: 0,
        min: 0,
        description: '从 0 开始计数',
      },
      {
        key: 'direction',
        label: '显示方向',
        type: PropType.Select,
        defaultValue: 'horizontal',
        options: [
          { label: '水平', value: 'horizontal' },
          { label: '垂直', value: 'vertical' },
        ],
      },
      {
        key: 'activeColor',
        label: '激活颜色',
        type: PropType.Color,
        defaultValue: '#07c160',
      },
      {
        key: 'inactiveColor',
        label: '未激活颜色',
        type: PropType.Color,
        defaultValue: '#969799',
      },
    ],
  },

  stepper: {
    name: '步进器',
    type: 'stepper',
    icon: 'i-tabler-square-plus',
    category: ComponentCategory.Form,
    component: StepperWidget,
    defaultProps: {
      modelValue: 1,
      min: 1,
      max: 99999,
      step: 1,
      disabled: false,
      disableInput: false,
      showInput: true,
      buttonSize: '28px',
    },
    defaultStyles: {
      margin: '8px 16px',
    },
    propSchema: [
      {
        key: 'modelValue',
        label: '当前值',
        type: PropType.Number,
        defaultValue: 1,
      },
      {
        key: 'min',
        label: '最小值',
        type: PropType.Number,
        defaultValue: 1,
      },
      {
        key: 'max',
        label: '最大值',
        type: PropType.Number,
        defaultValue: 99999,
      },
      {
        key: 'step',
        label: '步长',
        type: PropType.Number,
        defaultValue: 1,
      },
      {
        key: 'showInput',
        label: '显示输入框',
        type: PropType.Switch,
        defaultValue: true,
      },
      {
        key: 'disabled',
        label: '禁用',
        type: PropType.Switch,
        defaultValue: false,
      },
    ],
  },

  rate: {
    name: '评分',
    type: 'rate',
    icon: 'i-tabler-star',
    category: ComponentCategory.Form,
    component: RateWidget,
    defaultProps: {
      modelValue: 3,
      count: 5,
      size: '20px',
      color: '#ee0a24',
      voidColor: '#c8c9cc',
      icon: 'i-tabler-star-filled',
      voidIcon: 'i-tabler-star',
      readonly: false,
      disabled: false,
      showScore: false,
    },
    defaultStyles: {
      margin: '8px 16px',
    },
    propSchema: [
      {
        key: 'modelValue',
        label: '当前分数',
        type: PropType.Number,
        defaultValue: 3,
        min: 0,
      },
      {
        key: 'count',
        label: '图标总数',
        type: PropType.Number,
        defaultValue: 5,
        min: 1,
        max: 10,
      },
      {
        key: 'size',
        label: '图标大小',
        type: PropType.Text,
        defaultValue: '20px',
      },
      {
        key: 'color',
        label: '选中颜色',
        type: PropType.Color,
        defaultValue: '#ee0a24',
      },
      {
        key: 'voidColor',
        label: '未选中颜色',
        type: PropType.Color,
        defaultValue: '#c8c9cc',
      },
      {
        key: 'showScore',
        label: '显示分数',
        type: PropType.Switch,
        defaultValue: false,
      },
      {
        key: 'readonly',
        label: '只读',
        type: PropType.Switch,
        defaultValue: false,
      },
      {
        key: 'disabled',
        label: '禁用',
        type: PropType.Switch,
        defaultValue: false,
      },
    ],
  },

  navbar: {
    name: '导航栏',
    type: 'navbar',
    icon: 'i-tabler-layout-navbar',
    category: ComponentCategory.Navigation,
    component: NavBarWidget,
    defaultProps: {
      title: '标题',
      leftText: '',
      rightText: '',
      leftIcon: 'i-tabler-arrow-left',
      rightIcon: '',
      fixed: false,
      placeholder: false,
      zIndex: 1,
      backgroundColor: '#fff',
      titleColor: '#323233',
      border: true,
    },
    defaultStyles: {
      margin: '0',
    },
    propSchema: [
      {
        key: 'title',
        label: '标题',
        type: PropType.Text,
        defaultValue: '标题',
      },
      {
        key: 'leftText',
        label: '左侧文字',
        type: PropType.Text,
        defaultValue: '',
      },
      {
        key: 'rightText',
        label: '右侧文字',
        type: PropType.Text,
        defaultValue: '',
      },
      {
        key: 'backgroundColor',
        label: '背景颜色',
        type: PropType.Color,
        defaultValue: '#fff',
      },
      {
        key: 'titleColor',
        label: '标题颜色',
        type: PropType.Color,
        defaultValue: '#323233',
      },
      {
        key: 'fixed',
        label: '固定在顶部',
        type: PropType.Switch,
        defaultValue: false,
      },
      {
        key: 'border',
        label: '显示下边框',
        type: PropType.Switch,
        defaultValue: true,
      },
    ],
  },

  tab: {
    name: '标签页',
    type: 'tab',
    icon: 'i-tabler-layout-bottombar',
    category: ComponentCategory.Display,
    component: TabWidget,
    defaultProps: {
      active: 'tab1',
      color: '#1989fa',
      type: 'line',
      duration: 0.3,
    },
    defaultStyles: {
      margin: '0',
    },
    propSchema: [
      {
        key: 'color',
        label: '主题色',
        type: PropType.Color,
        defaultValue: '#1989fa',
      },
      {
        key: 'type',
        label: '样式类型',
        type: PropType.Select,
        defaultValue: 'line',
        options: [
          { label: '线条', value: 'line' },
          { label: '卡片', value: 'card' },
        ],
      },
    ],
  },

  collapse: {
    name: '折叠面板',
    type: 'collapse',
    icon: 'i-tabler-layout-collage',
    category: ComponentCategory.Display,
    component: CollapseWidget,
    defaultProps: {
      accordion: false,
      border: true,
      activeNames: [],
    },
    defaultStyles: {
      margin: '0',
    },
    propSchema: [
      {
        key: 'accordion',
        label: '手风琴模式',
        type: PropType.Switch,
        defaultValue: false,
        description: '开启后只能展开一个面板',
      },
      {
        key: 'border',
        label: '显示边框',
        type: PropType.Switch,
        defaultValue: true,
      },
    ],
  },

  empty: {
    name: '空状态',
    type: 'empty',
    icon: 'i-tabler-inbox',
    category: ComponentCategory.Display,
    component: EmptyWidget,
    defaultProps: {
      image: '',
      imageSize: '160px',
      description: '暂无数据',
      icon: 'i-tabler-inbox',
    },
    defaultStyles: {
      margin: '0',
    },
    propSchema: [
      {
        key: 'description',
        label: '描述文字',
        type: PropType.Text,
        defaultValue: '暂无数据',
      },
      {
        key: 'image',
        label: '自定义图片',
        type: PropType.Image,
        defaultValue: '',
        description: '留空则显示默认图标',
      },
      {
        key: 'imageSize',
        label: '图片大小',
        type: PropType.Text,
        defaultValue: '160px',
      },
    ],
  },

  skeleton: {
    name: '骨架屏',
    type: 'skeleton',
    icon: 'i-tabler-layout-grid',
    category: ComponentCategory.Display,
    component: SkeletonWidget,
    defaultProps: {
      row: 3,
      rowWidth: '100%',
      title: false,
      avatar: false,
      avatarSize: '32px',
      avatarShape: 'round',
      loading: true,
      animate: true,
    },
    defaultStyles: {
      margin: '0',
    },
    propSchema: [
      {
        key: 'loading',
        label: '显示骨架屏',
        type: PropType.Switch,
        defaultValue: true,
      },
      {
        key: 'row',
        label: '段落行数',
        type: PropType.Number,
        defaultValue: 3,
        min: 0,
        max: 10,
      },
      {
        key: 'title',
        label: '显示标题',
        type: PropType.Switch,
        defaultValue: false,
      },
      {
        key: 'avatar',
        label: '显示头像',
        type: PropType.Switch,
        defaultValue: false,
      },
      {
        key: 'avatarSize',
        label: '头像大小',
        type: PropType.Text,
        defaultValue: '32px',
      },
      {
        key: 'avatarShape',
        label: '头像形状',
        type: PropType.Select,
        defaultValue: 'round',
        options: [
          { label: '圆形', value: 'round' },
          { label: '方形', value: 'square' },
        ],
      },
      {
        key: 'animate',
        label: '显示动画',
        type: PropType.Switch,
        defaultValue: true,
      },
    ],
  },

  popover: {
    name: '气泡',
    type: 'popover',
    icon: 'i-tabler-message-circle',
    category: ComponentCategory.Display,
    component: PopoverWidget,
    defaultProps: {
      content: '这是一段提示内容',
      placement: 'bottom',
      trigger: 'click',
      theme: 'light',
      offset: 8,
      showArrow: true,
      childText: '点击',
      childIcon: '',
    },
    defaultStyles: {
      margin: '8px 16px',
    },
    propSchema: [
      {
        key: 'content',
        label: '提示内容',
        type: PropType.Textarea,
        defaultValue: '这是一段提示内容',
      },
      {
        key: 'placement',
        label: '弹出位置',
        type: PropType.Select,
        defaultValue: 'bottom',
        options: [
          { label: '上方', value: 'top' },
          { label: '下方', value: 'bottom' },
          { label: '左侧', value: 'left' },
          { label: '右侧', value: 'right' },
        ],
      },
      {
        key: 'trigger',
        label: '触发方式',
        type: PropType.Select,
        defaultValue: 'click',
        options: [
          { label: '点击', value: 'click' },
          { label: '悬停', value: 'hover' },
        ],
      },
      {
        key: 'theme',
        label: '主题风格',
        type: PropType.Select,
        defaultValue: 'light',
        options: [
          { label: '浅色', value: 'light' },
          { label: '深色', value: 'dark' },
        ],
      },
      {
        key: 'showArrow',
        label: '显示箭头',
        type: PropType.Switch,
        defaultValue: true,
      },
      {
        key: 'childText',
        label: '触发元素文字',
        type: PropType.Text,
        defaultValue: '点击',
      },
    ],
  },

  actionbar: {
    name: '动作栏',
    type: 'actionbar',
    icon: 'i-tabler-layout-bottombar-expand',
    category: ComponentCategory.Navigation,
    component: ActionBarWidget,
    defaultProps: {
      icons: [
        { icon: 'i-tabler-shopping-cart', text: '购物车' },
        { icon: 'i-tabler-heart', text: '收藏' },
      ],
      buttons: [
        { text: '加入购物车', type: 'warning' },
        { text: '立即购买', type: 'danger' },
      ],
      safeAreaInsetBottom: true,
      placeholder: true,
    },
    defaultStyles: {
      margin: '0',
    },
    propSchema: [
      {
        key: 'safeAreaInsetBottom',
        label: '底部安全区适配',
        type: PropType.Switch,
        defaultValue: true,
        description: '开启后会为 iPhone X 等机型留出底部安全距离',
      },
      {
        key: 'placeholder',
        label: '固定在底部',
        type: PropType.Switch,
        defaultValue: true,
        description: '开启后会固定在页面底部并生成占位元素',
      },
    ],
  },

  tabbar: {
    name: '标签栏',
    type: 'tabbar',
    icon: 'i-tabler-layout-navbar-expand',
    category: ComponentCategory.Navigation,
    component: TabbarWidget,
    defaultProps: {
      tabs: [
        { name: 'home', text: '首页', icon: 'i-tabler-home', activeIcon: 'i-tabler-home-filled' },
        { name: 'category', text: '分类', icon: 'i-tabler-category', activeIcon: 'i-tabler-category-filled' },
        { name: 'cart', text: '购物车', icon: 'i-tabler-shopping-cart', badge: 5 },
        { name: 'user', text: '我的', icon: 'i-tabler-user', activeIcon: 'i-tabler-user-filled' },
      ],
      active: 'home',
      fixed: true,
      placeholder: true,
      safeAreaInsetBottom: true,
      activeColor: '#1989fa',
      inactiveColor: '#7d7e80',
      border: true,
    },
    defaultStyles: {
      margin: '0',
    },
    propSchema: [
      {
        key: 'activeColor',
        label: '选中颜色',
        type: PropType.Color,
        defaultValue: '#1989fa',
      },
      {
        key: 'inactiveColor',
        label: '未选中颜色',
        type: PropType.Color,
        defaultValue: '#7d7e80',
      },
      {
        key: 'fixed',
        label: '固定在底部',
        type: PropType.Switch,
        defaultValue: true,
      },
      {
        key: 'placeholder',
        label: '显示占位',
        type: PropType.Switch,
        defaultValue: true,
        description: '固定在底部时,是否生成占位元素',
      },
      {
        key: 'safeAreaInsetBottom',
        label: '底部安全区适配',
        type: PropType.Switch,
        defaultValue: true,
      },
      {
        key: 'border',
        label: '显示上边框',
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
