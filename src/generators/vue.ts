import type { IconNode } from '../types'
import { formatIconNode } from '../parsers/svgParser'

/**
 * Generate Vue 3 icon component
 */
export function generateVueComponent(componentName: string, iconNode: IconNode[], typescript: boolean): string {
  const formattedNodes = iconNode.map(node => formatIconNode(node, 4)).join(',\n')
  const lang = typescript ? ' lang="ts"' : ''

  return `<template>
  <Icon :iconNode="iconNode" v-bind="$attrs" />
</template>

<script${lang}>
import { defineComponent } from 'vue'
import Icon from './Icon.vue'${typescript ? `\nimport type { IconNode } from 'vectify'` : ''}

export default defineComponent({
  name: '${componentName}',
  components: { Icon },
  inheritAttrs: false,
  setup() {
    const iconNode${typescript ? ': IconNode[]' : ''} = [
${formattedNodes}
    ]

    return { iconNode }
  }
})
</script>
`
}

/**
 * Generate Vue Icon base component
 */
export function generateVueIcon(typescript: boolean): string {
  const lang = typescript ? ' lang="ts"' : ''

  if (typescript) {
    return `<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="className"
    v-bind="$attrs"
  >
    <component
      v-for="(node, index) in iconNode"
      :key="index"
      :is="renderNode(node)"
    />
  </svg>
</template>

<script${lang}>
import { defineComponent, h } from 'vue'
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
    strokeWidth: {
      type: [Number, String],
      default: 2
    },
    className: {
      type: String,
      default: ''
    }
  },
  setup(props) {
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
      renderNode
    }
  }
})
</script>
`
  }

  return `<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="className"
    v-bind="$attrs"
  >
    <component
      v-for="(node, index) in iconNode"
      :key="index"
      :is="renderNode(node)"
    />
  </svg>
</template>

<script${lang}>
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'Icon',
  inheritAttrs: false,
  props: {
    iconNode: {
      type: Array,
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
    strokeWidth: {
      type: [Number, String],
      default: 2
    },
    className: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    function renderNode(node) {
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
      renderNode
    }
  }
})
</script>
`
}
