import path from 'node:path'
import process from 'node:process'
import chalk from 'chalk'
import inquirer from 'inquirer'
import ora from 'ora'
import { frameworkRegistry } from '../generators/framework-strategy'
import { ensureDir, fileExists, findProjectRoot, writeFile } from '../utils/helpers'

export interface InitOptions {
  force?: boolean
  config?: string
}

/**
 * Initialize configuration file
 */
export async function init(options: InitOptions = {}): Promise<void> {
  try {
    // Find project root directory
    const projectRoot = await findProjectRoot()
    const currentDir = process.cwd()

    // Show warning if not in project root
    if (currentDir !== projectRoot) {
      console.log(chalk.yellow(`\nNote: Project root detected at ${chalk.cyan(projectRoot)}`))
      console.log(chalk.yellow(`Current directory: ${chalk.cyan(currentDir)}\n`))
    }

    // Ask for config path first
    const pathAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'configPath',
        message: 'Where should we create the config file?',
        default: options.config || './vectify.config.ts',
        validate: (input: string) => {
          if (!input.endsWith('.ts') && !input.endsWith('.js')) {
            return 'Config file must have .ts or .js extension'
          }
          return true
        },
      },
    ])

    const configPath = path.resolve(projectRoot, pathAnswers.configPath)
    const configDir = path.dirname(configPath)

    // Check if config already exists
    if (!options.force && await fileExists(configPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'Config file already exists. Overwrite?',
          default: false,
        },
      ])

      if (!overwrite) {
        console.log(chalk.yellow('Cancelled'))
        return
      }
    }

    // Get supported frameworks dynamically
    const supportedFrameworks = frameworkRegistry.getSupportedFrameworks()
    const frameworkChoices = supportedFrameworks.map(fw => ({
      name: fw.charAt(0).toUpperCase() + fw.slice(1),
      value: fw,
    }))

    // Ask configuration questions
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: 'Which framework are you using?',
        choices: frameworkChoices,
      },
      {
        type: 'input',
        name: 'input',
        message: 'Where are your SVG files located?',
        default: './icons',
      },
      {
        type: 'input',
        name: 'output',
        message: 'Where should we output the components?',
        default: './src/icons',
      },
      {
        type: 'confirm',
        name: 'typescript',
        message: 'Use TypeScript?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'optimize',
        message: 'Optimize SVG files with SVGO?',
        default: true,
      },
      {
        type: 'input',
        name: 'prefix',
        message: 'Component name prefix (optional):',
        default: '',
      },
      {
        type: 'input',
        name: 'suffix',
        message: 'Component name suffix (optional):',
        default: '',
      },
    ])

    // Create input and output directories if they don't exist
    const inputPath = path.resolve(projectRoot, answers.input)
    const outputPath = path.resolve(projectRoot, answers.output)

    const spinner = ora('Setting up directories...').start()
    await ensureDir(inputPath)
    spinner.text = `Created input directory: ${chalk.cyan(answers.input)}`
    await ensureDir(outputPath)
    spinner.succeed(`Created output directory: ${chalk.cyan(answers.output)}`)

    // Calculate relative path from config directory to project root
    const relativeConfigDir = path.relative(configDir, projectRoot) || '.'

    // Generate config content
    const configContent = generateConfigContent(answers, relativeConfigDir)

    // Write config file
    spinner.start('Creating config file...')
    await writeFile(configPath, configContent)
    spinner.succeed(`Config file created at ${chalk.green(configPath)}`)

    // Show next steps
    console.log(`\n${chalk.bold('Next steps:')}`)
    console.log(`  1. Place your SVG files in ${chalk.cyan(answers.input)}`)
    console.log(`  2. Run ${chalk.cyan('svg-icon generate')} to generate components`)
    console.log(`  3. Import and use your icons!\n`)
  }
  catch (error: any) {
    console.error(chalk.red('Initialization failed'))
    throw error
  }
}

/**
 * Generate config file content
 */
function generateConfigContent(answers: any, configDir: string): string {
  return `import { defineConfig } from 'vectify'

export default defineConfig({
  framework: '${answers.framework}',
  configDir: '${configDir}',
  input: '${answers.input}',
  output: '${answers.output}',
  typescript: ${answers.typescript},
  optimize: ${answers.optimize},
  prefix: '${answers.prefix}',
  suffix: '${answers.suffix}',
  generateOptions: {
    index: true,
    types: true,
    preview: false
  },
  watch: {
    enabled: false,
    ignore: ['**/node_modules/**', '**/.git/**'],
    debounce: 300,
  },
})
`
}
