const path = require('path');
const wasmPack = require('vite-plugin-wasm-pack');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../**/*.stories.tsx'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    '@storybook/addon-controls',
    'storybook-dark-mode',
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
  features: {
    storyStoreV7: true,
  },
  viteFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@src': path.resolve(__dirname, 'src'),
      '@wasm': path.resolve(__dirname, '../wasm_module'),
    };
    config.plugins.push(wasmPack('./wasm_module'));

    return config;
  },
};
