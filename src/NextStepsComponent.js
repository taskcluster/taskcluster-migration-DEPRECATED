import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';

export default React.createClass({
  propTypes: {
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

  toggleVisible(name) {
    const update = {};
    update[name] = !this.state.visible[name];
    this.setState({
      visible: { ...this.state.visible, ...update },
    });
  },

  render() {
    const graph = this.props.graph;
    const blocked = [];
    const inProgress = [];
    const ready = [];
    const done = [];

    graph.nodes.forEach(node => {
      if (node.done) {
        done.push(node);
      } else if (!node.dependencies.length) {
        if (node.assigned) {
          inProgress.push(node);
        } else {
          ready.push(node);
        }
      } else {
        blocked.push(node);
      }
    });

    const listItems = (name, title, nodes) => {
      const visible = this.state.visible[name];
      const header = (
        <h2 onClick={() => this.toggleVisible(name)}>
          {title}
        </h2>
      );

      if (!nodes.length) {
        return (
          <Panel collapsible expanded={visible} header={header}>
            <span className="text-muted">no items</span>
          </Panel>
        );
      }

      return <Panel collapsible expanded={visible} header={header}>
        <ul>
          {
            nodes.map(node => <li key={node.name}>{node.title}</li>)
          }
        </ul>
      </Panel>;
    };
    return <div className="container-fluid">
      {listItems('blocked', 'Blocked', blocked)}
      {listItems('inProgress', 'In Progress', inProgress)}
      {listItems('ready', 'Ready', ready)}
      {listItems('done', 'Done', done)}
    </div>;
  },
});

