import path from 'node:path'
import chalk from 'chalk'
import chokidar from 'chokidar'
import ora from 'ora'
import { findConfig, loadConfig } from '../config/loader'
import { generateIcons } from '../generators'

export interface WatchOptions {
  config?: string
}

/**
 * Watch for SVG file changes and regenerate
 */
export async function watch(options: WatchOptions = {}): Promise<void> {
  const spinner = ora('Loading configuration...').start()

  try {
    // Find or load config
    let configPath = options.config

    if (!configPath) {
      const foundConfig = await findConfig()
      if (!foundConfig) {
        spinner.fail('No config file found')
        console.log(chalk.yellow('\nRun'), chalk.cyan('svg-icon init'), chalk.yellow('to create a config file'))
        return
      }
      configPath = foundConfig
    }

    const config = await loadConfig(configPath)
    spinner.succeed(`Config loaded from ${chalk.green(configPath)}`)

    // Initial generation
    spinner.start('Generating icon components...')
    const initialStats = await generateIcons(config)
    spinner.succeed(`Generated ${chalk.green(initialStats.success)} icon components`)

    // Setup watcher
    const watchPath = path.join(config.input, '**/*.svg')
    const debounce = config.watch?.debounce ?? 300
    const ignore = config.watch?.ignore ?? ['**/node_modules/**', '**/.git/**']

    console.log(chalk.bold('\nWatching for changes...'))
    console.log(`  ${chalk.cyan(watchPath)}`)
    console.log(`  ${chalk.gray('Press Ctrl+C to stop')}\n`)

    const debounceTimer: NodeJS.Timeout | null = null

    const watcher = chokidar.watch(watchPath, {
      ignored: ignore,
      persistent: true,
      ignoreInitial: true,
    })

    watcher
      .on('add', (filePath) => {
        handleChange('added', filePath, config, debounce, debounceTimer)
      })
      .on('change', (filePath) => {
        handleChange('changed', filePath, config, debounce, debounceTimer)
      })
      .on('unlink', (filePath) => {
        console.log(chalk.yellow(`SVG file removed: ${path.basename(filePath)}`))
        handleChange('removed', filePath, config, debounce, debounceTimer)
      })
      .on('error', (error) => {
        console.error(chalk.red(`Watcher error: ${error.message}`))
      })

    // Handle process exit
    process.on('SIGINT', () => {
      console.log(`\n\n${chalk.yellow('Stopping watch mode...')}`)
      watcher.close()
      process.exit(0)
    })
  }
  catch (error: any) {
    spinner.fail('Watch mode failed')
    console.error(chalk.red(error.message))
    throw error
  }
}

/**
 * Handle file change event
 */
function handleChange(
  event: 'added' | 'changed' | 'removed',
  filePath: string,
  config: any,
  debounce: number,
  timer: NodeJS.Timeout | null,
): void {
  const fileName = path.basename(filePath)

  // Clear existing timer
  if (timer) {
    clearTimeout(timer)
  }

  // Debounce regeneration
  timer = setTimeout(async () => {
    const spinner = ora(`Regenerating icons...`).start()

    try {
      const stats = await generateIcons(config)

      if (stats.failed > 0) {
        spinner.warn(
          `Regenerated ${chalk.green(stats.success)} icons, ${chalk.red(stats.failed)} failed`,
        )
      }
      else {
        spinner.succeed(`Regenerated ${chalk.green(stats.success)} icon components`)
      }

      console.log(chalk.gray(`  Triggered by: ${fileName} (${event})\n`))
    }
    catch (error: any) {
      spinner.fail('Regeneration failed')
      console.error(chalk.red(error.message))
    }
  }, debounce)
}
