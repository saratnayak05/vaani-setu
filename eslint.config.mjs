import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
  {
    rules: {
      // Allow unused vars when prefixed with _ (common TS pattern)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // We use `type` imports via verbatimModuleSyntax, so this is redundant
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
);
