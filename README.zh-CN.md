<div align="center">

# Vectify

一个强大的命令行工具，可将 SVG 文件转换为特定框架的图标组件。将你的 SVG 图标转换为完全类型化、可自定义的组件，支持 React、Vue、Svelte 等多个框架。

[English](./README.md) | 简体中文

[![npm version](https://img.shields.io/npm/v/vectify.svg)](https://www.npmjs.com/package/vectify)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## 📑 目录

- [特性](#特性)
- [安装](#安装)
- [快速开始](#快速开始)
- [CLI 命令](#cli-命令)
- [配置选项](#配置选项)
  - [基础配置](#基础配置)
  - [生成选项](#生成选项)
  - [自动格式化](#自动格式化)
  - [监听模式](#监听模式)
  - [SVGO 配置](#svgo-配置)
  - [生命周期钩子](#生命周期钩子)
- [组件属性](#组件属性)
- [框架特定说明](#框架特定说明)
- [最佳实践](#最佳实践)
- [高级用法](#高级用法)
- [故障排除](#故障排除)
- [迁移指南](#迁移指南)
- [贡献](#贡献)
- [许可证](#许可证)

## ✨ 特性

- **支持 10+ 框架** - React、Vue、Svelte、Solid.js、Preact、Angular、Lit、Qwik、Astro 和 Vanilla JS
- **TypeScript 优先** - 完整的 TypeScript 支持，自动生成类型定义
- **自动优化** - 内置 SVGO 进行 SVG 优化
- **灵活定制** - 运行时控制大小、颜色、描边宽度等
- **监听模式** - SVG 文件变化时自动重新生成组件
- **生命周期钩子** - 使用 beforeParse、afterGenerate 和 onComplete 钩子自定义生成过程
- **预览生成** - 生成所有图标的交互式 HTML 预览
- **智能清理** - SVG 文件删除时自动移除孤立组件
- **批量处理** - 高效处理多个 SVG 文件

## 📦 安装

```bash
# 使用 npm
npm install -D vectify

# 使用 pnpm
pnpm add -D vectify

# 使用 yarn
yarn add -D vectify
```

## 🚀 快速开始

### 1. 初始化配置

```bash
npx vectify init
```

这将在项目根目录创建 `vectify.config.ts` 文件。选择目标框架并配置路径：

```typescript
import { defineConfig } from 'vectify'

export default defineConfig({
  framework: 'react',
  input: './icons',
  output: './src/icons',
  typescript: true,
  optimize: true,
  generateOptions: {
    index: true,
    types: true,
    preview: true,
  },
})
```

### 2. 添加 SVG 文件

将 SVG 文件放入配置的输入目录（默认：`./icons`）：

```
icons/
├── arrow-right.svg
├── user.svg
└── settings.svg
```

### 3. 生成组件

```bash
npx vectify generate
```

这将在输出目录生成图标组件：

```
src/icons/
├── ArrowRight.tsx
├── User.tsx
├── Settings.tsx
├── index.ts
└── Icon.tsx
```

### 4. 在代码中使用

```tsx
import { ArrowRight, User, Settings } from './icons'

function App() {
  return (
    <div>
      <ArrowRight size={24} color="blue" />
      <User size={32} color="#333" strokeWidth={1.5} />
      <Settings className="icon" />
    </div>
  )
}
```

## 💻 CLI 命令

### `vectify init`

初始化新的配置文件。

```bash
npx vectify init [选项]

选项:
  -f, --force     覆盖已存在的配置文件
  -o, --output    配置文件输出路径 (默认: vectify.config.ts)
```

### `vectify generate`

从 SVG 文件生成图标组件。

```bash
npx vectify generate [选项]

选项:
  -c, --config    配置文件路径 (默认: vectify.config.ts)
  --dry-run       预览将要生成的内容而不实际写入文件
```

### `vectify watch`

监听变化并自动重新生成。

```bash
npx vectify watch [选项]

选项:
  -c, --config    配置文件路径 (默认: vectify.config.ts)
```

## ⚙️ 配置选项

### 完整配置参数说明

所有 `defineConfig()` 可用的配置选项如下表所示。

#### 核心配置

| 参数 | 类型 | 默认值 | 必填 | 说明 | 示例 |
|------|------|--------|------|------|------|
| `framework` | `'react'` \| `'vue'` \| `'svelte'` \| `'solid'` \| `'preact'` \| `'lit'` \| `'angular'` \| `'qwik'` \| `'astro'` \| `'vanilla'` | - | ✅ | 目标框架，决定组件模板、导出风格和文件扩展名 | `framework: 'react'` |
| `input` | `string` | `'./icons'` | ✅ | 包含源 SVG 文件的目录，可以是相对或绝对路径 | `input: './assets/icons'` |
| `output` | `string` | `'./src/icons'` | ✅ | 生成组件的输出目录 | `output: './components/icons'` |
| `configDir` | `string` | `'.'` | ❌ | 配置文件相对于项目根目录的路径。当配置文件位于子目录时，用于正确解析 input/output 路径 | `configDir: '../..'` |
| `typescript` | `boolean` | `true` | ❌ | 生成带完整类型定义的 TypeScript 组件。设为 `false` 则输出 JavaScript | `typescript: true` |
| `optimize` | `boolean` | `true` | ❌ | 使用 SVGO 优化 SVG。减小文件大小并清理不必要的属性 | `optimize: true` |
| `keepColors` | `boolean` | `false` | ❌ | 保留 SVG 文件中的原始颜色。为 `false` 时，使用 `currentColor` 以便自定义单色图标。为 `true` 时，保留原始 fill/stroke 颜色用于多色图标 | `keepColors: false` |
| `prefix` | `string` | `''` | ❌ | 添加到所有组件名称前的前缀。用于命名空间 | `prefix: 'Icon'` → `IconArrowRight` |
| `suffix` | `string` | `''` | ❌ | 添加到所有组件名称后的后缀 | `suffix: 'Icon'` → `ArrowRightIcon` |
| `transform` | `(name: string) => string` | - | ❌ | 自定义函数，将 SVG 文件名转换为组件名。覆盖默认的 PascalCase 转换和 prefix/suffix | `transform: (n) => 'X' + n` |
| `format` | `boolean` \| `'prettier'` \| `'eslint'` \| `'biome'` \| `FormatConfig` | `false` | ❌ | 生成后自动格式化文件。详见 [自动格式化](#自动格式化) | `format: true` |

#### `generateOptions` 对象

| 参数 | 类型 | 默认值 | 说明 | 示例 |
|------|------|--------|------|------|
| `index` | `boolean` | `true` | 生成包含聚合导出的索引文件。导出风格（默认 vs 具名）由框架自动决定 | `index: true` |
| `types` | `boolean` | `true` | 生成 TypeScript 声明文件 (.d.ts)。仅在 `typescript: true` 时生效 | `types: true` |
| `preview` | `boolean` | `false` | 生成交互式 `preview.html` 用于本地浏览所有图标。适合设计审查 | `preview: true` |
| `cleanOutput` | `boolean` | `false` | 移除不再有对应 SVG 文件的孤立组件。帮助保持输出目录整洁 | `cleanOutput: true` |

#### 自动格式化

Vectify 可以使用项目中的格式化工具自动格式化生成的文件。确保生成的代码符合项目的代码风格。

**快速开始：**

```typescript
export default defineConfig({
  framework: 'react',
  input: './icons',
  output: './src/icons',
  format: true, // 自动检测并使用项目格式化工具
})
```

**格式化选项：**

| 值 | 说明 |
|----|------|
| `false` | 禁用格式化（默认） |
| `true` | 自动检测格式化工具（biome > prettier > eslint） |
| `'prettier'` | 使用 Prettier |
| `'eslint'` | 使用 ESLint --fix |
| `'biome'` | 使用 Biome |
| `{ tool, args }` | 完整配置对象 |

**自动检测优先级：**

当 `format: true` 时，Vectify 按以下顺序查找配置文件：
1. `biome.json` / `biome.jsonc` → 使用 Biome
2. `.prettierrc*` / `prettier.config.*` → 使用 Prettier
3. `eslint.config.*` / `.eslintrc*` → 使用 ESLint

**完整配置：**

```typescript
export default defineConfig({
  format: {
    tool: 'prettier',       // 'auto' | 'prettier' | 'eslint' | 'biome'
    args: '--single-quote', // 额外的 CLI 参数
  },
})
```

**示例：**

```typescript
// 自动检测格式化工具
format: true

// 使用指定的格式化工具
format: 'prettier'
format: 'eslint'
format: 'biome'

// 带自定义参数
format: {
  tool: 'prettier',
  args: '--tab-width 4',
}

// 禁用格式化
format: false
```

#### `watch` 对象

| 参数 | 类型 | 默认值 | 说明 | 示例 |
|------|------|--------|------|------|
| `enabled` | `boolean` | `false` | 启用监听模式。在输入目录中添加、修改或删除 SVG 文件时自动重新生成组件 | `enabled: true` |
| `ignore` | `string[]` | - | 监听时忽略的 glob 模式数组 | `ignore: ['**/node_modules/**', '**/.git/**']` |
| `debounce` | `number` | `300` | 触发重新生成前的防抖延迟（毫秒）。防止过度重新构建 | `debounce: 500` |

#### `svgoConfig` 对象

自定义 SVG 优化行为。直接传递给 SVGO。

| 参数 | 类型 | 默认值 | 说明 | 示例 |
|------|------|--------|------|------|
| `plugins` | `any[]` | - | SVGO 插件名称和配置数组。可用插件见 [SVGO 文档](https://github.com/svg/svgo) | `plugins: ['preset-default', 'removeViewBox']` |
| `multipass` | `boolean` | - | 启用多次优化以获得更好效果 | `multipass: true` |
| `...` | `any` | - | 任何其他 SVGO 支持的配置选项 | - |

#### `hooks` 对象

用于自定义生成过程的生命周期钩子。

| 钩子 | 签名 | 调用时机 | 参数 | 返回值 | 常见用途 |
|------|------|----------|------|--------|----------|
| `beforeParse` | `(svg: string, fileName: string) => Promise<string> \| string` | 读取 SVG 文件后、解析前 | `svg`: 原始 SVG 内容<br>`fileName`: SVG 文件名 | 修改后的 SVG 内容 | 预处理 SVG、替换颜色/属性、规范化 viewBox |
| `afterGenerate` | `(code: string, iconName: string) => Promise<string> \| string` | 组件代码生成后、写入文件前 | `code`: 生成的组件源码<br>`iconName`: 组件名 | 修改后的组件代码 | 添加注释、注入导出、自定义代码风格 |
| `onComplete` | `(stats: GenerationStats) => Promise<void> \| void` | 所有图标生成完成后 | `stats`: 生成统计信息（见下） | `void` | 记录统计、运行后处理脚本、发送通知 |

#### `GenerationStats` 类型

传递给 `onComplete` 钩子的统计对象。

| 属性 | 类型 | 说明 |
|------|------|------|
| `success` | `number` | 成功生成的图标数量 |
| `failed` | `number` | 失败的生成数量 |
| `total` | `number` | 处理的 SVG 文件总数 |
| `errors` | `Array<{ file: string; error: string }>` | 失败生成的详细错误信息 |

### 配置示例

#### 基础配置

```typescript
import { defineConfig } from 'vectify'

export default defineConfig({
  framework: 'react',
  input: './icons',
  output: './src/icons',
})
```

#### 多色图标与自定义 SVGO

```typescript
export default defineConfig({
  framework: 'vue',
  input: './icons',
  output: './src/icons',
  keepColors: true, // 保留 SVG 原始颜色
  svgoConfig: {
    plugins: [
      'preset-default',
      {
        name: 'removeAttrs',
        params: { attrs: '(width|height)' },
      },
    ],
  },
})
```

#### Monorepo 配置

```typescript
// packages/web/vectify.config.ts
export default defineConfig({
  framework: 'svelte',
  configDir: '../..', // 指向 monorepo 根目录
  input: '../../icons', // 共享图标目录
  output: './src/icons', // 包特定输出
})
```

#### 带钩子的高级配置

```typescript
export default defineConfig({
  framework: 'react',
  input: './icons',
  output: './src/icons',
  hooks: {
    beforeParse: (svg, fileName) => {
      // 将黑色替换为 currentColor 以便自定义
      return svg.replace(/#000000/gi, 'currentColor')
    },
    afterGenerate: (code, iconName) => {
      // 为每个组件添加 JSDoc 注释
      return `/**\n * ${iconName} 图标组件\n * @generated by Vectify\n */\n${code}`
    },
    onComplete: (stats) => {
      console.log(`✔ 生成 ${stats.success}/${stats.total} 个图标`)
      if (stats.failed > 0) {
        console.error(`✖ 失败: ${stats.failed}`)
        stats.errors.forEach(({ file, error }) => {
          console.error(`  ${file}: ${error}`)
        })
      }
    },
  },
})
```

### 框架特定说明

**导出风格：**
- **默认导出：** Vue、Svelte、Preact
- **具名导出：** React、Solid、Qwik、Angular、Astro、Vanilla JS、Lit

索引文件会自动为你选择的框架使用正确的导出风格。

**命名策略：**
- 默认情况下，文件名会转换为 PascalCase（如 `arrow-right.svg` → `ArrowRight`）
- 在转换后应用 `prefix` 和 `suffix`
- 使用 `transform` 函数完全自定义命名

**颜色策略：**
- `keepColors: false` - 适合应继承文本颜色的单色图标。使用 `currentColor` 并允许通过 `color` 属性进行运行时自定义。
- `keepColors: true` - 适合多色品牌图标。保留原始 SVG 的 fill/stroke 颜色。


## 🎨 组件属性

所有生成的组件都接受以下属性：

```typescript
interface IconProps {
  // 图标大小 (默认: 24)
  size?: number | string

  // 图标颜色 (默认: 'currentColor')
  color?: string

  // 描边图标的描边宽度 (默认: 2)
  strokeWidth?: number | string

  // CSS 类名
  className?: string

  // 无障碍：图标标题
  title?: string

  // 无障碍：aria-label
  'aria-label'?: string

  // 无障碍：aria-hidden
  'aria-hidden'?: boolean

  // 所有其他 SVG 属性
  [key: string]: any
}
```

### 使用示例

```tsx
// 基础用法
<IconName />

// 自定义大小和颜色
<IconName size={32} color="#3b82f6" />

// 带描边宽度
<IconName size={24} strokeWidth={1.5} />

// 带 CSS 类
<IconName className="my-icon" />

// 带无障碍属性
<IconName
  title="用户资料"
  aria-label="用户资料图标"
/>

// 对屏幕阅读器隐藏
<IconName aria-hidden={true} />

// 带自定义 SVG 属性
<IconName
  size={28}
  color="red"
  style={{ transform: 'rotate(45deg)' }}
  onClick={() => console.log('clicked')}
/>
```

## 🔧 框架特定说明

### React / Preact

```tsx
import { ArrowRight } from './icons'

function Component() {
  return <ArrowRight size={24} color="blue" />
}
```

### Vue 3

```vue
<script setup>
import { ArrowRight } from './icons'
</script>

<template>
  <ArrowRight :size="24" color="blue" />
</template>
```

### Svelte

```svelte
<script>
import { ArrowRight } from './icons'
</script>

<ArrowRight size={24} color="blue" />
```

### Solid.js

```tsx
import { ArrowRight } from './icons'

function Component() {
  return <ArrowRight size={24} color="blue" />
}
```

### Angular

```typescript
import { ArrowRight } from './icons'

@Component({
  selector: 'app-root',
  template: '<ng-container *ngComponentOutlet="ArrowRight; inputs: { size: 24, color: \'blue\' }"></ng-container>',
})
export class AppComponent {
  ArrowRight = ArrowRight
}
```

### Vanilla JS

```javascript
import { ArrowRight } from './icons'

const icon = ArrowRight({ size: 24, color: 'blue' })
document.getElementById('app').appendChild(icon)
```

## 📋 最佳实践

### 1. 一致的 SVG 准备

- 使用一致的 viewBox（最好是 24x24）
- 移除不必要的属性（width、height、fill、stroke）
- 简化路径和形状
- 使用有意义的文件名

### 2. 命名约定

```
✓ 推荐：
  arrow-right.svg → ArrowRight
  user-profile.svg → UserProfile
  settings-gear.svg → SettingsGear

✗ 避免：
  arrow_right.svg
  UserProfile.svg
  settings gear.svg
```

### 3. 颜色管理

```typescript
// 单色图标（默认）
keepColors: false  // 使用 currentColor，可通过 color 属性自定义

// 多色图标
keepColors: true   // 保留 SVG 中的原始颜色
```

### 4. 项目结构

```
project/
├── icons/              # 源 SVG 文件
│   ├── arrow-right.svg
│   └── user.svg
├── src/
│   └── icons/          # 生成的组件（添加到 gitignore）
│       ├── ArrowRight.tsx
│       ├── User.tsx
│       └── index.ts
└── vectify.config.ts   # 配置文件
```

### 5. Git 集成

将生成的文件添加到 `.gitignore`：

```gitignore
# 生成的图标
src/icons/

# 保留配置
!vectify.config.ts
```

添加到 `package.json`：

```json
{
  "scripts": {
    "icons": "vectify generate",
    "icons:watch": "vectify watch",
    "postinstall": "vectify generate"
  }
}
```

## 🔥 高级用法

### 多配置设置

为多个框架生成图标：

```typescript
// vectify.react.config.ts
export default defineConfig({
  framework: 'react',
  output: './packages/react/src/icons',
})

// vectify.vue.config.ts
export default defineConfig({
  framework: 'vue',
  output: './packages/vue/src/icons',
})
```

```bash
npx vectify generate -c vectify.react.config.ts
npx vectify generate -c vectify.vue.config.ts
```

### Monorepo 设置

```typescript
// apps/web/vectify.config.ts
export default defineConfig({
  configDir: '../..', // 相对于项目根目录
  input: '../../icons',
  output: './src/icons',
})
```

### 自定义转换

```typescript
export default defineConfig({
  hooks: {
    beforeParse: async (svg, fileName) => {
      // 替换颜色
      svg = svg.replace(/#000000/g, 'currentColor')

      // 添加自定义属性
      svg = svg.replace('<svg', '<svg data-icon="true"')

      return svg
    },

    afterGenerate: async (code, iconName) => {
      // 添加自定义导出
      code += `\nexport const ${iconName}Name = '${iconName}'\n`

      // 添加 JSDoc 注释
      code = `/**\n * ${iconName} 图标组件\n */\n${code}`

      return code
    },
  },
})
```

## 🔍 故障排除

### 图标未生成

1. 检查输入目录中是否存在 SVG 文件
2. 验证配置文件路径是否正确
3. 确保 SVG 文件是有效的 XML
4. 检查文件权限

### TypeScript 错误

1. 确保配置中 `typescript: true`
2. 使用 `npx vectify generate` 重新生成
3. 检查生成的文件未被错误地添加到 gitignore

### 颜色不生效

1. 对于可自定义颜色：使用 `keepColors: false`
2. 对于保留原始颜色：使用 `keepColors: true`
3. 从源 SVG 中移除 fill/stroke 属性以获得更好的自定义效果

### 构建错误

1. 确保生成的文件包含在构建中
2. 检查输出目录是否在 tsconfig.json 的 include 路径中
3. 验证是否安装了框架特定的依赖

## 🔄 迁移指南

### 从 react-icons 迁移

```tsx
// 之前
import { FiArrowRight } from 'react-icons/fi'
<FiArrowRight size={24} />

// 之后
import { ArrowRight } from './icons'
<ArrowRight size={24} />
```

### 从 @iconify 迁移

```tsx
// 之前
import { Icon } from '@iconify/react'
<Icon icon="mdi:arrow-right" />

// 之后
import { ArrowRight } from './icons'
<ArrowRight />
```

## 🤝 贡献

欢迎贡献！请先阅读我们的[贡献指南](CONTRIBUTING.md)。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

MIT © [Xiaobing Zhu](https://github.com/hixb)

## 🙏 致谢

- [SVGO](https://github.com/svg/svgo) - SVG 优化
- [Handlebars](https://handlebarsjs.com/) - 模板引擎
- 所有框架社区的启发

## 🔗 链接

- [GitHub 仓库](https://github.com/hixb/vectify)
- [问题追踪](https://github.com/hixb/vectify/issues)
- [更新日志](CHANGELOG.md)

---

<div align="center">

由 [Xiaobing Zhu](https://github.com/hixb) 用 ❤️ 制作

</div>
