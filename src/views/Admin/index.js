import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const AdminView = React.lazy(() => import('./view'));
const AdminInsert = React.lazy(() => import('./insert'));
const AdminUpdate = React.lazy(() => import('./update'));
class Admin extends Component {

  async componentDidMount() {
    console.log("hhhh");


  }
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/admin" render={props => <AdminView {...props} />} />
            <Route exact path="/admin/insert" render={props => <AdminInsert {...props} />} />
            <Route exact path="/admin/update/:code" render={props => <AdminUpdate {...props} />} />

          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (Admin);
