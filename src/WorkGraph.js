import { Graph } from 'graphlib';

export default class WorkGraph {
  constructor(data) {
    const nodes = this.nodes = {};
    const g = this.g = new Graph({ directed: true });

    Object.keys(data).forEach(name => {
      const node = data[name];
      g.setNode(name, node.title || name);
      nodes[name] = {
        title: node.title,
        bug: node.bug,
        assigned: node.assigned,
        done: node.done || false,
        milestone: node.milestone || false,
        external: node.external || false,
      };

      (node.dependencies || []).forEach(dep => {
        g.setEdge(name, dep);
      });
    });
  }
}
