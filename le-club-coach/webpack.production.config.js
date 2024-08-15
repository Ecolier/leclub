const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const src = path.resolve(__dirname, './src')
const fs = require('fs')
const lessToJs = require('less-vars-to-js')
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './ant-theme-vars.less'), 'utf8'))
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const WorkboxPlugin = require('workbox-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const BetterPathResolver = {
  apply: resolver => {
    const target = resolver.ensureHook('resolve')
    resolver
      .getHook('resolve')
      .tapAsync('BetterPathResolver', (request, resolveContext, callback) => {
        const pathData = path.parse(request.request)
        const filename = path.resolve(
          request.path,
          `${pathData.dir}/${pathData.name}/${pathData.name}.js`,
        )
        if (/node_modules/.test(filename)) {
          return callback()
        }
        fs.stat(filename, err => {
          if (err) {
            return callback()
          }
          const obj = {
            path: request.path,
            request: filename,
            query: request.query,
            directory: request.directory,
          }
          resolver.doResolve(target, obj, null, resolveContext, callback)
        })
      })
  },
}

function createVendorChunk (name, targets) {
  return {
    name,
    chunks: 'all',
    test (module) {
      const context = module.context
      return context && context.indexOf('node_modules') >= 0 && targets.find(t => context.indexOf(`${t}`) > -1)
    },
  }
}

module.exports = {
  mode: 'production',
  entry: ['@babel/polyfill', './src/index.js'],
  cache: false,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'dist/bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{ loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            ['import', { libraryName: 'antd', style: true }],
          ],
        },
      }],
    },
    {
      test: /\.(scss|css)$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader'],
      include: src,

    },
    {
      test: /\.less$/,
      use: ['style-loader', { loader: 'css-loader', options: { sourceMap: 1 } }, {
        loader: 'less-loader',
        options: {
          javascriptEnabled: true,
          modifyVars: themeVariables,
        },
      }],
    },
    ],
  },
  resolve: {
    plugins: [BetterPathResolver],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@config': path.resolve(__dirname, 'app.json'),
    },
  },

  plugins: [
    new CleanWebpackPlugin(['dist', 'index.html']),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 20000,
      minRatio: 0.8,
    }),
    new WorkboxPlugin.GenerateSW({
    swDest: 'sw.js',
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: [{
      urlPattern: new RegExp('/'),
      handler: 'StaleWhileRevalidate'
    }]
  }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        WEBHOOK_URL_CLUB: JSON.stringify(`https://webhooks.mongodb-realm.com/api/client/v2.0/app/searchengine-wdmlr/service/getClubs/incoming_webhook/Find50Clubs`),
        WEBHOOK_URL_PLAYERS: JSON.stringify(`https://webhooks.mongodb-realm.com/api/client/v2.0/app/searchengine-wdmlr/service/getClubs/incoming_webhook/Find50Clubs`),
      },
    }),
    new CopyPlugin([
      { from: 'assets', to: 'assets' },
    ]),
    new CopyPlugin([
      { from: 'public', to: 'public' },
    ]),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        antd: createVendorChunk('antd', ['antd']),
        react: createVendorChunk('react', ['react']),
      },
    },
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          compress: {
            unused: true,
            dead_code: true, // big one--strip code that will never execute
            warnings: false, // good for prod apps so users can't peek behind curtain
            conditionals: true,
            evaluate: true,
            drop_console: true, // strips console statements
            sequences: true,
            booleans: true,
          },
          output: {
            comments: false,
            beautify: false,
          },
        },
      }),
    ],
  },
}
