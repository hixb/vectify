import type { IconNode } from '../types'
import { formatIconNode } from '../parsers/svg-parser'
import { getVanillaTemplatePath, renderTemplate } from './templates/template-engine'

/**
 * Generate Vanilla JS component
 */
export function generateVanillaComponent(
  componentName: string,
  iconNode: IconNode[],
  typescript: boolean,
  keepColors: boolean,
): string {
  const formattedNodes = iconNode
    .map(node => formatIconNode(node, 2))
    .join(',\n')

  const templatePath = getVanillaTemplatePath(typescript, 'component')

  return renderTemplate(templatePath, {
    componentName,
    formattedNodes,
    typescript,
    keepColors,
  })
}

/**
 * Generate base component for Vanilla JS
 */
export function generateVanillaBaseComponent(typescript: boolean): { code: string, fileName: string } {
  const templatePath = getVanillaTemplatePath(typescript, 'createIcon')

  return {
    code: renderTemplate(templatePath, { typescript }),
    fileName: typescript ? 'createIcon.ts' : 'createIcon.js',
  }
}
