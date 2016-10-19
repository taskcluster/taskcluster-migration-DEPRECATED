export default class WorkGraph {
  constructor(data) {
    const nodes = this.nodes = [];
    const byName = this.byName = {};

    Object.keys(data).forEach(name => {
      const node = data[name];

      // normalize
      node.name = name;
      if (!node.dependencies) {
        node.dependencies = [];
      }

      nodes.push(node);
      byName[name] = node;
    });
  }

  // Return a new WorkGraph instance containing only the nodes on which
  // the given node depends
  subgraph(name) {
    const subgraph = {};
    const byName = this.byName;

    const recur = n => {
      if (subgraph[n]) {
        return;
      }

      const node = byName[n];
      subgraph[n] = node;
      node.dependencies.forEach(dep => recur(dep));
    };
    recur(name);

    return new WorkGraph(subgraph);
  }

  // Return the list of work items tagged as milestones
  milestones() {
    return this.nodes
      .filter(node => node.milestone);
  }
}
