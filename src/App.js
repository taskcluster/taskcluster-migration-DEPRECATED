import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import OverviewComponent from './OverviewComponent';
import { DetailsComponent, DetailsGraph, DetailsKanban } from './DetailsComponent';
import { Router, Route, Redirect, Link, IndexRoute, hashHistory } from 'react-router';

const Navigation = () => (
  // TODO: add Navbar.Text containing title
  <div id="navbar">
    <Navbar fluid={true} inverse={true} staticTop={true}>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">TaskCluster Migration Work Graph</Link>
        </Navbar.Brand>
      </Navbar.Header>
    </Navbar>
  </div>
);

const Container = props =>
  <div>
    <Navigation />
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
        <Route path="/" component={Container}>
          <IndexRoute component={OverviewComponent} />
          <Redirect from="/details" to="/details/all" />
          <Route path="/details/:rootWorkItem" component={DetailsComponent}>
            <IndexRoute component={DetailsGraph} />
            <Route path="kanban" component={DetailsKanban} />
          </Route>
        </Route>
      </Router>
    );
  },
});
