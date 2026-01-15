#!/usr/bin/env node

import chalk from 'chalk'
import { Command } from 'commander'
import { generate } from './commands/generate'
import { init } from './commands/init'
import { watch } from './commands/watch'

// Package info
const packageJson = {
  name: 'vectify',
  version: '1.0.0',
  description: 'A powerful command-line tool to generate React, Vue, and Svelte icon components from SVG files',
}

// Create CLI program
const program = new Command()

program
  .name('svg-icon')
  .description(packageJson.description)
  .version(packageJson.version, '-v, --version', 'Output the current version')

// Init command
program
  .command('init')
  .description('Initialize a new configuration file')
  .option('--force', 'Overwrite existing configuration')
  .option('--config <path>', 'Custom config file path')
  .action(async (options) => {
    try {
      await init(options)
    }
    catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`))
      process.exit(1)
    }
  })

// Generate command
program
  .command('generate')
  .description('Generate icon components from SVG files')
  .option('-c, --config <path>', 'Path to config file')
  .option('--dry-run', 'Preview what will be generated without writing files')
  .action(async (options) => {
    try {
      await generate(options)
    }
    catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`))
      process.exit(1)
    }
  })

// Watch command
program
  .command('watch')
  .description('Watch for changes and regenerate automatically')
  .option('-c, --config <path>', 'Path to config file')
  .action(async (options) => {
    try {
      await watch(options)
    }
    catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`))
      process.exit(1)
    }
  })

// Parse command line arguments
program.parse(process.argv)

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp()
}

export { findConfig, loadConfig } from './config/loader'
export { generateIcons } from './generators'
// Export for programmatic usage
export * from './types'
export { generate, init, watch }
