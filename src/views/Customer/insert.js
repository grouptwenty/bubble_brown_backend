import React, { Component } from 'react';
import { Button, InputGroup, Form, Input, Table, Card, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Label, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import CustomerModel from '../../models/CustomerModel'
import ImgDefault from '../../assets/img/img_default.png'
import UploadModel from '../../models/UploadModel';

const customer_model = new CustomerModel
var upload_model = new UploadModel();

class insertView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false,
            imagePreviewUrl: '',
            file: null,
            selectedFile: null,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this)
    }

    onChangeHandler = e => {
        let reader = new FileReader();
        let file = e.target.files[0];
        let files = e.target.files;
        var today = new Date();
        var time_now = today.getTime();
        this.setState({
            time_now: time_now
        })
        const name = time_now + "-" + file.name;
        file = new File([file], name, { type: files.type });
        console.log('files', file);
        if (file != undefined) {
            reader.onloadend = () => {
                this.setState({
                    file: file,
                    imagePreviewUrl: reader.result,
                    selectedFile: file
                });
            }
            reader.readAsDataURL(file)
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

    async componentDidMount() {

        // console.log("max_code",customer_code_max);
    }



    async handleSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const data = new FormData(form);
        const date_now = new Date();
        var toDay = date_now.getFullYear() + "" + (date_now.getMonth() + 1) + "" + date_now.getDate() + "" + date_now.getTime()
        var arr = {};

        const max_code = await customer_model.getCustomerMaxCode()
        var customer_code = 'CM' + max_code.data.customer_code_max


        for (let name of data.keys()) {
            arr[name] = form.elements[name.toString()].value;
        }

        if (this.state.selectedFile != null) {
            arr['customer_image'] = await this.fileUpload(this.state.selectedFile, 'customer', '123');
        }

        arr['customer_code'] = customer_code

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

    }


    render() {

        let { imagePreviewUrl } = this.state;
        let imagePreview = null;
        console.log("ddd", imagePreviewUrl);


        if (imagePreviewUrl) {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={imagePreviewUrl} />);
        } else {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={ImgDefault} />);
        }

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
                                    <Row style={{ padding: 20 }}>
                                        <Col lg="8">
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    ชื่อ - นามสกุล : <font color='red'><b> * </b></font>
                                                </Col>
                                                <Col lg="6" md="6" sm="6">
                                                    <Input type="text" id="customer_name" name="customer_name" class="form-control"></Input>                                                </Col>
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

    }
}

export default connect(mapStatetoProps)(insertView);