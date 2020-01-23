
import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import { saveStateLogout } from '../../_helpers';
import MenuComponent from './Menu';
import { AppAside, AppHeader, AppSidebar, AppSidebarForm, AppSidebarHeader, AppSidebarMinimizer, AppSidebarNav, } from '@coreui/react';
import routes from '../../routes';
var items = []
const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));
var menu = new MenuComponent();
class DefaultLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: []
    }
    var currentLocation = this.props.location.pathname
    var pathMain = currentLocation.split("/")[1];
    console.log("currentLocation", pathMain);
    var value = menu.renderMenu(this.props.user)
    items['items'] = value
    console.log(" item = >", items);
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  async signOut(e) {
    e.preventDefault()
    await localStorage.clear();
    await this.props.setUser([])
    await saveStateLogout()
    this.props.history.push('/login')
  }

  render() {

    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={e => this.signOut(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body" >
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={items} {...this.props} />
            </Suspense>
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main" style={{ padding: 0 + '!important', backgroundColor: '#ebedef', paddingBottom: 0 }}>
            <Container fluid style={{ padding: 0 + '!important' }}>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...props} />
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to="/order" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
      </div>
    );
  }
}

const mapStatetoProps = (state) => {
  return {
    user: state.user
  }
}
const mapDispatchtoProps = (dispatch) => {
  return {
    setUser: (data) => {
      console.log(data)
      dispatch({
        type: "setUserLogout",
        payload: data
      })
    }
  }
}
export default connect(mapStatetoProps, mapDispatchtoProps)(DefaultLayout);

