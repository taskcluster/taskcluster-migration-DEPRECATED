import React from 'react';
import WorkItem from './WorkItem';

export const ItemComponent = React.createClass({
  contextTypes: {
    graph: React.PropTypes.object.isRequired,
  },

  render() {
    const graph = this.context.graph;
    const workItem = graph.byName[this.props.params.workItem];

    if (!workItem) {
      return (
        <div>
          <h2>Oops!</h2>
          No such work item
        </div>
      );
    }

    return <WorkItem node={workItem} detailed={true} />;
  },
});

