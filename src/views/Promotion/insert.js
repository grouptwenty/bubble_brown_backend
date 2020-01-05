import React, { Component } from 'react';
import { Button, InputGroup, Form, Input, Table, Card, CardHeader, Col, Row, CardImg, CardBody, CardTitle, Label, FormGroup, CardFooter } from 'reactstrap';
import { connect } from 'react-redux';
import Select from 'react-select';
import { NavLink } from 'react-router-dom';
import axios, { post } from 'axios';
import { Modal } from 'react-bootstrap';
import swal from 'sweetalert';
import PromotionModel from '../../models/PromotionModel';
import MenuTypeModel from '../../models/MenuTypeModel'
import ImgDefault from '../../assets/img/img_default.png'
import UploadModel from '../../models/UploadModel';
import GOBALS from '../../GOBALS';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate, } from 'react-day-picker/moment';
import moment from 'moment'
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
            file: null,
            selectedFile: null,
            startdate: today,
            enddate: today,
        };
        this.SavePromotion = this.SavePromotion.bind(this)
        this.onChangeHandler = this.onChangeHandler.bind(this)
        // this.fileUpload = this.fileUpload.bind(this)
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

    async componentDidMount() {
        const menu_type = await menu_type_model.getMenuTypeBy();
        this.setState({
            menu_type: menu_type.data
        })
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
    async SavePromotion(event) {

        event.preventDefault();
        const form = event.target;
        const date_now = new Date();
        var toDay = date_now.getFullYear() + "" + (date_now.getMonth() + 1) + "" + date_now.getDate() + "" + date_now.getTime()
        var type = form.elements['promotion_type'].value
        var arr
        var startdate = moment(this.state.startdate).format("MMM Do YY");
        var enddate = moment(this.state.enddate).format("MMM Do YY");
        // console.log("today :", today);

        if (type == "เปอร์เซ็น") {
            arr = {
                'addby': '1',
                'promotion_header': form.elements['promotion_header'].value,
                'promotion_detail': form.elements['promotion_detail'].value,
                'menu_type_id': form.elements['menu_type_id'].value,
                'discount_code': form.elements['discount_code'].value,
                'promotion_type': form.elements['promotion_type'].value,
                'discount_percent': form.elements['number'].value,
                'discount_giveaway': "",
                'discount_giveaway_buy': "",
                'discount_price': "",
                'startdate': this.state.startdate,
                'enddate': this.state.enddate
            }
        }
        if (type == "ส่วนลด") {
            arr = {
                'addby': '1',
                'promotion_header': form.elements['promotion_header'].value,
                'promotion_detail': form.elements['promotion_detail'].value,
                'menu_type_id': form.elements['menu_type_id'].value,
                'discount_code': form.elements['discount_code'].value,
                'promotion_type': form.elements['promotion_type'].value,
                'discount_giveaway': "",
                'discount_giveaway_buy': "",
                'discount_price': form.elements['number'].value,
                'discount_percent': "",
                'startdate': this.state.startdate,
                'enddate': this.state.enddate
            }
        }
        if (type == "แถม") {
            arr = {
                'addby': '1',
                'promotion_header': form.elements['promotion_header'].value,
                'promotion_detail': form.elements['promotion_detail'].value,
                'menu_type_id': form.elements['menu_type_id'].value,
                'discount_code': form.elements['discount_code'].value,
                'promotion_type': form.elements['promotion_type'].value,
                'discount_giveaway': form.elements['discount_giveaway'].value,
                'discount_giveaway_buy': form.elements['discount_giveaway_buy'].value,
                'discount_price': "",
                'discount_percent': "",
                'startdate': this.state.startdate,
                'enddate': this.state.enddate
            }
        }


        if (this.state.selectedFile != null) {
            arr['promotion_image'] = await this.fileUpload(this.state.selectedFile, 'promotion', form.elements['promotion_header'].value);
        }
        var res = await promotion_model.insertPromotion(arr);
        if (res.query_result) {
            // await this.fileUpload(this.state.selectedFile, 'CoverPage', res.data.insertId);
            swal({
                title: "Good job!",
                text: "Insert Promotion  Ok",
                icon: "success",
                button: "Close",
            });
            this.props.history.push('/promotion');
        } else {
            swal({
                title: "Error !",
                text: "Insert Promotion Error ",
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
        console.log("ddd", imagePreviewUrl);


        if (imagePreviewUrl) {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={imagePreviewUrl} />);
        } else {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={ImgDefault} />);
        }
        return (
            <Form onSubmit={this.SavePromotion} id="myForm">
                <div className="animated fadeIn">
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    เพิ่มโปรโมชั่น
                                </CardHeader>
                                <CardBody>
                                    <Row style={{ padding: 20 }}>
                                        <Col lg="8">
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    ชื่อโปรโมชั่น :
                                                    </Col>
                                                <Col lg="9" md="9" sm="9" style={{ textAlign: 'left' }}>
                                                    <Input placeholder="promotion_header" type="text" id={"promotion_header"} name={"promotion_header"} required />
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    เงื่อนไข :
                                                    </Col>
                                                <Col lg="9" md="9" sm="9">
                                                    <Input placeholder="promotion_detail" type="text" id={"promotion_detail"} name={"promotion_detail"} required />
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
                                                    <Input placeholder="discount_code" type="text" id={"discount_code"} name={"discount_code"} required />
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    ประเภทส่วนลด :
                                                    </Col>
                                                <Col lg="5" md="5" sm="5">
                                                    <Select options={promotion_type} name={"promotion_type"} required />
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    จำนวน :
                                                    </Col>
                                                <Col lg="4" md="4" sm="4">
                                                    <Input placeholder="number" type="text" id={"number"} name={"number"} />
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    จำนวนที่ซื้อ :
                                                    </Col>
                                                <Col lg="4" md="4" sm="4">
                                                    <Input placeholder="discount_giveaway_buy" type="text" id={"discount_giveaway_buy"} name={"discount_giveaway_buy"} />
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    จำนวนที่แถม :
                                                    </Col>
                                                <Col lg="4" md="4" sm="4">
                                                    <Input placeholder="discount_giveaway" type="text" id={"discount_giveaway"} name={"discount_giveaway"} />
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
                                                        onDayChange={this.handleDayChangeend.bind(this)}
                                                        value={this.state.enddate}
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
                                                    {/* <Input placeholder="promotion_code" type="hidden" id={"promotion_code"} name={"promotion_code"} required /> */}
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
// const mapStatetoProps = (state) => {
//     return {
//         member: state.member,
//     }
// }
// export default connect(mapStatetoProps)(HomeView);
export default (HomeView);