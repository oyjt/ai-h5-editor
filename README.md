# H5 营销页面可视化编辑器

一个功能强大的 H5 页面可视化编辑器，支持拖拽组件、实时预览、模板应用、页面导出等功能。

## ✨ 核心特性

### 🎨 可视化编辑
- **拖拽式操作**：从组件面板拖拽或点击添加组件到画布
- **实时预览**：所见即所得，修改立即生效
- **三栏布局**：组件面板 | 画布区域 | 属性配置面板
- **手机框架预览**：375px 移动端尺寸预览

### 🧩 组件系统
- **基础组件**：文本、图片、按钮（基于 Vant 4）
- **动态属性配置**：根据组件类型自动生成配置表单
- **样式编辑**：支持内边距、外边距、背景色、圆角等
- **组件嵌套**：支持递归嵌套渲染

### 📐 JSON Schema 驱动
- **数据与视图分离**：所有页面和组件都用 JSON 描述
- **易于序列化**：支持导入导出
- **AI 友好**：便于 AI 生成页面

### ⏱️ 历史记录
- **撤销/重做**：支持最多 50 步操作回退
- **快照机制**：每次操作记录完整状态
- **快捷键支持**：Ctrl+Z 撤销，Ctrl+Y 重做

### 🎭 模板系统
- **内置模板**：4 个常用模板（简单介绍、营销活动、信息收集、文章资讯）
- **模板分类**：营销活动、产品展示、表单收集、文章资讯
- **模板搜索**：支持按名称、描述、标签搜索
- **一键应用**：点击即可应用模板到编辑器

### 📤 发布导出
- **导出 HTML**：生成可独立运行的 HTML 文件（包含 CDN 资源）
- **导出 JSON**：导出 JSON Schema，可重新导入编辑器
- **在线预览**：生成预览链接，支持二维码扫码预览
- **移动端适配**：响应式设计，完美适配手机端

### 💾 数据持久化
- **自动保存**：页面数据自动保存到 localStorage
- **刷新不丢失**：页面刷新后自动恢复上次编辑状态

## 🛠️ 技术栈

### 核心框架
- **Vue 3.5+**：Composition API + `<script setup>`
- **TypeScript 5.9+**：类型安全
- **Vite 7.0+**：极速构建工具

### UI 框架
- **Element Plus**：编辑器界面组件库
- **Vant 4**：移动端预览组件库
- **UnoCSS**：原子化 CSS 引擎

### 状态管理
- **Pinia 3.0+**：模块化状态管理
  - `editor.ts`：编辑器核心状态
  - `history.ts`：历史记录管理
  - `templates.ts`：模板管理

### 工具库
- **Vue Router**：路由管理
- **@vueuse/core**：Vue 组合式工具集
- **nanoid**：唯一 ID 生成
- **qrcode**：二维码生成

## 📁 项目结构

