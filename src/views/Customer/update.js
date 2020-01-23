import React, { Component } from 'react';
import { Button, InputGroup, Form, Input, Table, Card, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Label, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import { formatDate, parseDate, } from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import CustomerModel from '../../models/CustomerModel'
import ImgDefault from '../../assets/img/img_default.png'
import UploadModel from '../../models/UploadModel';
import GOBALS from '../../GOBALS';
import 'react-day-picker/lib/style.css';
var customer_model = new CustomerModel
var upload_model = new UploadModel();
var today = new Date();

class editView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false,
            imagePreviewUrl: '',
            file: '',
            customer_img_old: null,
            customer: [],
            row_img: [],
            fileSelected: false
        };
        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setval = this.setval.bind(this);
    }
    onChangeHandler = e => {
        let reader = new FileReader();
        let file = e.target.files[0];
        let files = e.target.files;
        var today = new Date();
        var time_now = today.getTime();
        this.setState({
            time_now: time_now,
        })
        const name = time_now + "-" + file.name;
        file = new File([file], name, { type: files.type });
        console.log('files', file);
        if (file != undefined) {
            reader.onloadend = () => {
                this.setState({
                    file: file,
                    imagePreviewUrl: reader.result,
                    selectedFile: file,

                });
            }
            reader.readAsDataURL(file);
        }
        this.componentDidMount();
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
        console.log("res_upload.data.photo_url :", res_upload.data.photo_url);

        return res_upload.data.photo_url;
    }


    async componentDidMount() {
        const code = this.props.match.params.code
        console.log(code);

        const customer_data = await customer_model.getCustomerByCode(code);
        console.log(customer_data.data);

        this.setState({
            customer_img_old: customer_data.data.customer_image
        })
        this.setval(customer_data.data)

    }


    async setval(data) {
        document.getElementById('customer_code').value = data.customer_code
        document.getElementById('customer_name').value = data.customer_name
        document.getElementById('customer_id').value = data.customer_id
        document.getElementById('customer_email').value = data.customer_email
        document.getElementById('customer_tel').value = data.customer_tel
        // document.getElementById('customer_img').value = data.customer_img

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

        if (this.state.selectedFile != null) {

            if (this.state.customer_img_old != "" && this.state.customer_img_old != null) {
                var req = await upload_model.deleteImages(this.state.customer_img_old, "customer")
                console.log("Delect :" + req);
            }

            arr['customer_image'] = await this.fileUpload(this.state.selectedFile, 'customer', this.state.customer_code + "_" + toDay);
            // console.log("this.state.selectedFile :", this.state.selectedFile);

        } else {
            arr['customer_image'] = this.state.customer_img_old

        }
        arr['about_code'] = this.props.user.about_code

        if (this.check(arr)) {
            var res = await customer_model.updateCustomerByCode(arr);
            console.log(res)
            if (res.data) {
                swal({
                    title: "สำเร็จ!",
                    text: "แก้ไขข้อมูลลูกค้าสำเร็จ",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/customer/')
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
        } else if (form.customer_tel == '') {
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
        // return true;

    }

    render() {
        let { imagePreviewUrl } = this.state;
        let imagePreview = null;

        if (imagePreviewUrl) {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={imagePreviewUrl} />);
        } else {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={ImgDefault} />);
        }

        if (this.state.customer_img_old != null && this.state.customer_img_old != undefined && !imagePreviewUrl && this.state.customer_img_old != '') {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={GOBALS.URL_IMG + "customer/" + this.state.customer_img_old} />);
        }

        return (
            <div className="animated fadeIn" style={{padding:'15px'}}>
                <Row>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                                <CardHeader>
                                    แก้ไขข้อมูลลูกค้า

                            </CardHeader>
                                <CardBody>
                                    <Row style={{ padding: 20 }}>
                                        <Col lg="8">
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    <Label className="text_head"> รหัสลูกค้า<font color='red'><b> * </b></font></Label>
                                                </Col>
                                                <Col lg="6" md="6" sm="6">
                                                    <Input type="text" id="customer_code" name="customer_code" class="form-control" readOnly ></Input>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    ชื่อ - นามสกุล : <font color='red'><b> * </b></font>
                                                </Col>
                                                <Col lg="6" md="6" sm="6">
                                                    <Input type="text" id="customer_name" name="customer_name" class="form-control" autocomplete="off"></Input>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    ไอดีลูกค้า :
                                                </Col>
                                                <Col lg="7" md="7" sm="7">
                                                    <Input type="text" id="customer_id" name="customer_id" class="form-control"  ></Input>
                                                    <p id="customer_id" className="text_head_sub">Example : Line, Facebook</p>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    อีเมล : <font color='red'><b> * </b></font>
                                                </Col>
                                                <Col lg="5" md="5" sm="5">
                                                    <Input type="text" id="customer_email" name="customer_email" class="form-control"></Input>
                                                    <p id="customer_email" className="text_head_sub">Example : AAAA@gmail.com</p>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    เบอร์โทร : <font color='red'><b> * </b></font>
                                                </Col>
                                                <Col lg="5" md="5" sm="5">
                                                    <Input type="text" id="customer_tel" name="customer_tel" class="form-control"  ></Input>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg="4">
                                            <FormGroup style={{ textAlign: "center" }}>
                                                <div class="form-group files">
                                                    <Col style={{ marginBottom: "15px" }}>
                                                        {imagePreview}
                                                    </Col>
                                                    <input type="file" class="form-control" multiple onChange={this.onChangeHandler} id="customer_image" />
                                                </div>
                                            </FormGroup>
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
        user: state.user
    }
}

export default connect(mapStatetoProps)(editView);
