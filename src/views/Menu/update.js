import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Input, Label, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import { formatDate, parseDate, } from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MenuModel from '../../models/MenuModel'
const menu_model = new MenuModel


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

        const menu_data = await menu_model.getMenuByCode(code);
        console.log(menu_data.data);

        this.setval(menu_data.data)

    }


    async setval(data) {
        document.getElementById('menu_code').value = data.menu_code
        // document.getElementById('menu_id').value = data.menu_id
        document.getElementById('menu_type_code').value = data.menu_type_code
        document.getElementById('menu_name').value = data.menu_name
        // document.getElementById('menu_image').value = data.menu_image
        document.getElementById('menu_price').value = data.menu_price
        // document.getElementById('menu_img').value = data.menu_img

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
            var res = await menu_model.updateMenuByCode(arr);
            console.log(res)
            if (res.data) {
                swal({
                    title: "สำเร็จ!",
                    text: "แก้ไขเมนูสำเร็จ",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/menu/')
            }
        }
    }


    check(form) {
 
        if (form.menu_type_code == '') {
            swal({
                text: "กรุณาเลือก ประเภท",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.menu_name == '') {
            swal({
                text: "กรุณากรอก ชื่อเมนู",
                icon: "warning",
                button: "close",
            });
            return false
        // } else if (form.menu_image == '') {
        //     swal({
        //         text: "กรุณาใส่ รูปภาพ",
        //         icon: "warning",
        //         button: "close",
        //     });
        //     return false
        } else if (form.menu_price == '') {
            swal({
                text: "กรุณากรอก ราคา",
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
                                    แก้ไขเมนู
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col lg="12">
                                            <br />
                                            <Row>
                                                <Col lg="4">
                                                    <Label className="text_head"> รหัสเมนู<font color='red'><b> * </b></font></Label>
                                                    <Input type="text" id="menu_code" name="menu_code" class="form-control" readOnly ></Input>
                                                    <p id="menu_code" className="text_head_sub">Example : MN01001</p>
                                                </Col>
                                                <br />

                                            </Row>
                                            <br />
                                            <Row>
                                            <Col lg="4">
                                                <Label className="text_head"> ประเภท <font color='red'><b> * </b></font></Label>
                                                <Input type="select" id="menu_type_code" name="menu_type_code" class="form-control" >
                                                        <option value="">Select</option>
                                                        <option value="MNT01">เครื่องดื่ม</option>
                                                        <option value="MNT02">อาหาร</option>
                                                        <option value="MNT03">เบเกอร์รี่</option>
                                                        <option value="MNT04">อาหารทานเล่น</option>
                                                </Input>
                                                {/* <p id="menu_id" className="text_head_sub">Example : Line, Facebook</p> */}
                                            </Col>
                                            <Col lg="4">
                                                <Label className="text_head"> ชื่อเมนู <font color='red'><b> * </b></font></Label>
                                                <Input type="text" id="menu_name" name="menu_name" class="form-control" ></Input>
                                                {/* <p id="menu_name" className="text_head_sub">Example : ลาเต้</p> */}
                                            </Col>
                                            <Col lg="4">
                                                <Label className="text_head"> ราคา </Label>
                                                <Input type="text" id="menu_price" name="menu_price" class="form-control"></Input>
                                                {/* <p id="menu_price" className="text_head_sub">Example : AAAA@gmail.com</p> */}
                                            </Col>
                                        </Row>
                                        </Col>

                                    </Row>

                                </CardBody>
                                <CardFooter>
                                    <Link to="/menu/">
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
