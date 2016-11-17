import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import OverviewComponent from './OverviewComponent';
import Breadcrumbs from 'react-breadcrumbs';
import { DetailsComponent, DetailsGraph, DetailsKanban } from './DetailsComponent';
import { PersonComponent } from './PersonComponent';
import { ItemComponent } from './ItemComponent';
import { Router, Route, Redirect, IndexRoute, hashHistory } from 'react-router';

const Navigation = props => (
  <div id="navbar">
    <Navbar fluid={true} inverse={true} staticTop={true}>
      <Navbar.Header>
        <Navbar.Text>
          <Breadcrumbs
            separator=" &#x21d2; "
            wrapperElement="span"
            routes={props.routes}
            params={props.params} />
        </Navbar.Text>
      </Navbar.Header>
    </Navbar>
  </div>
);

const Container = props =>
  <div>
    <Navigation routes={props.routes} params={props.params} />
    <div className="container-fluid">
      {props.children}
    </div>
  </div>;

export default React.createClass({
  propTypes: {
    graph: React.PropTypes.object.isRequired,
  },

  childContextTypes: {
    graph: React.PropTypes.object,
  },

  getChildContext() {
    return { graph: this.props.graph };
  },

  render() {
    return (
      <Router history={hashHistory}>
        <Route name="TaskCluster Migration" path="/" component={Container}>
          <IndexRoute name="Overview" component={OverviewComponent} />
          <Redirect from="/details" to="/details/all" />
          <Route name="Details" path="/details/:rootWorkItem" component={DetailsComponent}>
            <IndexRoute name="Graph" component={DetailsGraph} />
            <Route name="Kanban" path="kanban" component={DetailsKanban} />
          </Route>
          <Route name="Person" path="/person/:person" component={PersonComponent} />
          <Route name="Item" path="/item/:workItem" component={ItemComponent} />
        </Route>
      </Router>
    );
  },
});
