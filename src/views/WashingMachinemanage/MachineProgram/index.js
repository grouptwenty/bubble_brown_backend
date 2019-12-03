import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const MachineProgramView = React.lazy(() => import('./view'));
const MachineProgramInsert = React.lazy(() => import('./insert'));
const MachineProgramUpdate = React.lazy(() => import('./update'));
class MachineProgram extends Component {

  async componentDidMount() {
    console.log("hhhh");


  }
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/machine-manage/machine-program/" render={props => <MachineProgramView {...props} />} />
            <Route exact path="/machine-manage/machine-program/insert" render={props => <MachineProgramInsert {...props} />} />
            <Route exact path="/machine-manage/machine-program/update/:code" render={props => <MachineProgramUpdate {...props} />} />

          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (MachineProgram);
