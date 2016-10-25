import React from 'react';
import Table from 'react-bootstrap/lib/Table';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import moment from 'moment';
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
    // get milestones, with a default due date
    const milestones = this.context.graph.milestones().map(milestone => {
      const { due, ...fields } = milestone;
      return { due: new Date(due || '2020-01-01'), ...fields };
    });

    milestones.sort((a, b) => {
      if (a.due < b.due) {
        return -1;
      } else if (a.due === b.due) {
        return 0;
      }
      return 1;
    });

    return (
      <Table responsive striped hover>
        <thead>
          <tr><th>Milestone/OKR</th><th>Due</th><th>Progress</th></tr>
        </thead>
        <tbody>
          {milestones.map(node => {
            const due = moment.utc(node.due);
            return (
              <tr key={node.name}>
                <td>
                  <Link to={`/details/${node.name}`}>
                    {node.title}
                  </Link>
                </td>
                <td>
                  <OverlayTrigger overlay={<Tooltip id="due">{due.format('LL')}</Tooltip>}>
                    <span>{due.fromNow()}</span>
                  </OverlayTrigger>
                </td>
                <td>{this.renderMilestoneProgress(node)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  },
});
