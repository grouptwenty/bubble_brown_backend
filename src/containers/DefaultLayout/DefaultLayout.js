
import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import { saveStateLogout } from '../../_helpers';
import MenuComponent from './Menu';
// import { store } from '../../_helpers';
import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';

// routes config
import routes from '../../routes';
var items = []
const DefaultAside = React.lazy(() => import('./DefaultAside'));
// const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));
var menu = new MenuComponent();


class DefaultLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: []
    }
    // const license = this.props.user.license
    // var value = menu.renderMenu(license)
    // items['items'] = value
    var currentLocation = this.props.location.pathname
    var pathMain = currentLocation.split("/")[1];
    console.log("currentLocation", pathMain);
    var value = menu.renderMenu()
    items['items'] = value
    console.log(" item = >", items);

  }

  async componentDidMount() {

  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    e.preventDefault()
    localStorage.clear();
    this.props.setUser([])
    saveStateLogout()
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
              {/* <DefaultMenu />   */}
              <AppSidebarNav navConfig={items} {...this.props} />
            </Suspense>
            {/* <AppSidebarFooter /> */}
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main" style={{ padding: 0 + '!important', backgroundColor: '#ebedef' ,paddingBottom:0 }}>
            {/* <AppBreadcrumb appRoutes={routes} /> */}
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
                  <Redirect from="/" to="/dashboard" />
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
        {/* <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter> */}
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

