import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const ZoneView = React.lazy(() => import('./view'));
class Home extends Component {
  async componentDidMount() {
    console.log("hhhh");


  }
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/tap-manage/zone" render={props => <ZoneView {...props} />} />          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (Home);