```
h5-editor/
├── src/
│   ├── main.ts                    # 应用入口
│   ├── App.vue                    # 根组件
│   │
│   ├── views/                     # 页面视图
│   │   ├── EditorView.vue         # 编辑器主页面
│   │   ├── TemplateView.vue       # 模板市场页面
│   │   └── PreviewView.vue        # 独立预览页面
│   │
│   ├── components/                # 组件库
│   │   ├── editor/                # 编辑器核心组件
│   │   │   ├── Canvas.vue         # 画布区域
│   │   │   ├── ComponentPanel.vue # 组件面板
│   │   │   ├── PropertyPanel.vue  # 属性配置面板
│   │   │   ├── Toolbar.vue        # 工具栏
│   │   │   └── FormItem.vue       # 动态表单项
│   │   │
│   │   ├── renderer/              # 渲染引擎组件
│   │   │   ├── PageRenderer.vue   # 页面渲染器
│   │   │   └── ComponentRenderer.vue # 组件渲染器
│   │   │
│   │   ├── widgets/               # 可拖拽组件库
│   │   │   ├── TextWidget.vue     # 文本组件
│   │   │   ├── ImageWidget.vue    # 图片组件
│   │   │   └── ButtonWidget.vue   # 按钮组件
│   │   │
│   │   └── dialogs/               # 对话框组件
│   │       └── PublishDialog.vue  # 发布对话框
│   │
│   ├── stores/                    # Pinia 状态管理
│   │   ├── index.ts               # Store 入口
│   │   ├── editor.ts              # 编辑器状态
│   │   ├── history.ts             # 历史记录
│   │   └── templates.ts           # 模板管理
│   │
│   ├── types/                     # TypeScript 类型定义
│   │   ├── schema.ts              # JSON Schema 类型
│   │   ├── component.ts           # 组件类型
│   │   └── template.ts            # 模板类型
│   │
│   ├── utils/                     # 工具函数
│   │   ├── schema-generator.ts    # JSON Schema 生成器
│   │   └── export.ts              # 页面导出工具
│   │
│   ├── config/                    # 配置文件
│   │   ├── components.ts          # 组件库配置
│   │   └── templates.ts           # 内置模板配置
│   │
│   ├── router/                    # 路由配置
│   │   └── index.ts
│   │
│   └── assets/                    # 静态资源
│       └── styles/
│           └── main.css           # 全局样式
│
├── public/                        # 公共资源
├── index.html                     # HTML 模板
├── vite.config.ts                 # Vite 配置
├── tsconfig.json                  # TypeScript 配置
├── uno.config.ts                  # UnoCSS 配置
├── eslint.config.js               # ESLint 配置
└── package.json                   # 项目依赖
```

## 🚀 快速开始

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```

访问 `http://localhost:3000` 即可使用编辑器。

### 构建生产版本
```bash
pnpm build
```

### 预览生产版本
```bash
pnpm preview
```

## 📖 使用指南

### 1. 添加组件
- **方式一**：点击左侧组件面板中的组件
- **方式二**：拖拽组件到画布区域

### 2. 编辑组件
- 点击画布中的组件进行选择
- 在右侧属性面板中修改组件属性和样式
- 修改实时生效

### 3. 撤销/重做
- 点击工具栏的撤销/重做按钮
- 或使用快捷键：Ctrl+Z（撤销）、Ctrl+Y（重做）

### 4. 使用模板
- 点击工具栏的"模板"按钮
- 浏览模板市场，选择合适的模板
- 点击"使用模板"按钮应用到编辑器

### 5. 保存页面
- 点击工具栏的"保存"按钮
- 页面数据会自动保存到浏览器本地存储
- 刷新页面后会自动恢复

### 6. 发布页面
- 点击工具栏的"发布"按钮
- 选择导出格式：
  - **HTML**：下载可独立运行的 HTML 文件
  - **JSON**：下载 JSON Schema 文件
- 或生成预览链接，扫码在手机上查看

## 🎯 核心设计理念

### SOLID 原则
- **单一职责**：每个组件和模块职责明确
- **开闭原则**：组件注册机制易于扩展
- **里氏替换**：组件渲染器支持任意组件类型
- **接口隔离**：PropSchema 定义清晰的属性接口
- **依赖倒置**：依赖抽象的 JSON Schema，而非具体实现

### DRY（不重复）
- 组件配置统一管理
- 工具函数复用
- 样式通过 UnoCSS 原子化

### KISS（简单至上）
- JSON Schema 驱动，数据结构简单清晰
- 组件渲染逻辑简洁
- 用户操作流程直观

### YAGNI（精益求精）
- 只实现必要功能
- 避免过度设计
- 代码简洁高效

## 📝 开发规范

### 代码风格
- 使用 `@antfu/eslint-config` 规范
- 所有组件使用 Composition API + `<script setup>`
- TypeScript 严格模式
- 代码注释使用中文

### 命名规范
- 组件文件：PascalCase（如 `ComponentPanel.vue`）
- 工具函数：camelCase（如 `createComponentSchema`）
- 类型定义：PascalCase（如 `PageSchema`）
- 常量：UPPER_SNAKE_CASE（如 `MAX_HISTORY_SIZE`）

### Git 提交规范
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

## 📄 License

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

**开发完成时间**：2026-03-17
**技术栈版本**：Vue 3.5 + Vite 7.0 + TypeScript 5.9 + Element Plus 2.13 + Vant 4.9
