import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Alert from 'react-bootstrap/lib/Alert';
import WorkItem from './WorkItem';
import GraphDisplay from './GraphDisplay';
import { Link, IndexLink } from 'react-router';
import './details.css';

export const DetailsGraph = React.createClass({
  contextTypes: {
    graph: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      selectedNode: 'linux32-builds-tier2',
    };
  },

  handleNodeSelected(name) {
    this.setState({ selectedNode: name });
  },

  renderNodeInfo() {
    const node = this.context.graph.byName[this.state.selectedNode];

    if (!node) {
      return (
        <Alert bsStyle="info">
          <p>Select a node in the graph to see details about it</p>
        </Alert>
      );
    }

    return (
      <div>
        <h2>{node.name}</h2>
        <p>{node.title}</p>
        {node.description ? <p className="text-muted">{node.description}</p> : null}
        <dl>
          <dt>State</dt>
          <dd>{node.state}</dd>
          {node.assigned ? <dt>Assigned:</dt> : null}
          {node.assigned ? <dd>{node.assigned}</dd> : null}
          {node.external ? <dt>External:</dt> : null}
          {node.external ? <dd>yes</dd> : null}
          {node.milestone ? <dt>Milestone:</dt> : null}
          {node.milestone ? <dd>yes</dd> : null}
          {node.bug ? <dt>Bug:</dt> : null}
          {node.bug ? (
            <dd>
              <a href={`https://bugzilla.mozilla.org/show_bug.cgi?id=${node.bug}`} target="_blank">
                #{node.bug}
              </a>
            </dd>
          ) : null}
          <dt>Dependencies</dt>
          <dd>
            <ul>
              {node.dependencies.map(dep => <li key={dep}>{dep}</li>)}
            </ul>
          </dd>
        </dl>
      </div>
    );
  },

  render() {
    return (
      <Row>
        <Col xs={12} md={7}>
          <GraphDisplay
            root={this.props.params.rootWorkItem}
            onSelect={this.handleNodeSelected} />
        </Col>
        <Col xs={12} md={5}>
          {this.renderNodeInfo()}
        </Col>
      </Row>
    );
  },
});

export const DetailsKanban = React.createClass({
  contextTypes: {
    graph: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      visible: {
        blocked: false,
        inProgress: true,
        ready: true,
        done: false,
      },
    };
  },

  toggleVisible(state) {
    const update = {};
    update[state] = !this.state.visible[state];
    this.setState({
      visible: { ...this.state.visible, ...update },
    });
  },

  render() {
    const graph = this.context.graph;

    const byState = { blocked: [], inProgress: [], ready: [], done: [] };
    graph.nodes.forEach(node => byState[node.state].push(node));

    const listItems = (state, title) => {
      const visible = this.state.visible[state];
      const nodes = byState[state];

      const header = (
        <h2 onClick={() => this.toggleVisible(state)}>
          {title}
        </h2>
      );

      const className = `wi-${state}`;

      if (!nodes.length) {
        return (
          <Panel collapsible expanded={visible} header={header}>
            <span className="text-muted">no items</span>
          </Panel>
        );
      }

      return <Panel collapsible className={className} expanded={visible} header={header}>
        <Row>
          {
            // TODO: use react-columns?  Or all in one column?  Order will matter..
            nodes.map(node => (
              <Col key={node.name} xs={12} lg={6}>
                <WorkItem node={node} />
              </Col>
            ))
          }
        </Row>
      </Panel>;
    };
    return <div className="container-fluid">
      {listItems('blocked', 'Blocked')}
      {listItems('inProgress', 'In Progress')}
      {listItems('ready', 'Ready')}
      {listItems('done', 'Done')}
    </div>;
  },
});

const Tab = React.createClass({
  // see http://brandonlehr.com/bootstrap-tabs-react-router-and-the-active-class/
  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },

  propTypes: {
    to: React.PropTypes.string,
    onlyActiveOnIndex: React.PropTypes.bool,
    children: React.PropTypes.node,
  },

  render() {
    const isActive = this.context.router.isActive(this.props.to, this.props.onlyActiveOnIndex);
    const LinkComponent = this.props.onlyActiveOnIndex ? IndexLink : Link;
    const className = isActive ? 'active' : '';

    return (
      <li className={className}>
        <LinkComponent to={this.props.to}>{this.props.children}</LinkComponent>
      </li>
    );
  },
});

export const DetailsComponent = React.createClass({
  contextTypes: {
    graph: React.PropTypes.object.isRequired,
  },

  childContextTypes: {
    graph: React.PropTypes.object,
  },

  getChildContext() {
    // limit the graph to work items rooted at rootWorkItem and pass that along as
    // the graph context
    const graph = this.props.params.rootWorkItem === 'all' ?
      this.context.graph :
      this.context.graph.subgraph(this.props.params.rootWorkItem);
    return { graph };
  },

  render() {
    const root = `/details/${this.props.params.rootWorkItem}`;
    return (
      <div>
        <nav>
          <ul className="nav nav-tabs">
            <Tab to={root} onlyActiveOnIndex>Graph</Tab>
            <Tab to={`${root}/kanban`}>Kanban</Tab>
          </ul>
        </nav>
        <div className="details-pane">
          {this.props.children}
        </div>
      </div>
    );
  },
});

