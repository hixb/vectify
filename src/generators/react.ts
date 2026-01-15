import type { IconNode } from '../types'
import { formatIconNode } from '../parsers/svg-parser'
import { getReactTemplatePath, renderTemplate } from './templates/template-engine'

/**
 * Generate React icon component
 */
export function generateReactComponent(componentName: string, iconNode: IconNode[], typescript: boolean, keepColors = false): string {
  const formattedNodes = iconNode.map(node => formatIconNode(node, 2)).join(',\n')
  const templatePath = getReactTemplatePath(typescript, 'component')

  return renderTemplate(templatePath, {
    typescript,
    componentName,
    formattedNodes,
    keepColors,
  })
}

/**
 * Generate React createIcon helper
 */
export function generateCreateIcon(typescript: boolean): string {
  const templatePath = getReactTemplatePath(typescript, 'createIcon')
  return renderTemplate(templatePath, { typescript })
}
