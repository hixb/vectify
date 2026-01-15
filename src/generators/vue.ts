import type { IconNode } from '../types'
import { formatIconNode } from '../parsers/svg-parser'
import { getVueTemplatePath, renderTemplate } from './templates/template-engine'

/**
 * Generate Vue 3 icon component
 */
export function generateVueComponent(componentName: string, iconNode: IconNode[], typescript: boolean): string {
  const formattedNodes = iconNode.map(node => formatIconNode(node, 4)).join(',\n')
  const templatePath = getVueTemplatePath(typescript, 'component')

  return renderTemplate(templatePath, {
    typescript,
    componentName,
    formattedNodes,
  })
}

/**
 * Generate Vue Icon base component
 */
export function generateVueIcon(typescript: boolean): string {
  const templatePath = getVueTemplatePath(typescript, 'icon')
  return renderTemplate(templatePath, { typescript })
}
