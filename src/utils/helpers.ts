/**
 * Convert string to PascalCase
 * @example toPascalCase('arrow-right') -> 'ArrowRight'
 * @example toPascalCase('user_profile') -> 'UserProfile'
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, char => char.toUpperCase())
    .replace(/[^a-z0-9]/gi, '')
}

/**
 * Convert string to kebab-case
 * @example toKebabCase('ArrowRight') -> 'arrow-right'
 * @example toKebabCase('UserProfile') -> 'user-profile'
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Merge multiple class names
 * @example mergeClasses('class1', 'class2', undefined) -> 'class1 class2'
 */
export function mergeClasses(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Get component name with prefix/suffix
 * @example getComponentName('arrow-right', 'Icon', '') -> 'IconArrowRight'
 * @example getComponentName('arrow-right', '', 'Icon') -> 'ArrowRightIcon'
 */
export function getComponentName(
  fileName: string,
  prefix = '',
  suffix = '',
  transform?: (name: string) => string,
): string {
  // Remove .svg extension
  const baseName = fileName.replace(/\.svg$/, '')

  // Convert to PascalCase
  let componentName = toPascalCase(baseName)

  // Apply custom transform if provided
  if (transform) {
    componentName = transform(componentName)
  }

  // Add prefix and suffix
  return `${prefix}${componentName}${suffix}`
}

/**
 * Format SVG attributes for code generation
 */
export function formatAttributes(attrs: Record<string, string | number>): string {
  const entries = Object.entries(attrs)
  if (entries.length === 0)
    return '{}'

  const formatted = entries
    .map(([key, value]) => {
      if (typeof value === 'number') {
        return `${key}: ${value}`
      }
      return `${key}: '${value}'`
    })
    .join(', ')

  return `{ ${formatted} }`
}

/**
 * Ensure directory exists
 */
export async function ensureDir(dirPath: string): Promise<void> {
  const fs = await import('node:fs/promises')
  try {
    await fs.mkdir(dirPath, { recursive: true })
  }
  catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error
    }
  }
}

/**
 * Check if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  const fs = await import('node:fs/promises')
  try {
    await fs.access(filePath)
    return true
  }
  catch {
    return false
  }
}

/**
 * Read file content
 */
export async function readFile(filePath: string): Promise<string> {
  const fs = await import('node:fs/promises')
  return await fs.readFile(filePath, 'utf-8')
}

/**
 * Write file content
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  const fs = await import('node:fs/promises')
  await fs.writeFile(filePath, content, 'utf-8')
}

/**
 * Get all SVG files in directory
 */
export async function getSvgFiles(dirPath: string): Promise<string[]> {
  const fs = await import('node:fs/promises')
  const path = await import('node:path')

  try {
    const files = await fs.readdir(dirPath)
    return files
      .filter(file => file.endsWith('.svg'))
      .map(file => path.join(dirPath, file))
  }
  catch {
    return []
  }
}
