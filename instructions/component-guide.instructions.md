# Feature Refactor Instructions

> 该文件已放入 `instructions/` 目录，便于模型或自动化工具统一扫描和使用。

## 目标

优化组件。

## 适用范围

- 已存在组件的重构
- 新组件的开发也应遵循这些规范

## 规则

1. Props
   - 禁止使用 `FC`
   - 如果组件 Props 不会被复用（即在组件外被引用），则直接定义为 inline 形式，避免跨组件共享专用 props 定义
   - 如果是 Modal 组件，则 Props 应该包含 `ActionModalContext`
2. 路由入口组件
   - 标准函数，使用 `function ComponentName() {}` 定义
   - 默认导出，` export default functon ComponentName() {}`
3. 非入口组件
   - 箭头函数，使用 `const ComponentName = () => {}` 定义
   - 命名导出，`export const ComponentName = () => {}`
4. UI 组件确保单一职责，目的明确，边界清晰
5. 业务组件，将页面逻辑与展示逻辑分离
   - fetch 请求状态，请使用 `useDataFetch/useResourceList/useSimpleList` 等 hooks 抽离
   - 表格组件遵循 `ActionControllerOptions`
   - 禁止手动处理 modal 的 open 状态，请通过 `useActionController` 或 `ActionModalContext` 进行控制
   - 禁止在组件中直接应用css文件，请使用 `antd-style` 方案进行样式编写
   - 对组件中的 state，event handler 等逻辑进行抽离
6. 编译检查并确认无 TS 错误

## 说明

这个文件不是业务代码，它是重构规范和流程指令。无论未来是否更改 Agent 工具，任何能够读取项目文件的模型或工具都可以使用它作为迁移参考。
