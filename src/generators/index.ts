import type { GenerationStats, IconForgeConfig } from '../types'
import path from 'node:path'
import { optimizeSvg } from '../parsers/optimizer'
import { parseSvg } from '../parsers/svg-parser'
import { ensureDir, getComponentName, getSvgFiles, readFile, writeFile } from '../utils/helpers'
import { getFrameworkStrategy } from './framework-strategy'

/**
 * Generate all icon components
 */
export async function generateIcons(config: IconForgeConfig, dryRun = false): Promise<GenerationStats> {
  const stats: GenerationStats = {
    success: 0,
    failed: 0,
    total: 0,
    errors: [],
  }

  try {
    // Ensure output directory exists (skip in dry-run)
    if (!dryRun) {
      await ensureDir(config.output)
    }

    // Get all SVG files
    const svgFiles = await getSvgFiles(config.input)
    stats.total = svgFiles.length

    if (svgFiles.length === 0) {
      console.warn(`No SVG files found in ${config.input}`)
      return stats
    }

    // Clean output directory if enabled
    if (config.generateOptions?.cleanOutput && !dryRun) {
      await cleanOutputDirectory(svgFiles, config)
    }

    // Generate base component (Icon/createIcon)
    await generateBaseComponent(config, dryRun)

    // Process each SVG file
    for (const svgFile of svgFiles) {
      try {
        await generateIconComponent(svgFile, config, dryRun)
        stats.success++
      }
      catch (error: any) {
        stats.failed++
        stats.errors.push({
          file: svgFile,
          error: error.message,
        })
        console.error(`Failed to generate ${svgFile}: ${error.message}`)
      }
    }

    // Generate index file
    if (config.generateOptions?.index) {
      await generateIndexFile(svgFiles, config, dryRun)
    }

    // Generate preview.html
    if (config.generateOptions?.preview && !dryRun) {
      await generatePreviewHtml(svgFiles, config)
    }

    // Call onComplete hook
    if (config.hooks?.onComplete) {
      await config.hooks.onComplete(stats)
    }
  }
  catch (error: any) {
    throw new Error(`Generation failed: ${error.message}`)
  }

  return stats
}

/**
 * Generate single icon component
 */
async function generateIconComponent(
  svgFile: string,
  config: IconForgeConfig,
  dryRun = false,
): Promise<void> {
  // Read SVG file
  let svgContent = await readFile(svgFile)

  // Get file name
  const fileName = path.basename(svgFile)

  // Call beforeParse hook
  if (config.hooks?.beforeParse) {
    svgContent = await config.hooks.beforeParse(svgContent, fileName)
  }

  // Optimize SVG
  svgContent = await optimizeSvg(svgContent, config)

  // Parse SVG to IconNode
  const iconNode = parseSvg(svgContent)

  // Get component name
  const componentName = getComponentName(
    fileName,
    config.prefix,
    config.suffix,
    config.transform,
  )

  // Get framework strategy
  const strategy = getFrameworkStrategy(config.framework)
  const typescript = config.typescript ?? true

  // Generate component code using strategy
  let code = strategy.generateComponent(
    componentName,
    iconNode,
    typescript,
    config.keepColors ?? false,
  )

  // Call afterGenerate hook
  if (config.hooks?.afterGenerate) {
    code = await config.hooks.afterGenerate(code, componentName)
  }

  // Get file extension from strategy
  const fileExt = strategy.getComponentExtension(typescript)

  // Write component file (skip in dry-run)
  const outputPath = path.join(config.output, `${componentName}.${fileExt}`)
  if (dryRun) {
    console.log(`  ${componentName}.${fileExt}`)
  }
  else {
    await writeFile(outputPath, code)
  }
}

/**
 * Generate base component
 */
async function generateBaseComponent(config: IconForgeConfig, dryRun = false): Promise<void> {
  const typescript = config.typescript ?? true
  const strategy = getFrameworkStrategy(config.framework)

  // Generate base component using strategy
  const { code, fileName } = strategy.generateBaseComponent(typescript)

  const outputPath = path.join(config.output, fileName)
  if (dryRun) {
    console.log(`  ${fileName}`)
  }
  else {
    await writeFile(outputPath, code)
  }
}

/**
 * Generate index file
 */
async function generateIndexFile(svgFiles: string[], config: IconForgeConfig, dryRun = false): Promise<void> {
  const typescript = config.typescript ?? true
  const strategy = getFrameworkStrategy(config.framework)
  const ext = strategy.getIndexExtension(typescript)

  // Vue and Svelte use default exports, other frameworks use named exports
  const usesDefaultExport = config.framework === 'vue' || config.framework === 'svelte'

  const exports = svgFiles
    .map((svgFile) => {
      const fileName = path.basename(svgFile)
      const componentName = getComponentName(
        fileName,
        config.prefix,
        config.suffix,
        config.transform,
      )

      // Don't include file extension in the import path
      if (usesDefaultExport) {
        return `export { default as ${componentName} } from './${componentName}'`
      }
      else {
        return `export { ${componentName} } from './${componentName}'`
      }
    })
    .join('\n')

  const indexPath = path.join(config.output, `index.${ext}`)
  if (dryRun) {
    console.log(`  index.${ext}`)
  }
  else {
    await writeFile(indexPath, `${exports}\n`)
  }
}

/**
 * Generate preview HTML file
 */
