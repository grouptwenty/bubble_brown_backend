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
import MenuModel from '../../models/MenuModel'
import MenuTypeModel from '../../models/MenuTypeModel'

const menu_model = new MenuModel
const menu_type_model = new MenuTypeModel

class insertView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            menu_type: [],
            refresh: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderMenu = this.renderMenu.bind(this);
    }



    async componentDidMount() {
        const menu_type = await menu_type_model.getMenuTypeBy();
        this.setState({
            menu_type: menu_type.data
        })
    }



    async handleSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const data = new FormData(form);
        const date_now = new Date();
        var toDay = date_now.getFullYear() + "" + (date_now.getMonth() + 1) + "" + date_now.getDate() + "" + date_now.getTime()
        var arr = {};
        var menu_type_code = document.getElementById("menu_type_code").value
        const max_code = await menu_model.getMenuMaxCode(menu_type_code)
        menu_type_code = menu_type_code.replace('MNT',"")
        var menu_code = 'MN' + menu_type_code + max_code.data.menu_code_max

// console.log(menu_code);


        for (let name of data.keys()) {
            arr[name] = form.elements[name.toString()].value;
        }

        arr['menu_code'] = menu_code
        if (this.check(arr)) {
            var res = await menu_model.insertMenu(arr);
            //   console.log(res)
            if (res.data) {
                swal({
                    title: "สำเร็จ!",
                    text: "เพิ่มเมนูสำเร็จ",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/menu')
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
        } else if (form.menu_price == '') {
            swal({
                text: "กรุณากรอก ราคา",
                icon: "warning",
                button: "close",
            });
            return false
            // } else if (form.menu_id == '') {
            //     swal({
            //         text: "กรุณากรอก ไอดีลูกค้า",
            //         icon: "warning",
            //         button: "close",
            //     });
            //     return false
        } else {
            return true
        }

    }

    renderMenu() {

        let menutype = []
        for (let i = 0; i < this.state.menu_type.length; i++) {
            menutype.push(
                <option value={this.state.menu_type[i].menu_type_code}>{this.state.menu_type[i].menu_type_name}</option>
            )

        }
        return menutype;
    }
    render() {

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                                <CardHeader>
                                    เพิ่มเมนู
                            </CardHeader>
                                <CardBody>

                                    <Row>

                                        <Col lg="12">
                                            <br />
{/* 
                                            <Col lg="4">
                                                <Label className="text_head"> รหัสเมนู<font color='red'><b> * </b></font></Label>
                                                <Input id="menu_code" name="menu_code" class="form-control" readOnly ></Input>
                                                <p id="menu_code" className="text_head_sub">Example : CM001</p>
                                            </Col> */}

                                            <Row>
                                                <Col lg="4">
                                                    <Label className="text_head"> ประเภท <font color='red'><b> * </b></font></Label>
                                                    <Input type="select" id="menu_type_code" name="menu_type_code" class="form-control" >
                                                        <option value="">Select</option>
                                                        {this.renderMenu()}
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
                                            {/* <Row>
                                            
                                            <Col lg="6">
                                                <Label className="text_head"> เบอร์โทร </Label>
                                                <Input type="text" id="menu_phone" name="menu_phone" class="form-control" autocomplete="off" ></Input>
                                                <p id="menu_phone" className="text_head_sub"></p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="6">
                                                <Label className="text_head"> รูปภาพ </Label>
                                                <Input type="file" id="menu_img" name="menu_img" class="form-control" autocomplete="off"></Input>
                                                <p id="menu_img" className="text_head_sub"></p>
                                            </Col>
                                        </Row> */}

                                        </Col>
                                    </Row>

                                </CardBody>
                                <CardFooter>
                                    <Link to="/menu/">
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

    }
}

export default connect(mapStatetoProps)(insertView);