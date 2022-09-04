const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../**/*.stories.tsx'],
  addons: [],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(sass|s?css)$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
          },
        },
        'resolve-url-loader',
        'sass-loader',
      ],
      include: /\.(module)\.(sass|s?css)$/i,
    });

    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader'),
      options: {
        presets: [['react-app', { flow: false, typescript: true }]],
      },
    });

    config.resolve.plugins.push(new TsconfigPathsPlugin({}));
    config.resolve.alias = {
      ...config.resolve.alias,
      '@src': path.resolve(__dirname, 'src'),
    };

    return config;
  },
};
