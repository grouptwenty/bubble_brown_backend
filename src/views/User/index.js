import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const UserView = React.lazy(() => import('./view'));
// const UserInsert = React.lazy(() => import('./detail'));
const UserInsert = React.lazy(() => import('./insert'));
const UserEdit = React.lazy(() => import('./update'));
const UserDetail = React.lazy(() => import('./detail'));

class User extends Component {
  async componentDidMount() {
    console.log("hhhh");
    
  }
  render() {
    return (
        <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/user" render={props => <UserView {...props} />} />
            {/* <Route exact path="/user/datail/:code" render={props => <UserDetail {...props} />} /> */}
            <Route exact path="/user/insert" render={props => <UserInsert {...props} />} />
            <Route exact path="/user/update/:code" render={props => <UserEdit {...props} />} />
            <Route exact path="/user/detail/:code" render={props => <UserDetail {...props} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (User);
