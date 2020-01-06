import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, FormGroup, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Input, Label, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import GOBALS from '../../GOBALS'

import ImgDefault from '../../assets/img/img_default.png'
import UploadModel from '../../models/UploadModel';

import AddressModel from '../../models/AddressModel'
import AboutModel from '../../models/AboutModel'

const address_model = new AddressModel
const about_model = new AboutModel
const upload_model = new UploadModel()
var md5 = require("md5");

class editView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            province: [],
            imagePreviewUrl: '',
            file: '',
            refresh: false,
            about_img_old: null,
            about_password_old: "",
            about: []
        };
        this.goBack = this.goBack.bind(this);
    }
    goBack() {
        this.props.history.goBack();
    }


    async componentDidMount() {
        const code = this.props.match.params.code
        const about_data = await about_model.getAboutByCol(code)
        console.log("about_data :", about_data);

        this.setState({
            about_code: this.props.match.params.code,
            about: about_data.data,
            about_img_old: about_data.data.about_img,
            // about_img_old: about_data.data[0].about_img,
        })
    }

    render() {
        let { imagePreviewUrl } = this.state;
        let imagePreview = null;

        if (imagePreviewUrl) {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={imagePreviewUrl} />);
        } else {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={ImgDefault} />);
        }

        if (this.state.about_img_old != null && this.state.about_img_old != undefined && !imagePreviewUrl && this.state.about_img_old != '') {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={GOBALS.URL_IMG + "about/" + this.state.about_img_old} />);
        }

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                                <CardHeader>
                                    แก้ไขข้อมูลร้านค้า / สาขา
                                <NavLink exact to={`/sale/sale-order/insert`} style={{ width: '100%' }}>
                                    </NavLink>
                                </CardHeader>
                                <CardBody>

                                    <Row>
                                        <Col lg="4" >
                                            <FormGroup style={{ textAlign: "center" }}>
                                                <div class="form-group files">
                                                    <Col style={{ marginBottom: "15px" }}>
                                                        {imagePreview}
                                                    </Col>
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col lg="8">
                                            <br />

                                            <Col lg="6">
                                                <Label className="text_head"> รหัสร้านค้า / สาขา</Label>
                                                <br />
                                                <label>{this.state.about_code}</label>
                                            </Col>
                                            <br />

                                            <Row>
                                                <Col lg="6">
                                                    <Label className="text_head"> ชื่อ (ไทย)/ Name (Th)</Label>
                                                    <br />
                                                    <label>{this.state.about.about_name_th}</label>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col lg="3">
                                            <Label className="text_head"> หมายเลขโทรศัพท์ </Label>
                                            <br />
                                            <label>{this.state.about.about_tel}</label>
                                        </Col>
                                        <Col lg="3">
                                            <Label className="text_head"> อีเมล / E-mail</Label>
                                            <br />
                                            <label>{this.state.about.about_email}</label>
                                        </Col>
                                    </Row>
                                    <br />
                                    <hr />
                                    <br />
                                    <Row>
                                        <Col lg="6">
                                            <Label className="text_head"> ที่อยู่ / Address<font color='red'><b> * </b></font></Label>
                                            <br />
                                            <label>{this.state.about.about_address}</label>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg="3">
                                            <Label className="text_head"> จังหวัด / Province<font color='red'><b> * </b></font></Label>
                                            <br />
                                            <label>{this.state.about.province_name}</label>
                                        </Col>
                                        <Col lg="3">
                                            <Label className="text_head"> อำเภอ / Amphur<font color='red'><b> * </b></font></Label>
                                            <br />
                                            <label>{this.state.about.amphur_name}</label>
                                        </Col>
                                        <Col lg="3">
                                            <Label className="text_head"> ตำบล / District<font color='red'><b> * </b></font></Label>
                                            <br />
                                            <label>{this.state.about.district_name}</label>
                                        </Col>
                                        <Col lg="3">
                                            <Label className="text_head"> รหัสไปรษณีย์ / Zipcode<font color='red'><b> * </b></font></Label>
                                            <br />
                                            <label>{this.state.about.user_zipcode}</label>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg="3">
                                            <Label className="text_head"> ละติจูด<font color='red'><b> * </b></font></Label>
                                            <br />
                                            <label>{this.state.about.latitude}</label>
                                        </Col>
                                        <Col lg="3">
                                            <Label className="text_head"> ลองจิจูด<font color='red'><b> * </b></font></Label>
                                            <br />
                                            <label>{this.state.about.longitude}</label>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <NavLink exact to={'../../about/update/' + this.state.about_code}>
                                        <button class="btn btn-warning btn-lg">แก้ไข</button>
                                    </NavLink>
                                    <Button variant="secondary" size="lg" onClick={this.goBack}>ย้อนกลับ</Button>
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