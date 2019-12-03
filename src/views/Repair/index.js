import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const RepairView = React.lazy(() => import('./view'));
const RepairEdit = React.lazy(() => import('./update'));
const RepairDetail = React.lazy(() => import('./detail'));

class Repair extends Component {
  async componentDidMount() {
    console.log("hhhh");
    

  }
  render() {
    return (
        <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/repair" render={props => <RepairView {...props} />} />
            <Route exact path="/repair/update/:code" render={props => <RepairEdit {...props} />} />
            <Route exact path="/repair/detail/:code" render={props => <RepairDetail {...props} />} />

          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (Repair);
