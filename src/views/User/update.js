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
import UserModel from '../../models/UserModel'
const user_model = new UserModel

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

        const user_data = await user_model.getUserByCode(code);
        console.log(user_data.data);
        
        this.setval(user_data.data)

    }

    async setval(data) {
        document.getElementById('user_code').value = data.user_code
        document.getElementById('user_position').value = data.user_position
        document.getElementById('user_firstname').value = data.user_firstname
        document.getElementById('user_lastname').value = data.user_lastname
        // document.getElementById('user_img').value = data.user_img
        document.getElementById('user_tel').value = data.user_tel
        document.getElementById('user_email').value = data.user_email
        document.getElementById('user_address').value = data.user_address
        document.getElementById('user_username').value = data.user_username
        document.getElementById('user_password').value = data.user_password
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
            var res = await user_model.updateUserByCode(arr);
            // console.log(res)
            if (res.data) {
                swal({
                    title: "สำเร็จ!",
                    text: "แก้ไขข้อมูลพนักงานสำเร็จ",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/user')
            }
        }
    }
    check(form) {

        if (form.user_position == '') {
            swal({
                text: "กรุณากรอก ตำแหน่ง",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.user_firstname == '') {
            swal({
                text: "กรุณากรอก ชื่อจริง",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.user_lastname == '') {
            swal({
                text: "กรุณากรอก นามสกุล",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.user_email == '') {
            swal({
                text: "กรุณากรอก อีเมล",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.user_tel == '') {
            swal({
                text: "กรุณากรอก เบอร์โทร",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.user_address == '') {
            swal({
                text: "กรุณากรอก ที่อยู่",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.user_username == '') {
            swal({
                text: "กรุณากรอก รหัสผู้ใช้",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.user_password == '') {
            swal({
                text: "กรุณากรอก รหัสผ่าน",
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
                                    แก้ไขข้อมูลพนักงาน

                                </CardHeader>
                                <CardBody>

                                    <Row>

                                        <Col lg="12">
                                            <br />
                                            <Row>
                                                <Col lg="4">
                                                    <Label className="text_head"> รหัสพนักงาน</Label>
                                                    <Input type="text" id="user_code" name="user_code" class="form-control" readOnly ></Input>
                                                    <p id="user_code" className="text_head_sub">Example : US001</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="4">
                                                    <Label className="text_head"> ตำแหน่ง <font color='red'><b> * </b></font></Label>
                                                    <Input type="select" id="user_position" name="user_position" class="form-control" >
                                                        <option value="">Select</option>
                                                        <option value="แอดมิน">แอดมิน</option>
                                                        <option value="แคชเชียร์">แคชเชียร์</option>
                                                        <option value="พนักงานเสิร์ฟ">พนักงานเสิร์ฟ</option>
                                                    </Input>
                                                    {/* <p id="user_position" className="text_head_sub">Example : ชื่อ นามสกุล</p> */}
                                                </Col>
                                                <Col lg="4">
                                                    <Label className="text_head"> ชื่อจริง <font color='red'><b> * </b></font></Label>
                                                    <Input type="text" id="user_firstname" name="user_firstname" class="form-control" autocomplete="off"></Input>
                                                </Col>
                                                <Col lg="4">
                                                    <Label className="text_head"> นามสกุล <font color='red'><b> * </b></font></Label>
                                                    <Input type="text" id="user_lastname" name="user_lastname" class="form-control"  ></Input>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="6">
                                                    <Label className="text_head"> อีเมล </Label>
                                                    <Input type="text" id="user_email" name="user_email" class="form-control"></Input>
                                                    <p id="user_email" className="text_head_sub">Example : AAAA@gmail.com</p>
                                                </Col>
                                                <Col lg="6">
                                                    <Label className="text_head"> เบอร์โทร </Label>
                                                    <Input type="text" id="user_tel" name="user_tel" class="form-control"  ></Input>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="12">
                                                    <Label className="text_head"> ที่อยู่ </Label>
                                                    <textarea type="text" id="user_address" name="user_address" class="form-control"  ></textarea>
                                                    <p id="user_address" className="text_head_sub">Example : 271/55 ตรอกวัดท่าตะโก</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="3">
                                                    <Label className="text_head">รหัสผู้ใช้ </Label>
                                                    <Input type="text" id="user_username" name="user_username" class="form-control"></Input>
                                                    {/* <p id="user_username" className="text_head_sub">Example : AAAA@gmail.com</p> */}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="3">
                                                    <Label className="text_head"> รหัสผ่าน </Label>
                                                    <Input type="password" id="user_password" name="user_password" class="form-control"  ></Input>
                                                </Col>
                                            </Row>
                                            {/* <Row>
                                            <Col lg="3">
                                                    <Label className="text_head"> ยืนยันรหัสผ่าน </Label>
                                                    <Input type="password" id="user_password" name="user_password" class="form-control"  ></Input>
                                            </Col>
                                            </Row> */}
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <Link to="/user/">
                                        <Button type="buttom" size="lg">ย้อนกลับ</Button>
                                    </Link>
                                    <Button type="reset" size="lg" color="danger">ยกเลิก</Button>
                                    <Button type="submit " size="lg" color="success">บันทึก</Button>
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