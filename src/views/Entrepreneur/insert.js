import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, FormGroup, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Input, Label, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';

import ImgDefault from '../../assets/img/img_default.png'
import UploadModel from '../../models/UploadModel';
import AddressModel from '../../models/AddressModel'
import EntrepreneurModel from '../../models/EntrepreneurModel'

const address_model = new AddressModel
const entrepreneur_model = new EntrepreneurModel
const upload_model = new UploadModel()
var md5 = require("md5");

class insertView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            province: [],//province data
            imagePreviewUrl: '',
            file: null,
            selectedFile: null,
            refresh: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this)

    }


    async componentDidMount() {

        const province = await address_model.getProvinceBy()
        const max_code = await entrepreneur_model.getEntrepreneurrMaxCode()


        // console.log("max_code", max_code);

        document.getElementById("entrepreneur_code").value = 'EP' + max_code.data.entrepreneur_code_max

        this.setState({
            province: province.data
        })
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

    async getamphur(event) { //amphur data
        const id = event.target.value
        const amphur = await address_model.getAmphurInfoByProviceID(id)
        var data_amphur = amphur.data
        var data_select_amphur = [];
        for (let i = 0; i < data_amphur.length; i++) {
            data_select_amphur.push(
                <option value={data_amphur[i].amphur_id}>{data_amphur[i].amphur_name}</option>
            )
        }
        this.setState({
            amphur: data_select_amphur
        })
    }

    async getdistrict(event) {
        const id = event.target.value
        const district = await address_model.getDistrictInfoByAmphurID(id)
        var data_district = district.data
        var data_select_district = [];
        for (let i = 0; i < data_district.length; i++) {
            data_select_district.push(
                <option value={data_district[i].district_id}>{data_district[i].district_name}</option>
            )
        }
        this.setState({
            district: data_select_district
        })
    }

    async getzipcode(event) {
        const id = event.target.value
        const zipcode = await address_model.getZipcodeByDistrictID(id)
        console.log("zipcode", zipcode);
        document.getElementById("user_zipcode").value = zipcode.data.post_code

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
        arr['addby'] = this.props.user.admin_code

        if (this.check(arr)) {

            arr['entrepreneur_password'] = await md5(arr['entrepreneur_password']);

            if (this.state.selectedFile != null) {
                arr['entrepreneur_img'] = await this.fileUpload(this.state.selectedFile, 'entrepreneur', form.elements['entrepreneur_code'].value + "_" + toDay);
            }
            var res = await entrepreneur_model.insertEntrepreneurBy(arr);
            //   console.log(res)
            if (res.data) {
                swal({
                    title: "Good job!",
                    text: "Add entrepreneur Ok",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/entrepreneur/')
            }
        }
    }

    check(form) {
        console.log("form", form);

        if (form.entrepreneur_code == '') {
            swal({
                text: "กรุณากรอก รหัสลูกค้า / User Code",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.entrepreneur_name_th == '') {
            swal({
                text: "กรุณากรอก ชื่อ / TH",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.entrepreneur_name_en == '') {
            swal({
                text: "กรุณากรอก ชื่อ / EN",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.entrepreneur_email == '') {
            swal({
                text: "กรุณากรอก อีเมล / E-mail",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.entrepreneur_username == '') {
            swal({
                text: "กรุณากรอก บัญชีผู้ใช้ / Username",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.entrepreneur_password == '') {
            swal({
                text: "กรุณากรอก รหัสผ่าน / Password",
                icon: "warning",
                button: "close",
            });
            return false

        } else if (form.entrepreneur_address == '') {
            swal({
                text: "กรุณากรอก ที่อยู่ / Address",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.province_id == '') {
            swal({
                text: "กรุณากรอก จังหวัด / Province",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.amphur_id == '') {
            swal({
                text: "กรุณากรอก อำเภอ / Amphur",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.district_id == '') {
            swal({
                text: "กรุณากรอก ตำบล / District",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.user_zipcode == '') {
            swal({
                text: "กรุณากรอก รหัสไปรษณีย์ / Zipcode",
                icon: "warning",
                button: "close",
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


        let province = this.state.province
        let province_address = [];
        for (let i = 0; i < province.length; i++) {
            province_address.push(
                <option value={province[i].province_id}>{province[i].province_name}</option>
            )
        }


        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                                <CardHeader>
                                    เพิ่มข้อมูลประกอบการ /  Insert Entrepreneur
                                <NavLink exact to={`/sale/sale-order/insert`} style={{ width: '100%' }}>
                                    </NavLink>
                                </CardHeader>
                                <CardBody>

                                    <Row>
                                        <Col lg="4" >
                                            {/* <img src="/coinlaundry.jpg" className="imgCircelinsert_cus" /> */}
                                            <FormGroup style={{ textAlign: "center" }}>
                                                <div class="form-group files">
                                                    <Col style={{ marginBottom: "15px" }}>
                                                        {imagePreview}
                                                    </Col>
                                                    <input type="file" class="form-control" multiple onChange={this.onChangeHandler} id="entrepreneur_img"/>
                                                </div>
                                            </FormGroup>                                        </Col>
                                        <Col lg="8">
                                            <br />

                                            <Col lg="6">
                                                <Label className="text_head"> รหัสผู้ประกอบการ / Entrepreneur Code<font color='red'><b> * </b></font></Label>
                                                <Input type="hidden" id="user_profile_img" name="user_profile_img" class="form-control" readOnly ></Input>
                                                <Input type="text" id="entrepreneur_code" name="entrepreneur_code" class="form-control" readOnly ></Input>
                                                <p id="entrepreneur_code" className="text_head_sub">Example : EP0001</p>
                                            </Col>
                                            <br />

                                            <Row>
                                                <Col lg="6">
                                                    <Label className="text_head"> ชื่อ (ไทย)/ Name (Th)<font color='red'><b> * </b></font></Label>
                                                    <Input type="text" id="entrepreneur_name_th" name="entrepreneur_name_th" class="form-control" autocomplete="off"></Input>
                                                    <p id="entrepreneur_name_th" className="text_head_sub">Example : revelsoft</p>
                                                </Col>
                                                <Col lg="6">
                                                    <Label className="text_head"> ชื่อ (อังกฤษ)/ Name (En)<font color='red'><b> * </b></font></Label>
                                                    <Input type="text" id="entrepreneur_name_en" name="entrepreneur_name_en" class="form-control"  ></Input>
                                                    <p id="entrepreneur_name_en" className="text_head_sub">Example : thailand</p>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col lg="3">
                                            <Label className="text_head"> หมายเลขโทรศัพท์ </Label>
                                            <Input type="text" id="entrepreneur_tel" name="entrepreneur_tel" class="form-control"  ></Input>
                                            <p id="entrepreneur_tel" className="text_head_sub">Example : 044-001-494</p>
                                        </Col>
                                        <Col lg="3">
                                            <Label className="text_head"> อีเมล / E-mail<font color='red'><b> * </b></font></Label>
                                            <Input type="email" id="entrepreneur_email" name="entrepreneur_email" class="form-control"  ></Input>
                                            <p id="entrepreneur_email" className="text_head_sub">Example : revelsoft.co.th</p>
                                        </Col>
                                        <Col lg="3">
                                            <Label className="text_head"> บัญชีผู้ใช้ / Username<font color='red'><b> * </b></font></Label>
                                            <Input type="text" id="entrepreneur_username" name="entrepreneur_username" class="form-control" autocomplete="off" ></Input>
                                            <p id="entrepreneur_username" className="text_head_sub">Example : root</p>
                                        </Col>
                                        <Col lg="3">
                                            <Label className="text_head"> รหัสผ่าน / Password<font color='red'><b> * </b></font></Label>
                                            <Input type="password" id="entrepreneur_password" name="entrepreneur_password" class="form-control" autoComplete="oof" ></Input>
                                            <p id="entrepreneur_password" className="text_head_sub">Example : 123456</p>
                                        </Col>
                                    </Row>
                                    <br />
                                    <hr />
                                    <br />
                                    <Row>
                                        <Col lg="6">
                                            <Label className="text_head"> ที่อยู่ / Address<font color='red'><b> * </b></font></Label>
                                            <textarea type="text" id="entrepreneur_address" name="entrepreneur_address" class="form-control"  ></textarea>
                                            <p id="entrepreneur_address" className="text_head_sub">Example : 271/55 ตรอกวัดท่าตะโก</p>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg="3">
                                            <Label className="text_head"> จังหวัด / Province<font color='red'><b> * </b></font></Label>
                                            <Input type="select" id="province_id" name="province_id" class="form-control" onChange={(event) => this.getamphur(event)}>
                                                <option value="">Select</option>
                                                {province_address}
                                            </Input>
                                            <p id="user_code" className="text_head_sub">Example : นคราชสีมา</p>
                                        </Col>
                                        <Col lg="3">
                                            <Label className="text_head"> อำเภอ / Amphur<font color='red'><b> * </b></font></Label>
                                            <Input type="select" id="amphur_id" name="amphur_id" class="form-control" onChange={(event) => this.getdistrict(event)}>
                                                <option value="">Select</option>
                                                {this.state.amphur}
                                            </Input>
                                            <p id="user_code" className="text_head_sub">Example : เมือง</p>
                                        </Col>
                                        <Col lg="3">
                                            <Label className="text_head"> ตำบล / District<font color='red'><b> * </b></font></Label>
                                            <Input type="select" id="district_id" name="district_id" class="form-control" onChange={(event) => this.getzipcode(event)}>
                                                <option value="">Select</option>
                                                {this.state.district}
                                            </Input>
                                            <p id="user_code" className="text_head_sub">Example : ในเมือง</p>
                                        </Col>
                                        <Col lg="3">
                                            <Label className="text_head"> รหัสไปรษณีย์ / Zipcode<font color='red'><b> * </b></font></Label>
                                            <Input type="text" id="user_zipcode" name="user_zipcode" class="form-control" readOnly ></Input>
                                            <p id="user_code" className="text_head_sub">Example : 30000</p>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <Link to="/entrepreneur/">
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

export default connect(mapStatetoProps)(insertView);