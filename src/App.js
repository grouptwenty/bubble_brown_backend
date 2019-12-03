import React, { Component } from 'react';

import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './App.scss';
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));
const Login = React.lazy(() => import('./views/Pages/Login'));
const ResponseOmise = React.lazy(() => import('./views/Pages/ResponseOmise/view'));

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
const VerifyView = React.lazy(() => import('./views/Verify/view'));
class App extends Component {
  constructor(props) {
    super(props)
    this.componentDidMount = this.componentDidMount.bind(this);

    this.state = {
      show: false,
    }
  }
  async componentDidMount() {

    // console.log("X",this.props.member);
    // var OneSignal = window.OneSignal || [];
    // OneSignal.push(function () {
    //   OneSignal.init({
    //     appId: "5f720a1d-87ee-4542-80d4-9c3be87e11f1",
    //   });
    // });
    // console.log("X2",OneSignal);

  }
  render() {
    console.log("user", this.props.user.admin_code);

    if (this.props.user.admin_code == undefined) {

      return (
        < HashRouter >

          <React.Suspense fallback={loading()}>
            <link href="https://fonts.googleapis.com/css?family=Kanit" rel="stylesheet" />
            <link href="https://cdn.syncfusion.com/ej2/material.css" rel="stylesheet" />
            <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
              <Route exact path="/response-omise" name="Response Omise" render={props => <ResponseOmise {...props} />} />
              <Route exact path="/" name="Login Page" render={props => <Login {...props} />} />
              <Route exact path="/verify/:email" name="Forgot Password" render={props => <VerifyView {...props} />} />
              <Redirect from="/" to="/login" />
            </Switch>
          </React.Suspense>
        </HashRouter >
      )
    } else {
      return (
        <HashRouter>
          <React.Suspense fallback={loading()}>
            <link href="https://fonts.googleapis.com/css?family=Kanit" rel="stylesheet" />
            <link href="https://cdn.syncfusion.com/ej2/material.css" rel="stylesheet" />
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />             
              <Route path="/" name="Home" render={props => <DefaultLayout {...props} />} />
            </Switch>
          </React.Suspense>
        </HashRouter>
      )
    }
  }
}
const mapStatetoProps = (state) => {
  return {
    user: state.user
  }
}
const mapDispatchtoProps = (dispatch) => {
  return {
    setMember: (data) => {
      console.log(data)
      dispatch({
        type: "setMemberLogin",
        payload: data
      })
    }
  }
}
export default connect(mapStatetoProps, mapDispatchtoProps)(App);
