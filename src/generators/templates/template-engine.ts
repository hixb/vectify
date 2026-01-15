import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Handlebars from 'handlebars'

/**
 * Template data interface
 */
export interface TemplateData {
  typescript: boolean
  componentName?: string
  formattedNodes?: string
  [key: string]: any
}

/**
 * Get the templates directory path
 * When bundled by tsup:
 * - CJS: code is in dist/index.js, __dirname = dist/
 * - ESM: code is in dist/chunk-*.mjs or dist/index.mjs, __dirname = dist/
 * Templates are copied to dist/templates/
 */
function getTemplatesDir(): string {
  // Check if __dirname is defined (CJS or bundled code)
  if (typeof __dirname !== 'undefined') {
    return path.join(__dirname, 'templates')
  }

  // ESM fallback: use import.meta.url
  // import.meta is only available in ESM
  const currentFile = fileURLToPath(import.meta.url)
  return path.join(path.dirname(currentFile), 'templates')
}

/**
 * Load and compile a Handlebars template
 */
function loadTemplate(templatePath: string): HandlebarsTemplateDelegate {
  const templatesDir = getTemplatesDir()
  const fullPath = path.join(templatesDir, templatePath)
  const templateContent = fs.readFileSync(fullPath, 'utf-8')
  return Handlebars.compile(templateContent, { noEscape: true })
}

/**
 * Render a template with data
 */
export function renderTemplate(templatePath: string, data: TemplateData): string {
  const template = loadTemplate(templatePath)
  return template(data)
}

/**
 * Get template path for React components
 */
export function getReactTemplatePath(typescript: boolean, type: 'component' | 'createIcon'): string {
  const ext = typescript ? 'tsx' : 'jsx'
  return `react/${type}.${ext}.hbs`
}

/**
 * Get template path for Vue components
 */
export function getVueTemplatePath(typescript: boolean, type: 'component' | 'icon'): string {
  const suffix = typescript ? 'ts' : 'js'
  return `vue/${type}.${suffix}.vue.hbs`
}

/**
 * Get template path for Svelte components
 */
export function getSvelteTemplatePath(typescript: boolean, type: 'component' | 'icon'): string {
  const suffix = typescript ? 'ts' : 'js'
  return `svelte/${type}.${suffix}.svelte.hbs`
}

/**
 * Get template path for Solid components
 */
export function getSolidTemplatePath(typescript: boolean, type: 'component' | 'createIcon'): string {
  const ext = typescript ? 'tsx' : 'jsx'
  return `solid/${type}.${ext}.hbs`
}

/**
 * Get template path for Preact components
 */
export function getPreactTemplatePath(typescript: boolean, type: 'component' | 'createIcon'): string {
  const ext = typescript ? 'tsx' : 'jsx'
  return `preact/${type}.${ext}.hbs`
}

/**
 * Get template path for Vanilla JS components
 */
export function getVanillaTemplatePath(typescript: boolean, type: 'component' | 'createIcon'): string {
  const ext = typescript ? 'ts' : 'js'
  return `vanilla/${type}.${ext}.hbs`
}

/**
 * Get template path for Qwik components
 */
export function getQwikTemplatePath(typescript: boolean, type: 'component' | 'createIcon'): string {
  const ext = typescript ? 'tsx' : 'jsx'
  return `qwik/${type}.${ext}.hbs`
}
