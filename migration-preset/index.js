'use strict';

const preset = require('neutrino-preset-react');
const HtmlPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

preset.module.loaders.push({
  test: /\.yml$/,
  include: path.resolve(__dirname, '..', 'workgraph'),
  loaders: ['json', path.resolve(__dirname, 'loader.js')],
});
module.exports = preset;
