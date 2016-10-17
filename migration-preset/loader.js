const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const merge = require('lodash.merge');

module.exports = function(source) {
  var self = this;

  self.addContextDependency(self.context)

  const iter = function(source, pathname) {
    var content = yaml.safeLoad(source, {pathname});
    if (content.include) {
      const include = content.include;
      delete content.include;

      include.forEach(function(filename) {
        const pathname = path.resolve(self.context, filename);
        self.addDependency(pathname);
        content = merge(content, iter(fs.readFileSync(pathname), pathname));
      });
    }
    return content;
  }

  var graphData = iter(source, self.resourcePath);

  // make some basic checks
  var roots = new Set(Object.keys(graphData));
  Object.keys(graphData).forEach(function(name) {
    var node = graphData[name];
    (node.dependencies || []).forEach(function(dep) {
      roots.delete(dep);
      if (!graphData[dep]) {
        self.emitError("work item " + dep + ", referenced from " + name + ", does not exist");
      }
    });
  });

  // make sure roots are all milestones
  roots.forEach(function(name) {
    var node = graphData[name];
    if (!node.milestone) {
      self.emitError("nothing depends on work item " + name + " but it is not a milestone");
    }
  });
  
  return JSON.stringify(graphData);
}
