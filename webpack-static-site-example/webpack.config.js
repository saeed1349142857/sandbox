const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/js/app.ts',
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader'
            ]
          },
          {
            test:  /\.(svg|gif|png|eot|woff|ttf)$/,
            use: [
              'url-loader'
            ]
          },
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
          },
          { test: /\.html$/, use: 'raw-loader' }
        ]
      },
      resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
      },
      plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: 'index.html',
          inject: 'head'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
      ],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].[hash].bundle.js'
    },
    stats: {
        colors: true,
        modules: true,
        reasons: true,
        errorDetails: true
      },
      devServer: {
        contentBase: path.resolve(__dirname, '.'),
        hot: true
      }
  };