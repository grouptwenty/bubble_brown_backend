import React, { Component } from 'react';
import {
    Button,
    Table,
    Card,
    Pagination,
    PaginationLink,
    PaginationItem,
    CardHeader,
    CardFooter,
    Col,
    Row,
    CardImg,
    CardBody,
    CardTitle,
    Input,
    Label,
    Form,
    FormGroup
} from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import WashingMachineTypeModel from '../../../models/WashingMachineTypeModel'
const type_model = new WashingMachineTypeModel

class insertView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }



    async componentDidMount() {

        const max_code = await type_model.getWashingMachineTypeMaxCode()
        console.log("max_code", max_code);

        document.getElementById("washing_machine_type_code").value = 'MT' + max_code.data.washing_machine_type_code_max


    }



    async handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        const date_now = new Date();
        var toDay = date_now.getFullYear() + "" + (date_now.getMonth() + 1) + "" + date_now.getDate() + "" + date_now.getTime()
        var arr = {};

        for (let name of data.keys()) {
            arr[name] = form.elements[name.toString()].value;
        }


        if (this.check(arr)) {
            var res = await type_model.insertTypeBy(arr);
            //   console.log(res)
            if (res.data) {
                swal({
                    title: "Good job!",
                    text: "Add Type Ok",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/machine-manage/machine-type/')
            }
        }
    }


    check(form) {

        if (form.washing_machine_type_code == '') {
            swal({
                text: "กรุณากรอก รหัสประเภท/ Type Code",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.washing_machine_type_name == '') {
            swal({
                text: "กรุณากรอก ประเภทเครื่อง / Machine Type",
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
                                    เพิ่มข้อมูลประเภทเครื่อง /  Insert Machine Type

                            </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col lg="4">
                                            <Label className="text_head"> รหัสประเภท/ Type Code<font color='red'><b> * </b></font></Label>
                                            <Input type="text" id="washing_machine_type_code" name="washing_machine_type_code" class="form-control" readOnly ></Input>
                                            <p id="washing_machine_type_code" className="text_head_sub">Example : MT01</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg="6">
                                            <Label className="text_head"> ประเภทเครื่อง / Machine Type <font color='red'><b> * </b></font></Label>
                                            <Input type="text" id="washing_machine_type_name" name="washing_machine_type_name" class="form-control" autocomplete="off"></Input>
                                            <p id="program_name" className="text_head_sub">Example : เครื่องอบผ้าฝาหน้า</p>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <Link to="/machine-manage/machine-type/">
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

    }
}

export default connect(mapStatetoProps)(insertView);