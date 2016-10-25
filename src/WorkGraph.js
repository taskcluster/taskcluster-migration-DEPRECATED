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

      if (node.done) {
        node.state = 'done';
      } else if (node.assigned) {
        // note that a work item can be inProgress even if it is blocked
        node.state = 'inProgress';
      } else if (node.dependencies.length) {
        node.state = 'blocked';
      } else {
        node.state = 'ready';
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

  rootDistances(root) {
    const distances = {};
    const stack = [{ node: root, distance: 0 }];

    while (stack.length) {
      const { node, distance } = stack.pop();

      // update distance, finding the minimum
      if (distance < (distances[node] || 9999)) {
        distances[node] = distance;
      }

      this.byName[node].dependencies.forEach(dep => {
        stack.push({ node: dep, distance: distance + 1 });
      });
    }

    return distances;
  }
}
