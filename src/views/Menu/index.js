import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const MenuView = React.lazy(() => import('./view'));
const MenuInsert = React.lazy(() => import('./insert'));
const MenuUpdate = React.lazy(() => import('./update'));
// const WashingMachineDetail = React.lazy(() => import('./detail'));
class Menu extends Component {

  async componentDidMount() {
    console.log("hhhh");


  }
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/menu/" render={props => <MenuView {...props} />} />
            <Route exact path="/menu/insert" render={props => <MenuInsert {...props} />} />
            <Route exact path="/menu/update/:code" render={props => <MenuUpdate {...props} />} />

          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (Menu);
