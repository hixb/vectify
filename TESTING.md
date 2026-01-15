# Vectify 测试指南

本文档说明如何在 `example/` 目录下测试 Vectify 的三个框架支持。

## 📁 目录结构

```
vectify/
├── example/
│   ├── react-demo/     # React 测试项目
│   ├── vue-demo/       # Vue 测试项目
│   └── svelte-demo/    # Svelte 测试项目
├── src/                # Vectify 源码
└── package.json
```

## 🚀 初始化步骤

### 1. 构建 Vectify

在根目录执行：

```bash
# 安装依赖
pnpm install

# 构建 Vectify CLI
pnpm build

# 全局链接（用于本地测试）
pnpm link --global
```

### 2. React 项目测试

```bash
# 进入 React 演示目录
cd example/react-demo

# 初始化 React + Vite 项目
pnpm create vite . --template react-ts

# 安装依赖
pnpm install

# 创建 icons 目录并放入测试 SVG
mkdir icons
# 在 icons/ 中放入一些测试 SVG 文件（例如：arrow-left.svg, check.svg, x.svg）

# 初始化 Vectify 配置
vectify init

# 选择配置：
# - Framework: React
# - SVG files location: ./icons
# - Output directory: ./src/icons
# - Use TypeScript: Yes
# - Optimize SVG: Yes
# - Prefix: (留空)
# - Suffix: Icon (可选)

# 生成图标组件
vectify generate

# 可选：查看预览（需要在配置中启用 preview）
# 打开 src/icons/preview.html

# 在 App.tsx 中使用
# import { ArrowLeft, Check } from './icons'
# <ArrowLeft size={32} color="blue" />

# 启动开发服务器
pnpm dev
```

### 3. Vue 项目测试

```bash
# 进入 Vue 演示目录
cd example/vue-demo

# 初始化 Vue + Vite 项目
pnpm create vite . --template vue-ts

# 安装依赖
pnpm install

# 创建 icons 目录并放入测试 SVG
mkdir icons
# 复制与 React 相同的 SVG 文件

# 初始化 Vectify 配置
vectify init

# 选择配置：
# - Framework: Vue
# - SVG files location: ./icons
# - Output directory: ./src/icons
# - Use TypeScript: Yes
# - Optimize SVG: Yes

# 生成图标组件
vectify generate

# 在 App.vue 中使用
# <script setup>
# import { ArrowLeft, Check } from './icons'
# </script>
# <template>
#   <ArrowLeft :size="32" color="blue" />
# </template>

# 启动开发服务器
pnpm dev
```

### 4. Svelte 项目测试

```bash
# 进入 Svelte 演示目录
cd example/svelte-demo

# 初始化 Svelte + Vite 项目
pnpm create vite . --template svelte-ts

# 安装依赖
pnpm install

# 创建 icons 目录并放入测试 SVG
mkdir icons
# 复制与 React 相同的 SVG 文件

# 初始化 Vectify 配置
vectify init

# 选择配置：
# - Framework: Svelte
# - SVG files location: ./icons
# - Output directory: ./src/icons
# - Use TypeScript: Yes
# - Optimize SVG: Yes

# 生成图标组件
vectify generate

# 在 App.svelte 中使用
# <script lang="ts">
#   import { ArrowLeft, Check } from './icons'
# </script>
# <ArrowLeft size={32} color="blue" />

# 启动开发服务器
pnpm dev
```

## 📝 配置文件示例

### React (vectify.config.ts)

```typescript
import { defineConfig } from 'vectify'

export default defineConfig({
  framework: 'react',
  input: './icons',
  output: './src/icons',
  typescript: true,
  optimize: true,
  keepColors: false, // 单色图标
  prefix: '',
  suffix: 'Icon',

  generateOptions: {
    index: true,
    types: true,
    preview: true, // 生成预览页面
  },
})
```

### Vue (vectify.config.ts)

```typescript
import { defineConfig } from 'vectify'

export default defineConfig({
  framework: 'vue',
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

### Svelte (vectify.config.ts)

```typescript
import { defineConfig } from 'vectify'

