import type { AnyNode } from 'domhandler'
import type { IconNode, SVGElementType } from '../types'
import * as cheerio from 'cheerio'

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
 * Parse SVG string to IconNode array using Cheerio (proper XML parser)
 */
export function parseSvg(svgContent: string): IconNode[] {
  // Load SVG with Cheerio (XML mode for proper SVG parsing)
  const $ = cheerio.load(svgContent, {
    xml: true,
  })

  const svgElement = $('svg')
  if (svgElement.length === 0) {
    throw new Error('Invalid SVG: No <svg> tag found')
  }

  // Parse all children of the SVG element
  const iconNodes: IconNode[] = []
  svgElement.children().each((_, element) => {
    const node = parseElement($, element)
    if (node) {
      iconNodes.push(node)
    }
  })

  return iconNodes
}

/**
 * Parse a single element and its children
 */
function parseElement($: cheerio.CheerioAPI, element: AnyNode): IconNode | null {
  // Check if element is an Element node
  if (element.type !== 'tag') {
    return null
  }

  const tagName = element.name as SVGElementType

  // Only parse supported SVG elements
  if (!SUPPORTED_ELEMENTS.includes(tagName)) {
    return null
  }

  // Parse attributes
  const attrs = parseAttributes(element)

  // Parse children recursively
  const $element = $(element)
  const children: IconNode[] = []

  $element.children().each((_, child) => {
    const childNode = parseElement($, child)
    if (childNode) {
      children.push(childNode)
    }
  })

  // Return node with or without children
  if (children.length > 0) {
    return [tagName, attrs, children]
  }

  return [tagName, attrs]
}

/**
 * Parse attributes from an element
 */
function parseAttributes(element: AnyNode): Record<string, string | number> {
  const attrs: Record<string, string | number> = {}

  // Check if element has attribs
  if (element.type !== 'tag' || !element.attribs) {
    return attrs
  }

  const attributes = element.attribs

  for (const [key, value] of Object.entries(attributes)) {
    // Skip xmlns and other namespace attributes
    if (key.startsWith('xmlns')) {
      continue
    }

    // Ensure value is a string
    if (typeof value !== 'string') {
      continue
    }

    // Convert to camelCase for React compatibility
    const camelKey = key.replace(/-([a-z])/g, (_, char) => char.toUpperCase())

    // Try to parse as number if possible
    const numValue = Number.parseFloat(value)
    attrs[camelKey] = Number.isNaN(numValue) ? value : numValue
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
