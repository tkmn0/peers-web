const path = require('path');
const WebpackCopyDocumentsPlugin = require('./webpack-copy-documents-pugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    library: 'peers-web',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.js'],
    alias: {
      '#': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [new WebpackCopyDocumentsPlugin()]
};
