import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const InstructionView = React.lazy(() => import('./view'));
const InstructionInsert = React.lazy(() => import('./insert'));
const InstructionEdit = React.lazy(() => import('./update'));


class Instruction extends Component {
  
  async componentDidMount() {
    console.log("hhhh");
    

  }
  render() {
    return (
        <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/instruction/" render={props => <InstructionView {...props} />} />
            <Route exact path="/instruction/insert/" render={props => <InstructionInsert {...props} />} />
            <Route exact path="/instruction/update/:code" render={props => <InstructionEdit {...props} />} />

          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (Instruction);
