import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Input, Label, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';

import { formatDate, parseDate, } from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import WashingMachineGenerationModel from '../../../models/WashingMachineGenerationModel'
import WashingMachineBrandModel from '../../../models/WashingMachineBrandModel'
import WashingMachineTypeModel from '../../../models/WashingMachineTypeModel'

const generation_model = new WashingMachineGenerationModel
const brand_model = new WashingMachineBrandModel
const machinetype_model = new WashingMachineTypeModel

class editView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            brand: [],
            machine_type: [],
            refresh: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setval = this.setval.bind(this);
    }


    async componentDidMount() {
        const code = this.props.match.params.code
        const generation_data = await generation_model.getGenerationByCode(code)
        var brand = await brand_model.getWashingMachineBrandBy()
        var machine_type = await machinetype_model.getWashingMachineTypeBy()
        // console.log(generation_data);


        this.setState({
            brand: brand.data,
            machine_type: machine_type.data
        })
        this.setval(generation_data.data)
    }


    async setval(data) {

        document.getElementById('washing_machine_generation_code').value = data.washing_machine_generation_code
        document.getElementById('washing_machine_generation_name').value = data.washing_machine_generation_name
        document.getElementById('washing_machine_brand_code').value = data.washing_machine_brand_code
        document.getElementById('washing_machine_type_code').value = data.washing_machine_type_code

    }

    async handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);

        var arr = {};

        for (let name of data.keys()) {
            arr[name] = form.elements[name.toString()].value;
        }

        if (this.check(arr)) {
            var res = await generation_model.updateGenerationBy(arr);
              console.log(res)
            if (res.data) {
                swal({
                    title: "Good job!",
                    text: "Update Generation Ok",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/machine-manage/machine-generation/')
            }
        }
    }

    check(form) {

        if (form.washing_machine_generation_code == '') {
            swal({
                text: "กรุณากรอก รหัสรุ่น / Generation Code",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.washing_machine_generation_name == '') {
            swal({
                text: "กรุณากรอก ชื่อ รุ่น / Generation",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.washing_machine_brand_code == '') {
            swal({
                text: "กรุณากรอก แบรนด์ / Brand",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.washing_machine_type_code == '') {
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
        let brand = this.state.brand
        let machine_type = this.state.machine_type
        // console.log("machine_type",machine_type);


        let brand_select = []
        for (let i = 0; i < brand.length; i++) {
            brand_select.push(
                <option value={brand[i].washing_machine_brand_code}>{brand[i].washing_machine_brand_name}</option>
            )
        }

        let machine_type_select = []
        for (let i = 0; i < machine_type.length; i++) {
            machine_type_select.push(
                <option value={machine_type[i].washing_machine_type_code}>{machine_type[i].washing_machine_type_name}</option>
            )
        }

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                            <CardHeader>
                                แก้ไขข้อมูลรุ่น /  Edit Genration

                            </CardHeader>
                            <CardBody>

                                <Row>
                                    <Col lg="12">
                                        <br />
                                        <Row>
                                            <Col lg="4">
                                                <Label className="text_head"> รหัสรุ่น / Generation Code<font color='red'><b> * </b></font></Label>
                                                <Input type="text" id="washing_machine_generation_code" name="washing_machine_generation_code" class="form-control" readOnly ></Input>
                                                <p id="washing_machine_generation_code" className="text_head_sub">Example : WMB001</p>
                                            </Col>
                                            <Col lg="6">

                                                <Label className="text_head"> ชื่อ รุ่น / Generation <font color='red'><b> * </b></font></Label>
                                                <Input type="text" id="washing_machine_generation_name" name="washing_machine_generation_name" class="form-control" autocomplete="off"></Input>
                                                <p id="washing_machine_generation_name" className="text_head_sub">Example : FC1409S4W</p>
                                            </Col>
                                        </Row>
                                        <br />
                                        <Row>
                                            <Col lg="6">
                                                <Label className="text_head"> แบรนด์ / Brand<font color='red'><b> * </b></font></Label>
                                                <Input type="select" id="washing_machine_brand_code" name="washing_machine_brand_code" class="form-control">
                                                    <option value="">Select</option>
                                                    {brand_select}
                                                </Input>
                                                <p id="laundry_code" className="text_head_sub">Example : SAMSUNG</p>
                                            </Col>
                                            <Col lg="6">
                                                <Label className="text_head"> ประเภทเครื่อง / Machine Type<font color='red'><b> * </b></font></Label>
                                                <Input type="select" id="washing_machine_type_code" name="washing_machine_type_code" class="form-control">
                                                    <option value="">Select</option>
                                                    {machine_type_select}
                                                </Input>
                                                <p id="laundry_code" className="text_head_sub">Example : เครื่องซักผ้าฝาหน้า</p>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                            </CardBody>
                            <CardFooter>
                                <Link to="/machine-manage/machine-genration/">
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