import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const StockView = React.lazy(() => import('./view'));
const StockInsert = React.lazy(() => import('./insert'));
const StockDetail = React.lazy(() => import('./stock-in-order'));
class Stock extends Component {

  async componentDidMount() {
    console.log("hhhh");


  }
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/product-manage/stock-in" render={props => <StockView {...props} />} />
            <Route exact path="/product-manage/stock-in/insert/" render={props => <StockInsert {...props} />} />
            <Route exact path="/product-manage/stock-in/stock-in-order/:code" render={props => <StockDetail {...props} />} />

          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (Stock);
