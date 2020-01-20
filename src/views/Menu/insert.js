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

const menu_model = new MenuModel
const menu_type_model = new MenuTypeModel
var upload_model = new UploadModel();

class insertView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            menu_type: [],
            refresh: false,
            imagePreviewUrl: '',
            file: null,
            selectedFile: null,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.renderMenu = this.renderMenu.bind(this);
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
        console.log("file :", file);
        var file_check = file
        if (file_check != undefined) {
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
            } else {

                console.log('files', file);

                reader.onloadend = () => {
                    this.setState({
                        file: "",
                        imagePreviewUrl: "",
                        selectedFile: ""
                    });
                }
                console.log('imagePreviewUrl', this.state.imagePreviewUrl);
            }
        }
        else {

            console.log('files', file);
            this.setState({
                file: "",
                imagePreviewUrl: "",
                selectedFile: ""
            });

            console.log('imagePreviewUrl', this.state.imagePreviewUrl);
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
        const menu_type = await menu_type_model.getMenuTypeBy(this.props.user);
        this.setState({
            menu_type: menu_type.data
        })
    }



    async handleSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const data = new FormData(form);
        const date_now = new Date();
        var toDay = date_now.getFullYear() + "" + (date_now.getMonth() + 1) + "" + date_now.getDate() + "" + date_now.getTime()
        var arr = {};
        var menu_type_id = document.getElementById("menu_type_id").value
        const max_code = await menu_model.getMenuMaxCode(menu_type_id)
        // menu_type_code = menu_type_code.replace('MNT', "")
        var menu_code = 'MN0' + menu_type_id + max_code.data.menu_code_max

        console.log(max_code);
        console.log(menu_code);


        for (let name of data.keys()) {
            arr[name] = form.elements[name.toString()].value;
        }

        if (this.state.selectedFile != null) {
            arr['menu_image'] = await this.fileUpload(this.state.selectedFile, 'menu', '123');
        }

        arr['menu_code'] = menu_code
        arr['about_code'] = this.props.user.about_code
        arr['addby'] = this.props.user.user_code
        if (this.check(arr)) {
            var res = await menu_model.insertMenu(arr);
            //   console.log(res)
            if (res.data) {
                swal({
                    title: "สำเร็จ!",
                    text: "เพิ่มเมนูสำเร็จ",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/menu')
            }
        }
    }


    check(form) {

        if (form.menu_type_id == '') {
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
        } else if (form.menu_price == '') {
            swal({
                text: "กรุณากรอก ราคา",
                icon: "warning",
                button: "close",
            });
            return false
            // } else if (form.menu_id == '') {
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

    renderMenu() {

        let menutype = []
        for (let i = 0; i < this.state.menu_type.length; i++) {
            menutype.push(
                <option value={this.state.menu_type[i].menu_type_id}>{this.state.menu_type[i].menu_type_name}</option>
            )

        }
        return menutype;
    }
    render() {

        let { imagePreviewUrl } = this.state;
        let imagePreview = null;
        console.log("ddd", imagePreviewUrl);


        if (imagePreviewUrl != "") {

            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={imagePreviewUrl} />);
        } else {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={ImgDefault} />);
        }

        return (
            <div className="animated fadeIn">
                <Row style={{ padding: '15px' }}>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                                <CardHeader>
                                    เพิ่มเมนู
                            </CardHeader>
                                <CardBody>
                                    <br />
                                    <Row>
                                        <br />
                                        <Col lg="6">
                                            <Row>
                                                <Col lg="12">
                                                    <FormGroup >
                                                        <Label className="text_head"> ชื่อเมนู <font color='red'><b> * </b></font></Label>
                                                        <Input type="text" id="menu_name" name="menu_name" class="form-control" ></Input>
                                                        {/* <p id="menu_name" className="text_head_sub">Example : ลาเต้</p> */}
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="12">
                                                    <FormGroup >
                                                        <Label className="text_head"> ราคา </Label>
                                                        <Input type="text" id="menu_price" name="menu_price" class="form-control"></Input>
                                                        {/* <p id="menu_price" className="text_head_sub">Example : AAAA@gmail.com</p> */}
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="12">
                                                    <FormGroup >
                                                        <Label className="text_head"> ประเภท <font color='red'><b> * </b></font></Label>
                                                        <Input type="select" id="menu_type_id" name="menu_type_id" class="form-control" >
                                                            <option value="">Select</option>
                                                            {this.renderMenu()}
                                                        </Input>
                                                        {/* <p id="menu_id" className="text_head_sub">Example : Line, Facebook</p> */}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg="6">

                                            {/* 
                                            <Col lg="4">
                                                <Label className="text_head"> รหัสเมนู<font color='red'><b> * </b></font></Label>
                                                <Input id="menu_code" name="menu_code" class="form-control" readOnly ></Input>
                                                <p id="menu_code" className="text_head_sub">Example : CM001</p>
                                            </Col> */}

                                            <FormGroup style={{ textAlign: "center" }}>
                                                <div class="form-group files">
                                                    <Col ol lg="12" style={{ marginBottom: "15px" }}>
                                                        {imagePreview}
                                                        <input type="file" class="form-control" multiple onChange={this.onChangeHandler} id="menu_image" />

                                                    </Col>
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                </CardBody>
                                <CardFooter>
                                    <Link to="/menu/">
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