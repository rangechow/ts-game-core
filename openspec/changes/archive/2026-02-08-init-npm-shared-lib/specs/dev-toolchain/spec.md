## ADDED Requirements

### Requirement: ESLint 代码检查配置
项目 SHALL 使用 ESLint（flat config 格式）进行代码静态检查，配置文件为 `eslint.config.mjs`，MUST 满足以下要求：
- 使用 `@typescript-eslint/parser` 解析 TypeScript
- 启用 `@typescript-eslint/eslint-plugin` 推荐规则集
- 检查范围为 `src/` 和 `__tests__/` 目录
- 忽略 `dist/` 和 `node_modules/` 目录

#### Scenario: lint 脚本检测代码问题
- **WHEN** 运行 `npm run lint`
- **THEN** ESLint SHALL 检查 `src/` 和 `__tests__/` 下所有 `.ts` 文件并报告问题

#### Scenario: lint 不检查构建产物
- **WHEN** 运行 `npm run lint`
- **THEN** `dist/` 目录下的文件 SHALL 不被检查

### Requirement: Prettier 代码格式化配置
项目 SHALL 使用 Prettier 进行代码格式化，配置文件为 `.prettierrc`，MUST 包含以下基本配置：
- `semi`: true（使用分号）
- `singleQuote`: true（使用单引号）
- `tabWidth`: 2（缩进 2 空格）
- `trailingComma`: "all"（尾随逗号）
- `printWidth`: 100（行宽限制）

#### Scenario: format 脚本格式化代码
- **WHEN** 运行 `npm run format`
- **THEN** Prettier SHALL 格式化 `src/` 和 `__tests__/` 下所有 `.ts` 文件

#### Scenario: ESLint 与 Prettier 不冲突
- **WHEN** 代码通过 Prettier 格式化后运行 `npm run lint`
- **THEN** ESLint SHALL 不因格式问题报错（通过 `eslint-config-prettier` 集成）

### Requirement: Vitest 测试框架配置
项目 SHALL 使用 Vitest 作为单元测试框架，MUST 满足以下要求：
- 配置在 `vitest.config.ts` 或 `vite.config.ts` 中
- 测试文件放置在 `__tests__/` 目录，匹配 `**/*.test.ts` 模式
- 支持 TypeScript 源码的直接导入（无需预编译）

#### Scenario: test 脚本运行测试
- **WHEN** 运行 `npm run test`
- **THEN** Vitest SHALL 执行 `__tests__/` 目录下所有 `*.test.ts` 文件

#### Scenario: 示例测试通过
- **WHEN** 项目初始化完成后运行 `npm run test`
- **THEN** 至少有一个示例测试 SHALL 存在且通过

### Requirement: 开发工具链脚本汇总
`package.json` 的 `scripts` 字段 SHALL 包含以下开发工具链脚本：
- `lint`: 运行 ESLint 检查
- `lint:fix`: 运行 ESLint 检查并自动修复
- `format`: 运行 Prettier 格式化
- `format:check`: 运行 Prettier 检查格式（不修改文件）
- `test`: 运行 Vitest 测试
- `test:watch`: 运行 Vitest watch 模式

#### Scenario: 所有开发脚本可正常运行
- **WHEN** 依次运行 `npm run lint`、`npm run format:check`、`npm run test`
- **THEN** 每个命令 SHALL 以状态码 0 正常退出
