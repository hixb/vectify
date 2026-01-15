import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    typescript: true,
    ignores: [
      '**/dist',
      '**/node_modules',
      '**/*.d.ts',
    ],
  },
  {
    rules: {
      'no-console': 'off',
      'node/prefer-global/process': 'off',
      'node/prefer-global/buffer': 'off',
      'ts/consistent-type-definitions': 'off',
    },
  },
)
