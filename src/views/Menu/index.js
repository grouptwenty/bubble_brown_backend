import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const MenuView = React.lazy(() => import('./view'));
// const UserInsert = React.lazy(() => import('./insert'));
// const UserEdit = React.lazy(() => import('./update'));

class User extends Component {
  async componentDidMount() {
    console.log("hhhh");
    

  }
  render() {
    return (
        <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/menu" render={props => <MenuView {...props} />} />
            {/* <Route exact path="/user/insert" render={props => <UserInsert {...props} />} />
            <Route exact path="/user/update/:code" render={props => <UserEdit {...props} />} /> */}
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (User);
