import React, { Component } from 'react';
import { Button, CustomInput, Form, Input, Table, Card, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Label, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import UserModel from '../../models/UserModel'
import AboutModel from '../../models/AboutModel'
import ImgDefault from '../../assets/img/img_default.png'
import UploadModel from '../../models/UploadModel';
var md5 = require("md5");

const user_model = new UserModel
const about_model = new AboutModel
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
        const branch = await about_model.getAboutBy();
        this.setState({
            branch: branch.data
        })
        // console.log("max_code",user_code_max);
    }

    renderBranch() {
        if (this.state.branch != undefined) {
            let branch_type = []

            for (let i = 0; i < this.state.branch.length; i++) {
                branch_type.push(
                    <option value={this.state.branch[i].about_code}>{this.state.branch[i].about_name_th}</option>
                )

            }
            return branch_type;
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const data = new FormData(form);
        const date_now = new Date();
        var toDay = date_now.getFullYear() + "" + (date_now.getMonth() + 1) + "" + date_now.getDate() + "" + date_now.getTime()
        var arr = {};

        const max_code = await user_model.getUserMaxCode()
        var user_code = 'US' + max_code.data.user_code_max

        for (let name of data.keys()) {
            arr[name] = form.elements[name.toString()].value;
        }
        // console.log("ssfsdfs");

        if (this.state.selectedFile != null) {
            arr['user_image'] = await this.fileUpload(this.state.selectedFile, 'user', '123');
        }

        arr['user_code'] = user_code
        arr['user_password'] = md5(arr['user_password'])
        arr['addby'] = this.props.user.user_code

        if (this.check(arr)) {

            var res = await user_model.insertUserBy(arr);

            console.log(res);
            if (res.data) {
                swal({
                    title: "สำเร็จ!",
                    text: "เพิ่มข้อมูลพนักงานสำเร็จ",
                    icon: "success",
                    button: "ปิด",
                });
                this.props.history.push('/user')
            }
        }
    }


    check(form) {

        if (form.user_position == '') {
            swal({
                text: "กรุณากรอก ตำแหน่ง",
                icon: "warning",
                button: "ปิด",
            });
            return false
        } else if (form.about_code == '') {
            swal({
                text: "กรุณาเลือก สาขา",
                icon: "warning",
                button: "ปิด",
            });
            return false
        } else if (form.user_firstname == '') {
            swal({
                text: "กรุณากรอก ชื่อจริง",
                icon: "warning",
                button: "ปิด",
            });
            return false
        } else if (form.user_lastname == '') {
            swal({
                text: "กรุณากรอก นามสกุล",
                icon: "warning",
                button: "ปิด",
            });
            return false
            // } else if (form.user_email == '') {
            //     swal({
            //         text: "กรุณากรอก อีเมล",
            //         icon: "warning",
            //         button: "close",
            //     });
            //     return false
        } else if (form.user_tel == '') {
            swal({
                text: "กรุณากรอก เบอร์โทร",
                icon: "warning",
                button: "ปิด",
            });
            return false
            // } else if (form.user_address == '') {
            //     swal({
            //         text: "กรุณากรอก ที่อยู่",
            //         icon: "warning",
            //         button: "close",
            //     });
            //     return false
        } else if (form.user_username == '') {
            swal({
                text: "กรุณากรอก รหัสผู้ใช้",
                icon: "warning",
                button: "ปิด",
            });
            return false
        } else if (form.user_password == '') {
            swal({
                text: "กรุณากรอก รหัสผ่าน",
                icon: "warning",
                button: "ปิด",
            });
            return false
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
            <div className="animated fadeIn" style={{padding:'15px'}}>
                <Row>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                                <CardHeader>
                                    เพิ่มข้อมูลพนักงาน
                                </CardHeader>
                                <CardBody>
                                    <Row style={{ padding: 20 }}>
                                        <Col lg="8">
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    ตำแหน่ง : <font color='red'><b> * </b></font>
                                                </Col>
                                                <Col lg="5" md="5" sm="5">
                                                    <Input type="select" id="user_position" name="user_position" class="form-control" >
                                                        <option value="">Select</option>
                                                        <option value="แอดมิน">แอดมิน</option>
                                                        <option value="เจ้าของร้าน">เจ้าของร้าน</option>
                                                        <option value="แคชเชียร์">แคชเชียร์</option>
                                                        <option value="พนักงานเสิร์ฟ">พนักงานเสิร์ฟ</option>
                                                    </Input>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    สาขา : <font color='red'><b> * </b></font>
                                                </Col>
                                                <Col lg="5" md="5" sm="5">
                                                    <Input type="select" id="about_code" name="about_code" class="form-control" >
                                                        <option value="">Select</option>
                                                        {this.renderBranch()}
                                                    </Input>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    ชื่อ : <font color='red'><b> * </b></font>
                                                </Col>
                                                <Col lg="6" md="6" sm="6">
                                                    <Input type="text" id="user_firstname" name="user_firstname" class="form-control"></Input>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    นามสกุล : <font color='red'><b> * </b></font>
                                                </Col>
                                                <Col lg="6" md="6" sm="6">
                                                    <Input type="text" id="user_lastname" name="user_lastname" class="form-control"  ></Input>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    อีเมล :
                                                </Col>
                                                <Col lg="7" md="7" sm="7">
                                                    <Input type="text" id="user_email" name="user_email" class="form-control"></Input>
                                                    <p id="user_email" className="text_head_sub">Example : AAAA@gmail.com</p>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    เบอร์โทร : <font color='red'><b> * </b></font>
                                                </Col>
                                                <Col lg="5" md="5" sm="5">
                                                    <Input type="text" id="user_tel" name="user_tel" class="form-control"  ></Input>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    ที่อยู่ :
                                                </Col>
                                                <Col lg="7" md="7" sm="7">
                                                    <textarea type="textarea" id="user_address" name="user_address" class="form-control"  ></textarea>
                                                    <p id="user_address" className="text_head_sub">Example : 271/55 ตรอกวัดท่าตะโก</p>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    ชื่อผู้ใช้ : <font color='red'><b> * </b></font>
                                                </Col>
                                                <Col lg="5" md="5" sm="5">
                                                    <Input type="text" id="user_username" name="user_username" class="form-control"></Input>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    รหัสผ่าน : <font color='red'><b> * </b></font>
                                                </Col>
                                                <Col lg="5" md="5" sm="5">
                                                    <Input type="password" id="user_password" name="user_password" class="form-control"  ></Input>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg="4">
                                            <FormGroup style={{ textAlign: "center" }}>
                                                <div class="form-group files">
                                                    <Col style={{ marginBottom: "15px" }}>
                                                        {imagePreview}
                                                    </Col>
                                                    <CustomInput type="file" label="เลือกรูปภาพ" class="form-control" multiple onChange={this.onChangeHandler} id="user_image" />
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <Link to="/user/">
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
        user: state.user,
    }
}
export default connect(mapStatetoProps)(insertView);