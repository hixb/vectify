import type { Framework, IconNode } from '../types'
import { generateAngularBaseComponent, generateAngularComponent } from './angular'
import { generateAstroBaseComponent, generateAstroComponent } from './astro'
import { generateLitBaseComponent, generateLitComponent } from './lit'
import { generateCreateIcon, generateReactComponent } from './react'
import { generateReactLikeBaseComponent, generateReactLikeComponent } from './react-like'
import { generateSvelteComponent, generateSvelteIcon } from './svelte'
import { generateVanillaBaseComponent, generateVanillaComponent } from './vanilla'
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
 * Solid.js framework strategy
 */
class SolidStrategy implements FrameworkStrategy {
  name: Framework = 'solid'

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
    keepColors?: boolean,
  ): string => {
    return generateReactLikeComponent(componentName, iconNode, typescript, keepColors ?? false, 'solid')
  }

  generateBaseComponent = (typescript: boolean): { code: string, fileName: string } => {
    return generateReactLikeBaseComponent(typescript, 'solid')
  }
}

/**
 * Preact framework strategy
 */
class PreactStrategy implements FrameworkStrategy {
  name: Framework = 'preact'

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
    keepColors?: boolean,
  ): string => {
    return generateReactLikeComponent(componentName, iconNode, typescript, keepColors ?? false, 'preact')
  }

  generateBaseComponent = (typescript: boolean): { code: string, fileName: string } => {
    return generateReactLikeBaseComponent(typescript, 'preact')
  }
}

/**
 * Vanilla JS framework strategy
 */
class VanillaStrategy implements FrameworkStrategy {
  name: Framework = 'vanilla'

  getComponentExtension = (typescript: boolean): string => {
    return typescript ? 'ts' : 'js'
  }

  getIndexExtension = (typescript: boolean): string => {
    return typescript ? 'ts' : 'js'
  }

  generateComponent = (
    componentName: string,
    iconNode: IconNode[],
    typescript: boolean,
    keepColors?: boolean,
  ): string => {
    return generateVanillaComponent(componentName, iconNode, typescript, keepColors ?? false)
  }

  generateBaseComponent = (typescript: boolean): { code: string, fileName: string } => {
    return generateVanillaBaseComponent(typescript)
  }
}

/**
 * Lit (Web Components) framework strategy
 */
class LitStrategy implements FrameworkStrategy {
  name: Framework = 'lit'

  getComponentExtension = (typescript: boolean): string => {
    return typescript ? 'ts' : 'js'
  }

  getIndexExtension = (typescript: boolean): string => {
    return typescript ? 'ts' : 'js'
  }

  generateComponent = (
    componentName: string,
    iconNode: IconNode[],
    typescript: boolean,
    keepColors?: boolean,
  ): string => {
    return generateLitComponent(componentName, iconNode, typescript, keepColors ?? false)
  }

  generateBaseComponent = (typescript: boolean): { code: string, fileName: string } => {
    return generateLitBaseComponent(typescript)
  }
}

/**
 * Qwik framework strategy
 */
class QwikStrategy implements FrameworkStrategy {
  name: Framework = 'qwik'

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
    keepColors?: boolean,
  ): string => {
    return generateReactLikeComponent(componentName, iconNode, typescript, keepColors ?? false, 'qwik')
  }

  generateBaseComponent = (typescript: boolean): { code: string, fileName: string } => {
    return generateReactLikeBaseComponent(typescript, 'qwik')
  }
}

/**
 * Astro framework strategy
 */
class AstroStrategy implements FrameworkStrategy {
  name: Framework = 'astro'

  getComponentExtension = (_typescript: boolean): string => {
    return 'astro'
  }

  getIndexExtension = (typescript: boolean): string => {
    return typescript ? 'ts' : 'js'
  }

  generateComponent = (
    componentName: string,
    iconNode: IconNode[],
    typescript: boolean,
    keepColors?: boolean,
  ): string => {
    return generateAstroComponent(componentName, iconNode, typescript, keepColors ?? false)
  }

  generateBaseComponent = (typescript: boolean): { code: string, fileName: string } => {
    return generateAstroBaseComponent(typescript)
  }
}

/**
 * Angular framework strategy
 */
class AngularStrategy implements FrameworkStrategy {
  name: Framework = 'angular'

  getComponentExtension = (_typescript: boolean): string => {
    return 'ts'
  }

  getIndexExtension = (_typescript: boolean): string => {
    return 'ts'
  }

  generateComponent = (
    componentName: string,
    iconNode: IconNode[],
    typescript: boolean,
    keepColors?: boolean,
  ): string => {
    return generateAngularComponent(componentName, iconNode, typescript, keepColors ?? false)
  }

  generateBaseComponent = (typescript: boolean): { code: string, fileName: string } => {
    return generateAngularBaseComponent(typescript)
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
    this.register(new SolidStrategy())
    this.register(new PreactStrategy())
    this.register(new VanillaStrategy())
    this.register(new LitStrategy())
    this.register(new QwikStrategy())
    this.register(new AstroStrategy())
    this.register(new AngularStrategy())
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
