## Context

`ts-game-core` 是一个全新的 TypeScript 项目（当前无 `package.json`），目标是构建为标准 npm 公共库，同时服务于 Cocos Creator 4.x 客户端和 Node.js 后台服务。项目需要从零搭建完整的包结构、构建流程和开发工具链。

关键约束：
- **双运行时**：产物必须同时兼容浏览器（Cocos4 引擎）和 Node.js >= 18
- **双模块格式**：需同时输出 ESM 和 CJS，适配不同消费方的模块系统
- **纯逻辑库**：不可依赖 DOM API 或 Node.js 特有 API，仅提供平台无关的公共逻辑

## Goals / Non-Goals

**Goals:**
- 建立符合 npm 标准的包结构，支持 `npm publish` 发布
- 配置 ESM / CJS 双格式构建，附带完整的 `.d.ts` 类型声明
- 集成 ESLint + Prettier + Vitest 开发工具链，确保代码质量
- 提供 `build` / `dev` / `lint` / `test` / `format` 等标准 npm scripts

**Non-Goals:**
- 不设计具体的业务功能模块（后续 change 补充）
- 不配置 CI/CD 流水线（可独立 change 处理）
- 不配置 npm 自动发布（如 changesets / semantic-release）
- 不处理 monorepo 场景

## Decisions

### Decision 1: 使用 tsup 作为构建工具

**选择**: tsup  
**替代方案**: unbuild, rollup + plugins, tsc 直接编译

**理由**:
- tsup 基于 esbuild，构建速度极快，对小型公共库非常友好
- 原生支持 ESM / CJS 双格式输出、`.d.ts` 生成，零配置即可满足需求
- 配置文件 `tsup.config.ts` 支持 TypeScript，类型安全
- 相比 unbuild（基于 rollup），tsup 更轻量、社区活跃度更高
- 相比纯 tsc，tsup 能处理 bundle 优化和格式转换，不需要额外工具链

### Decision 2: TypeScript target 设为 ES2020

**选择**: ES2020  
**替代方案**: ES2015, ES2022, ESNext

**理由**:
- ES2020 提供了 optional chaining (`?.`)、nullish coalescing (`??`)、`BigInt`、`Promise.allSettled` 等现代语法
- Cocos Creator 4.x 的 JavaScript 引擎（V8/JSC）完全支持 ES2020
- Node.js 18+ 完全支持 ES2020
- 相比 ES2015 减少了大量 polyfill 和降级代码，产物更精简
- 相比 ESNext 或 ES2022，兼容性风险更低

### Decision 3: moduleResolution 使用 bundler 模式

**选择**: `bundler`  
**替代方案**: `node16`, `nodenext`, `node`

**理由**:
- `bundler` 模式是 TypeScript 5.0+ 推荐的新策略，专为配合打包工具（tsup/esbuild）设计
- 支持 `package.json` 的 `exports` 字段解析
- 允许省略文件扩展名（与传统 TS 开发习惯一致）
- 相比 `node16` 不强制要求 `.js` 扩展名，开发体验更好
- 最终产物由 tsup 处理模块解析，源码阶段的 moduleResolution 只影响 IDE 体验和类型检查

### Decision 4: ESLint 采用 flat config 格式

**选择**: `eslint.config.mjs`（flat config）  
**替代方案**: `.eslintrc.json` / `.eslintrc.js`（legacy config）

**理由**:
- ESLint v9 默认使用 flat config，legacy config 已进入弃用倒计时
- flat config 更简洁，不需要 `extends` 继承链，依赖关系更清晰
- 配合 `typescript-eslint` v8+ 的 `tseslint.config()` 工具函数，配置更简洁
- 通过 `eslint-config-prettier` 禁用与 Prettier 冲突的格式规则

### Decision 5: 测试框架选择 Vitest

**选择**: Vitest  
**替代方案**: Jest, Mocha

**理由**:
- Vitest 原生支持 TypeScript 和 ESM，无需额外配置 `ts-jest` 或 babel 转换
- 与 Vite 生态兼容，底层使用 esbuild 转换，启动速度快
- API 兼容 Jest（`describe` / `it` / `expect`），迁移成本低
- 支持 watch 模式、并行测试，开发体验优秀
- 对于纯逻辑库（无 DOM 依赖），Vitest 的默认环境即可满足需求

### Decision 6: 包入口使用 exports 条件导出

**选择**: 同时配置 `exports` + `main` + `module` + `types`  
**替代方案**: 仅配置 `main`

**理由**:
- `exports` 是 Node.js 12.11+ 引入的现代包入口方案，支持条件导出（import/require/types）
- 保留 `main`（CJS）和 `module`（ESM）字段作为 fallback，兼容不支持 `exports` 的旧版打包工具
- `types` 字段确保 TypeScript 编辑器能正确找到类型声明
- 这种三重配置是当前 npm 生态的最佳实践，兼容性最广

## Risks / Trade-offs

**[tsup 的 dts 生成可能较慢]** → 对于小型库影响可忽略；如后续源码规模增大导致 dts 生成成为瓶颈，可切换为 `tsc` 单独生成声明文件。

**[ES2020 target 不兼容极旧环境]** → 项目明确约束 Cocos4 + Node.js 18+，这些环境均完整支持 ES2020，无兼容性风险。

**[flat config 生态兼容]** → 部分 ESLint 插件尚未完全适配 flat config；本项目仅使用 `typescript-eslint` 和 `eslint-config-prettier`，均已支持 flat config。

**[不包含 DOM lib]** → tsconfig 不包含 DOM lib 会导致无法使用 `console`、`setTimeout` 等全局 API 的类型；解决方案：仅在 `lib` 中保留 `ES2020`，对于 `console` 等跨平台 API，可在需要时通过 `@types/node` 或手动声明补充。

## Open Questions

- **包名**：最终包名是 `ts-game-core` 还是使用 scoped 名称（如 `@aifun/game-core`）？当前暂定 `ts-game-core`，可后续调整。
- **Node.js 版本下限**：`engines` 字段是否需要约束最低 Node.js 版本？建议设为 `>=18`。
