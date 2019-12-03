import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, FormGroup, PaginationItem, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Input, Label, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import GOBALS from '../../GOBALS'

import ImgDefault from '../../assets/img/img_default.png'
import UploadModel from '../../models/UploadModel';
import AddressModel from '../../models/AddressModel'
import UserModel from '../../models/UserModel'

const address_model = new AddressModel
const user_model = new UserModel
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
            user_img_old: "",
            refresh: false,
            user_username_old: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setval = this.setval.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this)

    }


    async componentDidMount() {
        const code = this.props.match.params.code
        const province = await address_model.getProvinceBy()
        const user_data = await user_model.getUserByCode(code)

        this.setState({
            province: province.data //ตัวที่เอาไปใช้ province
        })
        this.setval(user_data.data)

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



    async setval(data) {
        document.getElementById('user_code').value = data.user_code
        document.getElementById('user_prefix').value = data.user_prefix
        document.getElementById('user_name').value = data.user_name
        document.getElementById('user_lastname').value = data.user_lastname
        document.getElementById('user_mobile').value = data.user_mobile
        document.getElementById('user_email').value = data.user_email
        document.getElementById('user_username').value = data.user_username
        document.getElementById('user_password').value = data.user_password
        document.getElementById('user_address').value = data.user_address

        if (data.province_id != null) {
            document.getElementById('province_id').value = data.province_id
            await this.getamphur(data.province_id)
            document.getElementById('amphur_id').value = data.amphur_id
            await this.getdistrict(data.amphur_id)
            document.getElementById('district_id').value = data.district_id
            document.getElementById('user_zipcode').value = data.user_zipcode
        }
        if (data.user_profile_img != null) {

            this.setState({
                user_img_old: data.user_profile_img
            })
        }

        this.setState({
            user_username_old: data.user_password
        })
    }

    async getamphur(event) {
        const id = event
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
        const id = event
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
        const id = event
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
        arr['updateby'] = this.props.user.admin_code



        console.log(this.check(arr))
        if (this.check(arr)) {

            if (this.state.selectedFile != null) {

                if (this.state.user_img_old != "" && this.state.user_img_old != null) {
                    var req = await upload_model.deleteImages(this.state.user_img_old, "user")
                    console.log("Delect :" + req);
                }
                arr['user_profile_img'] = await this.fileUpload(this.state.selectedFile, 'user', form.elements['user_code'].value + "_" + toDay);
            }
            else {
                arr['user_profile_img'] = this.state.user_img_old

            }
            if (arr['user_password'] != this.state.user_username_old) {
                arr['user_password'] = await md5(arr['user_password']);
            }
            var res = await user_model.updateUserBy(arr);
            //   console.log(res)
            if (res.data) {
                swal({
                    title: "Good job!",
                    text: "Add user Ok",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/user/')
            }
        }
    }

    check(form) {
        console.log("form", form);

        if (form.user_code == '') {
            swal({
                text: "กรุณากรอก รหัสลูกค้า / User Code",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.user_prefix == '') {
            swal({
                text: "กรุณากรอก คำนำหน้า / Prefix",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.user_name == '') {
            swal({
                text: "กรุณากรอก ชื่อ / Name",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.user_lastname == '') {
            swal({
                text: "กรุณากรอก นามสกุล / Lastname",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.user_mobile == '') {
            swal({
                text: "กรุณากรอก หมายเลขโทรศัพท์",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.user_email == '') {
            swal({
                text: "กรุณากรอก อีเมล / E-mail",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.user_username == '') {
            swal({
                text: "กรุณากรอก บัญชีผู้ใช้ / Username",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.user_password == '') {
            swal({
                text: "กรุณากรอก รหัสผ่าน / Password",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.user_address == '') {
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

        if (imagePreviewUrl) {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={imagePreviewUrl} />);
        } else {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={ImgDefault} />);
        }

        if (this.state.user_img_old != null && this.state.user_img_old != undefined && !imagePreviewUrl && this.state.user_img_old != '') {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={GOBALS.URL_IMG + "user/" + this.state.user_img_old} />);
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
                                    แก้ไขข้อมูลลูกค้า /  Edit Customer
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
                                                    <input type="file" class="form-control" multiple onChange={this.onChangeHandler} />
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col lg="8">
                                            <br />

                                            <Col lg="6">
                                                <Label className="text_head"> รหัสลูกค้า / User Code<font color='red'><b> * </b></font></Label>
                                                <Input type="hidden" id="user_profile_img" name="user_profile_img" class="form-control" readOnly ></Input>
                                                <Input type="text" id="user_code" name="user_code" class="form-control" readOnly ></Input>
                                                <p id="user_code" className="text_head_sub">Example : U000001</p>
                                            </Col>
                                            <br />

                                            <Row>
                                                <Col lg="3">
                                                    <Label className="text_head"> คำนำหน้า / Prefix<font color='red'><b> * </b></font></Label>
                                                    <Input type="select" id="user_prefix" name="user_prefix" class="form-control" >
                                                        <option value="">Select</option>
                                                        <option value="นาย">นาย</option>
                                                        <option value="นาง">นาง</option>
                                                        <option value="นางสาว">นางสาว</option>
                                                    </Input>
                                                    <p id="user_code" className="text_head_sub">Example : นาย</p>
                                                </Col>
                                                <Col lg="4">
                                                    <Label className="text_head"> ชื่อ / Name<font color='red'><b> * </b></font></Label>
                                                    <Input type="text" id="user_name" name="user_name" class="form-control" autocomplete="off"></Input>
                                                    <p id="user_code" className="text_head_sub">Example : revelsoft</p>
                                                </Col>
                                                <Col lg="4">
                                                    <Label className="text_head"> นามสกุล / Lastname<font color='red'><b> * </b></font></Label>
                                                    <Input type="text" id="user_lastname" name="user_lastname" class="form-control"  ></Input>
                                                    <p id="user_code" className="text_head_sub">Example : thailand</p>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col lg="3">
                                            <Label className="text_head"> หมายเลขโทรศัพท์ </Label>
                                            <Input type="text" id="user_mobile" name="user_mobile" class="form-control"  ></Input>
                                            <p id="user_code" className="text_head_sub">Example : 044-001-494</p>
                                        </Col>
                                        <Col lg="3">
                                            <Label className="text_head"> อีเมล / E-mail<font color='red'><b> * </b></font></Label>
                                            <Input type="email" id="user_email" name="user_email" class="form-control"  ></Input>
                                            <p id="user_code" className="text_head_sub">Example : revelsoft.co.th</p>
                                        </Col>
                                        <Col lg="3">
                                            <Label className="text_head"> บัญชีผู้ใช้ / Username<font color='red'><b> * </b></font></Label>
                                            <Input type="text" id="user_username" name="user_username" class="form-control" autocomplete="off" ></Input>
                                            <p id="user_code" className="text_head_sub">Example : root</p>
                                        </Col>
                                        <Col lg="3">
                                            <Label className="text_head"> รหัสผ่าน / Password<font color='red'><b> * </b></font></Label>
                                            <Input type="password" id="user_password" name="user_password" class="form-control" autoComplete="oof" ></Input>
                                            <p id="user_code" className="text_head_sub">Example : 123456</p>
                                        </Col>
                                    </Row>
                                    <br />
                                    <hr />
                                    <br />
                                    <Row>
                                        <Col lg="6">
                                            <Label className="text_head"> ที่อยู่ / Address<font color='red'><b> * </b></font></Label>
                                            <textarea type="text" id="user_address" name="user_address" class="form-control"  ></textarea>
                                            <p id="user_code" className="text_head_sub">Example : 271/55 ตรอกวัดท่าตะโก</p>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg="3">
                                            <Label className="text_head"> จังหวัด / Province<font color='red'><b> * </b></font></Label>
                                            <Input type="select" id="province_id" name="province_id" class="form-control" onChange={(event) => this.getamphur(event.target.value)}>
                                                <option value="">Select</option>
                                                {province_address}
                                            </Input>
                                            <p id="user_code" className="text_head_sub">Example : นคราชสีมา</p>
                                        </Col>
                                        <Col lg="3">
                                            <Label className="text_head"> อำเภอ / Amphur<font color='red'><b> * </b></font></Label>
                                            <Input type="select" id="amphur_id" name="amphur_id" class="form-control" onChange={(event) => this.getdistrict(event.target.value)}>
                                                <option value="">Select</option>
                                                {this.state.amphur}
                                            </Input>
                                            <p id="user_code" className="text_head_sub">Example : เมือง</p>
                                        </Col>
                                        <Col lg="3">
                                            <Label className="text_head"> ตำบล / District<font color='red'><b> * </b></font></Label>
                                            <Input type="select" id="district_id" name="district_id" class="form-control" onChange={(event) => this.getzipcode(event.target.value)}>
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
                                    <Link to="/user/">
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

export default connect(mapStatetoProps)(editView);