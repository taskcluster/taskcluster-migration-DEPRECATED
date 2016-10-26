import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
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
      <div>
        <Row className="hidden-xs">
          <Col xs={12} sm={6}><h3>Milestone/OKR</h3></Col>
          <Col sm={2}><h3>Due</h3></Col>
          <Col sm={4}><h3>Progress</h3></Col>
        </Row>
        {milestones.map(node => {
          const due = moment.utc(node.due);
          return [
            <Row key={`${node.name}-1`}>
              <Col xs={12} sm={6}>
                <Link to={`/details/${node.name}`}>
                  {node.title}
                </Link>
              </Col>
              <Col xs={4} sm={2}>
                <OverlayTrigger overlay={<Tooltip id="due">{due.format('LL')}</Tooltip>}>
                  <span><span className="visible-xs-inline">Due </span>{due.fromNow()}</span>
                </OverlayTrigger>
              </Col>
              <Col xs={8} sm={4}>
                {this.renderMilestoneProgress(node)}
              </Col>
            </Row>,
            <Row key={`${node.name}-2`}>
              <Col xs={12}>
                {node.description ? <p className="text-muted">{node.description}</p> : null}
                <hr className="visible-xs-block" />
              </Col>
            </Row>,
          ];
        })}
      </div>
    );
  },
});