async function generatePreviewHtml(svgFiles: string[], config: IconForgeConfig): Promise<void> {
  const componentNames = svgFiles.map((svgFile) => {
    const fileName = path.basename(svgFile)
    return getComponentName(
      fileName,
      config.prefix,
      config.suffix,
      config.transform,
    )
  })

  // Read all SVG files content
  const svgContents = await Promise.all(
    svgFiles.map(async (svgFile) => {
      return await readFile(svgFile)
    }),
  )

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Icons - ${componentNames.length} Total</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body class="bg-white">
  <div class="max-w-[1400px] mx-auto px-6 py-12">
    <header class="mb-12">
      <h1 class="text-3xl font-semibold text-gray-900 mb-2">Icons</h1>
      <p class="text-sm text-gray-600">${componentNames.length} icons • ${config.framework} • Click to copy name</p>
    </header>

    <div class="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
      <div class="flex-1">
        <input
          type="search"
          id="search"
          placeholder="Search icons..."
          class="w-full h-10 px-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
        />
      </div>

      <div class="flex items-center gap-3">
        <label for="size" class="text-sm text-gray-600">Size</label>
        <input
          type="range"
          id="size"
          min="16"
          max="96"
          value="32"
          step="8"
          class="w-24 h-1 accent-gray-900"
        />
        <span id="sizeValue" class="text-sm text-gray-900 w-10">32px</span>
      </div>

      <div class="flex items-center gap-3">
        <label for="color" class="text-sm text-gray-600">Color</label>
        <input
          type="color"
          id="color"
          value="#171717"
          class="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
        />
      </div>
    </div>

    <div id="iconGrid" class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-1"></div>
  </div>

  <script>
    const icons = ${JSON.stringify(componentNames)};
    const svgContents = ${JSON.stringify(svgContents)};

    let currentSize = 32;
    let currentColor = '#171717';
    let searchQuery = '';

    function renderIcons() {
      const grid = document.getElementById('iconGrid');
      grid.innerHTML = '';

      const filteredIcons = icons.filter((name) =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filteredIcons.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-20 text-gray-400 text-sm">No icons found</div>';
        return;
      }

      for (let i = 0; i < filteredIcons.length; i++) {
        const iconName = filteredIcons[i];
        const svgIndex = icons.indexOf(iconName);
        const svgContent = svgContents[svgIndex];

        const card = document.createElement('div');
        card.className = 'group relative aspect-square flex flex-col items-center justify-center p-4 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all cursor-pointer';
        card.onclick = () => copyToClipboard(iconName);
        card.title = iconName;

        const wrapper = document.createElement('div');
        wrapper.className = 'flex items-center justify-center mb-2';

        wrapper.innerHTML = svgContent;

        const svg = wrapper.querySelector('svg');
        if (svg) {
          svg.setAttribute('width', currentSize);
          svg.setAttribute('height', currentSize);
          svg.setAttribute('stroke', currentColor);
          svg.setAttribute('fill', 'none');

          // Update stroke color for all child elements
          const elements = svg.querySelectorAll('[stroke]');
          elements.forEach(el => {
            el.setAttribute('stroke', currentColor);
          });
        }

        const name = document.createElement('div');
        name.className = 'text-[10px] text-gray-500 text-center truncate w-full group-hover:text-gray-900';
        name.textContent = iconName;

        card.appendChild(wrapper);
        card.appendChild(name);
        grid.appendChild(card);
      }
    }

    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        showCopiedNotification(text);
      });
    }

    function showCopiedNotification(text) {
      const existing = document.querySelector('.toast');
      if (existing) existing.remove();

      const notification = document.createElement('div');
      notification.className = 'toast fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-opacity';
      notification.innerHTML = \`
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Copied \${text}</span>
      \`;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 200);
      }, 1800);
    }

    document.getElementById('size').addEventListener('input', (e) => {
      currentSize = e.target.value;
      document.getElementById('sizeValue').textContent = currentSize + 'px';
      renderIcons();
    });

    document.getElementById('color').addEventListener('input', (e) => {
      currentColor = e.target.value;
      renderIcons();
    });

    document.getElementById('search').addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderIcons();
    });

    renderIcons();
  </script>
</body>
</html>`

  const previewPath = path.join(config.output, 'preview.html')
  await writeFile(previewPath, html)
}

/**
 * Clean output directory by removing components without corresponding SVG files
 */
async function cleanOutputDirectory(svgFiles: string[], config: IconForgeConfig): Promise<void> {
  const { readdir, unlink } = await import('node:fs/promises')
  const strategy = getFrameworkStrategy(config.framework)
  const fileExt = strategy.getComponentExtension(config.typescript ?? true)

  // Get expected component names from SVG files
  const expectedComponents = new Set(
    svgFiles.map((svgFile) => {
      const fileName = path.basename(svgFile, '.svg')
      const componentName = getComponentName(
        fileName,
        config.prefix,
        config.suffix,
        config.transform,
      )
      return `${componentName}.${fileExt}`
    }),
  )

  // Protected files that should never be deleted
  const protectedFiles = new Set([
    `Icon.${fileExt}`,
    `createIcon.${fileExt}`,
    `index.${config.typescript ? 'ts' : 'js'}`,
    `index.d.ts`,
    'preview.html',
  ])

  try {
    const files = await readdir(config.output)

    for (const file of files) {
      // Skip protected files
      if (protectedFiles.has(file)) {
        continue
      }

      // Skip files that don't match the component extension
      if (!file.endsWith(`.${fileExt}`)) {
        continue
      }

      // Delete if not in expected components
      if (!expectedComponents.has(file)) {
        const filePath = path.join(config.output, file)
        await unlink(filePath)
        console.log(`Deleted orphaned component: ${file}`)
      }
    }
  }
  catch (error: any) {
    console.warn(`Failed to clean output directory: ${error.message}`)
  }
}
