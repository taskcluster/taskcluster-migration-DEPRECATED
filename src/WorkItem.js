import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Badge from 'react-bootstrap/lib/Badge';
import Col from 'react-bootstrap/lib/Col';

export default React.createClass({
  contextTypes: {
    graph: React.PropTypes.object.isRequired,
  },

  propTypes: {
    node: React.PropTypes.object,
    detailed: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      detailed: this.props.detailed,
    };
  },

  render() {
    const node = this.props.node;
    const header = (
      <span>
        {node.title}
        {this.state.detailed || (
          <span className="pull-right" onClick={() => this.setState({ detailed: true })}>
            <Glyphicon bsSize="xsmall" glyph="option-vertical" />
          </span>)
        }
      </span>
    );
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
    const revDeps = this.context.graph.reverseDependencies(node.name);
    const showDep = dep => {
      const depState = this.context.graph.byName[dep].state;
      return (
        <li key={dep}>
          {dep}
          &nbsp;
          <Badge className={`wi-${depState}`}>{depState}</Badge>
        </li>
      );
    };

    return (
      <Panel className={className} header={header} footer={footer}>
        {node.title}
        {node.description ? <p className="text-muted">{node.description}</p> : null}
        {this.state.detailed && (
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
                <ul>{node.dependencies.map(showDep)}</ul>
              </dd>
            )}
            {revDeps.length > 0 && <dt>Depended On By:</dt>}
            {revDeps.length > 0 && (
              <dd>
                <ul>{revDeps.map(showDep)}</ul>
              </dd>
            )}
          </dl>
        )}
      </Panel>
    );
  },
});
