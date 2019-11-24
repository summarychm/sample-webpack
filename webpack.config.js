//@ts-check
const path = require('path');
const webpack = require('webpack');

/** @type {webpack.Configuration} */
let config = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};

module.exports = config