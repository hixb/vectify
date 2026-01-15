import fs from 'node:fs'
import path from 'node:path'
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
 * - ESM: code is in dist/chunk-*.mjs, __dirname = dist/
 * Templates are copied to dist/templates/
 */
function getTemplatesDir(): string {
  // __dirname points to dist/ after bundling
  return path.join(__dirname, 'templates')
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
