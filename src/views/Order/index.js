import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const OrderView = React.lazy(() => import('./view'));
// const UserInsert = React.lazy(() => import('./insert'));
// const UserEdit = React.lazy(() => import('./update'));

class Order extends Component {
  async componentDidMount() {
    console.log("hhhh");
    

  }
  render() {
    return (
        <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/order" render={props => <OrderView {...props} />} />
            {/* {/* <Route exact path="/user/insert" render={props => <UserInsert {...props} />} /> */}
            <Route exact path="/order/:code" render={props => <OrderView  {...props} />} /> 
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (Order);
