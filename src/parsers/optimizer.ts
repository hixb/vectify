import type { IconForgeConfig } from '../types'
import { optimize } from 'svgo'

/**
 * Default SVGO configuration
 */
const DEFAULT_SVGO_CONFIG = {
  plugins: [
    'preset-default',
    'removeViewBox',
    'removeDimensions',
    'convertShapeToPath',
    {
      name: 'removeAttrs',
      params: {
        attrs: ['class', 'data-name'],
      },
    },
  ],
}

/**
 * Optimize SVG content using SVGO
 */
export async function optimizeSvg(svgContent: string, config: IconForgeConfig): Promise<string> {
  if (!config.optimize) {
    return svgContent
  }

  try {
    const result = optimize(svgContent, {
      ...DEFAULT_SVGO_CONFIG,
      ...config.svgoConfig,
    })

    return result.data
  }
  catch (error: any) {
    console.warn(`SVGO optimization failed: ${error.message}`)
    return svgContent
  }
}
