import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const MachineGenerationView = React.lazy(() => import('./view'));
const MachineGenerationInsert = React.lazy(() => import('./insert'));
const WashingGenerationUpdate = React.lazy(() => import('./update'));
class MachineGeneration extends Component {

  async componentDidMount() {
    console.log("hhhh");


  }
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/machine-manage/machine-generation/" render={props => <MachineGenerationView {...props} />} />
            <Route exact path="/machine-manage/machine-generation/insert" render={props => <MachineGenerationInsert {...props} />} />
            <Route exact path="/machine-manage/machine-generation/update/:code" render={props => <WashingGenerationUpdate {...props} />} />

          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (MachineGeneration);
