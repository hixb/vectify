import { copyFileSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const srcTemplates = join(__dirname, '../src/generators/templates')
const distTemplates = join(__dirname, '../dist/templates')

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true })

  const entries = readdirSync(src)

  for (const entry of entries) {
    const srcPath = join(src, entry)
    const destPath = join(dest, entry)

    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath)
    }
    else {
      copyFileSync(srcPath, destPath)
    }
  }
}

copyDir(srcTemplates, distTemplates)
console.log('✓ Templates copied to dist/')
