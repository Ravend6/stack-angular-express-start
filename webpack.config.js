const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const NODE_ENV = process.env.NODE_ENV || 'development'
const IS_TEST = (NODE_ENV === 'test')

// const serverDir = path.resolve(__dirname, 'server')
const clientDir = path.resolve(__dirname, 'client')
const clientSrcDir = path.resolve(clientDir, 'src')
const clientBuildDir = path.resolve(clientDir, 'build')

const config = {
  // context: clientSrcDir,
  // entry: clientSrcDir + './app/index.js',
  entry: {
    // body: ['babel-polyfill', clientSrcDir + '/app/index.js'],
    body: [clientSrcDir + '/app/index.js'],
    head: [clientSrcDir + '/styles/index.js'],
  },
  output: {
    path: clientBuildDir,
    filename: '[name]-bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      IS_TEST
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-3'],
        },
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: 'raw',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style!css',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
        loader: 'url?name=[path][name].[ext]',
        exclude: /node_modules/
      }
      // {
      //   test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
      //   include: /node_modules/,
      //   loader: 'file?name=[1].[ext]&regExp=node_modules/(.*)'
      // }, {
      //   test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
      //   exclude: [/node_modules/],
      //   loader: 'file?name=../[path][name].[ext]'
      // }
    ],
    noParse: [
      /[\/\\]node_modules[\/\\]angular[\/\\]angular\.js$/
    ],
  },
  devServer: {
    host: 'localhost',
    port: 8000,
    contentBase: clientSrcDir,
    proxy: {
      '*': 'http://localhost:3000'
    }
  }
}

config.plugins.push(new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery'
}))

if (NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }))
  config.plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin()
  )
  config.devtool = 'source-map'

  config.plugins.push(new CopyWebpackPlugin([
    {
      from: clientSrcDir + '/index.html',
      to: clientBuildDir + '/index.html'
    },
    {
      from: clientSrcDir + '/uploads',
      to: clientBuildDir + '/uploads'
    },
  ]))
}

module.exports = config

// "start": "concurrently \"npm run webpack\" \"npm run serv\"",
// "webpack": "./node_modules/.bin/webpack-dev-server --content-base app",
// "dev": "NODE_ENV=development ./node_modules/.bin/webpack-dev-server",
// & cp ./client/src/index.html ./client/build/index.html
