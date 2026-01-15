import type { IconNode, SVGElementType } from '../types'

/**
 * Supported SVG elements
 */
const SUPPORTED_ELEMENTS: SVGElementType[] = [
  'circle',
  'ellipse',
  'line',
  'path',
  'polygon',
  'polyline',
  'rect',
  'g',
]

/**
 * Parse SVG string to IconNode array
 */
export function parseSvg(svgContent: string): IconNode[] {
  // Simple regex-based parser for SVG elements
  const iconNodes: IconNode[] = []

  // Extract SVG body (content between <svg> tags)
  const svgMatch = svgContent.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)
  if (!svgMatch) {
    throw new Error('Invalid SVG: No <svg> tag found')
  }

  const svgBody = svgMatch[1]

  // Parse each supported element
  for (const elementType of SUPPORTED_ELEMENTS) {
    // Match self-closing tags: <path ... />
    const selfClosingRegex = new RegExp(`<${elementType}([^>]*?)\\s*\\/?>`, 'gi')
    let match: RegExpExecArray | null

    match = selfClosingRegex.exec(svgBody)
    while (match !== null) {
      const attrsString = match[1]
      const attrs = parseAttributes(attrsString)

      if (Object.keys(attrs).length > 0) {
        iconNodes.push([elementType, attrs])
      }

      match = selfClosingRegex.exec(svgBody)
    }

    // Match opening/closing tags: <g ...>...</g>
    const wrappedRegex = new RegExp(`<${elementType}([^>]*?)>(.*?)<\\/${elementType}>`, 'gis')

    match = wrappedRegex.exec(svgBody)
    while (match !== null) {
      const attrsString = match[1]
      const innerContent = match[2]
      const attrs = parseAttributes(attrsString)

      // Parse children recursively
      const children = innerContent ? parseSvgContent(innerContent) : undefined

      if (Object.keys(attrs).length > 0 || children) {
        iconNodes.push([elementType, attrs, children])
      }

      match = wrappedRegex.exec(svgBody)
    }
  }

  return iconNodes
}

/**
 * Parse SVG content (for nested elements)
 */
function parseSvgContent(content: string): IconNode[] {
  const nodes: IconNode[] = []

  for (const elementType of SUPPORTED_ELEMENTS) {
    const selfClosingRegex = new RegExp(`<${elementType}([^>]*?)\\s*\\/?>`, 'gi')
    let match: RegExpExecArray | null

    match = selfClosingRegex.exec(content)
    while (match !== null) {
      const attrsString = match[1]
      const attrs = parseAttributes(attrsString)

      if (Object.keys(attrs).length > 0) {
        nodes.push([elementType, attrs])
      }

      match = selfClosingRegex.exec(content)
    }

    const wrappedRegex = new RegExp(`<${elementType}([^>]*?)>(.*?)<\\/${elementType}>`, 'gis')

    match = wrappedRegex.exec(content)
    while (match !== null) {
      const attrsString = match[1]
      const innerContent = match[2]
      const attrs = parseAttributes(attrsString)

      const children = innerContent ? parseSvgContent(innerContent) : undefined

      if (Object.keys(attrs).length > 0 || children) {
        nodes.push([elementType, attrs, children])
      }

      match = wrappedRegex.exec(content)
    }
  }

  return nodes
}

/**
 * Parse attributes from element string
 */
function parseAttributes(attrsString: string): Record<string, string | number> {
  const attrs: Record<string, string | number> = {}

  // Match key="value" or key='value'
  const attrRegex = /(\w+(?:-\w+)*)=["']([^"']*)["']/g
  let match: RegExpExecArray | null

  match = attrRegex.exec(attrsString)
  while (match !== null) {
    const key = match[1]
    const value = match[2]

    // Convert to camelCase for React compatibility
    const camelKey = key.replace(/-([a-z])/g, (_, char) => char.toUpperCase())

    // Try to parse as number if possible
    const numValue = Number.parseFloat(value)
    attrs[camelKey] = Number.isNaN(numValue) ? value : numValue

    match = attrRegex.exec(attrsString)
  }

  return attrs
}

/**
 * Format IconNode array to string for code generation
 */
export function formatIconNode(node: IconNode, indent = 2): string {
  const [elementType, attrs, children] = node
  const indentStr = ' '.repeat(indent)

  const attrsStr = formatAttrs(attrs)

  if (children && children.length > 0) {
    const childrenStr = children
      .map(child => formatIconNode(child, indent + 2))
      .join(',\n')

    return `${indentStr}['${elementType}', ${attrsStr}, [\n${childrenStr}\n${indentStr}]]`
  }

  return `${indentStr}['${elementType}', ${attrsStr}]`
}

/**
 * Format attributes object
 */
function formatAttrs(attrs: Record<string, string | number>): string {
  const entries = Object.entries(attrs)

  if (entries.length === 0) {
    return '{}'
  }

  const formatted = entries
    .map(([key, value]) => {
      if (typeof value === 'number') {
        return `${key}: ${value}`
      }
      // Escape quotes in strings
      const escaped = value.replace(/'/g, '\\\'')
      return `${key}: '${escaped}'`
    })
    .join(', ')

  return `{ ${formatted} }`
}
