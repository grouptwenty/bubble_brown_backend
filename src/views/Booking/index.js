import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const BookingView = React.lazy(() => import('./view'));
const BookingInsert = React.lazy(() => import('./insert'));
const BookingEdit = React.lazy(() => import('./edit'));
class Home extends Component {
  async componentDidMount() {
    console.log("hhhh");
  }
  render() {
    return (
        <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/booking" render={props => <BookingView {...props} />} />
            <Route exact path="/booking/insert" render={props => <BookingInsert {...props} />} />
            <Route exact path="/booking/edit/:code" render={props => <BookingEdit {...props} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (Home);
