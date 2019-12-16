import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Input, Label, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';

import { formatDate, parseDate, } from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import WashingMachineBrandModel from '../../../models/WashingMachineBrandModel'
const brand_model = new WashingMachineBrandModel

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
        const brand_data = await brand_model.getBrandByCode(code)


        this.setval(brand_data.data)

    }


    async setval(data) {
        document.getElementById('washing_machine_brand_code').value = data.washing_machine_brand_code
        document.getElementById('washing_machine_brand_name').value = data.washing_machine_brand_name
        document.getElementById('washing_machine_brand_detail').value = data.washing_machine_brand_detail

    }

    async handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);

        var arr = {};

        for (let name of data.keys()) {
            arr[name] = form.elements[name.toString()].value;
        }

        console.log(this.check(arr))
        if (this.check(arr)) {
            var res = await brand_model.updateBrandBy(arr);
              console.log(res)
            if (res.data) {
                swal({
                    title: "Good job!",
                    text: "Update Brand Ok",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/machine-manage/machine-brand/')
            }
        }
    }

    check(form) {

        if (form.washing_machine_brand_code == '') {
            swal({
                text: "กรุณากรอก รหัสแบรนด์/ Brand Code",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.washing_machine_brand_name == '') {
            swal({
                text: "กรุณากรอก ชื่อ แบรนด์ / Brand",
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
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                                <CardHeader>
                                    แก้ไขข้อมูลแบรนด์ /  Edit Brand

                            </CardHeader>
                                <CardBody>

                                    <Row>
                                        <Col lg="12">
                                            <br />
                                            <Row>
                                                <Col lg="4">
                                                    <Label className="text_head"> รหัสแบรนด์/ Brand Code<font color='red'><b> * </b></font></Label>
                                                    <Input type="text" id="washing_machine_brand_code" name="washing_machine_brand_code" class="form-control" readOnly ></Input>
                                                    <p id="washing_machine_brand_code" className="text_head_sub">Example : WMB001</p>
                                                </Col>
                                                <br />

                                            </Row>
                                            <br />
                                            <Row>
                                                <Col lg="6">
                                                    <Label className="text_head"> ชื่อ แบรนด์ / Brand <font color='red'><b> * </b></font></Label>
                                                    <Input type="text" id="washing_machine_brand_name" name="washing_machine_brand_name" class="form-control" autocomplete="off"></Input>
                                                    <p id="washing_machine_brand_name" className="text_head_sub">Example : SAMSUNG</p>
                                                </Col>
                                                <Col lg="6">
                                                    <Label className="text_head"> รายละเอียด </Label>
                                                    <Input type="text" id="washing_machine_brand_detail" name="washing_machine_brand_detail" class="form-control"  ></Input>
                                                    <p id="washing_machine_brand_detail" className="text_head_sub">Example : thailand</p>
                                                </Col>
                                            </Row>
                                        </Col>

                                    </Row>

                                </CardBody>
                                <CardFooter>
                                    <Link to="/machine-manage/machine-brand/">
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