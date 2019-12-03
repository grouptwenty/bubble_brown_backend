import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, Label, FormGroup, Form, Input, CardFooter, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';
import GOBALS from '../../GOBALS'

import ImgDefault from '../../assets/img/img_default.png'
import UploadModel from '../../models/UploadModel';
import AboutModel from '../../models/AboutModel'
const about_model = new AboutModel
const upload_model = new UploadModel()

class AboutView extends Component {
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
        const code = this.props.match.params.code
        const about_data = await about_model.getAboutByCode(1)
        console.log("about_data", about_data);
        this.setval(about_data.data)

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
        formData.append('images', file);

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

        document.getElementById('detail_id').value = data.detail_id
        document.getElementById('detail_header_th').value = data.detail_header_th
        document.getElementById('detail_header_en').value = data.detail_header_en
        document.getElementById('detail_footer_th').value = data.detail_footer_th
        document.getElementById('detail_footer_en').value = data.detail_footer_en
        document.getElementById('detail_th').value = data.detail_th
        document.getElementById('detail_en').value = data.detail_en

        if (data.detail_img != null) {

            this.setState({
                about_img_old: data.detail_img
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
            arr['detail_img'] = await this.fileUpload(this.state.selectedFile, 'about', form.elements['detail_id'].value);
        }else {
            arr['detail_img'] = this.state.detail_img_old

        }

        var res = await about_model.updateAboutBy(arr);
        //   console.log(res)
        if (res.data) {
            swal({
                title: "Good job!",
                text: "Update about Ok",
                icon: "success",
                button: "Close",
            });
            this.props.history.push('/about/')

        }
    }





    render() {

        let { imagePreviewUrl } = this.state;
        let imagePreview = null;
        console.log("ddd", this.state.user_img_old);

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
                                    เกี่ยวกับเรา /  About

                            </CardHeader>
                                <CardBody>
                                    <br />
                                    <Row>
                                        <Col lg="6">
                                            <Label className="text_head"> Detail header (TH)</Label>
                                            <textarea type="text" id="detail_header_th" name="detail_header_th" class="form-control" style={{ height: 50 }} ></textarea>
                                        </Col>
                                        <Col lg="6">
                                            <Label className="text_head"> Detail header (EN)</Label>
                                            <textarea type="text" id="detail_header_en" name="detail_header_en" class="form-control" style={{ height: 50 }} ></textarea>
                                        </Col>
                                    </Row>
                                    <br />
                                    <br />
                                    <Row>
                                        <Col lg="6">
                                            <Label className="text_head"> Detail footer (TH)</Label>
                                            <textarea type="text" id="detail_footer_th" name="detail_footer_th" class="form-control" style={{ height: 200 }} ></textarea>
                                        </Col>
                                        <Col lg="6">
                                            <Label className="text_head">  Detail footer (EN)</Label>
                                            <textarea type="text" id="detail_footer_en" name="detail_footer_en" class="form-control" style={{ height: 200 }} ></textarea>
                                        </Col>
                                    </Row>
                                    <br />
                                    <br />
                                    <Row>
                                        <Col lg="6">
                                            <Label className="text_head"> รายละเอียด (TH)</Label>
                                            <textarea type="text" id="detail_th" name="detail_th" class="form-control" style={{ height: 200 }} ></textarea>
                                        </Col>
                                        <Col lg="6">
                                            <Label className="text_head"> รายละเอียด (EN)</Label>
                                            <textarea type="text" id="detail_en" name="detail_en" class="form-control" style={{ height: 200 }} ></textarea>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col lg="6" >
                                            {/* <img src="/coinlaundry.jpg" className="imgCircelinsert_cus" /> */}
                                            <FormGroup style={{ textAlign: "center" }}>
                                                <div class="form-group files">
                                                    <Col style={{ marginBottom: "15px", marginTop: "15px", }}>
                                                        {imagePreview}
                                                    </Col>
                                                    <input type="file" class="form-control" multiple onChange={this.onChangeHandler} />
                                                </div>
                                            </FormGroup>                                        </Col>
                                        <Input type="hidden" id="detail_id" name="detail_id" class="form-control" readOnly ></Input>
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

export default connect(mapStatetoProps)(AboutView);