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
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <Form id="myForm">
                                <CardHeader>
                                    ข้อมูลพนักงาน
                                </CardHeader>
                                <CardBody>

                                    <Row>
                                        <Col lg="12">
                                            <br />
                                            <Row>
                                                <Col lg="4">
                                                    <Label className="text_head"> รหัสพนักงาน</Label>
                                                    <label>{this.state.user_code}</label>
                                                </Col>
                                            </Row>
                                            <Col>
                                                <FormGroup style={{ textAlign: "center" }}>
                                                    <div class="form-group files">
                                                        <Col style={{ marginBottom: "15px" }}>
                                                            {imagePreview}
                                                        </Col>
                                                    </div>
                                                </FormGroup>
                                            </Col>
                                            <Row>
                                                <Col lg="4">
                                                    <Label className="text_head"> ตำแหน่ง <font color='red'><b> * </b></font></Label>
                                                    <label>{this.state.user.user_position}</label>
                                                </Col>
                                                <Col lg="4">
                                                    <Label className="text_head"> ชื่อจริง <font color='red'><b> * </b></font></Label>
                                                    <label>{this.state.user.user_firstname}</label>                                                </Col>
                                                <Col lg="4">
                                                    <Label className="text_head"> นามสกุล <font color='red'><b> * </b></font></Label>
                                                    <label>{this.state.user.user_lastname}</label>                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="6">
                                                    <Label className="text_head"> อีเมล </Label>
                                                    <label>{this.state.user.user_email}</label>
                                                </Col>
                                                <Col lg="6">
                                                    <Label className="text_head"> เบอร์โทร </Label>
                                                    <label>{this.state.user.user_tel}</label>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="12">
                                                    <Label className="text_head"> ที่อยู่ </Label>
                                                    <label>{this.state.user.user_address}</label>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="3">
                                                    <Label className="text_head">รหัสผู้ใช้ </Label>
                                                    <label>{this.state.user.user_username}</label>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="3">
                                                    <Label className="text_head"> รหัสผ่าน </Label>
                                                    <Input type="password">{this.state.user.user_password}</Input>                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <NavLink exact to={'../../user/edit/' + this.state.user_code}>
                                        <button class="btn btn-warning">แก้ไข</button>
                                    </NavLink>
                                    <Button variant="secondary" onClick={this.goBack}>ย้อนกลับ</Button>
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