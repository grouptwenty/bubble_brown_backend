import React, { Component } from 'react';
import { Button, InputGroup, Form, Input, Table, Card, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Label, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import UserModel from '../../models/UserModel'
import ImgDefault from '../../assets/img/img_default.png'
import UploadModel from '../../models/UploadModel';
import GOBALS from '../../GOBALS';
import 'react-day-picker/lib/style.css';

var user_model = new UserModel
var upload_model = new UploadModel();
var today = new Date();

class editView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            user: [],
            refresh: false,
            imagePreviewUrl: '',
            file: '',
            user_img_old: null,
            user: [],
            row_img: [],
            fileSelected: false
        };
        this.goBack = this.goBack.bind(this);
    }

    goBack() {
        this.props.history.goBack();
    }

    async componentDidMount() {
        const code = this.props.match.params.code
        console.log(code);
        const user = await user_model.getUserByCode(code);
        console.log("ข้อมูลลลลลล :", user);
        this.setState({
            user_code: code,
            user: user.data,
            user_name: user.data.user_firstname + " " + user.data.user_lastname,
            firstname: user.data.user_firstname,
            user_img_old: user.data.user_image
        })
        console.log("user data: ", this.state.firstname);


    }

    render() {
        let { imagePreviewUrl } = this.state;
        let imagePreview = null;

        if (imagePreviewUrl) {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={imagePreviewUrl} />);
        } else {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={ImgDefault} />);
        }

        if (this.state.user_img_old != null && this.state.user_img_old != undefined && !imagePreviewUrl && this.state.user_img_old != '') {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={GOBALS.URL_IMG + "user/" + this.state.user_img_old} />);
        }

        return (
            <div className="animated fadeIn" style={{padding:'15px'}}>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                ข้อมูลพนักงาน
                                </CardHeader>
                            <CardBody>
                                <Row style={{ padding: 20 }}>
                                    <Col lg="8">
                                        <Row className="center" style={{ marginBottom: 10 }}>
                                            <Col lg="2" md="2" sm="2" className="right" >
                                                <Label className="text_head"> รหัสพนักงาน</Label>
                                            </Col>
                                            <Col lg="4" md="4" sm="4">
                                                <label>{this.state.user_code}</label>
                                            </Col>
                                            <Col lg="6" md="6" sm="6">
                                            </Col>
                                        </Row>
                                        <Row className="center" style={{ marginBottom: 10 }}>
                                            <Col lg="2" md="2" sm="2" className="right" >
                                                ตำแหน่ง :
                                                    </Col>
                                            <Col lg="4" md="4" sm="4">
                                                <label>{this.state.user.user_position}</label>
                                            </Col>
                                            <Col lg="6" md="6" sm="6">
                                            </Col>
                                        </Row>
                                        <Row className="center" style={{ marginBottom: 10 }}>
                                            <Col lg="2" md="2" sm="2" className="right" >
                                                สาขา :
                                                    </Col>
                                            <Col lg="4" md="4" sm="4">
                                                <label>{this.state.user.about_name_th}</label>
                                            </Col>
                                            <Col lg="6" md="6" sm="6">
                                            </Col>
                                        </Row>
                                        <Row className="center" style={{ marginBottom: 10 }}>
                                            <Col lg="2" md="2" sm="2" className="right" >
                                                ชื่อ - นามสกุล :
                                                    </Col>
                                            <Col lg="4" md="4" sm="4">
                                                <label>{this.state.user_name}</label>
                                            </Col>
                                            <Col lg="6" md="6" sm="6">
                                            </Col>
                                        </Row>
                                        <Row className="center" style={{ marginBottom: 10 }}>
                                            <Col lg="2" md="2" sm="2" className="right" >
                                                อีเมล :
                                                    </Col>
                                            <Col lg="4" md="4" sm="4">
                                                <label>{this.state.user.user_email}</label>
                                            </Col>
                                            <Col lg="6" md="6" sm="6">
                                            </Col>
                                        </Row>
                                        <Row className="center" style={{ marginBottom: 10 }}>
                                            <Col lg="2" md="2" sm="2" className="right" >
                                                เบอร์โทร :
                                                    </Col>
                                            <Col lg="4" md="4" sm="4">
                                                <label>{this.state.user.user_tel}</label>
                                            </Col>
                                            <Col lg="6" md="6" sm="6">
                                            </Col>
                                        </Row>
                                        <Row className="center" style={{ marginBottom: 10 }}>
                                            <Col lg="2" md="2" sm="2" className="right" >
                                                ที่อยู่ :
                                                    </Col>
                                            <Col lg="4" md="4" sm="4">
                                                <label>{this.state.user.user_address}</label>
                                            </Col>
                                            <Col lg="6" md="6" sm="6">
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col lg="4">
                                        <FormGroup style={{ textAlign: "center" }}>
                                            <div class="form-group files">
                                                <Col style={{ marginBottom: "15px" }}>
                                                    {imagePreview}
                                                </Col>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter>
                                <NavLink exact to={'../../user/update/' + this.state.user_code}>
                                    <button class="btn btn-warning btn-lg">แก้ไข</button>
                                </NavLink>
                                <Button variant="secondary" size="lg" onClick={this.goBack}>ย้อนกลับ</Button>
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

export default connect(mapStatetoProps)(editView);