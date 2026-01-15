import type { JSX } from 'solid-js'
import type { IconNode } from 'vectify'
import { splitProps } from 'solid-js'

export interface CreateIconProps {
  'size'?: number | string
  'color'?: string
  'strokeWidth'?: number | string
  'class'?: string
  'title'?: string
  'aria-label'?: string
  'aria-hidden'?: boolean | 'true' | 'false'
  [key: string]: any
}

export function createIcon(name: string, iconNode: IconNode[], keepColors = false) {
  return (props: CreateIconProps): JSX.Element => {
    const [local, others] = splitProps(props, [
      'size',
      'color',
      'strokeWidth',
      'class',
      'title',
      'aria-label',
      'aria-hidden',
    ])

    const size = () => local.size ?? 24
    const color = () => local.color ?? 'currentColor'
    const strokeWidth = () => local.strokeWidth ?? 2

    // Determine if icon should be hidden from screen readers
    const shouldHide = () => local['aria-hidden'] !== undefined
      ? local['aria-hidden']
      : (!local.title && !local['aria-label'])

    const mergedClass = () => local.class ? `vectify-icon ${local.class}` : 'vectify-icon'

    const renderIconNode = (node: IconNode, index: number): JSX.Element => {
      const [type, attrs, children] = node

      let cleanedAttrs: Record<string, any>

      if (keepColors) {
        cleanedAttrs = attrs
      }
      else {
        // Track color attributes to determine icon type
        let hasFill = false
        let hasStroke = false
        let originalStrokeWidth: number | string | undefined

        Object.entries(attrs).forEach(([key, value]) => {
          if (key === 'fill' && value !== 'none') {
            hasFill = true
          }
          if (key === 'stroke') {
            hasStroke = true
          }
          if (key === 'strokeWidth' || key === 'stroke-width') {
            originalStrokeWidth = value
          }
        })

        // Keep non-color attributes
        cleanedAttrs = Object.fromEntries(
          Object.entries(attrs).filter(([key]) =>
            !['stroke', 'fill', 'strokeWidth', 'stroke-width'].includes(key),
          ),
        )

        // Apply color based on original attributes
        if (hasFill) {
          cleanedAttrs.fill = color()
        }
        else if (hasStroke) {
          cleanedAttrs.fill = 'none'
          cleanedAttrs.stroke = color()
          cleanedAttrs.strokeWidth = originalStrokeWidth ?? strokeWidth()
          cleanedAttrs.strokeLinecap = 'round'
          cleanedAttrs.strokeLinejoin = 'round'
        }
      }

      // Convert strokeWidth to stroke-width for SVG
      if (cleanedAttrs.strokeWidth) {
        cleanedAttrs['stroke-width'] = cleanedAttrs.strokeWidth
        delete cleanedAttrs.strokeWidth
      }
      if (cleanedAttrs.strokeLinecap) {
        cleanedAttrs['stroke-linecap'] = cleanedAttrs.strokeLinecap
        delete cleanedAttrs.strokeLinecap
      }
      if (cleanedAttrs.strokeLinejoin) {
        cleanedAttrs['stroke-linejoin'] = cleanedAttrs.strokeLinejoin
        delete cleanedAttrs.strokeLinejoin
      }

      const childElements = children && children.length > 0
        ? children.map((child, idx) => renderIconNode(child, idx))
        : undefined

      // Create SVG element using the type as tag name
      switch (type) {
        case 'path':
          return <path {...cleanedAttrs}>{childElements}</path>
        case 'circle':
          return <circle {...cleanedAttrs}>{childElements}</circle>
        case 'rect':
          return <rect {...cleanedAttrs}>{childElements}</rect>
        case 'line':
          return <line {...cleanedAttrs}>{childElements}</line>
        case 'polyline':
          return <polyline {...cleanedAttrs}>{childElements}</polyline>
        case 'polygon':
          return <polygon {...cleanedAttrs}>{childElements}</polygon>
        case 'ellipse':
          return <ellipse {...cleanedAttrs}>{childElements}</ellipse>
        case 'g':
          return <g {...cleanedAttrs}>{childElements}</g>
        default:
          return <g {...cleanedAttrs}>{childElements}</g>
      }
    }

    return (
      <svg
        width={size()}
        height={size()}
        viewBox="0 0 24 24"
        aria-hidden={shouldHide()}
        aria-label={local['aria-label']}
        role={local.title || local['aria-label'] ? 'img' : undefined}
        {...others}
        class={mergedClass()}
      >
        {local.title && <title>{local.title}</title>}
        {iconNode.map((node, index) => renderIconNode(node, index))}
      </svg>
    )
  }
}
