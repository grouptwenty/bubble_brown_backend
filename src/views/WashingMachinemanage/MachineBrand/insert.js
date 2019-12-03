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

import WashingMachineBrandModel from '../../../models/WashingMachineBrandModel'
const brand_model = new WashingMachineBrandModel

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

        const max_code = await brand_model.getWashingMachineBrandMaxCode()

        document.getElementById("washing_machine_brand_code").value = 'WMB' + max_code.data.washing_machine_brand_code_max

    
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
            var res = await brand_model.insertBrandBy(arr);
            //   console.log(res)
              if (res.data) {
                swal({
                  title: "Good job!",
                  text: "Add Brand Ok",
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
                                เพิ่มข้อมูลแบรนด์/  Insert Brand
                                
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
        
    }
}

export default connect(mapStatetoProps)(insertView);