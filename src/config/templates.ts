/**
 * 内置模板配置
 */

import type { Template } from '@/types/template'
import { TemplateCategory } from '@/types/template'
import { createEmptyPageSchema } from '@/utils/schema-generator'

// 内置模板列表
export const builtInTemplates: Template[] = [
  {
    id: 'template_simple_intro',
    name: '简单介绍页',
    description: '包含标题、图片和按钮的简单介绍页面',
    category: TemplateCategory.Product,
    thumbnail: 'https://picsum.photos/seed/template1/300/400',
    tags: ['简单', '介绍', '产品'],
    schema: {
      ...createEmptyPageSchema('简单介绍页'),
      components: [
        {
          id: 'comp_title',
          type: 'text',
          props: {
            content: '欢迎使用 H5 编辑器',
            fontSize: '24px',
            color: '#1890ff',
            fontWeight: 'bold',
            textAlign: 'center',
          },
          styles: {
            padding: '40px 20px 20px',
          },
        },
        {
          id: 'comp_image',
          type: 'image',
          props: {
            src: 'https://picsum.photos/seed/product1/335/200',
            alt: '产品图片',
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: '12px',
          },
          styles: {
            padding: '0 20px',
            margin: '20px 0',
          },
        },
        {
          id: 'comp_desc',
          type: 'text',
          props: {
            content: '这是一个功能强大的 H5 页面编辑器，支持拖拽组件、实时预览、模板应用等功能。',
            fontSize: '14px',
            color: '#666666',
            textAlign: 'center',
            lineHeight: '1.6',
          },
          styles: {
            padding: '20px',
          },
        },
        {
          id: 'comp_tags',
          type: 'container',
          props: {
            backgroundColor: 'transparent',
            padding: '0',
          },
          styles: {
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            padding: '0 20px',
            margin: '20px 0',
          },
        },
        {
          id: 'comp_button',
          type: 'button',
          props: {
            text: '立即体验',
            type: 'primary',
            size: 'large',
            block: true,
            round: true,
          },
          styles: {
            padding: '0 20px',
            margin: '30px 0',
          },
        },
      ],
    },
  },
  {
    id: 'template_marketing',
    name: '营销活动页',
    description: '适合促销活动的营销页面模板',
    category: TemplateCategory.Marketing,
    thumbnail: 'https://picsum.photos/seed/template2/300/400',
    tags: ['营销', '活动', '促销'],
    schema: {
      ...createEmptyPageSchema('营销活动页'),
      components: [
        {
          id: 'comp_notice',
          type: 'notice',
          props: {
            text: '🔥 限时特惠活动进行中，全场商品5折起，数量有限先到先得！',
            backgroundColor: '#fff7e6',
            color: '#ed6a0c',
            scrollable: true,
          },
          styles: {
            margin: '0',
          },
        },
        {
          id: 'comp_swiper',
          type: 'swiper',
          props: {
            images: [
              'https://picsum.photos/seed/banner1/375/200',
              'https://picsum.photos/seed/banner2/375/200',
              'https://picsum.photos/seed/banner3/375/200',
            ],
            height: '200px',
            autoplay: true,
            interval: 3000,
            showIndicators: true,
          },
          styles: {
            margin: '0',
          },
        },
        {
          id: 'comp_title',
          type: 'text',
          props: {
            content: '🎉 限时优惠活动',
            fontSize: '28px',
            color: '#ff4d4f',
            fontWeight: 'bold',
            textAlign: 'center',
          },
          styles: {
            padding: '30px 20px 10px',
          },
        },
        {
          id: 'comp_countdown',
          type: 'countdown',
          props: {
            endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            format: 'HH:mm:ss',
            fontSize: '32px',
            color: '#ff4d4f',
          },
          styles: {
            padding: '20px',
            textAlign: 'center',
          },
        },
        {
          id: 'comp_divider',
          type: 'divider',
          props: {
            text: '热门商品',
            textPosition: 'center',
            borderStyle: 'solid',
            borderColor: '#ff7875',
          },
          styles: {
            margin: '20px 16px',
          },
        },
        {
          id: 'comp_card1',
          type: 'card',
          props: {
            title: '爆款商品 A',
            content: '原价 ¥199，现价 ¥99，限量100件',
            imageUrl: 'https://picsum.photos/seed/product1/335/180',
            shadow: 'hover',
            borderRadius: '12px',
          },
          styles: {
            margin: '16px',
          },
        },
        {
          id: 'comp_card2',
          type: 'card',
          props: {
            title: '爆款商品 B',
            content: '原价 ¥299，现价 ¥149，限量50件',
            imageUrl: 'https://picsum.photos/seed/product2/335/180',
            shadow: 'hover',
            borderRadius: '12px',
          },
          styles: {
            margin: '16px',
          },
        },
        {
          id: 'comp_button',
          type: 'button',
          props: {
            text: '立即抢购',
            type: 'danger',
            size: 'large',
            block: true,
            round: true,
          },
          styles: {
            padding: '0 20px',
            margin: '30px 0',
          },
        },
      ],
    },
  },
  {
    id: 'template_form',
    name: '信息收集表单',
    description: '用于收集用户信息的表单页面',
    category: TemplateCategory.Form,
    thumbnail: 'https://picsum.photos/seed/template3/300/400',
    tags: ['表单', '收集', '信息'],
    schema: {
      ...createEmptyPageSchema('信息收集表单'),
      components: [
        {
          id: 'comp_header_image',
          type: 'image',
          props: {
            src: 'https://picsum.photos/seed/formheader/375/150',
            alt: '表单头图',
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
          },
          styles: {
            margin: '0',
          },
        },
        {
          id: 'comp_title',
          type: 'text',
          props: {
            content: '用户信息登记',
            fontSize: '22px',
            color: '#1890ff',
            fontWeight: 'bold',
            textAlign: 'center',
          },
          styles: {
            padding: '30px 20px 10px',
          },
        },
        {
          id: 'comp_desc',
          type: 'text',
          props: {
            content: '请填写以下信息，我们将为您提供更好的服务',
            fontSize: '14px',
            color: '#666666',
            textAlign: 'center',
          },
          styles: {
            padding: '0 20px 20px',
          },
        },
        {
          id: 'comp_divider1',
          type: 'divider',
          props: {
            text: '基本信息',
            textPosition: 'left',
            borderStyle: 'solid',
            borderColor: '#e8e8e8',
          },
          styles: {
            margin: '20px 16px',
          },
        },
        {
          id: 'comp_input_name',
          type: 'input',
          props: {
            placeholder: '请输入您的姓名',
            type: 'text',
          },
          styles: {
            margin: '8px 16px',
          },
        },
        {
          id: 'comp_input_phone',
          type: 'input',
          props: {
            placeholder: '请输入手机号码',
            type: 'tel',
          },
          styles: {
            margin: '8px 16px',
          },
        },
        {
          id: 'comp_input_email',
          type: 'input',
          props: {
            placeholder: '请输入邮箱地址',
            type: 'email',
          },
          styles: {
            margin: '8px 16px',
          },
        },
        {
          id: 'comp_divider2',
          type: 'divider',
          props: {
            text: '偏好设置',
            textPosition: 'left',
            borderStyle: 'solid',
            borderColor: '#e8e8e8',
          },
          styles: {
            margin: '20px 16px',
          },
        },
        {
          id: 'comp_radio',
          type: 'radio',
          props: {
            options: [
              { label: '男', value: 'male' },
              { label: '女', value: 'female' },
            ],
            value: 'male',
            direction: 'horizontal',
          },
          styles: {
            margin: '8px 16px',
          },
        },
        {
          id: 'comp_checkbox',
          type: 'checkbox',
          props: {
            options: [
              { label: '接收邮件通知', value: 'email' },
              { label: '接收短信通知', value: 'sms' },
              { label: '接收推送通知', value: 'push' },
            ],
            value: ['email'],
            direction: 'vertical',
          },
          styles: {
            margin: '8px 16px',
          },
        },
        {
          id: 'comp_spacer',
          type: 'spacer',
          props: {
            height: '20px',
          },
          styles: {},
        },
        {
          id: 'comp_submit',
          type: 'button',
          props: {
            text: '提交信息',
            type: 'primary',
            size: 'large',
            block: true,
            round: true,
          },
          styles: {
            padding: '0 20px',
            margin: '20px 0 40px',
          },
        },
      ],
    },
  },
  {
    id: 'template_article',
    name: '文章资讯页',
    description: '适合展示文章内容的页面模板',
    category: TemplateCategory.Article,
    thumbnail: 'https://picsum.photos/seed/template4/300/400',
    tags: ['文章', '资讯', '内容'],
    schema: {
      ...createEmptyPageSchema('文章资讯页'),
      components: [
        {
          id: 'comp_cover',
          type: 'image',
          props: {
            src: 'https://picsum.photos/seed/article1/375/200',
            alt: '文章封面',
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
          },
          styles: {
            margin: '0',
          },
        },
        {
          id: 'comp_title',
          type: 'text',
          props: {
            content: '如何使用 H5 编辑器创建精美页面',
            fontSize: '20px',
            color: '#262626',
            fontWeight: 'bold',
            textAlign: 'left',
          },
          styles: {
            padding: '24px 20px 12px',
          },
        },
        {
          id: 'comp_meta',
          type: 'text',
          props: {
            content: '作者：张三 | 发布时间：2024-01-01 | 阅读量：1.2k',
            fontSize: '12px',
            color: '#8c8c8c',
            textAlign: 'left',
          },
          styles: {
            padding: '0 20px 12px',
          },
        },
        {
          id: 'comp_tags_container',
          type: 'container',
          props: {
            backgroundColor: 'transparent',
            padding: '0 20px',
          },
          styles: {
            display: 'flex',
            gap: '8px',
            margin: '0 0 20px',
          },
        },
        {
          id: 'comp_divider',
          type: 'divider',
          props: {
            text: '',
            borderStyle: 'solid',
            borderColor: '#e8e8e8',
          },
          styles: {
            margin: '20px 0',
          },
        },
        {
          id: 'comp_content',
          type: 'text',
          props: {
            content: 'H5 编辑器是一个功能强大的可视化页面编辑工具，支持拖拽组件、实时预览、模板应用等功能。\n\n通过简单的拖拽操作，您就可以快速创建出精美的 H5 页面。无论是营销活动页、产品介绍页，还是信息收集表单，都能轻松搞定。\n\n编辑器内置了丰富的组件库，包括文本、图片、按钮、表单、轮播图、倒计时等，满足各种场景需求。',
            fontSize: '15px',
            color: '#262626',
            textAlign: 'left',
            lineHeight: '1.8',
          },
          styles: {
            padding: '0 20px',
          },
        },
        {
          id: 'comp_image_in_content',
          type: 'image',
          props: {
            src: 'https://picsum.photos/seed/content1/335/200',
            alt: '内容配图',
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: '8px',
          },
          styles: {
            padding: '0 20px',
            margin: '24px 0',
          },
        },
        {
          id: 'comp_content2',
          type: 'text',
          props: {
            content: '此外，编辑器还支持响应式设计，确保您的页面在各种设备上都能完美展示。快来体验吧！',
            fontSize: '15px',
            color: '#262626',
            textAlign: 'left',
            lineHeight: '1.8',
          },
          styles: {
            padding: '0 20px 40px',
          },
        },
      ],
    },
  },
  // ── 功能导航页 ──────────────────────────────────────────────
  {
    id: 'template_nav_home',
    name: '功能导航页',
    description: '带顶部导航、轮播和九宫格功能入口的首页模板',
    category: TemplateCategory.Product,
    thumbnail: 'https://picsum.photos/seed/template_nav/300/400',
    tags: ['导航', '首页', '功能入口', '九宫格'],
    schema: {
      ...createEmptyPageSchema('功能导航页'),
      components: [
        {
          id: 'comp_navbar',
          type: 'navbar',
          props: {
            title: '我的应用',
            leftIcon: '',
            rightIcon: 'search',
            fixed: false,
            backgroundColor: '#1890ff',
            titleColor: '#ffffff',
            border: false,
          },
          styles: { margin: '0' },
        },
        {
          id: 'comp_notice',
          type: 'notice',
          props: {
            text: '📢 欢迎使用，点击右上角搜索查找更多功能',
            backgroundColor: '#e6f7ff',
            color: '#1890ff',
            scrollable: true,
          },
          styles: { margin: '0' },
        },
        {
          id: 'comp_swiper',
          type: 'swiper',
          props: {
            images: [
              'https://picsum.photos/seed/nav_b1/375/180',
              'https://picsum.photos/seed/nav_b2/375/180',
              'https://picsum.photos/seed/nav_b3/375/180',
            ],
            height: '180px',
            autoplay: true,
            interval: 3000,
            showIndicators: true,
          },
          styles: { margin: '0' },
        },
        {
          id: 'comp_grid_main',
          type: 'grid',
          props: {
            columnNum: 4,
            iconSize: '28px',
            gutter: 0,
            square: false,
            center: true,
            border: true,
            clickable: true,
            items: [
              { icon: 'i-tabler-shopping-cart', text: '购物车' },
              { icon: 'i-tabler-heart', text: '收藏' },
              { icon: 'i-tabler-user', text: '我的' },
              { icon: 'i-tabler-message-circle', text: '消息' },
              { icon: 'i-tabler-home', text: '首页' },
              { icon: 'i-tabler-layout-grid', text: '分类' },
              { icon: 'i-tabler-star', text: '推荐' },
              { icon: 'i-tabler-inbox', text: '订单' },
            ],
          },
          styles: { margin: '16px 0 0' },
        },
        {
          id: 'comp_divider_hot',
          type: 'divider',
          props: { text: '热门推荐', textPosition: 'center', borderStyle: 'solid', borderColor: '#e8e8e8' },
          styles: { margin: '20px 16px' },
        },
        {
          id: 'comp_card1',
          type: 'card',
          props: {
            title: '精选活动',
            content: '限时优惠，多款商品低至5折',
            imageUrl: 'https://picsum.photos/seed/nav_c1/335/160',
            shadow: 'hover',
            borderRadius: '12px',
          },
          styles: { margin: '0 16px 16px' },
        },
        {
          id: 'comp_cell_list',
          type: 'cell',
          props: {
            title: '最新公告',
            value: '查看详情',
            icon: 'i-tabler-speakerphone',
            isLink: true,
            border: true,
            size: 'large',
          },
          styles: { margin: '0' },
        },
        {
          id: 'comp_spacer_bottom',
          type: 'spacer',
          props: { height: '40px' },
          styles: {},
        },
      ],
    },
  },

  // ── 商品详情页 ──────────────────────────────────────────────
  {
    id: 'template_product_detail',
    name: '商品详情页',
    description: '完整的商品详情页，含评分、规格选择、FAQ折叠和购买按钮',
    category: TemplateCategory.Product,
    thumbnail: 'https://picsum.photos/seed/template_pd/300/400',
    tags: ['商品', '详情', '电商', '评分'],
    schema: {
      ...createEmptyPageSchema('商品详情页'),
      components: [
        {
          id: 'comp_navbar',
          type: 'navbar',
          props: {
            title: '商品详情',
            leftText: '返回',
            leftIcon: 'arrow-left',
            rightText: '分享',
            fixed: false,
            backgroundColor: '#ffffff',
            titleColor: '#262626',
            border: true,
          },
          styles: { margin: '0' },
        },
        {
          id: 'comp_swiper',
          type: 'swiper',
          props: {
            images: [
              'https://picsum.photos/seed/pd1/375/375',
              'https://picsum.photos/seed/pd2/375/375',
              'https://picsum.photos/seed/pd3/375/375',
            ],
            height: '375px',
            autoplay: false,
            showIndicators: true,
          },
          styles: { margin: '0' },
        },
        {
          id: 'comp_price_title',
          type: 'text',
          props: {
            content: '¥ 199  原价¥399',
            fontSize: '22px',
            color: '#ff4d4f',
            fontWeight: 'bold',
          },
          styles: { padding: '16px 16px 4px' },
        },
        {
          id: 'comp_product_name',
          type: 'text',
          props: {
            content: '高品质无线蓝牙耳机 主动降噪版',
            fontSize: '16px',
            color: '#262626',
            fontWeight: '500',
            lineHeight: '1.5',
          },
          styles: { padding: '0 16px 8px' },
        },
        {
          id: 'comp_rate',
          type: 'rate',
          props: {
            modelValue: 4,
            count: 5,
            size: '18px',
            color: '#ffd21e',
            voidColor: '#c8c9cc',
            readonly: true,
            showScore: true,
          },
          styles: { padding: '0 16px 16px' },
        },
        {
          id: 'comp_divider1',
          type: 'divider',
          props: { text: '', borderStyle: 'solid', borderColor: '#f0f0f0' },
          styles: { margin: '0' },
        },
        {
          id: 'comp_qty_row',
          type: 'cell',
          props: {
            title: '购买数量',
            icon: 'i-tabler-square-plus',
            isLink: false,
            border: true,
            size: 'large',
          },
          styles: { margin: '0' },
        },
        {
          id: 'comp_stepper',
          type: 'stepper',
          props: {
            modelValue: 1,
            min: 1,
            max: 99,
            step: 1,
            showInput: true,
            buttonSize: '28px',
            disabled: false,
          },
          styles: { padding: '8px 16px' },
        },
        {
          id: 'comp_tab',
          type: 'tab',
          props: {
            tabs: [
              { title: '商品详情', content: '优质材料，精工制作，为您带来卓越体验。主动降噪技术，有效降低环境噪音高达35dB。超长续航，充满电可连续使用30小时。' },
              { title: '规格参数', content: '连接方式：蓝牙5.2\n频率响应：20Hz-20kHz\n重量：250g\n充电接口：Type-C\n续航时间：30小时' },
              { title: '用户评价', content: '⭐⭐⭐⭐⭐ 音质非常好，降噪效果出色！\n⭐⭐⭐⭐⭐ 佩戴舒适，续航给力，值得购买！\n⭐⭐⭐⭐ 整体不错，就是有点重。' },
            ],
            active: 0,
            color: '#1890ff',
            type: 'line',
            duration: 300,
          },
          styles: { margin: '16px 0' },
        },
        {
          id: 'comp_faq',
          type: 'collapse',
          props: {
            items: [
              { name: '1', title: '支持哪些设备连接？', content: '支持所有蓝牙5.0及以上的设备，包括手机、平板、电脑等。' },
              { name: '2', title: '售后保修政策是什么？', content: '产品享受1年官方质保，非人为损坏免费维修或更换。' },
              { name: '3', title: '包装内有哪些配件？', content: '耳机本体 ×1、充电线 ×1、耳机包 ×1、使用说明书 ×1。' },
            ],
            accordion: true,
            border: true,
          },
          styles: { margin: '0 0 80px' },
        },
        {
          id: 'comp_buy_btn',
          type: 'button',
          props: {
            text: '立即购买',
            type: 'danger',
            size: 'large',
            block: true,
            round: false,
          },
          styles: { padding: '0 16px', margin: '16px 0 40px' },
        },
      ],
    },
  },

  // ── 用户中心页 ──────────────────────────────────────────────
  {
    id: 'template_user_center',
    name: '用户中心页',
    description: '个人中心页面，含头像、统计数据、功能列表和徽标提醒',
    category: TemplateCategory.Product,
    thumbnail: 'https://picsum.photos/seed/template_uc/300/400',
    tags: ['用户中心', '个人', '我的', '设置'],
    schema: {
      ...createEmptyPageSchema('用户中心页'),
      components: [
        {
          id: 'comp_header_bg',
          type: 'container',
          props: { backgroundColor: '#1890ff', padding: '40px 20px 60px' },
          styles: {},
        },
        {
          id: 'comp_avatar',
          type: 'image',
          props: {
            src: 'https://picsum.photos/seed/avatar1/80/80',
            alt: '用户头像',
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '50%',
          },
          styles: { margin: '0 auto 12px', display: 'block' },
        },
        {
          id: 'comp_username',
          type: 'text',
          props: {
            content: '用户昵称',
            fontSize: '18px',
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center',
          },
          styles: { padding: '0 20px 4px' },
        },
        {
          id: 'comp_user_tag',
          type: 'tag',
          props: { text: 'VIP 会员', type: 'warning', size: 'medium', plain: false, round: true },
          styles: { display: 'flex', justifyContent: 'center', padding: '0 0 20px' },
        },
        {
          id: 'comp_stats_divider',
          type: 'divider',
          props: { text: '我的数据', textPosition: 'center', borderStyle: 'solid', borderColor: '#e8e8e8' },
          styles: { margin: '20px 16px 8px' },
        },
        {
          id: 'comp_grid_stats',
          type: 'grid',
          props: {
            columnNum: 4,
            iconSize: '0',
            gutter: 0,
            square: false,
            center: true,
            border: true,
            clickable: false,
            items: [
              { icon: '', text: '12\n订单' },
              { icon: '', text: '5\n收藏' },
              { icon: '', text: '3\n优惠券' },
              { icon: '', text: '188\n积分' },
            ],
          },
          styles: { margin: '0' },
        },
        {
          id: 'comp_order_divider',
          type: 'divider',
          props: { text: '我的订单', textPosition: 'left', borderStyle: 'solid', borderColor: '#e8e8e8' },
          styles: { margin: '20px 16px 8px' },
        },
        {
          id: 'comp_grid_order',
          type: 'grid',
          props: {
            columnNum: 4,
            iconSize: '24px',
            gutter: 0,
            square: false,
            center: true,
            border: false,
            clickable: true,
            items: [
              { icon: 'i-tabler-inbox', text: '待付款' },
              { icon: 'i-tabler-shopping-cart', text: '待发货' },
              { icon: 'i-tabler-heart', text: '待收货' },
              { icon: 'i-tabler-star', text: '待评价' },
            ],
          },
          styles: { margin: '0 0 8px' },
        },
        {
          id: 'comp_cell_coupon',
          type: 'cell',
          props: { title: '优惠券', value: '3张可用', icon: 'i-tabler-tag', isLink: true, border: true, size: 'large' },
          styles: { margin: '0' },
        },
        {
          id: 'comp_cell_address',
          type: 'cell',
          props: { title: '收货地址', value: '管理', icon: 'i-tabler-home', isLink: true, border: true, size: 'large' },
          styles: { margin: '0' },
        },
        {
          id: 'comp_cell_service',
          type: 'cell',
          props: { title: '联系客服', value: '', icon: 'i-tabler-message-circle', isLink: true, border: true, size: 'large' },
          styles: { margin: '0' },
        },
        {
          id: 'comp_cell_settings',
          type: 'cell',
          props: { title: '账号设置', value: '', icon: 'i-tabler-user', isLink: true, border: true, size: 'large' },
          styles: { margin: '0' },
        },
        {
          id: 'comp_spacer_bottom',
          type: 'spacer',
          props: { height: '40px' },
          styles: {},
        },
      ],
    },
  },

  // ── 流程引导页 ──────────────────────────────────────────────
  {
    id: 'template_process_guide',
    name: '流程引导页',
    description: '带步骤条的报名/申请流程引导页，适合活动报名、任务引导',
    category: TemplateCategory.Form,
    thumbnail: 'https://picsum.photos/seed/template_pg/300/400',
    tags: ['流程', '步骤', '引导', '报名'],
    schema: {
      ...createEmptyPageSchema('流程引导页'),
      components: [
        {
          id: 'comp_navbar',
          type: 'navbar',
          props: {
            title: '活动报名',
            leftText: '返回',
            leftIcon: 'arrow-left',
            fixed: false,
            backgroundColor: '#ffffff',
            titleColor: '#262626',
            border: true,
          },
          styles: { margin: '0' },
        },
        {
          id: 'comp_banner',
          type: 'image',
          props: {
            src: 'https://picsum.photos/seed/guide_banner/375/160',
            alt: '活动封面',
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
          },
          styles: { margin: '0' },
        },
        {
          id: 'comp_title',
          type: 'text',
          props: {
            content: '2026 年度技能大赛报名',
            fontSize: '20px',
            color: '#262626',
            fontWeight: 'bold',
            textAlign: 'center',
          },
          styles: { padding: '24px 20px 8px' },
        },
        {
          id: 'comp_desc',
          type: 'text',
          props: {
            content: '参赛选手须完成以下报名流程，请按照步骤逐项完成。',
            fontSize: '14px',
            color: '#8c8c8c',
            textAlign: 'center',
            lineHeight: '1.6',
          },
          styles: { padding: '0 20px 20px' },
        },
        {
          id: 'comp_steps',
          type: 'steps',
          props: {
            steps: [
              { text: '填写信息' },
              { text: '上传资料' },
              { text: '缴纳报名费' },
              { text: '报名成功' },
            ],
            active: 1,
            direction: 'horizontal',
            activeColor: '#1890ff',
            inactiveColor: '#c8c9cc',
          },
          styles: { padding: '0 16px 24px' },
        },
        {
          id: 'comp_divider',
          type: 'divider',
          props: { text: '基本信息', textPosition: 'left', borderStyle: 'solid', borderColor: '#e8e8e8' },
          styles: { margin: '0 16px 16px' },
        },
        {
          id: 'comp_input_name',
          type: 'input',
          props: { placeholder: '请输入真实姓名', type: 'text' },
          styles: { margin: '8px 16px' },
        },
        {
          id: 'comp_input_phone',
          type: 'input',
          props: { placeholder: '请输入联系电话', type: 'tel' },
          styles: { margin: '8px 16px' },
        },
        {
          id: 'comp_input_org',
          type: 'input',
          props: { placeholder: '请输入所在单位/学校', type: 'text' },
          styles: { margin: '8px 16px' },
        },
        {
          id: 'comp_divider2',
          type: 'divider',
          props: { text: '参赛方向', textPosition: 'left', borderStyle: 'solid', borderColor: '#e8e8e8' },
          styles: { margin: '20px 16px 16px' },
        },
        {
          id: 'comp_radio',
          type: 'radio',
          props: {
            options: [
              { label: '前端开发', value: 'frontend' },
              { label: '后端开发', value: 'backend' },
              { label: 'UI 设计', value: 'design' },
            ],
            value: 'frontend',
            direction: 'vertical',
          },
          styles: { margin: '0 16px 8px' },
        },
        {
          id: 'comp_divider3',
          type: 'divider',
          props: { text: '报名须知', textPosition: 'left', borderStyle: 'solid', borderColor: '#e8e8e8' },
          styles: { margin: '20px 16px 8px' },
        },
        {
          id: 'comp_collapse_faq',
          type: 'collapse',
          props: {
            items: [
              { name: '1', title: '报名截止时间', content: '报名截止时间为 2026年4月15日 23:59，请在截止前完成全部流程。' },
              { name: '2', title: '报名费用说明', content: '个人参赛报名费为 200元/人，团队参赛（3人以内）报名费为 500元/队。' },
              { name: '3', title: '资格审核说明', content: '提交报名信息后，主办方将在 3个工作日 内完成资格审核，审核结果将以短信形式通知。' },
            ],
            accordion: false,
            border: true,
          },
          styles: { margin: '0 0 16px' },
        },
        {
          id: 'comp_agree_checkbox',
          type: 'checkbox',
          props: {
            options: [{ label: '我已阅读并同意《参赛规则》和《隐私政策》', value: 'agree' }],
            value: [],
            direction: 'vertical',
          },
          styles: { margin: '8px 16px' },
        },
        {
          id: 'comp_submit',
          type: 'button',
          props: {
            text: '下一步：上传资料',
            type: 'primary',
            size: 'large',
            block: true,
            round: true,
          },
          styles: { padding: '0 20px', margin: '24px 0 40px' },
        },
      ],
    },
  },

  {
    id: 'template_ecommerce',
    name: '电商促销页',
    description: '完整的电商促销活动页面，包含轮播、倒计时、商品卡片等',
    category: TemplateCategory.Marketing,
    thumbnail: 'https://picsum.photos/seed/template5/300/400',
    tags: ['电商', '促销', '购物', '营销'],
    schema: {
      ...createEmptyPageSchema('电商促销页'),
      components: [
        {
          id: 'comp_notice',
          type: 'notice',
          props: {
            text: '🎁 新用户专享：首单立减50元，满199包邮！',
            backgroundColor: '#fff0f6',
            color: '#eb2f96',
            scrollable: true,
          },
          styles: {
            margin: '0',
          },
        },
        {
          id: 'comp_swiper',
          type: 'swiper',
          props: {
            images: [
              'https://picsum.photos/seed/shop1/375/200',
              'https://picsum.photos/seed/shop2/375/200',
              'https://picsum.photos/seed/shop3/375/200',
            ],
            height: '200px',
            autoplay: true,
            interval: 3000,
            showIndicators: true,
          },
          styles: {
            margin: '0',
          },
        },
        {
          id: 'comp_spacer1',
          type: 'spacer',
          props: {
            height: '16px',
            backgroundColor: '#f5f5f5',
          },
          styles: {},
        },
        {
          id: 'comp_title',
          type: 'text',
          props: {
            content: '⚡ 限时秒杀',
            fontSize: '24px',
            color: '#ff4d4f',
            fontWeight: 'bold',
            textAlign: 'center',
          },
          styles: {
            padding: '24px 20px 12px',
          },
        },
        {
          id: 'comp_countdown',
          type: 'countdown',
          props: {
            endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            format: 'HH:mm:ss',
            fontSize: '28px',
            color: '#ff4d4f',
          },
          styles: {
            padding: '12px 20px',
            textAlign: 'center',
          },
        },
        {
          id: 'comp_progress',
          type: 'progress',
          props: {
            percentage: 68,
            strokeWidth: 10,
            color: '#ff4d4f',
            showText: true,
          },
          styles: {
            margin: '16px 20px',
          },
        },
        {
          id: 'comp_progress_text',
          type: 'text',
          props: {
            content: '已抢购 68%，仅剩 32 件',
            fontSize: '13px',
            color: '#8c8c8c',
            textAlign: 'center',
          },
          styles: {
            padding: '0 20px 20px',
          },
        },
        {
          id: 'comp_divider',
          type: 'divider',
          props: {
            text: '热销商品',
            textPosition: 'center',
            borderStyle: 'dashed',
            borderColor: '#ff7875',
          },
          styles: {
            margin: '20px 16px',
          },
        },
        {
          id: 'comp_card1',
          type: 'card',
          props: {
            title: '爆款商品 A',
            content: '限时特价 ¥99 | 原价 ¥299\n已售 1580 件 | 好评率 99%',
            imageUrl: 'https://picsum.photos/seed/product1/335/180',
            shadow: 'hover',
            borderRadius: '12px',
          },
          styles: {
            margin: '16px',
          },
        },
        {
          id: 'comp_card2',
          type: 'card',
          props: {
            title: '热销商品 B',
            content: '限时特价 ¥149 | 原价 ¥399\n已售 2360 件 | 好评率 98%',
            imageUrl: 'https://picsum.photos/seed/product2/335/180',
            shadow: 'hover',
            borderRadius: '12px',
          },
          styles: {
            margin: '16px',
          },
        },
        {
          id: 'comp_card3',
          type: 'card',
          props: {
            title: '新品推荐 C',
            content: '新品上市 ¥199 | 限量500件\n预售中 | 预计3天发货',
            imageUrl: 'https://picsum.photos/seed/product3/335/180',
            shadow: 'hover',
            borderRadius: '12px',
          },
          styles: {
            margin: '16px',
          },
        },
        {
          id: 'comp_spacer2',
          type: 'spacer',
          props: {
            height: '20px',
          },
          styles: {},
        },
        {
          id: 'comp_button',
          type: 'button',
          props: {
            text: '立即抢购',
            type: 'danger',
            size: 'large',
            block: true,
            round: true,
          },
          styles: {
            padding: '0 20px',
            margin: '0 0 40px',
          },
        },
      ],
    },
  },
]

// 根据分类获取模板
export function getTemplatesByCategory(category: TemplateCategory) {
  return builtInTemplates.filter(t => t.category === category)
}

// 根据 ID 获取模板
export function getTemplateById(id: string) {
  return builtInTemplates.find(t => t.id === id)
}

// 获取所有模板
export function getAllTemplates() {
  return builtInTemplates
}
