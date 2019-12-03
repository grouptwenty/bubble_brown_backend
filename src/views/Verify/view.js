import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import Background from './back2.jpg';
import EntrepreneurModel from '../../models/EntrepreneurModel'
import { verify } from 'crypto';

const entrepreneur_model = new EntrepreneurModel

var md5 = require("md5");
class VerifyView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            verify: [],
            data: [],
            fireRedirect: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    async componentDidMount() {
        const email = this.props.match.params.email
        const verify = await entrepreneur_model.ForgotPasswordEntrepreneurBy(email)
        console.log("verify:", verify);

        this.setState({
            verify: verify.data
        })
    }

    async handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);

        var arr = {};

        for (let name of data.keys()) {
            arr[name] = form.elements[name.toString()].value;
        }
        arr['entrepreneur_code'] = this.state.verify.entrepreneur_code

        if (this.check(arr)) {
            var res = await entrepreneur_model.updateForPasswordBy(arr);
            console.log(res)
            if (res.data) {
                swal({
                    title: "Good job!",
                    text: "update password complete",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/verify/')
            }
        }
    }

    check(form) {
console.log(form);

        if (form.entrepreneur_password !== form.Confirm_Password) {
            swal({
                title: "Confirm Password",
                text: "ยืนยันรหัสผ่านไม่ถูกต้อง กรุณายืนยันรหัสผ่านใหม่อีกครั้ง",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.entrepreneur_password == '') {
            swal({
                title: "Confirm Password",
                text: "กรุณากรอก รหัสผ่าน",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.Confirm_Password == '') {
            swal({
                title: "Confirm Password",
                text: "กรุณากรอก ยืนยันรหัสผ่าน",
                icon: "warning",
                button: "close",
            });
            return false

        } else {
            return true
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

                                            <p className="text-muted text_login_s">Forgot Password</p>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-lock"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="text" id="entrepreneur_password" name="entrepreneur_password" placeholder="Password" autoComplete="password" aria-describedby="inputGroupPrepend21" />
                                            </InputGroup>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-lock"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="text" id="Confirm_Password" name="Confirm_Password" placeholder="Confirm Password" autoComplete="confirmpassword" aria-describedby="inputGroupPrepend21"  />
                                            </InputGroup>
                                            <Row>
                                                <Col xs="6" className="button_login">
                                                    <Button type="submit " color="primary" size="lg" block className="px-4" name="button_login" >Send</Button>
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

export default (VerifyView);

