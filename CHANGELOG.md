# vectify

## 2.0.2

### Patch Changes

- feat(formatter): add auto-formatting support for generated files
  - Implement formatter detection based on project config files: biome, prettier, eslint
  - Add formatOutput util to run formatter commands on output directory
  - Support format option as boolean, string, or config object with tool and args
  - Integrate formatting step after file generation with error handling and user feedback
  - Update types to include formatter options and configuration interface
  - Document new auto-formatting feature with usage examples in README and README.zh-CN
  - Add formatter related dependencies and helper functions for async execution and file checks

## 2.0.1

### Patch Changes

- refactor(react): add 'use client' directives and improve icon component types
  - Add 'use client' directive to all React icon components and templates
  - Update createIcon function to return ForwardRefExoticComponent with proper typing
  - Adjust attribute handling in createIcon for color and stroke properties
  - Change icon exports in react-demo to default exports without file extensions
  - Modify framework export strategy to include React for default exports
  - Fix icons filter logic in preview.html for case-insensitive search without index parameter

## 2.0.0

### Major Changes

- feat: initial release supporting React, Vue, Svelte, Solid, Preact, Angular, Lit, Qwik, Astro, and Vanilla JS
