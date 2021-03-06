import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const AboutView = React.lazy(() => import('./view'));
const AboutInsert = React.lazy(() => import('./insert'));
const AboutBranchEdit = React.lazy(() => import('./editbranch'));
const AboutEdit = React.lazy(() => import('./update'));
const AboutDetail = React.lazy(() => import('./detail'));

class About extends Component {
  async componentDidMount() {


  }
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/about/" render={props => <AboutView {...props} />} />
            <Route exact path="/about/insert" render={props => <AboutInsert {...props} />} />
            <Route exact path="/about/editbranch" render={props => <AboutBranchEdit {...props} />} />
            <Route exact path="/about/update/:code" render={props => <AboutEdit {...props} />} />
            <Route exact path="/about/detail/:code" render={props => <AboutDetail {...props} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (About);
