# todo-frontend

## 项目简介
本项目是一个基于 React 和 Vite 构建的现代待办事项管理前端，支持任务的添加、编辑、删除、筛选、搜索和统计。界面简洁，交互流畅，适合个人或团队任务管理。

## 主要功能
- 添加、编辑、删除待办事项
- 支持任务子项（子任务）管理
- 搜索和筛选任务（如按状态、日期等）
- 任务统计视图（如已完成、未完成数量）
- 动画与过渡效果，提升用户体验
- 响应式布局，适配多种设备

## 目录结构
```
src/
  components/      // 主要 UI 组件
  hooks/           // 自定义 hooks（如 useTodos）
  utils/           // 工具函数（如日期处理、API 测试等）
  assets/          // 静态资源
  App.jsx          // 应用主入口
  main.jsx         // 应用挂载入口
  index.css        // 全局样式
public/
  vite.svg         // 项目 logo
```

## 快速开始

### 使用 bun
1. 安装依赖
   ```bash
   bun install
   ```
2. 启动开发服务器
   ```bash
   bun run dev
   ```
3. 构建生产环境
   ```bash
   bun run build
   ```

### 使用 npm 或 pnpm
1. 安装依赖
   ```bash
   npm install
   pnpm install
   ```
2. 启动开发服务器
   ```bash
   npm run dev
   pnpm run dev
   ```
3. 构建生产环境
   ```bash
   npm run build
   pnpm run build
   ```

访问 [http://localhost:5173](http://localhost:5173) 查看应用。

## 组件说明
- `AddTodoForm`：添加任务表单
- `TodoList`：任务列表展示
- `TodoItem`：单个任务项
- `FilterTabs`：任务筛选标签
- `SearchBar`：任务搜索
- `TodoStats`：任务统计
- `ConfirmDialog`：操作确认弹窗
- 其他辅助组件与工具函数

## API 说明
前端通过 `utils/testApi.js` 等工具与后端进行数据交互，支持任务的增删改查。

## 构建与部署
构建后静态文件位于 `dist/` 目录，可部署至任意静态服务器。

## 其他
- 支持动画和视图过渡
- 详细功能与修复说明见各功能文档（如 `AI_SUBTASKS_FEATURE.md`、`ANIMATION_TIMING_UPDATE.md` 等）

---

如需定制或扩展功能，请参考各组件和工具函数源码。
