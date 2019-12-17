import React, { Component } from 'react';
import { Button, 
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
    Form ,
    FormGroup
} from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import CustomerModel from '../../models/CustomerModel'
const customer_model = new CustomerModel

class insertView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false ,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

  

    async componentDidMount() {
        const max_code = await customer_model.getCustomerMaxCode()
    document.getElementById("customer_code").value = 'CM' + max_code.data.customer_code_max
    // console.log("max_code",customer_code_max);
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
            var res = await customer_model.insertCustomer(arr);
            //   console.log(res)
              if (res.data) {
                swal({
                  title: "สำเร็จ!",
                  text: "เพิ่มข้อมูลลูกค้าสำเร็จ",
                  icon: "success",
                  button: "Close",
                });
                this.props.history.push('/customer')
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

    }


    render() {

       
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                            <CardHeader>
                                เพิ่มข้อมูลลูกค้า
                                
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
                                        {/* <Row>
                                            <Col lg="6">
                                                <Label className="text_head"> รูปภาพ </Label>
                                                <Input type="file" id="customer_img" name="customer_img" class="form-control" autocomplete="off"></Input>
                                                <p id="customer_img" className="text_head_sub"></p>
                                            </Col>
                                        </Row> */}
                            
                                    </Col>
                                </Row>

                            </CardBody>
                            <CardFooter>
                                <Link to="/customer/">
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