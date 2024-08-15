const path = require('path')
const webpack = require('webpack')
const fs = require('fs')
const src = path.resolve(__dirname, './src')
const lessToJs = require('less-vars-to-js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './ant-theme-vars.less'), 'utf8'))
const WorkboxPlugin = require('workbox-webpack-plugin')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const InterpolateHtmlPlugin = require('interpolate-html-plugin');

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

module.exports = {
  mode: 'development',

  entry: ['@babel/polyfill', './src/index.js'],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'dist/bundle.js',
    publicPath: '/',
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
  plugins: [
		new NodePolyfillPlugin(),
    new InterpolateHtmlPlugin({
      PUBLIC_URL: 'public' // can modify `static` to another name or get it from `process`
    }),
    new webpack.IgnorePlugin({
      contextRegExp: /^\.\/locale$/,
      resourceRegExp: /moment$/
    }),
    // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      title: 'LeClub',
      template: 'public/index.html',
    }),
    // new WorkboxPlugin.GenerateSW({
    //   swDest: 'sw.js',
    //   clientsClaim: true,
    //   skipWaiting: true,
    //   runtimeCaching: [{
    //     urlPattern: new RegExp('/'),
    //     handler: 'StaleWhileRevalidate'
    //   }]
    // }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.WEBHOOK_URL_CLUB': JSON.stringify(`https://webhooks.mongodb-realm.com/api/client/v2.0/app/searchengine-wdmlr/service/getClubs/incoming_webhook/Find50Clubs`),
      'process.env.WEBHOOK_URL_PLAYERS': JSON.stringify(`https://webhooks.mongodb-realm.com/api/client/v2.0/app/searchengine-wdmlr/service/getClubs/incoming_webhook/Find50Clubs`),
    }),
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{ loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            ['import', { libraryName: 'antd', style: true }],
            ['@babel/plugin-proposal-optional-chaining'],
            ['@babel/plugin-proposal-nullish-coalescing-operator'],
          ],
        },
      }],

    },
    {
      test: /\.(scss|css)$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: src,
    },
    {
      test: /\.less$/,
      use: ['style-loader', { loader: 'css-loader', options: { sourceMap: true } }, {
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: themeVariables,
          }
        }
      }],
    },
    ],
  },
  resolve: {
    fallback: {
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false,
      "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
    },
    plugins: [BetterPathResolver],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@config': path.resolve(__dirname, 'app.json'),
    },
  },
}
