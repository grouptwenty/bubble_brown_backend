import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Input, Label, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';

import { formatDate, parseDate,} from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import RepairModel from '../../models/RepairModel'
const repair_model = new RepairModel

var today = new Date();
class editView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            repair_status_data:[],
            change_date: today,
            
            refresh: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.setval = this.setval.bind(this);
    }


    async componentDidMount() {
        const code = this.props.match.params.code
        const repair_data = await repair_model.getRepairByCode(code)
        const repair_status_data = await repair_model.getRepairStatusBy()

        this.setState({
            repair_status_data: repair_status_data.data
        })

        this.setval(repair_data.data)

    }


    async setval(data) { 
        var repair_date = new Date(data.repair_date)
        document.getElementById('repair_code').value = data.repair_code
        document.getElementById('washing_machine_code').value = data.washing_machine_code
        document.getElementById('washing_machine_name').value = data.washing_machine_name
        document.getElementById('laundry_name_th').value = data.laundry_name_th
        document.getElementById('name_user').value = data.name_user
        document.getElementById('repair_date').value = data.repair_date
        document.getElementById('repair_status_code').value = data.repair_status_code
        document.getElementById('repair_detail').value = data.repair_detail

        this.setState({
            change_date: repair_date
        })

    }

    handleDayChange(date){
        this.setState({
            change_date: date
        });

    }


    async handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);

        var arr = {};

        for (let name of data.keys()) {
            arr[name] = form.elements[name.toString()].value;
        }
        arr['updateby'] = this.props.user.admin_code 
        arr['repair_date'] = this.state.change_date
        // console.log("updateby",arr)

        console.log(this.check(arr))
        if (this.check(arr)) {
            var res = await repair_model.updateRepairBy(arr);
            //   console.log(res)
            if (res.data) {
                swal({
                    title: "Good job!",
                    text: "Update repair Ok",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/repair/')
            }
        }
    }

    check(form) {
        console.log("form", form);

        if (form.repair_code == '') {
            swal({
                text: "กรุณากรอก รหัสแจ้งซ่อม / Maintenance Code",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.washing_machine_code == '') {
            swal({
                text: "กรุณากรอก รหัสเครื่องซักผ้า / washing Machine",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.washing_machine_name == '') {
            swal({
                text: "กรุณากรอก เครื่องซักผ้า / washing Machine",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.name_user == '') {
            swal({
                text: "กรุณากรอก ผู้แจ้งซ่อม",
                icon: "warning",
                button: "close",
            });
            return false

        } else if (form.laundry_name_th == '') {
            swal({
                text: "กรุณากรอก ร้านซักผ้า",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.repair_date == '') {
            swal({
                text: "กรุณากรอก วันที่แจ้งซ่อมบำรุง",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.repair_status_code == '') {
            swal({
                text: "กรุณากรอก สถานะ / Status",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.repair_detail == '') {
            swal({
                text: "กรุณากรอก รายละเอียดแจ้งซ่อม",
                icon: "warning",
                button: "close",
            });
            return false
         } else {
                return true
            }

        }


        render() {
            let repair_status_data = this.state.repair_status_data
    
            let repair_status_select= []

         for (let i = 0; i < repair_status_data.length; i++) {
                repair_status_select.push(
                    <option value={repair_status_data[i].repair_status_code}>{repair_status_data[i].repair_status}</option>
                )
            }


            return (
                <div className="animated fadeIn">
                    <Row>
                        <Col>
                            <Card>
                                <Form onSubmit={this.handleSubmit} id="myForm">
                                    <CardHeader>
                                        แก้ไขข้อมูลแจ้งซ่อม /  Edit Maintenance
        
                            </CardHeader>
                                    <CardBody>

                                        <Row>
                                            <Col lg="3">
                                                <Label className="text_head"> รหัสแจ้งซ่อม / Maintenance Code<font color='red'><b> * </b></font></Label>
                                                <Input type="hidden" id="user_profile_img" name="user_profile_img" class="form-control" readOnly ></Input>
                                                <Input type="text" id="repair_code" name="repair_code" class="form-control" readOnly ></Input>
                                                <p id="repair_code" className="text_head_sub">Example : RP0001</p>
                                            </Col>
                                            <br />
                                            <Col lg="3">
                                                <Label className="text_head"> รหัสเครื่องซักผ้า / washing Machine<font color='red'><b> * </b></font></Label>
                                                <Input type="hidden" id="user_profile_img" name="user_profile_img" class="form-control" readOnly ></Input>
                                                <Input type="text" id="washing_machine_code" name="washing_machine_code" class="form-control" readOnly ></Input>
                                                <p id="washing_machine_code" className="text_head_sub">Example : WS000001</p>
                                            </Col>
                                            <Col lg="4">
                                                <Label className="text_head"> เครื่องซักผ้า / washing Machine<font color='red'><b> * </b></font></Label>
                                                <Input type="hidden" id="user_profile_img" name="user_profile_img" class="form-control" readOnly ></Input>
                                                <Input type="text" id="washing_machine_name" name="washing_machine_name" class="form-control" readOnly ></Input>
                                                <p id="washing_machine_name" className="text_head_sub">Example : เครื่องซักผ้า 1</p>
                                            </Col>

                                            <Col lg="6">
                                                <Label className="text_head"> ผู้แจ้งซ่อม <font color='red'><b> * </b></font></Label>
                                                <Input type="text" id="name_user" name="name_user" class="form-control" readOnly></Input>
                                                <p id="name_user" className="text_head_sub">Example : สมชาย</p>
                                            </Col>
                                            <Col lg="6">
                                                <Label className="text_head"> ร้านซักผ้า<font color='red'><b> * </b></font></Label>
                                                <Input type="text" id="laundry_name_th" name="laundry_name_th" class="form-control" readOnly ></Input>
                                                <p id="laundry_name_th" className="text_head_sub">Example : Super wash 24 Hours</p>
                                            </Col>

                                            <Col lg="2">
                                                <Label className="text_head"> วันที่แจ้งซ่อมบำรุง<font color='red'><b> * </b></font></Label>
                                                <DayPickerInput 
                                                format = "DD/MM/YYYY"
                                                formatDate = {formatDate}
                                                onDayChange = {this.handleDayChange.bind(this)}
                                                value = {this.state.change_date}
                                                selecteDay = {this.state.change_date}
                                                dayPickerProps = {{disabledDays: { before: new Date() }}}
                                                // inputProps = {{readOnly}}
                                                />
                                                <p id="repair_date" className="text_head_sub">Example : 10-09-2019</p>
                                            </Col>

                                            <Col lg="4">
                                                <Label className="text_head"> สถานะ/ Status<font color='red'><b> * </b></font></Label>
                                                <Input type="select" id="repair_status_code" name="repair_status_code" class="form-control">
                                                    <option value="">Select</option>
                                                  {repair_status_select}
                                                </Input>
                                                <p id="repair_status_code" className="text_head_sub">Example : แจ้งซ่อม</p>
                                            </Col>

                                            <Col lg="6">
                                                <Label className="text_head"> รายละเอียดแจ้งซ่อม <font color='red'><b> * </b></font></Label>
                                                <textarea type="text" id="repair_detail" name="repair_detail" class="form-control"  ></textarea>
                                                <p id="repair_detail" className="text_head_sub">Example : น้ำไม่ไหล</p>
                                            </Col>

                                        </Row>

                                    </CardBody>
                                    <CardFooter>
                                        <Link to="/repair/">
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