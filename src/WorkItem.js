import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

export default React.createClass({
  propTypes: {
    node: React.PropTypes.object,
    detailed: React.PropTypes.bool,
  },

  render() {
    const node = this.props.node;
    const footer = (
      <Row>
        <Col xs={6}>
          {node.bug &&
            <a href={`https://bugzilla.mozilla.org/show_bug.cgi?id=${node.bug}`}
               target="_blank">#{node.bug}</a>
          }
        </Col>
        <Col className="text-right" xs={6}>
          {node.assigned && <span>Assigned To: {node.assigned}</span>}
        </Col>
      </Row>
    );
    const className = `wi-${node.state}`;

    return (
      <Panel className={className} header={node.name} footer={footer}>
        {node.title}
        {node.description ? <p className="text-muted">{node.description}</p> : null}
        {this.props.detailed && (
          <dl className="dl-horizontal">
            <dt>State:</dt>
            <dd>{node.state}</dd>
            {node.external && <dt>External:</dt>}
            {node.external && <dd>yes</dd>}
            {node.milestone && <dt>Milestone:</dt>}
            {node.milestone && <dd>yes</dd>}
            {node.dependencies.length > 0 && <dt>Dependencies:</dt>}
            {node.dependencies.length > 0 && (
              <dd>
                <ul>
                  {node.dependencies.map(dep => <li key={dep}>{dep}</li>)}
                </ul>
              </dd>
            )}
          </dl>
        )}
      </Panel>
    );
  },
});
