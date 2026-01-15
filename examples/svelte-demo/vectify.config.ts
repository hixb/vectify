import { defineConfig } from 'vectify'

export default defineConfig({
  framework: 'svelte',
  configDir: '.',
  input: './icons',
  output: './src/icons',
  typescript: true,
  optimize: true,
  prefix: '',
  suffix: '',

  // SVGO configuration (optional)
  // svgoConfig: {
  //   plugins: [
  //     'preset-default',
  //     'removeViewBox',
  //     'convertShapeToPath'
  //   ]
  // },

  // Generation options
  generateOptions: {
    index: true,
    types: true,
    preview: true,
  },

  // Watch mode settings
  watch: {
    enabled: false,
    ignore: ['**/node_modules/**', '**/.git/**'],
    debounce: 300,
  },

  // Lifecycle hooks (optional)
  // hooks: {
  //   beforeParse: async (svg, fileName) => {
  //     // Modify SVG before parsing
  //     return svg
  //   },
  //   afterGenerate: async (code, iconName) => {
  //     // Modify generated code
  //     return code
  //   },
  //   onComplete: async (stats) => {
  //     console.log(`Generated ${stats.success} icons`)
  //   }
  // }
})
