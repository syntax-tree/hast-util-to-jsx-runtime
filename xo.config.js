/**
 * @import {FlatXoConfig} from 'xo'
 */

/** @type {FlatXoConfig} */
const xoConfig = [
  {
    name: 'default',
    prettier: 'compat',
    rules: {
      '@typescript-eslint/no-shadow': 'off',
      curly: 'off',
      'import-x/order': 'off',
      'jsdoc/check-indentation': 'off',
      'jsdoc/check-line-alignment': 'off',
      // Wrong for overloads.
      'jsdoc/check-param-names': 'off',
      // Wrong for templates on typedefs.
      'jsdoc/check-template-names': 'off',
      'jsdoc/informative-docs': 'off',
      // Wrong for `@types/*` packages.
      'jsdoc/imports-as-dependencies': 'off',
      'jsdoc/reject-any-type': 'off',
      'jsdoc/require-asterisk-prefix': 'off',
      // Wrong for contextually typed callbacks.
      'jsdoc/require-param-type': 'off',
      // Wrong for overloads.
      'jsdoc/require-returns-check': 'off',
      // Wrong for TypeScript types.
      'jsdoc/valid-types': 'off',
      'no-shadow': 'off',
      // Asserts are used to narrow types.
      'node-test/consistent-assert-style': 'off',
      'node-test/no-conditional-assertion': 'off',
      'node-test/no-standalone-assert': 'off',
      'node-test/prefer-equality-assertion': 'off',
      'prefer-arrow-callback': 'off',
      'prefer-object-spread': 'off',
      'regexp/no-super-linear-move': 'off',
      'regexp/prefer-character-class': 'off',
      'regexp/prefer-named-capture-group': 'off',
      'regexp/unicode-property': 'off',
      'regexp/use-ignore-case': 'off',
      'require-unicode-regexp': 'off',
      'unicorn/better-dom-traversing': 'off',
      // Asserts are used to narrow types.
      'unicorn/consistent-assert': 'off',
      'unicorn/consistent-boolean-name': 'off',
      'unicorn/logical-assignment-operators': 'off',
      'unicorn/max-nested-calls': 'off',
      'unicorn/no-array-sort': 'off',
      'unicorn/no-computed-property-existence-check': 'off',
      // Wrong for spec steps that are numbered separately.
      'unicorn/no-duplicate-if-branches': 'off',
      'unicorn/no-immediate-mutation': 'off',
      // Wrong for function replacers.
      'unicorn/no-unsafe-string-replacement': 'off',
      'unicorn/prefer-at': 'off',
      'unicorn/prefer-boolean-return': 'off',
      'unicorn/prefer-code-point': 'off',
      'unicorn/prefer-continue': 'off',
      'unicorn/prefer-early-return': 'off',
      'unicorn/prefer-https': 'off',
      'unicorn/prefer-includes-over-repeated-comparisons': 'off',
      'unicorn/prefer-simple-condition-first': 'off',
      'unicorn/prefer-string-raw': 'off',
      'unicorn/prefer-string-replace-all': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/prefer-unicode-code-point-escapes': 'off',
      'unicorn/require-array-sort-compare': 'off',
      'unicorn/single-line-block-comment-style': 'off'
    },
    space: true
  },
  // Wrong.
  {ignores: ['**/*.md']},
  {
    files: ['**/*.html'],
    rules: {
      '@html-eslint/no-inline-styles': 'off',
      // Wrong: `utf8` is a valid encoding label.
      '@html-eslint/no-invalid-attr-value': 'off',
      // Wrong for implied end tags.
      '@html-eslint/require-li-container': 'off'
    }
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/array-type': ['error', {default: 'generic'}],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-duplicate-type-constituents': 'off',
      '@typescript-eslint/no-restricted-types': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      'max-params': 'off'
    }
  },
  {
    files: ['package.json'],
    rules: {
      'package-json/no-orphan-types': 'off',
      'package-json/prefer-exports': 'off',
      'package-json/require-engines': 'off',
      'package-json/require-types-in-exports': 'off',
      'package-json/sort-files': 'off',
      'package-json/sort-properties': 'off'
    }
  }
]

export default xoConfig
