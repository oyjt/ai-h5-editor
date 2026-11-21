# 开发指南

## 环境与命令

需要 Node.js 18+ 和 pnpm。

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 先生成 Design Token，再启动开发服务器 |
| `pnpm build` | 生成 Token、类型检查、构建 |
| `pnpm preview` | 预览构建产物 |
| `pnpm typecheck` | 仅类型检查 |
| `pnpm tokens` | 单独重新生成 Token（dev / build 已自动执行） |

## 技术栈

Vue 3、TypeScript、Vite、Pinia、Vue Router、Element Plus、Vant、UnoCSS、Style Dictionary、VueUse、vue-draggable-plus、zod、qrcode、nanoid。

## 目录结构

```text
src/
├── agent/            # Agent：类型、本地规划器、模型调用、补丁应用
├── ai/               # 组件目录与页面生成器
├── components/
│   ├── agent/        # AI 面板、快速发起、任务悬浮岛
│   ├── dialogs/      # 预览 / 发布 / 设置等弹层
│   ├── editor/       # 编辑器主体（含 panels/ 属性面板）
│   ├── platform/     # 顶部平台导航
│   ├── renderer/     # Schema 渲染器
│   └── widgets/      # H5 组件库
├── config/           # 组件与模板注册
├── design/           # Token、规范校验、示例图、代码生成
├── router/
├── stores/           # Pinia：editor / agent / settings / style-library / ui ...
├── styles/           # 全局样式、design-system.css、生成的 Token CSS
├── types/            # Schema / 组件 / 模板类型
├── utils/            # 导出、素材库（IndexedDB）、项目文件导入导出
└── views/            # 各路由页面
tokens/               # Design Token 源文件（DTCG 格式）
scripts/              # Token 构建脚本
public/samples/       # 本地示例图
docs/                 # 文档
```

## Design Token

- 源文件：`tokens/ant-design.tokens.json`，由 Style Dictionary 生成 `src/styles/tokens.generated.css`（CSS 变量 `--ud-*`）、`src/design/tokens.generated.ts` 和 UnoCSS 主题色（如 `bg-ud-primary`）。
- 不要手改 `*.generated.*` 文件。
- 平台界面本身的样式变量在 `src/styles/design-system.css`。

## 数据存储

| 数据 | 位置 |
| --- | --- |
| 项目与页面 | localStorage（`h5-editor-project`） |
| 上传的图片 | IndexedDB（`ai-h5-assets`），页面里以 `asset://<id>` 引用 |
| 设置（示例图来源、模型 Key） | localStorage（`ai-h5-settings`） |
| 风格库 | localStorage（`ai-h5-style-libraries`） |

导出 HTML / JSON 时会把 `asset://` 图片内联为 data URL。

## 模型服务

优先级：「设置」面板里填写的接口 > 环境变量 > 本地规划器。环境变量（写在 `.env.local`）：

```bash
VITE_LLM_ENDPOINT=https://your-gateway/v1/chat/completions   # OpenAI 兼容
VITE_LLM_MODEL=your-model
VITE_LLM_API_KEY=...        # 仅用于本地开发；前端构建产物会包含它，不要用于公开部署
```

模型输出经 zod 校验，不合法或请求失败时回落到本地规划器。

## 参与约定

提交前阅读 [AGENTS.md](../AGENTS.md) 和 [设计系统](design-system.md)；UI 以最新设计稿和 `DESIGN.md` 为准。
