const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './spiders.js',
  output: {
    filename: 'application.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: [nodeExternals()],
};
