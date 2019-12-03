import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Input, Label, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';

import RepairModel from '../../models/RepairModel'
const repair_model = new RepairModel

class detailView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            repair_detail: [],
            refresh: false
        };
    }


    async componentDidMount() {
        const code = this.props.match.params.code
        var repair_detail = await repair_model.getRepairByCode(code)

        this.setState({
            repair_detail: repair_detail.data
        })
    }


    render() {
        let repair_detail = this.state.repair_detail
        let repair_code = ''
        let washing_machine_code = ''
        let washing_machine_name = ''
        let laundry_name_th = ''
        let repair_status = ''
        let washing_machine_brand = ''
        let washing_machine_detail = ''
        let repair_date = ''
        let repair_details = ''

        if (repair_detail != undefined) {
            repair_code = repair_detail.repair_code
            washing_machine_code = repair_detail.washing_machine_code
            washing_machine_name = repair_detail.washing_machine_name
            laundry_name_th = repair_detail.laundry_name_th
            repair_status = repair_detail.repair_status
            washing_machine_brand = repair_detail.washing_machine_brand
            washing_machine_detail = repair_detail.washing_machine_detail
            repair_date = repair_detail.repair_date
            repair_details = repair_detail.repair_detail

        }


        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <h2> รายละเอียดแจ้งซ่อม / Detail Maintenance</h2>
                        <hr />
                        <br />
                        <Card>
                            <CardHeader>
                                <h4>ข้อมูลการซ่อมบำรุง / Maintenance infomation</h4>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col lg="3" >
                                        <Label className="text_head"> <p>รหัสการซ่อมบำรุง</p></Label> <a style={{marginLeft:15,color:'#555'}}>{repair_code}</a>
                                    </Col>

                                    <Col lg="3">
                                        <Label className="text_head"> <p>สถานะการซ่อม</p></Label><a style={{marginLeft:15,color:'#555'}}>{repair_status}</a>
                                    </Col>

                                    <Col lg="3">
                                        <Label className="text_head"> <p>เวลาแจ้งซ่อม</p></Label><a style={{marginLeft:15,color:'#555'}}>{repair_date}</a>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col lg="3">
                                        <Label className="text_head"> <p>รหัสเครื่องซักผ้า </p></Label><a style={{marginLeft:30 ,color:'#555'}}>{washing_machine_code}</a>
                                    </Col>
                                    <Col lg="3">
                                        <Label className="text_head"> <p>เลขเครื่อง </p></Label><a style={{marginLeft:45,color:'#555'}}>{washing_machine_name}</a>
                                    </Col>
                                    <Col lg="6">
                                        <Label className="text_head"> <p>เครื่องซักผ้า </p></Label><a style={{marginLeft:25,color:'#555'}}>{washing_machine_brand + ' ' + washing_machine_detail}</a>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="6">
                                        <Label className="text_head"> <p>ร้านซักผ้า</p></Label> <a style={{marginLeft:15,color:'#555'}}>{laundry_name_th}</a>
                                    </Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col lg="6">
                                        <Label className="text_head"> รายละเอียดแจ้งซ่อม </Label><p style={{color:'#555',marginTop:5}}> {repair_details}</p>
                                    </Col>
                                </Row>

                            </CardBody>
                            <CardFooter>
                                <Link to="/repair/">
                                    <Button type="buttom" size="lg">Back</Button>
                                </Link>

                            </CardFooter>
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

export default connect(mapStatetoProps)(detailView);