export default defineConfig({
  framework: 'svelte',
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

## 🧪 测试要点

### 1. 基础功能测试

- [ ] 生成的组件能正常导入
- [ ] 图标能正确渲染
- [ ] `size` prop 能改变图标大小
- [ ] `color` prop 能改变图标颜色
- [ ] `className`/`class` 能正确应用样式

### 2. TypeScript 测试

- [ ] 类型提示正常工作
- [ ] IconProps 类型正确
- [ ] 无 TypeScript 错误

### 3. React 特有功能

```tsx
import { useRef } from 'react'
import { ArrowLeft } from './icons'

function App() {
  const iconRef = useRef<SVGSVGElement>(null)

  return (
    <div>
      {/* 测试 forwardRef */}
      <ArrowLeft
        ref={iconRef}
        size={32}
        color="blue"
        className="my-icon"
        title="返回"
        aria-label="返回上一页"
      />

      {/* 测试 className 合并 */}
      <ArrowLeft className="custom-class" />

      {/* 测试无障碍 */}
      <ArrowLeft title="搜索" />
      <ArrowLeft aria-label="关闭" />
      <ArrowLeft aria-hidden={true} />
    </div>
  )
}
```

### 4. Vue 特有功能

```vue
<template>
  <div>
    <!-- 测试 v-bind -->
    <ArrowLeft v-bind="iconProps" />

    <!-- 测试 class 合并 -->
    <ArrowLeft class="custom-class" />

    <!-- 测试无障碍 -->
    <ArrowLeft title="返回" />
    <ArrowLeft aria-label="关闭" />
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from './icons'

const iconProps = {
  size: 32,
  color: 'blue',
}
</script>
```

### 5. Svelte 特有功能

```svelte
<script lang="ts">
  import { ArrowLeft } from './icons'

  let size = 32
  let color = 'blue'
</script>

<!-- 测试响应式 -->
<ArrowLeft {size} {color} />

<!-- 测试 class 合并 -->
<ArrowLeft class="custom-class" />

<!-- 测试无障碍 -->
<ArrowLeft title="返回" />
```

### 6. Dry Run 模式测试

```bash
# 在任意项目中
vectify generate --dry-run

# 验证：
# - 不应创建任何文件
# - 应显示将要生成的文件列表
# - 应显示错误（如果有）
```

### 7. 预览页面测试

```bash
# 在配置中启用 preview: true
vectify generate

# 打开 src/icons/preview.html
# 验证：
# - 所有图标正确显示
# - 搜索功能正常
# - 尺寸调整正常
# - 颜色选择器正常
# - 点击复制组件名称正常
```

### 8. Watch 模式测试

```bash
# 启动 watch 模式
vectify watch

# 验证：
# - 添加新 SVG 文件自动生成组件
# - 修改 SVG 文件自动重新生成
# - 删除 SVG 文件对应组件也被删除
```

### 9. keepColors 配置测试

修改配置启用 `keepColors: true`：

```typescript
export default defineConfig({
  // ...
  keepColors: true, // 保留原始颜色
})
```

```bash
# 重新生成
vectify generate

# 验证：
# - 彩色 SVG（如国旗）保留原始颜色
# - 不会被 currentColor 覆盖
```

## 🐛 常见问题

### 1. vectify 命令找不到

```bash
# 重新链接
cd /path/to/vectify
pnpm link --global
```

### 2. 生成的组件报错

```bash
# 确保已构建最新版本
cd /path/to/vectify
pnpm build
```

### 3. 类型错误

```bash
# 确保安装了 vectify 类型
pnpm add -D vectify
```

### 4. 预览页面加载失败

```bash
# 使用本地服务器而不是 file:// 协议
cd src/icons
python3 -m http.server 8000
# 或
npx serve .
```

## 📊 性能测试

### 批量图标生成

```bash
# 准备 100+ SVG 文件
# 测试生成时间
time vectify generate

# 预期：
# - < 5s for 100 icons
# - < 10s for 500 icons
```

### Watch 模式响应

```bash
vectify watch

# 添加新文件后
# 预期：< 1s 自动生成
```

## ✅ 验收标准

所有测试项目应满足：

1. ✅ 图标组件正常渲染
2. ✅ TypeScript 无错误
3. ✅ Props 功能正常（size, color, className）
4. ✅ 无障碍功能正常（aria-*, title）
5. ✅ React forwardRef 正常工作
6. ✅ 预览页面功能完整
7. ✅ Dry run 模式正常
8. ✅ Watch 模式响应及时

## 📸 截图记录

建议在每个测试项目中截图记录：

- [ ] 开发服务器运行的图标显示
- [ ] 浏览器控制台无错误
- [ ] preview.html 页面
- [ ] TypeScript 类型提示
- [ ] 不同 size/color 的效果

## 🚢 发布前检查

- [ ] 所有三个框架测试通过
- [ ] 预览页面在所有框架中正常
- [ ] TypeScript 类型完整
- [ ] 文档与实际行为一致
- [ ] 示例代码可运行
- [ ] Dry run 和 watch 模式正常
