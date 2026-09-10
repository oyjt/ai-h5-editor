# H5 营销编辑器

面向营销场景的可视化 H5 搭建平台。项目基于 Vue 3 + TypeScript + Vite，实现工作台、作品管理、模板中心、素材管理、可视化编辑器、移动端预览和发布流程。

> 当前产品范围不包含数据分析与团队协作模块。

## 产品导航

工作台、模板中心、我的作品、素材管理统一使用顶部导航：

`工作台 / 模板中心 / 我的作品 / 素材管理`

顶部右侧提供统一搜索、通知和用户信息。平台搜索框采用单一白色 Surface：外层容器负责背景、边框和圆角，内部 input 保持透明，避免双层背景造成视觉割裂。

## 功能概览

### 工作台

- 最近作品
- 新建空白项目
- 从模板创建
- 已发布 / 草稿 / 素材状态概览
- 快捷进入模板中心与素材管理

### 我的作品

- 全部 / 已发布 / 草稿 / 回收站筛选
- 搜索作品
- 编辑、复制、删除
- 页面数量与更新时间展示

### 模板中心

- 分类筛选与搜索
- 收藏模板
- 自定义模板
- 模板预览
- 一键应用到编辑器

### 素材管理

- 图片、图标、插画、视频、音频素材分类
- 搜索素材
- 上传素材
- 编辑器内直接复用营销素材

### H5 可视化编辑器

- 组件拖拽与点击添加
- 左侧组件库 / 页面管理 / 模板 / 素材
- 多页面切换、复制、排序、重命名和删除
- 手机 / 平板预览
- 50%–150% 缩放
- 组件 Hover / Selected 状态
- 选中组件后右侧删除 / 上移 / 下移操作
- 右侧内容 / 样式 / 交互 / 动画配置
- 撤销 / 重做
- 自动保存
- AI 生成页面

### 营销组件

包括优惠券、商品推荐、营销表单、秒杀、拼团、抽奖、倒计时、轮播、图片、按钮等组件。部分营销组件已支持预览态交互，如领取、加购、报名、倒计时、参团和抽奖反馈。

### 预览与发布

- 手机 / 平板预览
- 二维码预览
- 发布路径配置
- 公开访问 / 密码访问
- 发布检查
- 发布成功页
- 复制访问链接

## 技术栈

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Element Plus
- Vant
- UnoCSS
- VueUse
- vue-draggable-plus
- nanoid
- qrcode
- zod

## 项目结构

```text
src/
├── ai/                     # AI 页面生成
├── components/
│   ├── dialogs/            # 预览 / 发布 / AI 弹层
│   ├── editor/             # 编辑器主体
│   │   └── panels/         # 内容 / 样式 / 交互 / 动画面板
│   ├── platform/           # 顶部平台导航
│   ├── renderer/           # Schema 渲染器
│   └── widgets/            # H5 组件库
├── config/                 # 组件与模板注册
├── router/                 # 路由
├── stores/                 # Pinia 状态
├── styles/
│   └── design-system.css   # 全局 Design Token / 搜索框规范
├── types/                  # Schema / 组件 / 模板类型
├── utils/                  # 导出与 Schema 工具
└── views/
    ├── LoginView.vue
    ├── WorkspaceView.vue
    ├── ProjectsView.vue
    ├── TemplateView.vue
    ├── AssetsView.vue
    ├── EditorView.vue
    └── PreviewView.vue
```

## 路由

| 路径 | 页面 |
| --- | --- |
| `/login` | 登录 |
| `/workspace` | 工作台 |
| `/projects` | 我的作品 |
| `/templates` | 模板中心 |
| `/assets` | 素材管理 |
| `/` | H5 编辑器 |
| `/preview` | 独立预览 |

## 开发

```bash
pnpm install
pnpm dev
```

构建：

```bash
pnpm build
```

生产预览：

```bash
pnpm preview
```

## 设计与 Agent 规范

- `DESIGN.md`：产品信息架构、顶部导航、搜索框、编辑器与交互视觉基线。
- `AGENTS.md`：AI Agent 和代码助手的开发约束。
- `src/styles/design-system.css`：运行时代码中的 Design Token 唯一来源。

UI 调整优先以最新设计稿和 `DESIGN.md` 为准。复杂交互若设计稿未覆盖，应先补设计，再开发。
