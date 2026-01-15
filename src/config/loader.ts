import type { IconForgeConfig } from '../types'
import path from 'node:path'
import process from 'node:process'
import { createJiti } from 'jiti'
import { frameworkRegistry } from '../generators/framework-strategy'

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Partial<IconForgeConfig> = {
  input: './icons',
  output: './src/icons',
  typescript: true,
  optimize: true,
  keepColors: false,
  prefix: '',
  suffix: '',
  configDir: '.',
  generateOptions: {
    index: true,
    types: true,
    preview: false,
    cleanOutput: false,
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

  let config: any

  try {
    config = await jiti.import(absolutePath)
  }
  catch (error: any) {
    throw new Error(`Failed to load config from ${configPath}: ${error.message}`)
  }

  // Handle ES module default export
  let loadedConfig = config.default || config

  // Handle array configs
  if (Array.isArray(loadedConfig)) {
    loadedConfig = loadedConfig[0]
  }

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
    const supported = frameworkRegistry.getSupportedFrameworks().join(', ')
    throw new Error(`Config must specify a framework (${supported})`)
  }

  if (!frameworkRegistry.has(mergedConfig.framework)) {
    const supported = frameworkRegistry.getSupportedFrameworks().join(', ')
    throw new Error(`Invalid framework: ${mergedConfig.framework}. Supported: ${supported}`)
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
