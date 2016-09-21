'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const env = process.env.NODE_ENV;
const isProduction = env === 'production';

let plugins = [
  new ExtractTextPlugin('[name].css', {allChunks: true}),
  new webpack.optimize.CommonsChunkPlugin('shared.js'),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.MinChunkSizePlugin({
    minChunkSize: 51200,
  })
];
if (isProduction) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false,
      },
    }),
    new webpack.DefinePlugin({
      __SERVER__: !isProduction,
      __DEVELOPMENT__: !isProduction,
      __DEVTOOLS__: !isProduction,
      'process.env': {
        BABEL_ENV: JSON.stringify(env),
      },
    })
  )
}

module.exports = {
  debug: !isProduction,
  devtool: isProduction ? false : 'eval',
  entry: './components/Index/',
  output: {
    path: path.join(__dirname, '../server/assets'),
    filename: '[name].js',
    publicPath: '/',
  },
  plugins: plugins,
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel?presets[]=es2015,presets[]=stage-0', 'eslint']
    }, {
      test: /\.jsx$/,
      exclude: /node_modules/,
      loaders: ['babel?presets[]=react,presets[]=es2015', 'eslint']
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
    }, {
      test: /\.jpe?g$|\.svg$|\.gif$|\.png$/i,
      loader: "url-loader?limit=10000&name=images/[hash].png"
    }]
  },
  postcss: function () {
    return [
      require('autoprefixer'),
      require('precss')
    ];
  },
  eslint: {
    configFile: './.eslintrc',
    emitError: true,
    emitWarning: true
  },
  target: "web",
  stats: false,
  progress: true
};
