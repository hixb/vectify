<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :aria-hidden="shouldHide"
    :aria-label="ariaLabel"
    :role="title || ariaLabel ? 'img' : undefined"
    v-bind="$attrs"
    :class="mergedClass"
  >
    <title v-if="title"></title>
    <component
      v-for="(node, index) in cleanedIconNode"
      :key="index"
      :is="renderNode(node)"
    />
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, h } from 'vue'
import type { PropType, VNode } from 'vue'
import type { IconNode } from 'vectify'

export default defineComponent({
  name: 'Icon',
  inheritAttrs: false,
  props: {
    iconNode: {
      type: Array as PropType<IconNode[]>,
      required: true
    },
    size: {
      type: [Number, String],
      default: 24
    },
    color: {
      type: String,
      default: 'currentColor'
    },
    className: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    ariaLabel: {
      type: String,
      default: ''
    },
    ariaHidden: {
      type: [Boolean, String] as PropType<boolean | 'true' | 'false'>,
      default: undefined
    },
    keepColors: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    // Merge className with default class
    const mergedClass = computed(() => {
      return props.className ? `vectify-icon ${props.className}` : 'vectify-icon'
    })

    // Determine if icon should be hidden from screen readers
    const shouldHide = computed(() => {
      return props.ariaHidden !== undefined ? props.ariaHidden : (!props.title && !props.ariaLabel)
    })

    // Clean icon node to apply color
    const cleanedIconNode = computed(() => {
      if (props.keepColors) {
        return props.iconNode
      }

      return cleanIconNodes(props.iconNode, props.color)
    })

    function cleanIconNodes(nodes: IconNode[], color: string): IconNode[] {
      return nodes.map(node => {
        const [type, attrs, children] = node

        // Keep non-color attributes and determine if we need fill or stroke
        const cleanedAttrs: Record<string, any> = {}
        let hasFill = false
        let hasStroke = false

        Object.entries(attrs).forEach(([key, value]) => {
          // Track color attributes
          if (key === 'fill' && value !== 'none') {
            hasFill = true
          }
          if (key === 'stroke') {
            hasStroke = true
          }

          // Keep non-color attributes
          if (!['stroke', 'fill', 'strokeWidth', 'stroke-width'].includes(key)) {
            cleanedAttrs[key] = value
          }
        })

        // Apply color based on original attributes
        if (hasFill) {
          cleanedAttrs.fill = color
        }
        if (hasStroke) {
          cleanedAttrs.stroke = color
        }

        const cleanedChildren = children ? cleanIconNodes(children, color) : undefined

        return [type, cleanedAttrs, cleanedChildren] as IconNode
      })
    }

    function renderNode(node: IconNode): VNode {
      const [type, attrs, children] = node

      if (children && children.length > 0) {
        return h(
          type,
          attrs,
          children.map(child => renderNode(child))
        )
      }

      return h(type, attrs)
    }

    return {
      renderNode,
      mergedClass,
      shouldHide,
      cleanedIconNode
    }
  }
})
</script>
