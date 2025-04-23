import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import checkFile from 'eslint-plugin-check-file';
import css from '@eslint/css';

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', '**/dist/**', 'coverage'],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: '.',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',
      'max-lines': [
        'error',
        {
          max: 500,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'always', prev: '*', next: 'switch' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: '*', next: 'export' },
      ],
      'no-console': ['error', { allow: ['error'] }],
      'no-debugger': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-interface': [
        'error',
        {
          allowSingleExtends: true,
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-trailing-spaces': ['error', { skipBlankLines: false }],
    },
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    ignores: ['**/main.tsx', '**/index.tsx', '**/vite-env.d.ts'],
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      'check-file/folder-match-with-fex': [
        'error',
        {
          '*.test.{js,jsx,ts,tsx}': '**/__test__/',
        },
      ],
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/!(hooks|routes)/*.{jsx,tsx}': 'PASCAL_CASE',
          '**/!(hooks|routes)/*.{js,ts}': 'CAMEL_CASE',
          '**/hooks/*.{jsx,tsx,js,ts}': 'CAMEL_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/!(__test__|__mocks__)/': 'KEBAB_CASE',
        },
      ],
    },
  },
  {
    files: ['src/**/*.css'],
    plugins: {
      'check-file': checkFile,
      css: css,
    },
    language: 'css/css',
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.css': 'PASCAL_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
  },
);
