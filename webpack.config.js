const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const outputDirectory = 'dist'

module.exports = {
  entry: ['babel-polyfill', './src/client/index.js'],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.(js)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    },
    {
        test: /\.(vue)$/,
        exclude: /node_modules/,
        use: {
          loader: 'vue-loader'
        }
    },
    {
      test: /\.css$/,
      use: ['vue-style-loader', 'css-loader']
    },
    {
      test: /\.(sass|scss)$/,
      exclude: /(node_modules)/,
      use: ['vue-style-loader', 'css-loader?url=false', 'sass-loader']
    },
    {
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=100000'
    }
    ]
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico'
    }),
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: ['.js', '.vue', '.scss', '.sass'],
  }
}