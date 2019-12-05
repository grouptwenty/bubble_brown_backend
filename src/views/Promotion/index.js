import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const PromotionView = React.lazy(() => import('./view'));
const PromotionInsert = React.lazy(() => import('./insert'));
const PromotionEdit = React.lazy(() => import('./edit'));
class Home extends Component {
  async componentDidMount() {
    console.log("hhhh");
  }
  render() {
    return (
        <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/promotion" render={props => <PromotionView {...props} />} />
            <Route exact path="/promotion/insert" render={props => <PromotionInsert {...props} />} />
            <Route exact path="/promotion/edit/:code" render={props => <PromotionEdit {...props} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (Home);
