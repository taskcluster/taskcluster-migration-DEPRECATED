import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

export default React.createClass({
  propTypes: {
    graph: React.PropTypes.object.isRequired,
  },

  render() {
    return <div>
      <Row>
        <Col xs={2}><strong>Total Work Items</strong></Col>
        <Col xs={10}>{this.props.graph.nodes.length} nodes</Col>
      </Row>
      <Row>
        <Col xs={2}><strong>Milestones</strong></Col>
        <Col xs={10}>
          <ul>
            {this.props.graph.milestones().map(node => <li key={node.name}>{node.title}</li>)}
          </ul>
        </Col>
      </Row>
    </div>;
  },
});
