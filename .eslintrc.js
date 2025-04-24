module.exports = {
    root: true,
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['react', '@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
      'airbnb',
      'airbnb/hooks',
      'prettier',
    ],
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error'],
    },
  };
  