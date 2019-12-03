import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Input, Label, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';

import { formatDate, parseDate, } from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import WashingMachineProgramModel from '../../../models/WashingMachineProgramModel'
import WashingMachineGenerationModel from '../../../models/WashingMachineGenerationModel'

const program_model = new WashingMachineProgramModel
const generation_model = new WashingMachineGenerationModel
class editView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            generation: [],
            refresh: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setval = this.setval.bind(this);
    }


    async componentDidMount() {
        const code = this.props.match.params.code
        const programe_data = await program_model.getProgramByCode(code)
        var generation = await generation_model.getWashingMachineGenerationBy()
        // console.log(programe_data);


        
        this.setState({
            generation: generation.data
        })

        this.setval(programe_data.data)
    }


    async setval(data) {

        document.getElementById('program_code').value = data.program_code
        document.getElementById('program_name').value = data.program_name
        document.getElementById('program_price').value = data.program_price
        document.getElementById('program_time').value = data.program_time
        document.getElementById('description').value = data.description
        document.getElementById('washing_machine_generation_code').value = data.washing_machine_generation_code

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
            var res = await program_model.updateProgramBy(arr);
              console.log(res)
            if (res.data) {
                swal({
                    title: "Good job!",
                    text: "Update Program Ok",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/machine-manage/machine-program/')
            }
        }
    }

    check(form) {

        if (form.program_code == '') {
            swal({
                text: "กรุณากรอก รหัสโปรแกรม / Program Code",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.program_name == '') {
            swal({
                text: "กรุณากรอก โปรแกรม / Program ",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.program_price == '') {
            swal({
                text: "กรุณากรอก ราคา / Price",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.program_time == '') {
            swal({
                text: "กรุณากรอก เวลา / Time (นาที)",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.washing_machine_generation_code == '') {
            swal({
                text: "กรุณากรอก รุ่น / Generation",
                icon: "warning",
                button: "close",
            });
            return false
        } else {
            return true
        }

    }
    render() {
        let generation = this.state.generation
        // console.log("machine_type",machine_type);

        let generation_select = []
        for (let i = 0; i < generation.length; i++) {
            generation_select.push(
                <option value={generation[i].washing_machine_generation_code}>{generation[i].washing_machine_generation_name}</option>
            )
        }

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                            <CardHeader>
                                แก้ไขข้อมูลโปรแกรม /  Edit Program

                            </CardHeader>
                            <CardBody>

                                <Row>
                                <Col lg="12">
                                        <br />
                                        <Row>
                                            <Col lg="4">
                                                <Label className="text_head"> รหัสโปรแกรม / Program Code<font color='red'><b> * </b></font></Label>
                                                <Input type="text" id="program_code" name="program_code" class="form-control" readOnly ></Input>
                                                <p id="program_code" className="text_head_sub">Example : PG01</p>
                                            </Col>
                                            <Col lg="6">
                                                <Label className="text_head"> โปรแกรม / Program <font color='red'><b> * </b></font></Label>
                                                <Input type="text" id="program_name" name="program_name" class="form-control" autocomplete="off"></Input>
                                                <p id="program_name" className="text_head_sub">Example : Quick 30</p>
                                            </Col>
                                        </Row>
                                        <br />
                                        <Row>
                                            <Col lg="4">
                                                <Label className="text_head"> ราคา / Price <font color='red'><b> * </b></font></Label>
                                                <Input type="text" id="program_price" name="program_price" class="form-control" autocomplete="off"></Input>
                                                <p id="program_price" className="text_head_sub">Example : 50 บาท.</p>
                                            </Col>
                                            <Col lg="4">
                                                <Label className="text_head"> เวลา / Time (นาที) </Label>
                                                <Input type="text" id="program_time" name="program_time" class="form-control" autocomplete="off"></Input>
                                                <p id="program_time" className="text_head_sub">Example :  30 </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="4">
                                                <Label className="text_head"> รุ่น / Generation<font color='red'><b> * </b></font></Label>
                                                <Input type="select" id="washing_machine_generation_code" name="washing_machine_generation_code" class="form-control">
                                                    <option value="">Select</option>
                                                    {generation_select}
                                                </Input>
                                                <p id="washing_machine_generation_code" className="text_head_sub">Example : FC1409S4W</p>
                                            </Col>
                                            <Col lg="4">
                                                <Label className="text_head"> รายละเอียด </Label>
                                                <Input type="text" id="description" name="description" class="form-control" autocomplete="off"></Input>
                                                <p id="description" className="text_head_sub">Example : ซักด่วน 30 นาที</p>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                            </CardBody>
                            <CardFooter>
                                <Link to="/machine-manage/machine-program/">
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