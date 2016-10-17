'use strict';

const preset = require('neutrino-preset-react');
const HtmlPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const _ = require('lodash');

const WORKGRAPH_DIR = 'workgraph';

class WorkgraphDataPlugin {
  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const graph = this.readGraph();

      // record dependencies on file contents
      _.forEach(graph.inputs, (filename) => {
        compilation.fileDependencies.push(filename)
      });

      // include an asset containing the graph JSON
      const graphJson = "WORKGRAPH = " + JSON.stringify(graph.data);
      compilation.assets['workgraph.js'] = {
        source: () => graphJson,
        size: () => graphJson.length
      };
      callback();
    });
  }

  readGraph() {
    const inputs = [];

    _.forEach(fs.readdirSync(WORKGRAPH_DIR), (filename) => {
      if (filename.endsWith('.yml')) {
        inputs.push(path.resolve('workgraph/' + filename));
      }
    });

    const data = {};
    _.forEach(inputs, (filename) => {
      const content = yaml.safeLoad(fs.readFileSync(filename), {filename});
      _.merge(data, content);
    });

    return { inputs, data };
  }
}

// TODO: remove when https://github.com/mozilla-neutrino/neutrino-preset-web/pull/4
// ---
preset.plugins = preset.plugins
  .filter(plugin => {
    if (!plugin.constructor) {
      return true;
    }

    return plugin.constructor.name !== 'HtmlWebpackPlugin';
  });
preset.plugins.push(
  new HtmlPlugin({
    template: 'src/template.ejs',
    hash: true,
    xhtml: true
  })
);
// ---

preset.plugins.push(new WorkgraphDataPlugin())

module.exports = preset;
