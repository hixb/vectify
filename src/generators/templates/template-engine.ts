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
 * Load and compile a Handlebars template
 */
function loadTemplate(templatePath: string): HandlebarsTemplateDelegate {
  const fullPath = path.join(__dirname, templatePath)
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
