import chalk from 'chalk'
import ora from 'ora'
import { findConfig, loadConfig } from '../config/loader'
import { generateIcons } from '../generators'

export interface GenerateOptions {
  config?: string
  dryRun?: boolean
}

/**
 * Generate icon components
 */
export async function generate(options: GenerateOptions = {}): Promise<void> {
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

    // Dry run mode
    if (options.dryRun) {
      spinner.info(chalk.cyan('Dry run mode - no files will be written'))
      console.log(`\n${chalk.bold('Files that would be generated:')}\n`)
    }

    // Generate icons
    const actionText = options.dryRun ? 'Analyzing icons...' : 'Generating icon components...'
    spinner.start(actionText)
    const stats = await generateIcons(config, options.dryRun)

    if (stats.failed > 0) {
      spinner.warn(`${options.dryRun ? 'Analyzed' : 'Generated'} ${chalk.green(stats.success)} icons, ${chalk.red(stats.failed)} failed`)

      // Show errors
      if (stats.errors.length > 0) {
        console.log(`\n${chalk.bold.red('Errors:')}`)
        stats.errors.forEach(({ file, error }) => {
          console.log(`  ${chalk.red('✗')} ${file}: ${error}`)
        })
      }
    }
    else {
      const message = options.dryRun
        ? `Would generate ${chalk.green(stats.success)} icon components`
        : `Generated ${chalk.green(stats.success)} icon components`
      spinner.succeed(message)
    }

    // Show output location
    if (options.dryRun) {
      console.log(`\n${chalk.bold('Target directory:')} ${chalk.cyan(config.output)}`)
      console.log(chalk.gray('\nRun without --dry-run to generate files'))
    }
    else {
      console.log(`\n${chalk.bold('Output:')} ${chalk.cyan(config.output)}`)
      if (config.generateOptions?.preview) {
        console.log(`${chalk.bold('Preview:')} ${chalk.cyan(`${config.output}/preview.html`)}`)
      }
    }
  }
  catch (error: any) {
    spinner.fail('Generation failed')
    console.error(chalk.red(error.message))
    throw error
  }
}
