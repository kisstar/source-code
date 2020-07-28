const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const GhPlugins = require('../plugins/gh-plugins')
const { articles } = require('../config')

const isDev = process.env.NODE_ENV !== 'production'

function resolve(p) {
  return path.resolve(__dirname, `../${p}`)
}

function getEntries() {
  /*
  |- src
  |- pages
  |---- list
  |-------- index.html
  |-------- main.js
  |---- other
  |-------- index.html
  |-------- main.js
  |- index.html
  └─ favicon.ico
  */
  const compressConf = {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true
  }
  const commonConfig = {
    minify: isDev ? false : compressConf,
    favicon: resolve('src/favicon.ico')
  }
  const entryMap = {
    main: resolve('src/index.js'),
    list: resolve('src/pages/list/main.js')
  }
  const htmlPluginArray = [
    new HtmlWebpackPlugin(
      Object.assign(commonConfig, {
        filename: 'index.html',
        template: resolve('src/index.html'),
        chunks: ['runtime', 'main', 'common']
      })
    ),
    new HtmlWebpackPlugin(
      Object.assign(commonConfig, {
        filename: './list/index.html',
        template: resolve('src/pages/list/index.html'),
        chunks: ['runtime', 'list', 'common']
      })
    )
  ]

  /*
  interface articles {
    [prop: string]: Article;
  }
  interface Article {
    title: string;
    examplePath: string;
    docsPath: string;
    buttons: string[];
    cards: { name: string; path: string }[];
    links: { rel: string; href: string };
    scripts: { type: string; src: string }[];
  }
  */
  Object.keys(articles).forEach(name => {
    entryMap[name] = resolve(`src/pages/${name}/main.js`)
    htmlPluginArray.push(
      new HtmlWebpackPlugin(
        Object.assign(
          commonConfig,
          {
            template: resolve('config/template.ejs'),
            filename: `./${name}/index.html`,
            chunks: ['runtime', name, 'common']
          },
          articles[name]
        )
      )
    )
  })

  return { entryMap, htmlPluginArray }
}

const { entryMap, htmlPluginArray } = getEntries()
const rules = [
  {
    test: /\.(html)$/,
    use: {
      loader: 'html-loader',
      options: {
        attrs: ['img:src']
      }
    }
  },
  {
    test: /\.(le|c)ss$/,
    use: [
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader',
      'less-loader'
    ]
  },
  {
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader'
    }
  },
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'images/[name].[ext]',
          fallback: 'file-loader'
        }
      }
    ]
  }
]

module.exports = {
  entry: entryMap,
  output: {
    // fix: https://github.com/webpack/webpack-dev-server/issues/1591
    publicPath: isDev
      ? 'http://localhost:8888/'
      : 'https://kisstar.github.io/source-code/',
    path: resolve('dist'),
    filename: isDev ? '[name]/main.js' : '[name]/main.[chunkhash:8].js',
    chunkFilename: isDev
      ? '[name]/[name].min.js'
      : '[name]/[name].[chunkhash:8].min.js'
  },
  module: {
    rules
  },
  plugins: [
    new webpack.ProgressPlugin(),
    ...htmlPluginArray,
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      filename: isDev ? '[name]/main.css' : '[name]/main.[contenthash].css',
      chunkFilename: isDev ? '[name]/[id].css' : '[name]/[id].[contenthash].css'
    }),
    new GhPlugins()
  ],
  resolve: {
    alias: {
      '@': resolve('src'),
      '@utils': '@/utils',
      '@styles': '@/styles',
      '@pages': '@/pages'
    }
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, '../loaders')]
  }
}
