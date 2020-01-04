import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const ProductView = React.lazy(() => import('./view'));
const ProductInsert = React.lazy(() => import('./insert'));
const ProductUpdate = React.lazy(() => import('./update'));
class Product extends Component {

  async componentDidMount() {
    console.log("hhhh");


  }
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/product-manage/product/" render={props => <ProductView {...props} />} />
            <Route exact path="/product-manage/product/insert/" render={props => <ProductInsert {...props} />} />
            <Route exact path="/product-manage/product/update/:code" render={props => <ProductUpdate {...props} />} />

          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (Product);
