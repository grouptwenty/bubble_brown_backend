import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const EntrepreneurView = React.lazy(() => import('./view'));
const EntrepreneurInsert = React.lazy(() => import('./insert'));
const EntrepreneurEdit = React.lazy(() => import('./update'));


class Entrepreneur extends Component {
  async componentDidMount() {


  }
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/entrepreneur/" render={props => <EntrepreneurView {...props} />} />
            <Route exact path="/entrepreneur/insert" render={props => <EntrepreneurInsert {...props} />} />
            <Route exact path="/entrepreneur/update/:code" render={props => <EntrepreneurEdit {...props} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (Entrepreneur);
