import type { IconNode } from '../types'
import { formatIconNode } from '../parsers/svg-parser'
import { renderTemplate } from './templates/template-engine'

/**
 * Get template path for Astro components
 */
function getAstroTemplatePath(type: 'component' | 'createIcon'): string {
  return `astro/${type}.astro.hbs`
}

/**
 * Generate Astro component
 */
export function generateAstroComponent(
  componentName: string,
  iconNode: IconNode[],
  typescript: boolean,
  keepColors = false,
): string {
  const formattedNodes = iconNode
    .map(node => formatIconNode(node, 2))
    .join(',\n')

  const templatePath = getAstroTemplatePath('component')

  return renderTemplate(templatePath, {
    componentName,
    formattedNodes,
    typescript,
    keepColors,
  })
}

/**
 * Generate Astro base component
 */
export function generateAstroBaseComponent(typescript: boolean): { code: string, fileName: string } {
  const templatePath = getAstroTemplatePath('createIcon')

  return {
    code: renderTemplate(templatePath, { typescript }),
    fileName: 'createIcon.astro',
  }
}
