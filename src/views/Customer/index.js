import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const CustomerView = React.lazy(() => import('./view'));
const CustomerInsert = React.lazy(() => import('./insert'));
const CustomerUpdate = React.lazy(() => import('./update'));
// const CustomerDetail = React.lazy(() => import('./detail'));
class Customer extends Component {

  async componentDidMount() {
    console.log("hhhh");


  }
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/customer/" render={props => <CustomerView {...props} />} />
            <Route exact path="/customer/insert" render={props => <CustomerInsert {...props} />} />
            <Route exact path="/customer/update/:code" render={props => <CustomerUpdate {...props} />} />
            {/* <Route exact path="/customer/detail/:code" render={props => <CustomerDetail {...props} />} /> */}

          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (Customer);
