import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { connect } from 'react-redux';
import AdminModel from '../../../models/AdminModel';
import swal from 'sweetalert';
import Background from './back2.jpg';
var md5 = require("md5");

var adminModel = new AdminModel();

class Login extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      fireRedirect: false
    }
  }
  async componentDidMount() {
    // console.log(this.props.user.member_code)
    // if (this.props.member.member_code!=undefined) {
    //   this.props.history.push('/admin/home')
    // }
  }

  async handleSubmit(event) {
    event.preventDefault();

    var arr = {};

    var user_username = document.getElementById("user_username").value;
    var user_password = document.getElementById("user_password").value;
    console.log('user_username', user_username);
    console.log('user_password', user_password);


    arr['member_email'] = user_username;
    arr['member_password'] = md5(user_password);;

    const information = await adminModel.checkAdminModelLogin(arr);

    console.log("information", information);

    if (information.data) {
      var member = {}

      member = information;
      this.props.setUser(member.data);
      console.log("information", member);

      this.props.history.push('/dashboard')
    } else {
      swal({
        title: "Can not login!",
        text: "Please check your username and password!",
        icon: "warning",
        button: "Close",
      });

    }

  }
  render() {


    return (

      <Form onSubmit={this.handleSubmit} id="myForm">
        <div className="app flex-row align-items-center background-login" style={{ backgroundImage: `url(${Background})` }}>
          <Container>
            <div className="b-head">
              <h1 >IOT WASHING MACHINE</h1>
            </div>
            <Row className="justify-content-center">
              <Col md="6">
                <CardGroup>
                  <Card className="p-4 card_login">
                    <CardBody>

                      <p className="text-muted text_login_s">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" id="user_username" name="user_username" placeholder="Username" autoComplete="username" aria-describedby="inputGroupPrepend21" required />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" id="user_password" name="user_password" placeholder="Password" autoComplete="current-password" required />
                      </InputGroup>
                      <Row>
                        <Col xs="6" className="button_login">
                          <Button color="primary" size="lg" block className="px-4" name="button_login" >Login</Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
      </Form>
    );
  }
}
const mapStatetoProps = (state) => {
  return {
    member: state.member
  }
}
const mapDispatchtoProps = (dispatch) => {
  return {
    setUser: (data) => {
      console.log(data)
      dispatch({
        type: "setMemberLogin",
        payload: data
      })
    }
  }
}

export default connect(mapStatetoProps, mapDispatchtoProps)(Login);

