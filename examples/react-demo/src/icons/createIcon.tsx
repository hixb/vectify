import { createElement, forwardRef } from 'react'
import type { IconNode, IconProps } from 'vectify'
import type { ReactNode, SVGProps } from 'react'

export interface CreateIconProps extends IconProps, Omit<SVGProps<SVGSVGElement>, keyof IconProps> {
  size?: number | string
  color?: string
  strokeWidth?: number | string
  className?: string
  title?: string
  'aria-label'?: string
  'aria-hidden'?: boolean | 'true' | 'false'
}

export function createIcon(name: string, iconNode: IconNode[], keepColors = false) {
  const Icon = forwardRef<SVGSVGElement, CreateIconProps>(({
    size = 24,
    color = 'currentColor',
    strokeWidth = 2,
    className,
    title,
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden,
    ...props
  }, ref) => {
    // Determine if icon should be hidden from screen readers
    const shouldHide = ariaHidden !== undefined ? ariaHidden : (!title && !ariaLabel)

    const { className: propsClassName, ...restProps } = props as any
    const allClassNames = [className, propsClassName].filter(Boolean).join(' ')
    const mergedClassName = allClassNames ? `vectify-icon ${allClassNames}` : 'vectify-icon'

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={keepColors ? undefined : "none"}
        stroke={keepColors ? undefined : color}
        strokeWidth={keepColors ? undefined : strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={shouldHide}
        aria-label={ariaLabel}
        role={title || ariaLabel ? 'img' : undefined}
        {...restProps}
        className={mergedClassName}
      >
        {title && <title>{title}</title>}
        {renderIconNode(iconNode)}
      </svg>
    )
  })

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
