import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const ReportSaleView = React.lazy(() => import('./view'));
// const LaundryInsert = React.lazy(() => import('./insert'));
// const LaundryEdit = React.lazy(() => import('./edit'));

class ReportView extends Component {
  
  async componentDidMount() {
    console.log("hhhh");
    

  }
  render() {
    return (
        <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/report/report_sale/" render={props => <ReportSaleView {...props} />} />
            {/* <Route exact path="/laundry/insert" render={props => <LaundryInsert {...props} />} />
            <Route exact path="/laundry/edit/:code" render={props => <LaundryEdit {...props} />} /> */}
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (ReportView);
