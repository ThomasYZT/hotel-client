const CompressionWebpackPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DevEnv = require('./config/prod.env');
const ProEnv = require('./config/dev.env');
module.exports = {
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== 'production',
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
  chainWebpack: config => {
    config.plugin('define')
      .tap(args => {
        return [{ 'process.env': process.env.NODE_ENV === 'production' ? DevEnv : ProEnv }];
      });

    config.module
      .rule('less')
      .oneOf('normal')
      .use('less-loader')
      .tap(options => {
        return {
          ...options,
          javascriptEnabled: true
        };
      });

    config.when(process.env.NODE_ENV === 'production', () => {
      config.module.rule('css').oneOf('vue').use('vue-style-loader').clear();

      config.plugin('gzip')
        .use(CompressionWebpackPlugin, [{
          asset: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(js|css)$'),
          threshold: 10240,
          minRatio: 0.8
        }])
        .end();

      config.module.rule('css')
        .oneOf('vue')
        .use('vue-style-loader')
        .loader(MiniCssExtractPlugin.loader);
    });
  }
};
