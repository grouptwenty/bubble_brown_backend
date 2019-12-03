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

import WashingMachineProgramModel from '../../../models/WashingMachineProgramModel'
import WashingMachineGenerationModel from '../../../models/WashingMachineGenerationModel'

const program_model = new WashingMachineProgramModel
const generation_model = new WashingMachineGenerationModel


class insertView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            brand: [],
            generation: [],
            refresh: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }



    async componentDidMount() {

        const max_code = await program_model.getWashingMachineProgramMaxCode()
        var generation = await generation_model.getWashingMachineGenerationBy()
        // console.log("generation", generation);

        document.getElementById("program_code").value = 'PG' + max_code.data.program_code_max

        this.setState({
            generation: generation.data
        })

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
            var res = await program_model.insertProgramBy(arr);
            //   console.log(res)
              if (res.data) {
                swal({
                  title: "Good job!",
                  text: "Add Program Ok",
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
                text: "กรุณากรอก เวลา / Time (นาที) ",
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
                                เพิ่มข้อมูลรุ่น/  Insert Generation

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

    }
}

export default connect(mapStatetoProps)(insertView);