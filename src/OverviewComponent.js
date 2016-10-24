import React from 'react';
import Table from 'react-bootstrap/lib/Table';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import { Link } from 'react-router';

export default React.createClass({
  contextTypes: {
    graph: React.PropTypes.object.isRequired,
  },

  renderMilestoneProgress(node) {
    const graph = this.context.graph.subgraph(node.name);

    const counts = { blocked: 0, inProgress: 0, done: 0, ready: 0 };
    graph.nodes.forEach(n => { counts[n.state] += 1; });

    const total = counts.blocked + counts.inProgress + counts.done + counts.ready;

    return (
      <ProgressBar>
        <ProgressBar className="wi-done" now={counts.done} max={total} key="done" />
        <ProgressBar className="wi-inProgress" now={counts.inProgress} max={total} key="inProgress" />
        <ProgressBar className="wi-ready" now={counts.ready} max={total} key="ready" />
      </ProgressBar>
    );
  },

  render() {
    // TODO: sort by OKR due date
    return (
      <Table responsive striped hover>
        <thead>
          <tr><th>Milestone</th><th>Progress</th></tr>
        </thead>
        <tbody>
          {this.context.graph.milestones().map(node =>
            <tr key={node.name}>
              <td>
                <Link to={`/details/${node.name}`}>
                  {node.title}
                </Link>
              </td>
              <td>{this.renderMilestoneProgress(node)}</td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  },
});
