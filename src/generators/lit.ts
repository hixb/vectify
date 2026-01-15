import type { IconNode } from '../types'
import { formatIconNode } from '../parsers/svg-parser'
import { renderTemplate } from './templates/template-engine'

/**
 * Get template path for Lit components
 */
function getLitTemplatePath(typescript: boolean, type: 'component' | 'createIcon'): string {
  const ext = typescript ? 'ts' : 'js'
  return `lit/${type}.${ext}.hbs`
}

/**
 * Generate Lit component
 */
export function generateLitComponent(
  componentName: string,
  iconNode: IconNode[],
  typescript: boolean,
  keepColors = false,
): string {
  const formattedNodes = iconNode
    .map(node => formatIconNode(node, 2))
    .join(',\n')

  const templatePath = getLitTemplatePath(typescript, 'component')

  return renderTemplate(templatePath, {
    componentName,
    formattedNodes,
    typescript,
    keepColors,
  })
}

/**
 * Generate Lit base component
 */
export function generateLitBaseComponent(typescript: boolean): { code: string, fileName: string } {
  const templatePath = getLitTemplatePath(typescript, 'createIcon')

  return {
    code: renderTemplate(templatePath, { typescript }),
    fileName: typescript ? 'createIcon.ts' : 'createIcon.js',
  }
}
