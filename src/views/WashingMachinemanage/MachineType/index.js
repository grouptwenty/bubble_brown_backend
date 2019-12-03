import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const MachineTypeView = React.lazy(() => import('./view'));
const MachineTypeInsert = React.lazy(() => import('./insert'));
const MachineTypeUpdate = React.lazy(() => import('./update'));
class MachineType extends Component {

  async componentDidMount() {
    console.log("hhhh");


  }
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/machine-manage/machine-type/" render={props => <MachineTypeView {...props} />} />
            <Route exact path="/machine-manage/machine-type/insert" render={props => <MachineTypeInsert {...props} />} />
            <Route exact path="/machine-manage/machine-type/update/:code" render={props => <MachineTypeUpdate {...props} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (MachineType);
