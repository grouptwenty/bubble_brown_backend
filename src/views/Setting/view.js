import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, Label, FormGroup, Form, Input, CardFooter, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';
import GOBALS from '../../GOBALS'

import ImgDefault from '../../assets/img/img_default.png'
import UploadModel from '../../models/UploadModel';
import SettingModel from '../../models/SettingModel'
const setting_model = new SettingModel
const upload_model = new UploadModel()

class SettingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            imagePreviewUrl: '',
            file: '',
            user_img_old: "",
            refresh: false
        };
        this.setval = this.setval.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this)
    }



    async componentDidMount() {
        const setting_data = await setting_model.getSettingByCode(1)
        console.log("setting_data", setting_data);
        this.setval(setting_data.data)

    }

    onChangeHandler = event => {
        let render = new FileReader();
        let file = event.target.files[0];
        console.log("file", file);
        console.log("render", render);

        if (file != undefined) {
            render.onloadend = () => {
                this.setState({
                    selectedFile: file,
                    loaded: 0,
                    imagePreviewUrl: render.result,
                });
            }
            render.readAsDataURL(file)
        }

    }

    async fileUpload(file, page, _code) {
        // const url = GOBALS.URL_UPLOAD_OTHER;
        const formData = new FormData();
        var res = file.name.split(".");
        formData.append('_code', _code);
        formData.append('file_type', '.' + res[res.length - 1]);
        formData.append('upload_url', page);
        formData.append('files', file);

        var res_upload = await upload_model.uploadImages(formData);
        // console.log(res_upload);
        // var data_update = {
        //   journal_file_path: res_upload.data[0].comment_photo_url
        // }
        // var data_where = {
        //   journal_code: _code
        // }
        // var res_update = journal_model.updateCoverPage(data_update, data_where);
        return res_upload.data.photo_url;
    }

    async setval(data) { //setdata edit

        document.getElementById('setting_id').value = data.setting_id
        document.getElementById('setting_name').value = data.setting_name
        document.getElementById('setting_phone').value = data.setting_phone
        document.getElementById('setting_open').value = data.setting_open
        document.getElementById('setting_email').value = data.setting_email
        document.getElementById('setting_fax').value = data.setting_fax
        document.getElementById('setting_page_id').value = data.setting_page_id
        document.getElementById('setting_facebook').value = data.setting_facebook
        document.getElementById('setting_google_plus').value = data.setting_google_plus
        document.getElementById('setting_youtube').value = data.setting_youtube
        document.getElementById('setting_url').value = data.setting_url

        if (data.setting_logo != null) {

            this.setState({
                setting_logo_old: data.setting_logo
            })

        }
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
        // console.log("updateby",arr)

        if (this.state.selectedFile != null) {
            arr['setting_logo'] = await this.fileUpload(this.state.selectedFile, 'setting', form.elements['setting_id'].value);
        }else {
            arr['setting_logo'] = this.state.setting_logo_old

        }


        var res = await setting_model.updateSettingBy(arr);
        //   console.log(res)
        if (res.data) {
            swal({
                title: "Good job!",
                text: "Update setting Ok",
                icon: "success",
                button: "Close",
            });
            this.props.history.push('/setting/')

        }
    }


    render() {

        let { imagePreviewUrl } = this.state;
        let imagePreview = null;

        if (imagePreviewUrl) {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={imagePreviewUrl} />);
        } else {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={ImgDefault} />);
        }

        if (this.state.setting_logo_old != null && this.state.setting_logo_old != undefined && !imagePreviewUrl && this.state.setting_logo_old != '') {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={GOBALS.URL_IMG + "setting/" + this.state.setting_logo_old} />);
        }

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                                <CardHeader>
                                    ตั้งค่า /  Setting

                            </CardHeader>
                                <CardBody>
                                    <br />
                                    <p style={{ fontSize: 24, color: '#0c7eaf', fontWeight: 'bold' }}>  ตั้งค่าเว็ปไซต์</p>
                                    <Row>
                                        <Col lg="8">
                                            <Row>
                                                <Col lg="8">
                                                    <Label className="text_head"> WEBSITE URL</Label>
                                                    <Input type="text" id="setting_url" name="setting_url" class="form-control" ></Input>
                                                </Col>
                                            </Row>
                                            <br />
                                            <Row>
                                                <Col lg="4">
                                                    <Label className="text_head"> FACEBOOK PAGE ID</Label>
                                                    <Input type="text" id="setting_page_id" name="setting_page_id" class="form-control" ></Input>
                                                </Col>
                                                <Col lg="8">
                                                    <Label className="text_head"> FACEBOOK URL</Label>
                                                    <Input type="text" id="setting_facebook" name="setting_facebook" class="form-control" ></Input>
                                                </Col>
                                            </Row>
                                            <br />
                                            <Row>
                                                <Col lg="6">
                                                    <Label className="text_head"> Youtube</Label>
                                                    <Input type="text" id="setting_youtube" name="setting_youtube" class="form-control" ></Input>
                                                </Col>
                                                <Col lg="6">
                                                    <Label className="text_head"> Google Plus</Label>
                                                    <Input type="text" id="setting_google_plus" name="setting_google_plus" class="form-control" ></Input>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg="4">
                                            {/* <img src="/coinlaundry.jpg" className="imgCircelinsert_cus" /> */}
                                            <FormGroup style={{ textAlign: "center" }}>
                                                <div class="form-group files">
                                                    <Col style={{ marginBottom: "15px", }}>
                                                        {imagePreview}
                                                    </Col>
                                                    <input type="file" class="form-control" multiple onChange={this.onChangeHandler} />
                                                </div>
                                            </FormGroup>
                                            <Input type="hidden" id="setting_id" name="setting_id" class="form-control" readOnly ></Input>
                                        </Col>
                                    </Row>
                                    <hr />
                                    <br />
                                    <p style={{ fontSize: 24, color: '#0c7eaf', fontWeight: 'bold' }}>  ตั้งค่าข้อมูล</p>
                                    <Row>
                                        <Col lg="6">
                                            <Label className="text_head"> BUSINESS NAME</Label>
                                            <Input type="text" id="setting_name" name="setting_name" class="form-control" ></Input>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col lg="5">
                                            <Label className="text_head"> PHONE</Label>
                                            <Input type="text" id="setting_phone" name="setting_phone" class="form-control" ></Input>
                                        </Col>
                                        <Col lg="5">
                                            <Label className="text_head"> FAX</Label>
                                            <Input type="text" id="setting_fax" name="setting_fax" class="form-control" ></Input>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col lg="5">
                                            <Label className="text_head"> OPEN</Label>
                                            <Input type="text" id="setting_open" name="setting_open" class="form-control" ></Input>
                                        </Col>
                                        <Col lg="5">
                                            <Label className="text_head"> EMAIL</Label>
                                            <Input type="text" id="setting_email" name="setting_email" class="form-control" ></Input>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <Link to="/news/">
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

export default connect(mapStatetoProps)(SettingView);