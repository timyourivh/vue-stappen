/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-unused-vars': ['error', { args: 'none' }],
    'vue/multi-word-component-names': ['off'],
    'no-console': ['warn', { allow: ['error', 'warn'] }], // Disallow console.log() as this is a develoment tool.
  },
}
