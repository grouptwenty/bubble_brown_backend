import React, { Component } from 'react';
import { Button, InputGroup, Form, Input, Table, Card, CardHeader, Col, Row, CardImg, CardBody, CardTitle, Label, FormGroup, CardFooter } from 'reactstrap';
import { connect } from 'react-redux';
import Select from 'react-select';
import { NavLink } from 'react-router-dom';
import { formatDate, parseDate, } from 'react-day-picker/moment';
import { Modal } from 'react-bootstrap';
import axios, { post } from 'axios';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import swal from 'sweetalert';
import PromotionModel from '../../models/PromotionModel';
import MenuTypeModel from '../../models/MenuTypeModel'
import ImgDefault from '../../assets/img/img_default.png'
import UploadModel from '../../models/UploadModel';
import GOBALS from '../../GOBALS';
import 'react-day-picker/lib/style.css';
var promotion_model = new PromotionModel();
const menu_type_model = new MenuTypeModel
var upload_model = new UploadModel();
const promotion_type = [
    { value: 'เปอร์เซ็น', label: 'เปอร์เซ็น' },
    { value: 'ส่วนลด', label: 'ส่วนลด' },
    { value: 'แถม', label: 'แถม' },
];
var today = new Date();
class HomeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false,
            imagePreviewUrl: '',
            file: '',
            promotion_img_old: null,
            promotion: [],
            row_img: [],
            fileSelected: false
        };
        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.SavePromotion = this.SavePromotion.bind(this)
        this.goBack = this.goBack.bind(this);
        this.handleDayChangestart = this.handleDayChangestart.bind(this);
        this.handleDayChangeend = this.handleDayChangeend.bind(this);
        this.renderMenuType = this.renderMenuType.bind(this);
    }
    goBack() {
        this.props.history.goBack();
    }
    handleDayChangestart(date) {
        this.setState({
            startdate: date
        });

    }
    handleDayChangeend(date) {
        this.setState({
            enddate: date
        });

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
        var promotion_code = this.props.match.params.code;
        const promotion = await promotion_model.getPromotionByCol({ 'promotion_code': promotion_code });
        console.log("promotion :", promotion.data[0])
        this.setState({
            promotion_code: this.props.match.params.code,
            promotion: promotion.data[0],
            startdate: promotion.data[0].startdate,
            enddate: promotion.data[0].enddate,
            discount_percent: promotion.data[0].discount_percent,
            discount_price: promotion.data[0].discount_price,
            promotion_img_old: promotion.data[0].promotion_image,
        });
        console.log("setState", this.state.promotion.promotion);

        const menu_type = await menu_type_model.getMenuTypeBy(this.props.user);
        this.setState({
            menu_type: menu_type.data
        })
    }

    async SavePromotion(event) {
        event.preventDefault();
        const form = event.target;
        const date_now = new Date();
        var toDay = date_now.getFullYear() + "" + (date_now.getMonth() + 1) + "" + date_now.getDate() + "" + date_now.getTime()
        var arr
        var promotion_img
        var type = form.elements['promotion_type'].value

        if (type == "เปอร์เซ็น") {
            arr = {
                'promotion_code': this.props.match.params.code,
                'updateby': '1',
                'promotion_header': form.elements['promotion_header'].value,
                'promotion_detail': form.elements['promotion_detail'].value,
                'menu_type_id': form.elements['menu_type_id'].value,
                'discount_code': form.elements['discount_code'].value,
                'promotion_type': form.elements['promotion_type'].value,
                'discount_percent': form.elements['number'].value,
                'discount_price': "",
                'startdate': this.state.startdate,
                'enddate': this.state.enddate
            }
            if (this.state.selectedFile != null) {

                if (this.state.promotion_img_old != "" && this.state.promotion_img_old != null) {
                    var req = await upload_model.deleteImages(this.state.promotion_img_old, "promotion")
                    console.log("Delect :" + req);
                }

                arr['promotion_image'] = await this.fileUpload(this.state.selectedFile, 'promotion', this.state.promotion_code + "_" + toDay);
                // console.log("this.state.selectedFile :", this.state.selectedFile);

            } else {
                arr['promotion_image'] = this.state.promotion_img_old

            }
        }
        if (type == "ส่วนลด") {
            arr = {
                'promotion_code': this.props.match.params.code,
                'updateby': '1',
                'promotion_header': form.elements['promotion_header'].value,
                'promotion_detail': form.elements['promotion_detail'].value,
                'menu_type_id': form.elements['menu_type_id'].value,
                'discount_code': form.elements['discount_code'].value,
                'promotion_type': form.elements['promotion_type'].value,
                'discount_percent': "",
                'discount_price': form.elements['number'].value,
                'startdate': this.state.startdate,
                'enddate': this.state.enddate
            }
            if (this.state.selectedFile != null) {

                if (this.state.promotion_img_old != "" && this.state.promotion_img_old != null) {
                    var req = await upload_model.deleteImages(this.state.promotion_img_old, "promotion")
                    console.log("Delect :" + req);
                }

                arr['promotion_image'] = await this.fileUpload(this.state.selectedFile, 'promotion', this.state.promotion_code + "_" + toDay);
                // console.log("this.state.selectedFile :", this.state.selectedFile);

            } else {
                arr['promotion_image'] = this.state.promotion_img_old

            }
        }


        var res = await promotion_model.updatePromotion(arr);
        console.log("data:", arr);

        if (res.query_result) {
            // if (this.state.imagePreviewUrl) {
            //     await upload_model.fileDelete(this.state.journal.journal_file_path);
            //     await this.fileUpload(this.state.selectedFile, 'CoverPage', this.props.match.params.code);
            // }

            swal({
                title: "Good job!",
                text: "Insert Position  Ok",
                icon: "success",
                button: "Close",
            });
            this.props.history.push('/promotion');
        } else {
            swal({
                title: "Error !",
                text: "Insert Position Error ",
                icon: "error",
                button: "Close",
            });
        }
    }

    renderMenuType() {
        if (this.state.menu_type != undefined) {
            let menutype = []

            for (let i = 0; i < this.state.menu_type.length; i++) {
                menutype.push(
                    <option value={this.state.menu_type[i].menu_type_id}>{this.state.menu_type[i].menu_type_name}</option>
                )
            }
            return menutype;
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

        if (this.state.promotion_img_old != null && this.state.promotion_img_old != undefined && !imagePreviewUrl && this.state.promotion_img_old != '') {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={GOBALS.URL_IMG + "promotion/" + this.state.promotion_img_old} />);
        }

        return (
            <Form onSubmit={this.SavePromotion} id="myForm">
                <div className="animated fadeIn">
                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <Card>
                                <CardHeader>
                                    แก้ไขโปรโมชั่น
                                </CardHeader>
                                <CardBody>
                                    <Row style={{ padding: 20 }}>
                                        <Col lg="8">
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    ชื่อโปรโมชั่น :
                                                    </Col>
                                                <Col lg="9" md="9" sm="9">
                                                    <Input placeholder="promotion_header" type="text" id={"promotion_header"} name={"promotion_header"} defaultValue={this.state.promotion.promotion_header} required />
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    เงื่อนไข :
                                                    </Col>
                                                <Col lg="9" md="9" sm="9">
                                                    <Input placeholder="promotion_detail" type="text" id={"promotion_detail"} name={"promotion_detail"} defaultValue={this.state.promotion.promotion_detail} required />
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    ประเภท :
                                                    </Col>
                                                <Col lg="5" md="5" sm="5">
                                                    <Input type="select" id="menu_type_id" name="menu_type_id" class="form-control" >
                                                        <option value="">Select</option>
                                                        {this.renderMenuType()}
                                                    </Input>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    โค๊ดโปรโมชั่น :
                                                    </Col>
                                                <Col lg="4" md="4" sm="4">
                                                    <Input placeholder="discount_code" type="text" id={"discount_code"} name={"discount_code"} defaultValue={this.state.promotion.discount_code} required />
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    ประเภทส่วนลด :
                                                    </Col>
                                                <Col lg="5" md="5" sm="5">
                                                    {this.state.promotion.promotion_type ?
                                                        <Select options={promotion_type} value={{ value: this.state.promotion.promotion_type, label: this.state.promotion.promotion_type }} name={"promotion_type"} />
                                                        : null}
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    จำนวน :
                                                    </Col>
                                                <Col lg="4" md="4" sm="4">
                                                    {this.state.promotion.promotion_type == "เปอร์เซ็น" ?
                                                        < Input placeholder="number" type="text" id={"number"} name={"number"} defaultValue={this.state.promotion.discount_percent} required />
                                                        : <Input placeholder="number" type="text" id={"number"} name={"number"} defaultValue={this.state.promotion.discount_price} required />
                                                    }
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    จำนวนที่ซื้อ :
                                                    </Col>
                                                <Col lg="4" md="4" sm="4">
                                                    < Input placeholder="discount_giveaway_buy" type="text" id={"discount_giveaway_buy"} name={"discount_giveaway_buy"} defaultValue={this.state.promotion.discount_giveaway_buy} required />
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    จำนวนที่แถม :
                                                    </Col>
                                                <Col lg="4" md="4" sm="4">
                                                    <Input placeholder="discount_giveaway" type="text" id={"discount_giveaway"} name={"discount_giveaway"} defaultValue={this.state.promotion.discount_giveaway} required />
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="6">
                                                    <Label className="text_head"> วันที่เริ่มต้น<font color='red'><b> * </b></font></Label>
                                                    <DayPickerInput
                                                        format="DD/MM/YYYY"
                                                        formatDate={formatDate}
                                                        onDayChange={this.handleDayChangestart.bind(this)}
                                                        value={this.state.startdate}
                                                        selecteDay={this.state.startdate}
                                                        dayPickerProps={{ disabledDays: { before: new Date() } }}
                                                    // inputProps = {{readOnly}}
                                                    />
                                                    <p id="startdate" className="text_head_sub">Example : 10-09-2019</p>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="6">
                                                    <Label className="text_head"> วันที่เริ่มต้น<font color='red'><b> * </b></font></Label>
                                                    <DayPickerInput
                                                        format="DD/MM/YYYY"
                                                        formatDate={formatDate}
                                                        onDayChange={this.handleDayChangestart.bind(this)}
                                                        value={this.state.promotion.startdate}
                                                        selecteDay={this.state.startdate}
                                                        dayPickerProps={{ disabledDays: { before: new Date() } }}
                                                    // inputProps = {{readOnly}}
                                                    />
                                                    <p id="startdate" className="text_head_sub">Example : 10-09-2019</p>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="6">
                                                    <Label className="text_head"> วันที่สิ้นสุด<font color='red'><b> * </b></font></Label>
                                                    <DayPickerInput
                                                        format="DD/MM/YYYY"
                                                        formatDate={formatDate}
                                                        onDayChange={this.handleDayChangeend.bind(this)}
                                                        value={this.state.promotion.enddate}
                                                        selecteDay={this.state.enddate}
                                                        dayPickerProps={{ disabledDays: { before: new Date() } }}
                                                    // inputProps = {{readOnly}}
                                                    />
                                                    <p id="enddate" className="text_head_sub">Example : 10-09-2019</p>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg="4">
                                            <FormGroup style={{ textAlign: "center" }}>
                                                <div class="form-group files">
                                                    <Col style={{ marginBottom: "15px" }}>
                                                        {imagePreview}
                                                    </Col>
                                                    <input type="file" class="form-control" multiple onChange={this.onChangeHandler} id="promotion_image" />
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <Button variant="secondary" size="lg" onClick={this.goBack}>ย้อนกลับ</Button>
                                    <Button type="reset" size="lg" color="danger">ยกเลิก</Button>
                                    <Button className="btn btn-success" type="submit" size="lg" color="primary">บันทึก</Button>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Form>
        )
    }
}
const mapStatetoProps = (state) => {
    return {
        user: state.user,
    }
}
export default connect(mapStatetoProps)(HomeView);