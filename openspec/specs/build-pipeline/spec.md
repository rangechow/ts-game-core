## ADDED Requirements

### Requirement: 构建工具配置
项目 SHALL 使用 `tsup` 作为构建工具，配置文件为 `tsup.config.ts`，MUST 满足以下要求：
- 入口文件为 `src/index.ts`
- 同时输出 ESM（`.mjs`）和 CJS（`.cjs`）两种格式
- 启用 `.d.ts` 类型声明生成
- 配置 `target` 为 `es2020`，兼容 Cocos4 和 Node.js 运行时
- 启用 `clean` 选项，构建前清理 `dist/` 目录
- 不打包 external dependencies（`node_modules` 中的依赖保持 external）

#### Scenario: 构建输出双格式文件
- **WHEN** 运行 `npm run build`
- **THEN** `dist/` 目录 SHALL 同时包含 `index.mjs`（ESM）和 `index.cjs`（CJS）文件

#### Scenario: 构建输出类型声明
- **WHEN** 运行 `npm run build`
- **THEN** `dist/` 目录 SHALL 包含 `index.d.ts`（或 `index.d.mts` / `index.d.cts`）类型声明文件

#### Scenario: 构建前自动清理
- **WHEN** `dist/` 目录中存在旧的构建产物并运行 `npm run build`
- **THEN** 旧产物 SHALL 被清除，仅保留本次构建的文件

### Requirement: 构建脚本配置
`package.json` 的 `scripts` 字段 SHALL 包含以下脚本：
- `build`: 执行 tsup 构建，输出生产环境产物
- `dev`: 执行 tsup 的 watch 模式，监听源码变更自动重新构建

#### Scenario: build 脚本正常执行
- **WHEN** 运行 `npm run build`
- **THEN** 命令 SHALL 以状态码 0 正常退出，并在 `dist/` 目录生成所有产物

#### Scenario: dev 脚本监听变更
- **WHEN** 运行 `npm run dev` 并修改 `src/` 中的源码
- **THEN** tsup SHALL 自动检测变更并重新构建 `dist/` 目录的产物

### Requirement: Cocos4 和 Node.js 双运行时兼容
构建产物 SHALL 不依赖任何浏览器特有 API（如 `window`、`document`、`DOM` 等）或 Node.js 特有 API（如 `fs`、`path`、`process` 等），确保同时可在以下环境中运行：
- Cocos Creator 4.x（浏览器 / 原生引擎）
- Node.js >= 18 后台服务

#### Scenario: 构建产物不含平台特有全局变量
- **WHEN** 对 `dist/index.mjs` 进行静态分析
- **THEN** SHALL 不包含对 `window`、`document`、`global`、`process`（直接引用）等平台特有全局变量的依赖

#### Scenario: ESM 产物可在 Node.js 中导入
- **WHEN** 在 Node.js 18+ 环境中执行 `import { } from 'ts-game-core'`
- **THEN** 导入 SHALL 成功，无运行时错误
