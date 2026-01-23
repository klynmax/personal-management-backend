// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },

  // Base ESLint
  eslint.configs.recommended,

  // TypeScript (type-checked)
  ...tseslint.configs.recommendedTypeChecked,

  // Prettier
  eslintPluginPrettierRecommended,

  // Configuração global
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.dto.ts'],
    rules: {
      // Decorators do class-validator geram falsos positivos
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',

      // DTO não deve ter lógica async
      '@typescript-eslint/no-floating-promises': 'off',

      // Any é aceitável em boundary objects
      '@typescript-eslint/no-explicit-any': 'off',

      // Estilo
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          endOfLine: 'auto',
        },
      ],
      quotes: 'off',
      '@typescript-eslint/quotes': 'off',
    },
  }
);
