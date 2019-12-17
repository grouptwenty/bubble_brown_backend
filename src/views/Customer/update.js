import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Input, Label, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';

import { formatDate, parseDate, } from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import CustomerModel from '../../models/CustomerModel'
const customer_model = new CustomerModel


class editView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setval = this.setval.bind(this);
    }


    async componentDidMount() {
        const code = this.props.match.params.code
        console.log(code);

        const customer_data = await customer_model.getCustomerByCode(code);
        console.log(customer_data.data);

        this.setval(customer_data.data)

    }


    async setval(data) {
        document.getElementById('customer_code').value = data.customer_code
        document.getElementById('customer_name').value = data.customer_name
        document.getElementById('customer_id').value = data.customer_id
        document.getElementById('customer_email').value = data.customer_email
        document.getElementById('customer_phone').value = data.customer_phone
        // document.getElementById('customer_img').value = data.customer_img

    }

    async handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        // const date_now = new Date();
        var arr = {};

        for (let name of data.keys()) {
            arr[name] = form.elements[name.toString()].value;
        }
        
console.log(arr);
        if (this.check(arr)) {
            var res = await customer_model.updateCustomerByCode(arr);
              console.log(res)
              if (res.data) {
                swal({
                  title: "สำเร็จ!",
                  text: "แก้ไขข้อมูลลูกค้าสำเร็จ",
                  icon: "success",
                  button: "Close",
                });
                this.props.history.push('/customer/')
              }
        }
    }


    check(form) {
 
        if (form.customer_name == '') {
            swal({
                text: "กรุณากรอก ชื่อ-นามสกุล",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.customer_id == '') {
            swal({
                text: "กรุณากรอก ไอดีลูกค้า",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.customer_email == '') {
            swal({
                text: "กรุณากรอก อีเมล",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.customer_phone == '') {
            swal({
                text: "กรุณากรอก เบอร์โทร",
                icon: "warning",
                button: "close",
            });
            return false
        // } else if (form.customer_id == '') {
        //     swal({
        //         text: "กรุณากรอก ไอดีลูกค้า",
        //         icon: "warning",
        //         button: "close",
        //     });
        //     return false
        } else {
            return true
        }
        // return true;

    }

    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                                <CardHeader>
                                    แก้ไขข้อมูลลูกค้า

                            </CardHeader>
                                <CardBody>

                                    <Row>
                                        <Col lg="12">
                                            <br />
                                            <Row>
                                                <Col lg="4">
                                                    <Label className="text_head"> รหัสลูกค้า<font color='red'><b> * </b></font></Label>
                                                    <Input type="text" id="customer_code" name="customer_code" class="form-control" readOnly ></Input>
                                                    <p id="customer_code" className="text_head_sub">Example : CM001</p>
                                                </Col>
                                                <br />

                                            </Row>
                                            <br />
                                            <Row>
                                                <Col lg="6">
                                                    <Label className="text_head"> ชื่อ-นามสกุล <font color='red'><b> * </b></font></Label>
                                                    <Input type="text" id="customer_name" name="customer_name" class="form-control" autocomplete="off"></Input>
                                                    <p id="customer_name" className="text_head_sub">Example : ชื่อ นามสกุล</p>
                                                </Col>
                                                <Col lg="6">
                                                    <Label className="text_head"> ไอดีลูกค้า </Label>
                                                    <Input type="text" id="customer_id" name="customer_id" class="form-control"  ></Input>
                                                    <p id="customer_id" className="text_head_sub">Example : Line, Facebook</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                            <Col lg="6">
                                                <Label className="text_head"> อีเมล </Label>
                                                <Input type="text" id="customer_email" name="customer_email" class="form-control"></Input>
                                                <p id="customer_email" className="text_head_sub">Example : AAAA@gmail.com</p>
                                            </Col>
                                            <Col lg="6">
                                                <Label className="text_head"> เบอร์โทร </Label>
                                                <Input type="text" id="customer_phone" name="customer_phone" class="form-control"  ></Input>
                                                <p id="customer_phone" className="text_head_sub"></p>
                                            </Col>
                                            </Row>
                                        </Col>

                                    </Row>

                                </CardBody>
                                <CardFooter>
                                    <Link to="/customer/">
                                        <Button type="buttom" size="lg">Back</Button>
                                    </Link>
                                    <Button type="reset" size="lg" color="danger">Reset</Button>
                                    <Button type="submit " size="lg" color="success">Save</Button>
                                </CardFooter>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div >
        )
    }
}

const mapStatetoProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStatetoProps)(editView);
