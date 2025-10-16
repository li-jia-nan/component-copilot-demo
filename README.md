# Component Copilot Demo

Component Copilot Demo 是一个基于 Next.js 的交互式「设计 → 代码」生成工作台。输入组件需求，系统会调用 Moonshot Kimi 模型生成 HTML/CSS/JS 代码，通过内置沙箱即时预览，同时提供代码编辑和版本切换能力，便于快速迭代组件原型。

## 快速开始

### 环境准备

- Node.js >= 18.18（推荐 22 LTS）
- 包管理器：pnpm（可使用 `npm` 或 `yarn`，但已提供 `pnpm-lock.yaml`）
- 获取 Moonshot 平台的 `MOONSHOT_API_KEY`

### 安装与运行

1. 安装依赖：`pnpm install`
2. 配置环境变量：在项目根目录创建 `.env.local`
   ```bash
   MOONSHOT_API_KEY=your_api_key
   ```
3. 开发模式启动：`pnpm dev`
4. 生产构建与启动：
   ```bash
   pnpm build
   pnpm start
   ```
5. 访问 `http://localhost:3000`，在左侧输入需求即会触发 AI 生成流程

## 技术选型与架构设计

- **应用框架：Next.js 15 App Router** — 统一服务端 API 和前端界面，利用最新的 React 19 特性和 `route.ts` Server Actions 简化后端接入。
- **状态管理：Zustand + Immer** — 通过 `store/index.ts` 维护对话和代码片段；轻量化的同时支持 immutable 更新，适合快速状态切片。
- **数据请求：SWR Mutation** — 在 `app/utils/sendPost` 中封装 LLM 调用，自动处理重试与状态缓存，使得生成动作具备响应式体验。
- **代码编辑：Monaco Editor** — `app/components/CodeEditor` 将三段代码拆分视图，提供语法高亮和快捷编辑能力。
- **UI 与交互：SCSS Module + Tailwind 基础变量** — 组件化样式隔离，保持主题一致性并降低全局污染风险。
- **LLM 接入：Moonshot Kimi** — 使用 `kimi-k2-0905-preview` 模型，兼顾中文指令理解能力和前端代码生成质量。
- **沙箱方案：iframe + CSP** — `PreviewPanel` 组件通过 `sandbox="allow-scripts"` 和自定义 CSP (`buildSrcDoc`) 限制第三方资源加载，阻断潜在 XSS。

### 模块划分

- `app/api/generate-component`：服务端路由，接收 Prompt 并调用 Moonshot API。
- `app/components/*`：界面组件，包含聊天面板、代码编辑器、预览区、工具栏等。
- `app/utils`：封装 Prompt、CSP 模板、SWR 请求。
- `store`：Zustand 全局状态。
- `lib`、`styleRegistry.tsx`：Next.js 自定义配置，保证样式在服务端正确注入。

## Prompt 设计

- **System Prompt (`baseSystemPrompt`)**：约束模型只输出 JSON `{ html, css, js }`，杜绝 Markdown/解释性文本；强调使用原生技术、避免副作用、控制格式紧凑。这样能降低解析失败概率并保证安全。
- **User Prompt (`buildUserPrompt`)**：在系统提示之上简单包装用户意图，避免噪声输入，后续可扩展上下文或历史记录。
- **流程控制**：在 `store` 中保留系统消息，确保每次生成都携带默认约束条件，即便用户重置依旧有效。

## 架构关键决策

- **为什么选择 Moonshot**：项目面向中文设计师/开发者，Kimi 模型对中文描述理解更佳，同时提供稳定的 API 和成本优势。
- **选择 Next.js 而非纯 CRA/Vite**：App Router 的服务器组件和路由约定让 API 与前端同构，减少部署位点；同时使用 Edge/Node runtime 灵活切换。
- **沙箱安全策略**：决定采用 iframe inline preview，而非直接 `dangerouslySetInnerHTML`。配合严格 CSP 与 `sandbox` 属性，阻断外链、脚本注入和网络请求，保证生成代码可控。
- **状态设计**：对话消息和代码分离，支持未来加入版本管理或手动编辑合并；`showCode` 控制器便于聚焦预览或代码。

## 遇到的挑战与解决方案

- **模型输出格式不稳定**：早期模型偶尔返回 Markdown。通过加强 system prompt、明确 JSON 约束、加上“不要包含反引号”限制，输出稳定性显著提升。
- **预览安全性**：生成代码可能包含第三方脚本。通过 `buildSrcDoc` 注入 CSP，限制资源源并仅允许内联脚本，同时 `sandbox` 限制顶层访问，解决了安全隐患。
- **多段代码同步问题**：需要在预览中实时展示 HTML/CSS/JS。引入 `useMemo` 缓存 `srcdoc`，并在 Zustand 内存储最新代码，避免 iframe 不必要刷新。
- **API 响应延迟**：Moonshot 响应时间相较本地模型更长。加入 `isMutating` 状态，在 `Loading` 与 `ThinkingLoader` 组件中反馈加载状态，提升用户体验。

## 开发脚本

- `pnpm dev`：本地开发模式（Turbopack）。
- `pnpm build`：生产构建。
- `pnpm start`：使用构建产物启动。
- `pnpm lint`：运行 ESLint。

## 后续扩展思路

- 支持流式输出，让代码逐步渲染。
- 引入版本差异对比，记录历史生成结果。
- 增加 Prompt 模板管理，针对不同组件类型优化。
- 结合云端模板库，实现生成代码的快速落地。

欢迎提交 Issue 或 PR，一起完善 Component Copilot Demo。
