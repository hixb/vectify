import type { Framework, IconNode } from '../types'
import { generateCreateIcon, generateReactComponent } from './react'
import { generateSvelteComponent, generateSvelteIcon } from './svelte'
import { generateVueComponent, generateVueIcon } from './vue'

/**
 * Framework strategy interface
 */
export interface FrameworkStrategy {
  /**
   * Framework name
   */
  name: Framework

  /**
   * File extension for components
   */
  getComponentExtension: (typescript: boolean) => string

  /**
   * File extension for index files
   */
  getIndexExtension: (typescript: boolean) => string

  /**
   * Generate component code
   */
  generateComponent: (
    componentName: string,
    iconNode: IconNode[],
    typescript: boolean,
    keepColors?: boolean,
  ) => string

  /**
   * Generate base component (Icon/createIcon)
   */
  generateBaseComponent: (typescript: boolean) => {
    code: string
    fileName: string
  }
}

/**
 * React framework strategy
 */
class ReactStrategy implements FrameworkStrategy {
  name: Framework = 'react'

  getComponentExtension = (typescript: boolean): string => {
    return typescript ? 'tsx' : 'jsx'
  }

  getIndexExtension = (typescript: boolean): string => {
    return typescript ? 'ts' : 'js'
  }

  generateComponent = (
    componentName: string,
    iconNode: IconNode[],
    typescript: boolean,
    keepColors = false,
  ): string => {
    return generateReactComponent(componentName, iconNode, typescript, keepColors)
  }

  generateBaseComponent = (typescript: boolean): { code: string, fileName: string } => {
    return {
      code: generateCreateIcon(typescript),
      fileName: `createIcon.${this.getComponentExtension(typescript)}`,
    }
  }
}

/**
 * Vue framework strategy
 */
class VueStrategy implements FrameworkStrategy {
  name: Framework = 'vue'

  getComponentExtension = (_typescript: boolean): string => {
    return 'vue'
  }

  getIndexExtension = (typescript: boolean): string => {
    return typescript ? 'ts' : 'js'
  }

  generateComponent = (
    componentName: string,
    iconNode: IconNode[],
    typescript: boolean,
  ): string => {
    return generateVueComponent(componentName, iconNode, typescript)
  }

  generateBaseComponent = (typescript: boolean): { code: string, fileName: string } => {
    return {
      code: generateVueIcon(typescript),
      fileName: 'Icon.vue',
    }
  }
}

/**
 * Svelte framework strategy
 */
class SvelteStrategy implements FrameworkStrategy {
  name: Framework = 'svelte'

  getComponentExtension = (_typescript: boolean): string => {
    return 'svelte'
  }

  getIndexExtension = (typescript: boolean): string => {
    return typescript ? 'ts' : 'js'
  }

  generateComponent = (
    componentName: string,
    iconNode: IconNode[],
    typescript: boolean,
  ): string => {
    return generateSvelteComponent(componentName, iconNode, typescript)
  }

  generateBaseComponent = (typescript: boolean): { code: string, fileName: string } => {
    return {
      code: generateSvelteIcon(typescript),
      fileName: 'Icon.svelte',
    }
  }
}

/**
 * Framework strategy registry
 */
class FrameworkRegistry {
  private strategies = new Map<Framework, FrameworkStrategy>()

  constructor() {
    // Register built-in strategies
    this.register(new ReactStrategy())
    this.register(new VueStrategy())
    this.register(new SvelteStrategy())
  }

  /**
   * Register a framework strategy
   */
  register(strategy: FrameworkStrategy): void {
    this.strategies.set(strategy.name, strategy)
  }

  /**
   * Get a framework strategy
   */
  get(framework: Framework): FrameworkStrategy {
    const strategy = this.strategies.get(framework)
    if (!strategy) {
      throw new Error(`Unsupported framework: ${framework}`)
    }
    return strategy
  }

  /**
   * Check if a framework is supported
   */
  has(framework: Framework): boolean {
    return this.strategies.has(framework)
  }

  /**
   * Get all supported frameworks
   */
  getSupportedFrameworks(): Framework[] {
    return Array.from(this.strategies.keys())
  }
}

/**
 * Global framework registry instance
 */
export const frameworkRegistry = new FrameworkRegistry()

/**
 * Get framework strategy
 */
export function getFrameworkStrategy(framework: Framework): FrameworkStrategy {
  return frameworkRegistry.get(framework)
}
