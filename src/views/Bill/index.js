import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const BillView = React.lazy(() => import('./view'));
// const UserInsert = React.lazy(() => import('./insert'));
// const BillEdit = React.lazy(() => import('./update'));

class User extends Component {
  async componentDidMount() {
    console.log("hhhh");
    

  }
  render() {
    return (
        <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/bill" render={props => <BillView {...props} />} />
            {/* <Route exact path="/user/insert" render={props => <UserInsert {...props} />} /> */}
            {/* <Route exact path="/bill/update/:code" render={props => <BillEdit {...props} />} /> */}
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (User);
