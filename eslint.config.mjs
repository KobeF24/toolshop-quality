import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default defineConfig([
  { ignores: ['node_modules', 'playwright-report', 'test-results', 'reports', 'toolshop'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      // An un-awaited promise is the #1 cause of flaky tests
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
  { files: ['tests/**/*.ts'], ...playwright.configs['flat/recommended'] },
  { files: ['**/*.mjs'], ...tseslint.configs.disableTypeChecked },
  // Node scripts: declare Node globals
  { files: ['**/*.mjs'], languageOptions: { globals: { process: 'readonly', console: 'readonly' } } },
  prettier,
]);