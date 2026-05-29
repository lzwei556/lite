# Feature Refactor Instructions

> 该文件已放入 `instructions/` 目录，便于模型或自动化工具统一扫描和使用。

## 目标

将旧的结构迁移到 `features/<feature>`，统一业务逻辑至 `domain/<feature>.ts`。

## 适用范围

- 迁移老旧页面与功能组件
- 删除存在但未使用的文件/组件

## 重构规则

1. 删除旧的 `types/<feature>.ts` 和 `apis/<feature>.ts`
2. 新建 `domain/<feature>.ts`
   - 包含类型声明
   - 包含数据转换函数
   - 包含 API 请求函数
3. 查找旧组件
4. 迁移组件到 `features/<feature>/`，如果存在路由入口组件，则迁移至 `pages/<feature>/` 下
5. 删除未实际使用的组件、方法、API
6. 遵循组件开发规范（见 `component-guide.instructions.md`）
7. 更新路由表中对旧组件的引用
8. 编译检查并确认无 TS 错误

## 页面迁移要点

1. 新页面组件应放在 `src/features/<feature>/` 下。
2. 组件应只负责渲染和交互，不负责 HTTP 请求逻辑。
3. 使用 `domain/<feature>` 提供的 hook 来获取数据，例如 `useDataFetch(get)`。
4. 对于复杂图表或数据处理逻辑，可提取为独立 helper 函数或子组件。
5. 如果旧页面不再使用，则删除。

## 说明

这个文件不是业务代码，它是重构规范和流程指令。无论未来是否更改 Agent 工具，任何能够读取项目文件的模型或工具都可以使用它作为迁移参考。
