import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const AgreementView = React.lazy(() => import('./view'));
// const WashingMachineInsert = React.lazy(() => import('./insert'));
// const WashingMachineUpdate = React.lazy(() => import('./update'));
// const WashingMachineDetail = React.lazy(() => import('./detail'));
class Agreement extends Component {

  async componentDidMount() {
    console.log("hhhh");


  }
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/agreement/" render={props => <AgreementView {...props} />} />
            {/* <Route exact path="/machine-brand/insert" render={props => <WashingMachineInsert {...props} />} />
            <Route exact path="/machine-brand/update/:code" render={props => <WashingMachineUpdate {...props} />} />
            <Route exact path="/machine-brand/detail/:code" render={props => <WashingMachineDetail {...props} />} />
 */}
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (Agreement);
