import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const MachineBrandView = React.lazy(() => import('./view'));
const MachineBrandInsert = React.lazy(() => import('./insert'));
const MachineBrandUpdate = React.lazy(() => import('./update'));
// const WashingMachineDetail = React.lazy(() => import('./detail'));
class MachineBrand extends Component {

  async componentDidMount() {
    console.log("hhhh");


  }
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/machine-manage/machine-brand/" render={props => <MachineBrandView {...props} />} />
            <Route exact path="/machine-manage/machine-brand/insert" render={props => <MachineBrandInsert {...props} />} />
            <Route exact path="/machine-manage/machine-brand/update/:code" render={props => <MachineBrandUpdate {...props} />} />

          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (MachineBrand);
