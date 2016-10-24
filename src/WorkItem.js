import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

export default React.createClass({
  propTypes: {
    node: React.PropTypes.object.required,
  },

  render() {
    const node = this.props.node;
    const footer = (
      <Row>
        <Col xs={6}>
          {node.bug ?
            <a href={`https://bugzilla.mozilla.org/show_bug.cgi?id=${node.bug}`}
               target="_blank">#{node.bug}</a> : null
          }
        </Col>
        <Col className="text-right" xs={6}>
          {node.assigned}
        </Col>
      </Row>
    );
    const className = `wi-${node.state}`;

    return (
      <Panel className={className} header={node.name} footer={footer}>
        {node.title}
        {node.description ? <p className="text-muted">{node.description}</p> : null}
      </Panel>
    );
  },
});
