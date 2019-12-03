import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, FormGroup, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Input, Label, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import { formatDate, parseDate, } from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import GOBALS from '../../GOBALS'

import ImgDefault from '../../assets/img/img_default.png'
import UploadModel from '../../models/UploadModel';
import NewsModel from '../../models/NewsModel'
const news_model = new NewsModel
const upload_model = new UploadModel()


var today = new Date();
class editView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            change_date: today,
            imagePreviewUrl: '',
            file: '',
            user_img_old: "",
            refresh: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.setval = this.setval.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this)

    }


    async componentDidMount() {
        const code = this.props.match.params.code
        const news_data = await news_model.getNewsByCode(code)
        // // console.log(this.props);
        console.log("news_data", news_data);

        this.setval(news_data.data)

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

    handleDayChange(date) {
        this.setState({
            change_date: date
        });

    }

    async setval(data) { //setdata edit
        var news_date = new Date(data.news_date)
        document.getElementById('news_code').value = data.news_code
        document.getElementById('news_date').value = data.news_date
        document.getElementById('news_provision').value = data.news_provision
        document.getElementById('news_title').value = data.news_title
        document.getElementById('news_description').value = data.news_description
        document.getElementById('news_detail').value = data.news_detail

        if (data.news_img != null) {

            this.setState({
                news_img_old: data.news_img
            })

        }

        this.setState({
            change_date: news_date
        })
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
        arr['news_date'] = this.state.change_date

        if (this.state.selectedFile != null) {
            if (this.state.news_img_old != "" && this.state.news_img_old != null) {
                var req = await upload_model.deleteImages(this.state.news_img_old, "news")
                console.log("Delect :" + req);
            }
            arr['news_img'] = await this.fileUpload(this.state.selectedFile, 'news', form.elements['news_code'].value + "_" + toDay);
        } else {
            arr['news_img'] = this.state.news_img_old

        }

        console.log(this.check(arr))
        if (this.check(arr)) {
            var res = await news_model.updateNewsBy(arr);
            //   console.log(res)
            if (res.data) {
                swal({
                    title: "Good job!",
                    text: "Update News Ok",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/news/')
            }
        }
    }

    check(form) {
        console.log("form", form);

        if (form.news_code == '') {
            swal({
                text: "กรุณากรอก รหัสข่าวสาร",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.news_date == '') {
            swal({
                text: "กรุณากรอก วันที่ข่าวสาร",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.news_title == '') {
            swal({
                text: "กรุณากรอก พาดหัวข่าว",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.news_provision == '') {
            swal({
                text: "กรุณากรอก สิทธแสดงข่าวสาร",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.news_description == '') {
            swal({
                text: "กรุณากรอก บทคัดย่อ",
                icon: "warning",
                button: "close",
            });
            return false

        } else if (form.news_detail == '') {
            swal({
                text: "กรุณากรอก รายละเอียดข่าว",
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

        if (this.state.news_img_old != null && this.state.news_img_old != undefined && !imagePreviewUrl && this.state.news_img_old != '') {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={GOBALS.URL_IMG + "news/" + this.state.news_img_old} />);
        }
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                                <CardHeader>
                                    แก้ไขข้อมูลข่าวสาร /  Edit News

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
                                            <Row>
                                                <Col lg="4">
                                                    <Label className="text_head"> รหัสข่าวสาร<font color='red'><b> * </b></font></Label>
                                                    <Input type="hidden" id="user_profile_img" name="user_profile_img" class="form-control" readOnly ></Input>
                                                    <Input type="text" id="news_code" name="news_code" class="form-control" readOnly ></Input>
                                                    <p id="news_code" className="text_head_sub">Example : NW001</p>
                                                </Col>
                                                <Col lg="4">
                                                    <Label className="text_head"> วันที่ข่าวสาร<font color='red'><b> * </b></font></Label>
                                                    <DayPickerInput
                                                        format="DD/MM/YYYY"
                                                        formatDate={formatDate}
                                                        onDayChange={this.handleDayChange.bind(this)}
                                                        value={this.state.change_date}
                                                        selecteDay={this.state.change_date}
                                                        dayPickerProps={{ disabledDays: { before: new Date() } }}
                                                    // inputProps = {{readOnly}}
                                                    />
                                                    <p id="news_date" className="news_date">Example : 01-01-2018</p>
                                                </Col>
                                                <Col lg="4">
                                                    <Label className="text_head"> สิทธแสดงข่าวสาร <font color='red'><b> * </b></font></Label>
                                                    <Input type="select" id="news_provision" name="news_provision" class="form-control" >
                                                        <option value="">Select</option>
                                                        <option value="ผู้ประกอบการ">ผู้ประกอบการ</option>
                                                        <option value="ลูกค้าทั่งไป">ลูกค้าทั่งไป</option>
                                                        <option value="ทั้งหมด">ทั้งหมด</option>
                                                    </Input>
                                                </Col>
                                            </Row>
                                            <br />
                                            <Row>
                                                <Col lg="6">
                                                    <Label className="text_head"> พาดหัวข้อข่าว<font color='red'><b> * </b></font></Label>
                                                    <textarea type="text" id="news_title" name="news_title" class="form-control"  ></textarea>
                                                </Col>
                                                <Col lg="6">
                                                    <Label className="text_head"> บทคัดย่อ<font color='red'><b> * </b></font></Label>
                                                    <textarea type="text" id="news_description" name="news_description" class="form-control"  ></textarea>
                                                </Col>

                                            </Row>
                                            <br />
                                            <Row>
                                                <Col lg="8">
                                                    <Label className="text_head"> เนื้อหาข่าว<font color='red'><b> * </b></font></Label>
                                                    <textarea type="text" id="news_detail" name="news_detail" class="form-control" style={{ height: 150 }} ></textarea>
                                                </Col>
                                            </Row>
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

export default connect(mapStatetoProps)(editView);