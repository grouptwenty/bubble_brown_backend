import React, { Component } from 'react';
import { Button, InputGroup, Form, Input, Table, Card, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Label, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import MenuModel from '../../models/MenuModel'
import MenuTypeModel from '../../models/MenuTypeModel'
import ImgDefault from '../../assets/img/img_default.png'
import UploadModel from '../../models/UploadModel';
import GOBALS from '../../GOBALS';
import 'react-day-picker/lib/style.css';

const menu_model = new MenuModel
const menu_type_model = new MenuTypeModel
var upload_model = new UploadModel();
var today = new Date();

class editView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            menu_type: [],
            menu_data: [],
            refresh: false,
            imagePreviewUrl: '',
            file: '',
            menu_img_old: null,
            row_img: [],
            fileSelected: false
        };
        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setval = this.setval.bind(this);
        this.renderMenu = this.renderMenu.bind(this);
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

        const menu_data = await menu_model.getMenuByMenuCode(code);
        console.log("menu_data", menu_data);
        const menu_type = await menu_type_model.getMenuTypeBy();
        this.setState({
            menu_type: menu_type.data,
            menu_img_old: menu_data.data.menu_image
        })


        this.setval(menu_data.data)


    }


    async setval(data) {
        // console.log(data.menu_code)
        document.getElementById('menu_code').value = data.menu_code
        // document.getElementById('menu_id').value = data.menu_id
        document.getElementById('menu_type_code').value = data.menu_type_code
        document.getElementById('menu_name').value = data.menu_name
        // document.getElementById('menu_image').value = data.menu_image
        document.getElementById('menu_price').value = data.menu_price
        // document.getElementById('menu_img').value = data.menu_img

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

            if (this.state.menu_img_old != "" && this.state.menu_img_old != null) {
                var req = await upload_model.deleteImages(this.state.menu_img_old, "menu")
                console.log("Delect :" + req);
            }

            arr['menu_image'] = await this.fileUpload(this.state.selectedFile, 'menu', this.state.menu_code + "_" + toDay);
            // console.log("this.state.selectedFile :", this.state.selectedFile);

        } else {
            arr['menu_image'] = this.state.menu_img_old

        }

        if (this.check(arr)) {
            var res = await menu_model.updateMenuByCode(arr);
            console.log(res)
            if (res.data) {
                swal({
                    title: "สำเร็จ!",
                    text: "แก้ไขเมนูสำเร็จ",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/menu/')
            }
        }
    }


    check(form) {

        if (form.menu_type_code == '') {
            swal({
                text: "กรุณาเลือก ประเภท",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.menu_name == '') {
            swal({
                text: "กรุณากรอก ชื่อเมนู",
                icon: "warning",
                button: "close",
            });
            return false
            // } else if (form.menu_image == '') {
            //     swal({
            //         text: "กรุณาใส่ รูปภาพ",
            //         icon: "warning",
            //         button: "close",
            //     });
            //     return false
        } else if (form.menu_price == '') {
            swal({
                text: "กรุณากรอก ราคา",
                icon: "warning",
                button: "close",
            });
            return false
        } else {
            return true
        }

    }
    renderMenu() {

        let menutype = []
        for (let i = 0; i < this.state.menu_type.length; i++) {
            menutype.push(
                <option value={this.state.menu_type[i].menu_type_code}>{this.state.menu_type[i].menu_type_name}</option>
            )

        }
        return menutype;
    }

    render() {
        let { imagePreviewUrl } = this.state;
        let imagePreview = null;

        if (imagePreviewUrl) {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={imagePreviewUrl} />);
        } else {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={ImgDefault} />);
        }

        if (this.state.menu_img_old != null && this.state.menu_img_old != undefined && !imagePreviewUrl && this.state.menu_img_old != '') {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={GOBALS.URL_IMG + "menu/" + this.state.menu_img_old} />);
        }

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                                <CardHeader>
                                    แก้ไขเมนู
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col lg="12">
                                            <br />
                                            <Row>
                                                <Col lg="4">
                                                    <Label className="text_head"> รหัสเมนู<font color='red'><b> * </b></font></Label>
                                                    <Input type="text" id="menu_code" name="menu_code" class="form-control" readOnly ></Input>
                                                    <p id="menu_code" className="text_head_sub">Example : MN01001</p>
                                                </Col>
                                                <br />

                                            </Row>
                                            <br />
                                            <Col lg="4">
                                                    <FormGroup style={{ textAlign: "center" }}>
                                                        <div class="form-group files">
                                                            <Col style={{ marginBottom: "15px" }}>
                                                                {imagePreview}
                                                            </Col>
                                                            <input type="file" class="form-control" multiple onChange={this.onChangeHandler} id="menu_image" />
                                                        </div>
                                                    </FormGroup>
                                                </Col>
                                            <Row>
                                                <Col lg="4">
                                                    <Label className="text_head"> ประเภท <font color='red'><b> * </b></font></Label>
                                                    <Input type="select" id="menu_type_code" name="menu_type_code" class="form-control" >
                                                        <option value="">Select</option>
                                                        {this.renderMenu()}
                                                    </Input>
                                                    {/* <p id="menu_id" className="text_head_sub">Example : Line, Facebook</p> */}
                                                </Col>
                                                <Col lg="4">
                                                    <Label className="text_head"> ชื่อเมนู <font color='red'><b> * </b></font></Label>
                                                    <Input type="text" id="menu_name" name="menu_name" class="form-control" ></Input>
                                                    {/* <p id="menu_name" className="text_head_sub">Example : ลาเต้</p> */}
                                                </Col>
                                                <Col lg="4">
                                                    <Label className="text_head"> ราคา </Label>
                                                    <Input type="text" id="menu_price" name="menu_price" class="form-control"></Input>
                                                    {/* <p id="menu_price" className="text_head_sub">Example : AAAA@gmail.com</p> */}
                                                </Col>
                                            </Row>
                                        </Col>

                                    </Row>

                                </CardBody>
                                <CardFooter>
                                    <Link to="/menu/">
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
