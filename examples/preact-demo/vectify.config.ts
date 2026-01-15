import { defineConfig } from 'vectify'

export default defineConfig({
  framework: 'preact',
  configDir: '.',
  input: './icons',
  output: './src/icons',
  typescript: true,
  optimize: true,
  prefix: '',
  suffix: '',
  generateOptions: {
    index: true,
    types: true,
    preview: false,
  },
  watch: {
    enabled: false,
    ignore: ['**/node_modules/**', '**/.git/**'],
    debounce: 300,
  },
})
