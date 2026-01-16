<div align="center">

# Vectify

A powerful command-line tool to generate framework-specific icon components from SVG files. Transform your SVG icons into fully-typed, customizable components for React, Vue, Svelte, and more.

English | [简体中文](./README.zh-CN.md)

[![npm version](https://img.shields.io/npm/v/vectify.svg)](https://www.npmjs.com/package/vectify)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## 📑 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Commands](#cli-commands)
- [Configuration](#configuration)
  - [Basic Options](#basic-options)
  - [Generation Options](#generation-options)
  - [Auto Formatting](#auto-formatting)
  - [Watch Mode](#watch-mode)
  - [SVGO Configuration](#svgo-configuration)
  - [Lifecycle Hooks](#lifecycle-hooks)
- [Component Props](#component-props)
- [Framework-Specific Notes](#framework-specific-notes)
- [Best Practices](#best-practices)
- [Advanced Usage](#advanced-usage)
- [Troubleshooting](#troubleshooting)
- [Migration Guide](#migration-guide)
- [Contributing](#contributing)
- [License](#license)

## Features

- **10+ Framework Support** - React, Vue, Svelte, Solid.js, Preact, Angular, Lit, Qwik, Astro, and Vanilla JS
- **TypeScript First** - Full TypeScript support with auto-generated type definitions
- **Automatic Optimization** - Built-in SVG optimization using SVGO
- **Flexible Customization** - Control size, color, stroke width, and more at runtime
- **Watch Mode** - Automatically regenerate components when SVG files change
- **Lifecycle Hooks** - Customize generation with beforeParse, afterGenerate, and onComplete hooks
- **Preview Generation** - Generate interactive HTML preview of all icons
- **Clean Output** - Automatically remove orphaned components when SVG files are deleted
- **Batch Processing** - Process multiple SVG files efficiently

## Installation

```bash
# Using npm
npm install -D vectify

# Using pnpm
pnpm add -D vectify

# Using yarn
yarn add -D vectify
```

## Quick Start

### 1. Initialize Configuration

```bash
npx vectify init
```

This will create a `vectify.config.ts` file in your project root. Select your target framework and configure the paths:

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

### 2. Add SVG Files

Place your SVG files in the configured input directory (default: `./icons`):

```
icons/
├── arrow-right.svg
├── user.svg
└── settings.svg
```

### 3. Generate Components

```bash
npx vectify generate
```

This will generate icon components in your output directory:

```
src/icons/
├── ArrowRight.tsx
├── User.tsx
├── Settings.tsx
├── index.ts
└── Icon.tsx
```

### 4. Use in Your Code

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

## CLI Commands

### `vectify init`

Initialize a new configuration file.

```bash
npx vectify init [options]

Options:
  -f, --force     Overwrite existing config file
  -o, --output    Output path for config file (default: vectify.config.ts)
```

### `vectify generate`

Generate icon components from SVG files.

```bash
npx vectify generate [options]

Options:
  -c, --config    Path to config file (default: vectify.config.ts)
  --dry-run       Preview what will be generated without writing files
```

### `vectify watch`

Watch for changes and regenerate automatically.

```bash
npx vectify watch [options]

Options:
  -c, --config    Path to config file (default: vectify.config.ts)
```

## Configuration

### Complete Configuration Reference

All available options for `defineConfig()` are documented in the tables below.

#### Core Configuration

| Parameter | Type | Default | Required | Description | Example |
|-----------|------|---------|----------|-------------|----------|
| `framework` | `'react'` \| `'vue'` \| `'svelte'` \| `'solid'` \| `'preact'` \| `'lit'` \| `'angular'` \| `'qwik'` \| `'astro'` \| `'vanilla'` | - | ✅ | Target framework for component generation. Determines component template, export style, and file extension. | `framework: 'react'` |
| `input` | `string` | `'./icons'` | ✅ | Directory containing source SVG files. Can be relative or absolute path. | `input: './assets/icons'` |
| `output` | `string` | `'./src/icons'` | ✅ | Directory where generated components will be saved. | `output: './components/icons'` |
| `configDir` | `string` | `'.'` | ❌ | Config file directory relative to project root. Used for resolving input/output paths when config is in a subdirectory. | `configDir: '../..'` |
| `typescript` | `boolean` | `true` | ❌ | Generate TypeScript components with full type definitions. Set to `false` for JavaScript output. | `typescript: true` |
| `optimize` | `boolean` | `true` | ❌ | Enable SVG optimization using SVGO. Reduces file size and cleans up unnecessary attributes. | `optimize: true` |
| `keepColors` | `boolean` | `false` | ❌ | Preserve original colors from SVG files. When `false`, uses `currentColor` for customizable single-color icons. When `true`, keeps original fill/stroke colors for multi-color icons. | `keepColors: false` |
| `prefix` | `string` | `''` | ❌ | Prefix added to all component names. Useful for namespacing. | `prefix: 'Icon'` → `IconArrowRight` |
| `suffix` | `string` | `''` | ❌ | Suffix added to all component names. | `suffix: 'Icon'` → `ArrowRightIcon` |
| `transform` | `(name: string) => string` | - | ❌ | Custom function to transform SVG filename to component name. Overrides default PascalCase conversion and prefix/suffix. | `transform: (n) => 'X' + n` |
| `format` | `boolean` \| `'prettier'` \| `'eslint'` \| `'biome'` \| `FormatConfig` | `false` | ❌ | Auto-format generated files after generation. See [Auto Formatting](#auto-formatting) for details. | `format: true` |

#### `generateOptions` Object

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|----------|
| `index` | `boolean` | `true` | Generate index file with aggregated exports. Export style (default vs named) is automatically determined by framework. | `index: true` |
| `types` | `boolean` | `true` | Generate TypeScript declaration files (.d.ts). Only applies when `typescript: true`. | `types: true` |
| `preview` | `boolean` | `false` | Generate interactive `preview.html` for browsing all icons locally. Useful for design review. | `preview: true` |
| `cleanOutput` | `boolean` | `false` | Remove orphaned component files that no longer have corresponding SVG files. Helps keep output directory clean. | `cleanOutput: true` |

#### Auto Formatting

Vectify can automatically format generated files using your project's formatter. This ensures generated code matches your project's code style.

**Quick Start:**

```typescript
export default defineConfig({
  framework: 'react',
  input: './icons',
  output: './src/icons',
  format: true, // Auto-detect and use project formatter
})
```

**Format Options:**

| Value | Description |
|-------|-------------|
| `false` | Disable formatting (default) |
| `true` | Auto-detect formatter (biome > prettier > eslint) |
| `'prettier'` | Use Prettier |
| `'eslint'` | Use ESLint --fix |
| `'biome'` | Use Biome |
| `{ tool, args }` | Full configuration object |

**Auto-Detection Priority:**

When `format: true`, Vectify looks for config files in this order:
1. `biome.json` / `biome.jsonc` → Uses Biome
2. `.prettierrc*` / `prettier.config.*` → Uses Prettier
3. `eslint.config.*` / `.eslintrc*` → Uses ESLint

**Full Configuration:**

```typescript
export default defineConfig({
  format: {
    tool: 'prettier',      // 'auto' | 'prettier' | 'eslint' | 'biome'
    args: '--single-quote', // Additional CLI arguments
  },
})
```

**Examples:**

```typescript
// Auto-detect formatter
format: true

// Use specific formatter
format: 'prettier'
format: 'eslint'
format: 'biome'

// With custom arguments
format: {
  tool: 'prettier',
  args: '--tab-width 4',
}

// Disable formatting
format: false
```

#### `watch` Object

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|----------|
| `enabled` | `boolean` | `false` | Enable watch mode. Automatically regenerate components when SVG files are added, modified, or deleted in the input directory. | `enabled: true` |
| `ignore` | `string[]` | - | Array of glob patterns to ignore during watch. | `ignore: ['**/node_modules/**', '**/.git/**']` |
| `debounce` | `number` | `300` | Debounce delay in milliseconds before triggering regeneration. Prevents excessive rebuilds. | `debounce: 500` |

#### `svgoConfig` Object

Customize SVG optimization behavior. Passed directly to SVGO.

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|----------|
| `plugins` | `any[]` | - | Array of SVGO plugin names and configurations. See [SVGO documentation](https://github.com/svg/svgo) for available plugins. | `plugins: ['preset-default', 'removeViewBox']` |
| `multipass` | `boolean` | - | Enable multiple optimization passes for better results. | `multipass: true` |
| `...` | `any` | - | Any other SVGO-supported configuration options. | - |

#### `hooks` Object

Lifecycle hooks for customizing the generation process.

| Hook | Signature | When Called | Parameters | Return Value | Common Use Cases |
|------|-----------|-------------|------------|--------------|------------------|
| `beforeParse` | `(svg: string, fileName: string) => Promise<string> \| string` | After reading SVG file, before parsing | `svg`: Raw SVG content<br>`fileName`: SVG filename | Modified SVG content | Pre-process SVGs, replace colors/attributes, normalize viewBox |
| `afterGenerate` | `(code: string, iconName: string) => Promise<string> \| string` | After component code generation, before writing to file | `code`: Generated component source<br>`iconName`: Component name | Modified component code | Add comments, inject exports, customize code style |
| `onComplete` | `(stats: GenerationStats) => Promise<void> \| void` | After all icons are generated | `stats`: Generation statistics (see below) | `void` | Log statistics, run post-processing scripts, send notifications |

#### `GenerationStats` Type

Statistics object passed to `onComplete` hook.

| Property | Type | Description |
|----------|------|-------------|
| `success` | `number` | Number of successfully generated icons |
| `failed` | `number` | Number of failed generations |
| `total` | `number` | Total number of SVG files processed |
| `errors` | `Array<{ file: string; error: string }>` | Detailed error information for failed generations |

### Configuration Examples

#### Basic Configuration

```typescript
import { defineConfig } from 'vectify'

export default defineConfig({
  framework: 'react',
  input: './icons',
  output: './src/icons',
})
```

#### Multi-Color Icons with Custom SVGO

```typescript
export default defineConfig({
  framework: 'vue',
  input: './icons',
  output: './src/icons',
  keepColors: true, // Preserve original SVG colors
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

#### Monorepo Configuration

```typescript
// packages/web/vectify.config.ts
export default defineConfig({
  framework: 'svelte',
  configDir: '../..', // Point to monorepo root
  input: '../../icons', // Shared icons directory
  output: './src/icons', // Package-specific output
})
```

#### Advanced with Hooks

```typescript
export default defineConfig({
  framework: 'react',
  input: './icons',
  output: './src/icons',
  hooks: {
    beforeParse: (svg, fileName) => {
      // Replace black with currentColor for customization
      return svg.replace(/#000000/gi, 'currentColor')
    },
    afterGenerate: (code, iconName) => {
      // Add JSDoc comment to each component
      return `/**\n * ${iconName} icon component\n * @generated by Vectify\n */\n${code}`
    },
    onComplete: (stats) => {
      console.log(`✔ Generated ${stats.success}/${stats.total} icons`)
      if (stats.failed > 0) {
        console.error(`✖ Failed: ${stats.failed}`)
        stats.errors.forEach(({ file, error }) => {
          console.error(`  ${file}: ${error}`)
        })
      }
    },
  },
})
```

### Framework-Specific Notes

**Export Styles:**
- **Default exports:** Vue, Svelte, Preact
- **Named exports:** React, Solid, Qwik, Angular, Astro, Vanilla JS, Lit

The index file automatically uses the correct export style for your chosen framework.

**Naming Strategy:**
- By default, filenames are converted to PascalCase (e.g., `arrow-right.svg` → `ArrowRight`)
- `prefix` and `suffix` are applied after conversion
- Use `transform` function to completely customize naming

**Color Strategy:**
- `keepColors: false` - Best for single-color icons that should inherit text color. Uses `currentColor` and allows runtime customization via the `color` prop.
- `keepColors: true` - Best for multi-color brand icons. Preserves original SVG fill/stroke colors.


## Component Props

All generated components accept the following props:

```typescript
interface IconProps {
  // Icon size (default: 24)
  size?: number | string

  // Icon color (default: 'currentColor')
  color?: string

  // Stroke width for stroke-based icons (default: 2)
  strokeWidth?: number | string

  // CSS class name
  className?: string

  // Accessibility: icon title
  title?: string

  // Accessibility: aria-label
  'aria-label'?: string

  // Accessibility: aria-hidden
  'aria-hidden'?: boolean

  // All other SVG attributes
  [key: string]: any
}
```

### Usage Examples

```tsx
// Basic usage
<IconName />

// Custom size and color
<IconName size={32} color="#3b82f6" />

// With stroke width
<IconName size={24} strokeWidth={1.5} />

// With CSS class
<IconName className="my-icon" />

// With accessibility attributes
<IconName
  title="User Profile"
  aria-label="User profile icon"
/>

// Hidden from screen readers
<IconName aria-hidden={true} />

// With custom SVG attributes
<IconName
  size={28}
  color="red"
  style={{ transform: 'rotate(45deg)' }}
  onClick={() => console.log('clicked')}
/>
```

## Framework-Specific Notes

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

## Best Practices

### 1. Consistent SVG Preparation

- Use a consistent viewBox (preferably 24x24)
- Remove unnecessary attributes (width, height, fill, stroke)
- Simplify paths and shapes
- Use meaningful file names

### 2. Naming Conventions

```
✓ Good:
  arrow-right.svg → ArrowRight
  user-profile.svg → UserProfile
  settings-gear.svg → SettingsGear

✗ Avoid:
  arrow_right.svg
  UserProfile.svg
  settings gear.svg
```

### 3. Color Management

```typescript
// For single-color icons (default)
keepColors: false  // Uses currentColor, customizable via color prop

// For multi-color icons
keepColors: true   // Preserves original colors from SVG
```

### 4. Project Structure

```
project/
├── icons/              # Source SVG files
│   ├── arrow-right.svg
│   └── user.svg
├── src/
│   └── icons/          # Generated components (gitignore)
│       ├── ArrowRight.tsx
│       ├── User.tsx
│       └── index.ts
└── vectify.config.ts   # Configuration
```

### 5. Git Integration

Add generated files to `.gitignore`:

```gitignore
# Generated icons
src/icons/

# Keep the config
!vectify.config.ts
```

Add to your `package.json`:

```json
{
  "scripts": {
    "icons": "vectify generate",
    "icons:watch": "vectify watch",
    "postinstall": "vectify generate"
  }
}
```

## Advanced Usage

### Multi-Config Setup

Generate icons for multiple frameworks:

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

### Monorepo Setup

```typescript
// apps/web/vectify.config.ts
export default defineConfig({
  configDir: '../..', // Relative to project root
  input: '../../icons',
  output: './src/icons',
})
```

### Custom Transformations

```typescript
export default defineConfig({
  hooks: {
    beforeParse: async (svg, fileName) => {
      // Replace colors
      svg = svg.replace(/#000000/g, 'currentColor')

      // Add custom attributes
      svg = svg.replace('<svg', '<svg data-icon="true"')

      return svg
    },

    afterGenerate: async (code, iconName) => {
      // Add custom exports
      code += `\nexport const ${iconName}Name = '${iconName}'\n`

      // Add JSDoc comments
      code = `/**\n * ${iconName} icon component\n */\n${code}`

      return code
    },
  },
})
```

## Troubleshooting

### Icons not generating

1. Check that SVG files exist in the input directory
2. Verify the config file path is correct
3. Ensure SVG files are valid XML
4. Check file permissions

### TypeScript errors

1. Make sure `typescript: true` in config
2. Regenerate with `npx vectify generate`
3. Check that generated files are not gitignored incorrectly

### Colors not working

1. For customizable colors: use `keepColors: false`
2. For preserving original colors: use `keepColors: true`
3. Remove fill/stroke attributes from source SVGs for better customization

### Build errors

1. Ensure generated files are included in your build
2. Check that the output directory is in your tsconfig.json include path
3. Verify framework-specific dependencies are installed

## Migration Guide

### From react-icons

```tsx
// Before
import { FiArrowRight } from 'react-icons/fi'
<FiArrowRight size={24} />

// After
import { ArrowRight } from './icons'
<ArrowRight size={24} />
```

### From @iconify

```tsx
// Before
import { Icon } from '@iconify/react'
<Icon icon="mdi:arrow-right" />

// After
import { ArrowRight } from './icons'
<ArrowRight />
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Xiaobing Zhu](https://github.com/hixb)

## Acknowledgments

- [SVGO](https://github.com/svg/svgo) - SVG optimization
- [Handlebars](https://handlebarsjs.com/) - Template engine
- All framework communities for inspiration

## Links

- [GitHub Repository](https://github.com/hixb/vectify)
- [Issue Tracker](https://github.com/hixb/vectify/issues)
- [Changelog](CHANGELOG.md)

---

Made with ❤️ by [Xiaobing Zhu](https://github.com/hixb)
