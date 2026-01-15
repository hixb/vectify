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
  const componentExt = strategy.getComponentExtension(typescript)

  const exports = svgFiles
    .map((svgFile) => {
      const fileName = path.basename(svgFile)
      const componentName = getComponentName(
        fileName,
        config.prefix,
        config.suffix,
        config.transform,
      )

      return `export { default as ${componentName} } from './${componentName}.${componentExt}'`
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
      const content = await readFile(svgFile)
      return content
    }),
  )

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Icon Preview - ${componentNames.length} Icons</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #f5f5f5;
      padding: 2rem;
    }

    .header {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    h1 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #666;
      font-size: 0.9rem;
    }

    .controls {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .control-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    label {
      font-size: 0.875rem;
      color: #666;
      font-weight: 500;
    }

    input[type="range"] {
      width: 120px;
    }

    input[type="color"] {
      width: 50px;
      height: 32px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      cursor: pointer;
    }

    input[type="search"] {
      flex: 1;
      min-width: 200px;
      padding: 0.5rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.875rem;
    }

    input[type="search"]:focus {
      outline: none;
      border-color: #4f46e5;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1.5rem;
    }

    .icon-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.2s;
      cursor: pointer;
    }

    .icon-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 80px;
    }

    .icon-card svg {
      transition: all 0.2s;
    }

    .icon-name {
      font-size: 0.75rem;
      color: #666;
      text-align: center;
      word-break: break-word;
      width: 100%;
    }

    .copied {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: #10b981;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .no-results {
      text-align: center;
      padding: 4rem 2rem;
      color: #999;
      grid-column: 1 / -1;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Icon Preview</h1>
    <p class="subtitle">${componentNames.length} icons generated • Framework: ${config.framework}</p>
  </div>

  <div class="controls">
    <input type="search" id="search" placeholder="Search icons...">
    <div class="control-group">
      <label for="size">Size:</label>
      <input type="range" id="size" min="16" max="128" value="48" step="8">
      <span id="sizeValue">48px</span>
    </div>
    <div class="control-group">
      <label for="color">Color:</label>
      <input type="color" id="color" value="#333333">
    </div>
  </div>

  <div class="grid" id="iconGrid"></div>

  <script>
    const icons = ${JSON.stringify(componentNames)};
    const svgContents = ${JSON.stringify(svgContents)};

    let currentSize = 48;
    let currentColor = '#333333';
    let searchQuery = '';

    function renderIcons() {
      const grid = document.getElementById('iconGrid');
      grid.innerHTML = '';

      const filteredIcons = icons.filter((name, index) =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filteredIcons.length === 0) {
        grid.innerHTML = '<div class="no-results">No icons found matching "' + searchQuery + '"</div>';
        return;
      }

      for (let i = 0; i < filteredIcons.length; i++) {
        const iconName = filteredIcons[i];
        const svgIndex = icons.indexOf(iconName);
        const svgContent = svgContents[svgIndex];

        const card = document.createElement('div');
        card.className = 'icon-card';
        card.onclick = () => copyToClipboard(iconName);

        const wrapper = document.createElement('div');
        wrapper.className = 'icon-wrapper';

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
        name.className = 'icon-name';
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
      const existing = document.querySelector('.copied');
      if (existing) existing.remove();

      const notification = document.createElement('div');
      notification.className = 'copied';
      notification.textContent = 'Copied: ' + text;
      document.body.appendChild(notification);

      setTimeout(() => notification.remove(), 2000);
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
