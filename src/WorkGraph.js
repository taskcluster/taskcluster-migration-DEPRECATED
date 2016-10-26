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

  // Return a copy of this WorkGraph containing only the minimum edges required
  // to reach every node from the root.  This removes redundant "long" edges:
  // if A -> B -> C, then an edge from A -> C is redundant.  The effect is a
  // much simpler, almost tree-shaped visual display
  transitiveReduction() {
    // begin by making a reachability matrix
    const paths = new Set();
    const seen = new Set();
    const stack = [];

    // DFS through the graph, using a stack to get transitive reachability
    const recur = name => {
      seen.add(name);
      stack.forEach(n => paths.add(`${n}-${name}`));
      stack.push(name);
      this.byName[name].dependencies.forEach(recur);
      stack.pop();
    };

    this.nodes.forEach(node => {
      if (seen.has(node.name)) {
        return;
      }
      recur(node.name);
    });

    // now omit dependencies for which another dependency has a path
    const reduced = {};
    this.nodes.forEach(node => {
      const omit = new Set();

      node.dependencies.forEach(dep1 => {
        node.dependencies.forEach(dep2 => {
          if (dep1 !== dep2 && paths.has(`${dep2}-${dep1}`)) {
            // node -> dep2 --...--> dep1
            //      \______________/
            // so omit the longer edge from node1 -> dep1
            omit.add(dep1);
          }
        });
      });

      const dependencies = node.dependencies.filter(dep => !omit.has(dep));
      reduced[node.name] = { ...node, dependencies };
    });

    return new WorkGraph(reduced);
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
