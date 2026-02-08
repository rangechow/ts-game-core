## 1. 项目初始化与包结构

- [x] 1.1 创建 `package.json`，配置 name(`ts-game-core`)、version(`0.1.0`)、description、license、engines(`>=18`) 等基础字段
- [x] 1.2 配置 `package.json` 的 `main`(`dist/index.cjs`)、`module`(`dist/index.mjs`)、`types`(`dist/index.d.ts`) 入口字段
- [x] 1.3 配置 `package.json` 的 `exports` 条件导出映射（import/require/types）
- [x] 1.4 配置 `package.json` 的 `files` 字段，仅包含 `dist/`
- [x] 1.5 创建 `src/index.ts` 入口文件，导出一个占位符（如版本号常量）
- [x] 1.6 创建 `__tests__/` 测试目录
- [x] 1.7 创建 `.gitignore`，忽略 `node_modules/`、`dist/`、`*.tsbuildinfo`、`.DS_Store` 等

## 2. TypeScript 配置

- [x] 2.1 创建 `tsconfig.json`，配置 `target: ES2020`、`module: ESNext`、`moduleResolution: bundler`
- [x] 2.2 配置 `strict: true`、`declaration: true`、`outDir: dist`、`rootDir: src`
- [x] 2.3 配置 `lib: ["ES2020"]`（不包含 DOM），确保不引入浏览器特有 API 类型
- [x] 2.4 配置 `include: ["src"]` 和 `exclude: ["node_modules", "dist", "__tests__"]`

## 3. 构建流水线（tsup）

- [x] 3.1 安装 `tsup` 和 `typescript` 作为 devDependencies
- [x] 3.2 创建 `tsup.config.ts`，配置入口(`src/index.ts`)、双格式输出(esm+cjs)、dts 生成、target(`es2020`)、clean
- [x] 3.3 在 `package.json` 中添加 `build` 脚本（`tsup`）
- [x] 3.4 在 `package.json` 中添加 `dev` 脚本（`tsup --watch`）
- [x] 3.5 运行 `npm run build` 验证 `dist/` 下生成 `index.mjs`、`index.cjs`、`index.d.ts`

## 4. 开发工具链

- [x] 4.1 安装 ESLint v9+、`typescript-eslint`、`eslint-config-prettier` 作为 devDependencies
- [x] 4.2 创建 `eslint.config.mjs`（flat config），配置 TypeScript 解析器和推荐规则集，忽略 `dist/`
- [x] 4.3 安装 Prettier，创建 `.prettierrc` 配置文件（semi、singleQuote、tabWidth、trailingComma、printWidth）
- [x] 4.4 在 `package.json` 中添加 `lint`、`lint:fix`、`format`、`format:check` 脚本
- [x] 4.5 安装 Vitest，创建 `vitest.config.ts` 配置文件，设置测试目录匹配 `__tests__/**/*.test.ts`
- [x] 4.6 创建 `__tests__/index.test.ts` 示例测试文件，验证入口导出正常
- [x] 4.7 在 `package.json` 中添加 `test` 和 `test:watch` 脚本

## 5. 验证与收尾

- [x] 5.1 运行 `npx tsc --noEmit` 验证 TypeScript 编译无错误
- [x] 5.2 运行 `npm run build` 验证构建产物完整（index.mjs、index.cjs、index.d.ts）
- [x] 5.3 运行 `npm run lint` 验证 ESLint 检查通过
- [x] 5.4 运行 `npm run format:check` 验证 Prettier 格式检查通过
- [x] 5.5 运行 `npm run test` 验证示例测试通过
- [x] 5.6 运行 `npm pack --dry-run` 验证发布包内容仅包含 `dist/` 和 `package.json`
