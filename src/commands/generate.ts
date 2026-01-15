import chalk from 'chalk'
import ora from 'ora'
import { findConfig, loadConfig } from '../config/loader'
import { generateIcons } from '../generators'

export interface GenerateOptions {
  config?: string
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

    // Generate icons
    spinner.start('Generating icon components...')
    const stats = await generateIcons(config)

    if (stats.failed > 0) {
      spinner.warn(`Generated ${chalk.green(stats.success)} icons, ${chalk.red(stats.failed)} failed`)

      // Show errors
      if (stats.errors.length > 0) {
        console.log(`\n${chalk.bold.red('Errors:')}`)
        stats.errors.forEach(({ file, error }) => {
          console.log(`  ${chalk.red('✗')} ${file}: ${error}`)
        })
      }
    }
    else {
      spinner.succeed(`Generated ${chalk.green(stats.success)} icon components`)
    }

    // Show output location
    console.log(`\n${chalk.bold('Output:')} ${chalk.cyan(config.output)}`)
  }
  catch (error: any) {
    spinner.fail('Generation failed')
    console.error(chalk.red(error.message))
    throw error
  }
}
