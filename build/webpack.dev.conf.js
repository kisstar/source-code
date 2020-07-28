const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')

const devConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    host: 'localhost',
    port: 8888,
    publicPath: 'http://localhost:8888/',
    inline: true,
    open: 'Google Chrome',
    openPage: './',
    index: 'index.html',
    hot: true,
    historyApiFallback: true,
    quiet: false,
    stats: 'errors-only'
  }
}

module.exports = merge(baseConfig, devConfig)
