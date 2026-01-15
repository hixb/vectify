import type { IconNode } from '../types'
import { formatIconNode } from '../parsers/svgParser'

/**
 * Generate React icon component
 */
export function generateReactComponent(componentName: string, iconNode: IconNode[], typescript: boolean): string {
  const typeAnnotations = typescript
    ? `import type { IconNode, IconProps } from 'vectify'\n`
    : ''

  const formattedNodes = iconNode.map(node => formatIconNode(node, 2)).join(',\n')

  return `${typeAnnotations}import { createIcon } from '../createIcon'

export const iconNode${typescript ? ': IconNode[]' : ''} = [
${formattedNodes}
]

const ${componentName} = createIcon('${componentName}', iconNode)
export default ${componentName}
`
}

/**
 * Generate React createIcon helper
 */
export function generateCreateIcon(typescript: boolean): string {
  if (typescript) {
    return `import { createElement } from 'react'
import type { IconNode, IconProps } from 'vectify'
import type { FC, ReactNode } from 'react'

export interface CreateIconProps extends IconProps {
  size?: number | string
  color?: string
  strokeWidth?: number | string
  className?: string
}

export function createIcon(name: string,  iconNode: IconNode[]): FC<CreateIconProps> {
  const Icon: FC<CreateIconProps> = ({
    size = 24,
    color = 'currentColor',
    strokeWidth = 2,
    className,
    ...props
  }) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {renderIconNode(iconNode)}
      </svg>
    )
  }

  Icon.displayName = name
  return Icon
}

function renderIconNode(nodes: IconNode[]): ReactNode {
  return nodes.map((node, index) => {
    const [type, attrs, children] = node
    const props = { key: index, ...attrs }

    if (children && children.length > 0) {
      return createElement(
        type,
        props,
        renderIconNode(children)
      )
    }

    return createElement(type, props)
  })
}
`
  }

  return `import { createElement } from 'react'

export function createIcon(name, iconNode) {
  const Icon = ({
    size = 24,
    color = 'currentColor',
    strokeWidth = 2,
    className,
    ...props
  }) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {renderIconNode(iconNode)}
      </svg>
    )
  }

  Icon.displayName = name
  return Icon
}

function renderIconNode(nodes) {
  return nodes.map((node, index) => {
    const [type, attrs, children] = node
    const props = { key: index, ...attrs }

    if (children && children.length > 0) {
      return createElement(
        type,
        props,
        renderIconNode(children)
      )
    }

    return createElement(type, props)
  })
}
`
}
