#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import chalk from 'chalk'
import { Command } from 'commander'
import { generate } from './commands/generate'
import { init } from './commands/init'
import { watch } from './commands/watch'

function getPackageJson(): { readonly description: string, readonly version: string } {
  let pkgPath: string

  // Check if running in CJS or ESM
  if (typeof __dirname !== 'undefined') {
    // CJS
    pkgPath = join(__dirname, '../package.json')
  }
  else {
    // ESM
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    pkgPath = join(__dirname, '../package.json')
  }

  return JSON.parse(readFileSync(pkgPath, 'utf-8'))
}

const packageJson = getPackageJson()

const program = new Command()

program
  .name('svg-icon')
  .description(packageJson.description)
  .version(packageJson.version, '-v, --version', 'Output the current version')

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

program.parse(process.argv)

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
