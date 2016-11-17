import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import WorkItem from './WorkItem';

export const PersonComponent = React.createClass({
  contextTypes: {
    graph: React.PropTypes.object.isRequired,
  },

  render() {
    const graph = this.context.graph;
    const workItems = graph.nodes.filter(
        node => node.assigned === this.props.params.person && node.state === 'inProgress');

    // sort the longest distances first
    workItems.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    return (
      <div className="container-fluid">
        <h2>Work items assigned to {this.props.params.person}</h2>
        {!workItems.length && <span className="text-muted">no items</span>}
        <Row>
          {
            workItems.map(node => (
              <Col key={node.name} xs={12}>
                <WorkItem node={node} />
              </Col>
            ))
          }
        </Row>
      </div>
    );
  },
});
