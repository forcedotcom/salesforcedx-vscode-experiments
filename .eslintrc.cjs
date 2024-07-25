/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'header'],
  rules: {
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'class',
        format: ['PascalCase'],
      },
    ],
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'header/header': [
      2,
      'block',
      [
        '*',
        {
          pattern: ' \\* Copyright \\(c\\) \\d{4}, salesforce\\.com, inc\\.',
          template: ' * Copyright (c) 2024, salesforce.com, inc.',
        },
        ' * All rights reserved.',
        ' * Licensed under the BSD 3-Clause license.',
        ' * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause',
        ' *',
      ],
    ],
    curly: 'warn',
    eqeqeq: 'warn',
    'no-throw-literal': 'warn',
    'require-await': 'error',
  },
  ignorePatterns: ['out', 'dist', '**/*.d.ts', 'scripts/setup-jest.ts'],
};
