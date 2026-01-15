/**
 * SVG element types supported by the parser
 */
export type SVGElementType
  = | 'circle'
    | 'ellipse'
    | 'line'
    | 'path'
    | 'polygon'
    | 'polyline'
    | 'rect'
    | 'g'

/**
 * Icon node representing an SVG element and its attributes
 * Format: [elementType, attributes, children?]
 */
export type IconNode = [
  SVGElementType,
  Record<string, string | number>,
    IconNode[]?,
]

/**
 * Icon component props
 */
export interface IconProps {
  'size'?: number | string
  'color'?: string
  'strokeWidth'?: number | string
  'className'?: string
  'title'?: string
  'aria-label'?: string
  'aria-hidden'?: boolean | 'true' | 'false'
  [key: string]: any
}

/**
 * Framework types supported
 */
export type Framework = 'react' | 'vue' | 'svelte'

/**
 * Main configuration interface
 */
export interface IconForgeConfig {
  /**
   * Target framework
   */
  framework: Framework

  /**
   * Config file directory relative to project root
   * Used for resolving input/output paths when config is in a subdirectory
   * @default '.'
   * @example
   * // Config at root
   * { configDir: '.' }
   *
   * // Config in config/icons/ subdirectory
   * { configDir: '../..' }
   */
  configDir?: string

  /**
   * Input directory containing SVG files
   * @default './icons'
   */
  input: string

  /**
   * Output directory for generated components
   * @default './src/icons'
   */
  output: string

  /**
   * Enable TypeScript generation
   * @default true
   */
  typescript?: boolean

  /**
   * Enable SVG optimization with SVGO
   * @default true
   */
  optimize?: boolean

  /**
   * Keep original colors from SVG files
   * When true, preserves fill and stroke colors from the original SVG
   * When false, uses currentColor for single-color icons
   * @default false
   */
  keepColors?: boolean

  /**
   * Prefix for component names
   * @default ''
   * @example 'Icon' -> IconArrowRight
   */
  prefix?: string

  /**
   * Suffix for component names
   * @default ''
   * @example 'Icon' -> ArrowRightIcon
   */
  suffix?: string

  /**
   * Custom name transformation function
   */
  transform?: (name: string) => string

  /**
   * SVGO configuration
   */
  svgoConfig?: {
    plugins?: any[]
    [key: string]: any
  }

  /**
   * Generation options
   */
  generateOptions?: {
    /**
     * Generate index file
     * @default true
     */
    index?: boolean

    /**
     * Generate type definitions
     * @default true
     */
    types?: boolean

    /**
     * Generate preview.html to visualize icons
     * @default false
     */
    preview?: boolean

    /**
     * Clean output directory before generating
     * Removes icon components that no longer have corresponding SVG files
     * @default false
     */
    cleanOutput?: boolean
  }

  /**
   * Watch mode settings
   */
  watch?: {
    /**
     * Enable watch mode
     * @default false
     */
    enabled?: boolean

    /**
     * Patterns to ignore
     */
    ignore?: string[]

    /**
     * Debounce delay in milliseconds
     * @default 300
     */
    debounce?: number
  }

  /**
   * Lifecycle hooks
   */
  hooks?: {
    /**
     * Called before parsing SVG
     */
    beforeParse?: (svg: string, fileName: string) => Promise<string> | string

    /**
     * Called after generating component code
     */
    afterGenerate?: (code: string, iconName: string) => Promise<string> | string

    /**
     * Called after all icons are generated
     */
    onComplete?: (stats: GenerationStats) => Promise<void> | void
  }
}

/**
 * Generation statistics
 */
export interface GenerationStats {
  success: number
  failed: number
  total: number
  errors: Array<{ file: string, error: string }>
}

/**
 * Config definition helper
 */
export function defineConfig(config: IconForgeConfig): IconForgeConfig {
  return config
}
