import type { IconForgeConfig } from '../types'
import path from 'node:path'
import process from 'node:process'
import { createJiti } from 'jiti'

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Partial<IconForgeConfig> = {
  input: './icons',
  output: './src/icons',
  typescript: true,
  optimize: true,
  prefix: '',
  suffix: '',
  configDir: '.',
  generateOptions: {
    index: true,
    types: true,
  },
  watch: {
    enabled: false,
    ignore: ['**/node_modules/**', '**/.git/**'],
    debounce: 300,
  },
}

/**
 * Load configuration from file
 */
export async function loadConfig(configPath: string): Promise<IconForgeConfig> {
  const absolutePath = path.resolve(process.cwd(), configPath)
  const configDir = path.dirname(absolutePath)

  // Use jiti to load TypeScript config files
  const jiti = createJiti(configDir, {
    interopDefault: true,
  })

  let config: IconForgeConfig | IconForgeConfig[]

  try {
    config = await jiti.import(absolutePath) as IconForgeConfig | IconForgeConfig[]
  }
  catch (error: any) {
    throw new Error(`Failed to load config from ${configPath}: ${error.message}`)
  }

  // Handle array configs (e.g., from defineConfig)
  const loadedConfig = Array.isArray(config) ? config[0] : config

  // Merge with defaults
  const mergedConfig = {
    ...DEFAULT_CONFIG,
    ...loadedConfig,
    generateOptions: {
      ...DEFAULT_CONFIG.generateOptions,
      ...loadedConfig.generateOptions,
    },
    watch: {
      ...DEFAULT_CONFIG.watch,
      ...loadedConfig.watch,
    },
  } as IconForgeConfig

  // Resolve paths based on configDir
  if (mergedConfig.configDir && mergedConfig.configDir !== '.') {
    // Config is in a subdirectory, resolve paths from project root
    const projectRoot = path.resolve(configDir, mergedConfig.configDir)
    mergedConfig.input = path.resolve(projectRoot, mergedConfig.input)
    mergedConfig.output = path.resolve(projectRoot, mergedConfig.output)
  }
  else {
    // Config is at root, resolve paths from config directory
    mergedConfig.input = path.resolve(configDir, mergedConfig.input)
    mergedConfig.output = path.resolve(configDir, mergedConfig.output)
  }

  // Validate required fields
  if (!mergedConfig.framework) {
    throw new Error('Config must specify a framework (react, vue, or svelte)')
  }

  if (!['react', 'vue', 'svelte'].includes(mergedConfig.framework)) {
    throw new Error(`Invalid framework: ${mergedConfig.framework}. Must be react, vue, or svelte`)
  }

  return mergedConfig
}

/**
 * Find config file in current directory
 */
export async function findConfig(): Promise<string | null> {
  const { fileExists } = await import('../utils/helpers')

  const configFiles = [
    'vectify.config.ts',
    'vectify.config.js',
  ]

  for (const file of configFiles) {
    const configPath = path.resolve(process.cwd(), file)
    if (await fileExists(configPath)) {
      return configPath
    }
  }

  return null
}
