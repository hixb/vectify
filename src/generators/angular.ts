import type { IconNode } from '../types'
import { formatIconNode } from '../parsers/svg-parser'
import { renderTemplate } from './templates/template-engine'

/**
 * Get template path for Angular components
 */
function getAngularTemplatePath(type: 'component' | 'createIcon'): string {
  return `angular/${type}.ts.hbs`
}

/**
 * Generate Angular component
 */
export function generateAngularComponent(
  componentName: string,
  iconNode: IconNode[],
  typescript: boolean,
  keepColors = false,
): string {
  const formattedNodes = iconNode
    .map(node => formatIconNode(node, 2))
    .join(',\n')

  const templatePath = getAngularTemplatePath('component')

  return renderTemplate(templatePath, {
    componentName,
    formattedNodes,
    typescript,
    keepColors,
  })
}

/**
 * Generate Angular base component
 */
export function generateAngularBaseComponent(typescript: boolean): { code: string, fileName: string } {
  const templatePath = getAngularTemplatePath('createIcon')

  return {
    code: renderTemplate(templatePath, { typescript }),
    fileName: 'createIcon.ts',
  }
}
