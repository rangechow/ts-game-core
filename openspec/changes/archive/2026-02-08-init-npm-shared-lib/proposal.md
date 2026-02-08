## Why

当前项目 `ts-game-core` 需要建立一个标准的 npm 公共库，作为 Cocos Creator 4.x 客户端和后台服务（Node.js）之间的共享代码基础。通过抽取公共逻辑到独立的 npm 包中，可以避免代码重复、统一类型定义、降低维护成本，并确保前后端行为一致性。

## What Changes

- **初始化 npm 包结构**：创建符合 npm 标准的 `package.json`，配置包名、版本、入口、类型声明等字段
- **配置 TypeScript 编译**：设置 `tsconfig.json`，支持同时输出 ESM 和 CJS 格式，兼容 Cocos4 和 Node.js 环境
- **搭建构建流程**：引入构建工具（如 tsup 或 unbuild），配置 build / dev 脚本
- **配置代码质量工具**：集成 ESLint、Prettier，确保代码风格统一
- **配置测试框架**：引入 Vitest 作为单元测试工具
- **建立源码目录结构**：创建 `src/` 目录和入口文件 `src/index.ts`，预留模块扩展空间
- **配置发布流程**：设置 `.npmignore` 或 `package.json` 的 `files` 字段，确保发布包干净

## Capabilities

### New Capabilities
- `npm-package-scaffold`: npm 包基础脚手架，包括 package.json、tsconfig.json、构建配置、目录结构
- `build-pipeline`: 构建流水线，支持 ESM/CJS 双格式输出，适配 Cocos4 和 Node.js 运行时
- `dev-toolchain`: 开发工具链，包括 ESLint、Prettier、Vitest 等代码质量和测试工具配置

### Modified Capabilities
<!-- 无现有能力需要修改 -->

## Impact

- **代码结构**：从空项目初始化为标准 npm 包结构，新增 `src/`、`dist/`、配置文件等
- **依赖**：引入 TypeScript、tsup/unbuild（构建）、Vitest（测试）、ESLint + Prettier（代码质量）等开发依赖
- **API**：建立 `src/index.ts` 作为包的公共入口，后续所有公共能力从此导出
- **系统兼容性**：需同时兼容 Cocos Creator 4.x（浏览器/原生环境）和 Node.js 后台服务运行时
