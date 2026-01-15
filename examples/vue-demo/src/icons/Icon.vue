<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :aria-hidden="shouldHide"
    :aria-label="ariaLabel"
    :role="title || ariaLabel ? 'img' : undefined"
    v-bind="$attrs"
    :class="mergedClass"
  >
    <title v-if="title"></title>
    <component
      v-for="(node, index) in iconNode"
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
    strokeWidth: {
      type: [Number, String],
      default: 2
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
      shouldHide
    }
  }
})
</script>
