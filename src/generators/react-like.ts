import type { IconNode } from '../types'
import { formatIconNode } from '../parsers/svg-parser'
import { getPreactTemplatePath, getQwikTemplatePath, getSolidTemplatePath, renderTemplate } from './templates/template-engine'

/**
 * Generate React-like component (React, Preact, Solid, Qwik)
 */
export function generateReactLikeComponent(
  componentName: string,
  iconNode: IconNode[],
  typescript: boolean,
  keepColors: boolean,
  framework: 'react' | 'preact' | 'solid' | 'qwik',
): string {
  const formattedNodes = iconNode
    .map(node => formatIconNode(node, 2))
    .join(',\n')

  let templatePath: string
  if (framework === 'solid') {
    templatePath = getSolidTemplatePath(typescript, 'component')
  }
  else if (framework === 'preact') {
    templatePath = getPreactTemplatePath(typescript, 'component')
  }
  else if (framework === 'qwik') {
    templatePath = getQwikTemplatePath(typescript, 'component')
  }
  else {
    throw new Error(`Unsupported framework: ${framework}`)
  }

  return renderTemplate(templatePath, {
    componentName,
    formattedNodes,
    typescript,
    keepColors,
  })
}

/**
 * Generate base component for React-like frameworks
 */
export function generateReactLikeBaseComponent(
  typescript: boolean,
  framework: 'react' | 'preact' | 'solid' | 'qwik',
): { code: string, fileName: string } {
  let templatePath: string
  if (framework === 'solid') {
    templatePath = getSolidTemplatePath(typescript, 'createIcon')
  }
  else if (framework === 'preact') {
    templatePath = getPreactTemplatePath(typescript, 'createIcon')
  }
  else if (framework === 'qwik') {
    templatePath = getQwikTemplatePath(typescript, 'createIcon')
  }
  else {
    throw new Error(`Unsupported framework: ${framework}`)
  }

  return {
    code: renderTemplate(templatePath, { typescript }),
    fileName: typescript ? 'createIcon.tsx' : 'createIcon.jsx',
  }
}
