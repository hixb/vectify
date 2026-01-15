import type { GenerationStats, IconForgeConfig } from '../types'
import path from 'node:path'
import { optimizeSvg } from '../parsers/optimizer'
import { parseSvg } from '../parsers/svg-parser'
import { ensureDir, getComponentName, getSvgFiles, readFile, writeFile } from '../utils/helpers'
import { generateCreateIcon, generateReactComponent } from './react'
import { generateSvelteComponent, generateSvelteIcon } from './svelte'
import { generateVueComponent, generateVueIcon } from './vue'

/**
 * Generate all icon components
 */
export async function generateIcons(config: IconForgeConfig): Promise<GenerationStats> {
  const stats: GenerationStats = {
    success: 0,
    failed: 0,
    total: 0,
    errors: [],
  }

  try {
    // Ensure output directory exists
    await ensureDir(config.output)

    // Get all SVG files
    const svgFiles = await getSvgFiles(config.input)
    stats.total = svgFiles.length

    if (svgFiles.length === 0) {
      console.warn(`No SVG files found in ${config.input}`)
      return stats
    }

    // Generate base component (Icon/createIcon)
    await generateBaseComponent(config)

    // Process each SVG file
    for (const svgFile of svgFiles) {
      try {
        await generateIconComponent(svgFile, config)
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
      await generateIndexFile(svgFiles, config)
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

  // Generate component code
  let code = ''

  switch (config.framework) {
    case 'react':
      code = generateReactComponent(componentName, iconNode, config.typescript ?? true)
      break
    case 'vue':
      code = generateVueComponent(componentName, iconNode, config.typescript ?? true)
      break
    case 'svelte':
      code = generateSvelteComponent(componentName, iconNode, config.typescript ?? true)
      break
  }

  // Call afterGenerate hook
  if (config.hooks?.afterGenerate) {
    code = await config.hooks.afterGenerate(code, componentName)
  }

  // Determine file extension
  const fileExt = config.framework === 'react'
    ? (config.typescript ? 'tsx' : 'jsx')
    : config.framework === 'vue'
      ? 'vue'
      : 'svelte'

  // Write component file
  const outputPath = path.join(config.output, `${componentName}.${fileExt}`)
  await writeFile(outputPath, code)
}

/**
 * Generate base component
 */
async function generateBaseComponent(config: IconForgeConfig): Promise<void> {
  const typescript = config.typescript ?? true

  let code = ''
  let fileName = ''

  switch (config.framework) {
    case 'react':
      code = generateCreateIcon(typescript)
      fileName = `createIcon.${typescript ? 'tsx' : 'jsx'}`
      break
    case 'vue':
      code = generateVueIcon(typescript)
      fileName = 'Icon.vue'
      break
    case 'svelte':
      code = generateSvelteIcon(typescript)
      fileName = 'Icon.svelte'
      break
  }

  const outputPath = path.join(config.output, fileName)
  await writeFile(outputPath, code)
}

/**
 * Generate index file
 */
async function generateIndexFile(svgFiles: string[], config: IconForgeConfig): Promise<void> {
  const ext = config.typescript ? 'ts' : 'js'

  const exports = svgFiles
    .map((svgFile) => {
      const fileName = path.basename(svgFile)
      const componentName = getComponentName(
        fileName,
        config.prefix,
        config.suffix,
        config.transform,
      )

      const fileExt = config.framework === 'react'
        ? (config.typescript ? 'tsx' : 'jsx')
        : config.framework === 'vue'
          ? 'vue'
          : 'svelte'

      return `export { default as ${componentName} } from './${componentName}.${fileExt}'`
    })
    .join('\n')

  const indexPath = path.join(config.output, `index.${ext}`)
  await writeFile(indexPath, `${exports}\n`)
}
