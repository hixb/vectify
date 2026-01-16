import type { FormatConfig, FormatOption, FormatterTool } from '../types'
import { exec } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'
import { fileExists } from './helpers'

const execAsync = promisify(exec)

/**
 * Formatter configuration patterns for auto-detection
 */
const FORMATTER_PATTERNS: Record<Exclude<FormatterTool, 'auto'>, string[]> = {
  biome: ['biome.json', 'biome.jsonc'],
  prettier: [
    '.prettierrc',
    '.prettierrc.json',
    '.prettierrc.yml',
    '.prettierrc.yaml',
    '.prettierrc.js',
    '.prettierrc.cjs',
    '.prettierrc.mjs',
    'prettier.config.js',
    'prettier.config.cjs',
    'prettier.config.mjs',
  ],
  eslint: [
    'eslint.config.js',
    'eslint.config.mjs',
    'eslint.config.cjs',
    'eslint.config.ts',
    '.eslintrc',
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.eslintrc.json',
    '.eslintrc.yml',
    '.eslintrc.yaml',
  ],
}

/**
 * Formatter commands
 */
const FORMATTER_COMMANDS: Record<Exclude<FormatterTool, 'auto'>, (outputDir: string, args?: string) => string> = {
  biome: (outputDir, args) => `npx @biomejs/biome format --write ${args || ''} "${outputDir}"`.trim(),
  prettier: (outputDir, args) => `npx prettier --write ${args || ''} "${outputDir}"`.trim(),
  eslint: (outputDir, args) => `npx eslint --fix ${args || ''} "${outputDir}"`.trim(),
}

/**
 * Normalize format option to FormatConfig
 */
export function normalizeFormatOption(format: FormatOption): FormatConfig | null {
  if (format === false) {
    return null
  }

  if (format === true) {
    return { tool: 'auto' }
  }

  if (typeof format === 'string') {
    return { tool: format }
  }

  return format
}

/**
 * Detect formatter tool based on project config files
 */
export async function detectFormatter(): Promise<Exclude<FormatterTool, 'auto'> | null> {
  const cwd = process.cwd()

  // Check in priority order: biome > prettier > eslint
  const priority: Exclude<FormatterTool, 'auto'>[] = ['biome', 'prettier', 'eslint']

  for (const tool of priority) {
    const patterns = FORMATTER_PATTERNS[tool]
    for (const pattern of patterns) {
      const configPath = path.join(cwd, pattern)
      if (await fileExists(configPath)) {
        return tool
      }
    }
  }

  return null
}

/**
 * Format generated files
 */
export async function formatOutput(outputDir: string, format: FormatOption): Promise<{ success: boolean, tool?: string, error?: string }> {
  const config = normalizeFormatOption(format)

  if (!config) {
    return { success: true }
  }

  let tool: Exclude<FormatterTool, 'auto'> | null = null

  if (config.tool === 'auto') {
    tool = await detectFormatter()
    if (!tool) {
      return {
        success: true,
        error: 'No formatter detected. Install prettier, eslint, or biome to enable auto-formatting.',
      }
    }
  }
  else {
    tool = config.tool || 'prettier'
  }

  const command = FORMATTER_COMMANDS[tool](outputDir, config.args)

  try {
    await execAsync(command, { cwd: process.cwd() })
    return { success: true, tool }
  }
  catch (error: any) {
    return {
      success: false,
      tool,
      error: `Format failed with ${tool}: ${error.message}`,
    }
  }
}
