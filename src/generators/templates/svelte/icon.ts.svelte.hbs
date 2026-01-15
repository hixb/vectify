<script lang="ts">
  import { onMount } from 'svelte'
  import type { IconNode } from 'vectify'

  export let iconNode: IconNode[]
  export let size: number | string = 24
  export let color: string = 'currentColor'
  export let strokeWidth: number | string = 2
  export let className: string = ''
  export let title: string = ''
  export let ariaLabel: string = ''
  export let ariaHidden: boolean | 'true' | 'false' | undefined = undefined
  export let keepColors: boolean = false

  let svgElement: SVGSVGElement

  // Merge className with default class
  $: mergedClass = className ? `vectify-icon ${className}` : 'vectify-icon'

  // Determine if icon should be hidden from screen readers
  $: shouldHide = ariaHidden !== undefined ? ariaHidden : (!title && !ariaLabel)

  // Clean icon node to apply color
  $: cleanedIconNode = keepColors ? iconNode : cleanIconNodes(iconNode, color, strokeWidth)

  function cleanIconNodes(nodes: IconNode[], color: string, strokeWidth: number | string): IconNode[] {
    return nodes.map(node => {
      const [type, attrs, children] = node

      // Keep non-color attributes and determine if we need fill or stroke
      const cleanedAttrs: Record<string, any> = {}
      let hasFill = false
      let hasStroke = false
      let originalStrokeWidth: number | string | undefined

      Object.entries(attrs).forEach(([key, value]) => {
        // Track color attributes
        if (key === 'fill') {
          if (value !== 'none') {
            hasFill = true
          }
        }
        if (key === 'stroke') {
          hasStroke = true
        }
        if (key === 'strokeWidth' || key === 'stroke-width') {
          originalStrokeWidth = value
        }

        // Keep non-color attributes
        if (!['stroke', 'fill', 'strokeWidth', 'stroke-width'].includes(key)) {
          cleanedAttrs[key] = value
        }
      })

      // Apply color based on original attributes
      if (hasFill) {
        cleanedAttrs.fill = color
      } else if (hasStroke) {
        // Stroke-based icon: set fill to none to prevent default black fill
        cleanedAttrs.fill = 'none'
        cleanedAttrs.stroke = color
        cleanedAttrs.strokeWidth = originalStrokeWidth ?? strokeWidth
        cleanedAttrs.strokeLinecap = 'round'
        cleanedAttrs.strokeLinejoin = 'round'
      }

      const cleanedChildren = children ? cleanIconNodes(children, color, strokeWidth) : undefined

      return cleanedChildren ? [type, cleanedAttrs, cleanedChildren] : [type, cleanedAttrs]
    }) as IconNode[]
  }

  function renderNode(node: IconNode): SVGElement {
    const [type, attrs, children] = node
    const element = document.createElementNS('http://www.w3.org/2000/svg', type)

    // Set attributes
    Object.entries(attrs).forEach(([key, value]) => {
      element.setAttribute(key, String(value))
    })

    // Render children
    if (children && children.length > 0) {
      children.forEach(child => {
        element.appendChild(renderNode(child))
      })
    }

    return element
  }

  onMount(() => {
    // Clear existing content (except title if present)
    while (svgElement.firstChild) {
      if (svgElement.firstChild.nodeName !== 'title') {
        svgElement.removeChild(svgElement.firstChild)
      } else {
        break
      }
    }

    // Render icon nodes after title
    cleanedIconNode.forEach(node => {
      svgElement.appendChild(renderNode(node))
    })
  })
</script>

<svg
  bind:this={svgElement}
  width={size}
  height={size}
  viewBox="0 0 24 24"
  aria-hidden={shouldHide}
  aria-label={ariaLabel || undefined}
  role={title || ariaLabel ? 'img' : undefined}
  {...$$restProps}
  class={mergedClass}
>
  {#if title}
    <title>{title}</title>
  {/if}
</svg>
