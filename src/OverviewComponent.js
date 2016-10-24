import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { Link } from 'react-router';

export default React.createClass({
  contextTypes: {
    graph: React.PropTypes.object.isRequired,
  },

  render() {
    return <div>
      <Row>
        <Col xs={2}><strong>Total Work Items</strong></Col>
        <Col xs={10}>{this.context.graph.nodes.length} nodes</Col>
      </Row>
      <Row>
        <Col xs={2}><strong>Milestones</strong></Col>
        <Col xs={10}>
          <ul>
            {this.context.graph.milestones().map(node =>
              <li key={node.name}>
                <Link to={`/details/${node.name}`}>{node.title}</Link>
              </li>
            )}
          </ul>
        </Col>
      </Row>
    </div>;
  },
});
