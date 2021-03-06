import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
// Pages
const RecipeView = React.lazy(() => import('./view'));
const RecipeInsert = React.lazy(() => import('./insert'));
// const WashingGenerationUpdate = React.lazy(() => import('./update'));
class Recipe extends Component {

  async componentDidMount() {
    console.log("hhhh");


  }
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route exact path="/product-manage/recipe/" render={props => <RecipeView {...props} />} />
            <Route exact path="/product-manage/recipe/insert/:code" render={props => <RecipeInsert {...props} />} />
            {/* <Route exact path="/machine-manage/machine-generation/update/:code" render={props => <WashingGenerationUpdate {...props} />} /> */}

          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}


export default (Recipe);
