import path from 'path';
import webpack from 'webpack';

module.exports = {
  entry: path.resolve(__dirname, './src/assets/js/index.js'),
  output: {
    path: path.resolve(__dirname, './dist/assets/js'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { 
        test: /\.js$/, 
        exclude: /(node_modules|bower_components)/, 
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  externals: {
    'jquery': 'jQuery',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin()
  ]
}