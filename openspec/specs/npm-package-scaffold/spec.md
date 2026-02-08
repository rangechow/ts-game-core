## ADDED Requirements

### Requirement: package.json 符合 npm 标准
项目根目录 SHALL 包含一个 `package.json` 文件，其中 MUST 包含以下字段：
- `name`: 包名（scoped 或 unscoped）
- `version`: 语义化版本号，初始为 `0.1.0`
- `description`: 包描述
- `main`: CJS 入口，指向 `dist/index.cjs`
- `module`: ESM 入口，指向 `dist/index.mjs`
- `types`: 类型声明入口，指向 `dist/index.d.ts`
- `exports`: 条件导出映射，分别配置 `import`、`require`、`types` 子路径
- `files`: 发布文件白名单，仅包含 `dist/` 目录
- `license`: 许可证类型
- `engines`: 声明支持的 Node.js 版本范围

#### Scenario: 验证 package.json 基本字段完整性
- **WHEN** 运行 `npm pack --dry-run`
- **THEN** 输出中 SHALL 仅包含 `dist/` 下的文件和 `package.json`

#### Scenario: 验证 exports 条件导出配置
- **WHEN** 在 Node.js 中通过 `import` 导入该包
- **THEN** 系统 SHALL 解析到 `dist/index.mjs`
- **WHEN** 在 Node.js 中通过 `require()` 导入该包
- **THEN** 系统 SHALL 解析到 `dist/index.cjs`

### Requirement: TypeScript 配置支持双运行时环境
项目根目录 SHALL 包含 `tsconfig.json`，MUST 满足以下配置：
- `target`: 设置为 `ES2020` 或更高，兼容 Cocos4 和现代 Node.js
- `module`: 设置为 `ESNext`
- `moduleResolution`: 设置为 `bundler` 或 `node16`
- `declaration`: 启用，生成 `.d.ts` 类型声明文件
- `strict`: 启用严格模式
- `outDir`: 指向 `dist/`
- `rootDir`: 指向 `src/`
- `lib`: 包含 `ES2020`，不包含 DOM 相关 lib（确保不引入浏览器特有 API）

#### Scenario: TypeScript 编译成功
- **WHEN** 运行 `npx tsc --noEmit`
- **THEN** 编译 SHALL 无错误退出

#### Scenario: 不依赖浏览器 API
- **WHEN** 源码中引用 `document` 或 `window` 等 DOM API
- **THEN** TypeScript 编译 SHALL 报错，提示类型不存在

### Requirement: 源码目录结构规范
项目 SHALL 采用以下目录结构：
- `src/`: 源码目录
- `src/index.ts`: 包的公共入口文件，所有对外 API 从此导出
- `dist/`: 构建产物目录（git-ignored）
- `__tests__/`: 测试文件目录

#### Scenario: 入口文件存在且可导入
- **WHEN** 构建完成后
- **THEN** `dist/index.mjs`、`dist/index.cjs`、`dist/index.d.ts` 三个文件 SHALL 均存在

#### Scenario: dist 目录不纳入版本管理
- **WHEN** 检查 `.gitignore` 文件
- **THEN** `dist/` 目录 SHALL 被包含在忽略列表中

### Requirement: .gitignore 配置完整
项目根目录 SHALL 包含 `.gitignore` 文件，MUST 忽略以下内容：
- `node_modules/`
- `dist/`
- `*.tsbuildinfo`
- `.DS_Store`
- 编辑器相关临时文件

#### Scenario: 版本管理不包含构建产物和依赖
- **WHEN** 运行 `git status` 在全新 clone 并构建后
- **THEN** `node_modules/` 和 `dist/` SHALL 不出现在未跟踪文件列表中
