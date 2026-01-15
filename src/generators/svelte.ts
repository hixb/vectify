import type { IconNode } from '../types'
import { formatIconNode } from '../parsers/svg-parser'
import { getSvelteTemplatePath, renderTemplate } from './templates/template-engine'

/**
 * Generate Svelte icon component
 */
export function generateSvelteComponent(_componentName: string, iconNode: IconNode[], typescript: boolean): string {
  const formattedNodes = iconNode.map(node => formatIconNode(node, 4)).join(',\n')
  const templatePath = getSvelteTemplatePath(typescript, 'component')

  return renderTemplate(templatePath, {
    typescript,
    formattedNodes,
  })
}

/**
 * Generate Svelte Icon base component
 */
export function generateSvelteIcon(typescript: boolean): string {
  const templatePath = getSvelteTemplatePath(typescript, 'icon')
  return renderTemplate(templatePath, { typescript })
}
