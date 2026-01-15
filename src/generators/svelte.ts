import type { IconNode } from '../types'
import { formatIconNode } from '../parsers/svgParser'

/**
 * Generate Svelte icon component
 */
export function generateSvelteComponent(_componentName: string, iconNode: IconNode[], typescript: boolean): string {
  const formattedNodes = iconNode.map(node => formatIconNode(node, 4)).join(',\n')
  const lang = typescript ? ' lang="ts"' : ''

  return `<script${lang}>
  import Icon from './Icon.svelte'${typescript ? `\n  import type { IconNode } from 'vectify'` : ''}

  const iconNode${typescript ? ': IconNode[]' : ''} = [
${formattedNodes}
  ]
</script>

<Icon {iconNode} {...$$restProps} />
`
}

/**
 * Generate Svelte Icon base component
 */
export function generateSvelteIcon(typescript: boolean): string {
  const lang = typescript ? ' lang="ts"' : ''

  if (typescript) {
    return `<script${lang}>
  import { onMount } from 'svelte'
  import type { IconNode } from 'vectify'

  export let iconNode: IconNode[]
  export let size: number | string = 24
  export let color: string = 'currentColor'
  export let strokeWidth: number | string = 2
  export let className: string = ''

  let svgElement: SVGSVGElement

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
    // Clear existing content
    while (svgElement.firstChild) {
      svgElement.removeChild(svgElement.firstChild)
    }

    // Render icon nodes
    iconNode.forEach(node => {
      svgElement.appendChild(renderNode(node))
    })
  })
</script>

<svg
  bind:this={svgElement}
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke={color}
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
  {...$$restProps}
/>
`
  }

  return `<script${lang}>
  import { onMount } from 'svelte'

  export let iconNode
  export let size = 24
  export let color = 'currentColor'
  export let strokeWidth = 2
  export let className = ''

  let svgElement

  function renderNode(node) {
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
    // Clear existing content
    while (svgElement.firstChild) {
      svgElement.removeChild(svgElement.firstChild)
    }

    // Render icon nodes
    iconNode.forEach(node => {
      svgElement.appendChild(renderNode(node))
    })
  })
</script>

<svg
  bind:this={svgElement}
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke={color}
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
  {...$$restProps}
/>
`
}
