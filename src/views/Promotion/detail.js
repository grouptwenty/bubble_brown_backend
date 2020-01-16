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
import ImgDefault from '../../assets/img/img_default.png'
import UploadModel from '../../models/UploadModel';
import GOBALS from '../../GOBALS';
import 'react-day-picker/lib/style.css';
var promotion_model = new PromotionModel();
var upload_model = new UploadModel();
const type = [
    { value: 'MNT01', label: 'เครื่องดื่ม' },
    { value: 'MNT02', label: 'อาหาร' },
    { value: 'MNT03', label: 'เบเกอร์รี่' },
];
const promotion_type = [
    { value: 'เปอร์เซ็น', label: 'เปอร์เซ็น' },
    { value: 'ส่วนลด', label: 'ส่วนลด' },
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
        this.goBack = this.goBack.bind(this);
    }
    goBack() {
        this.props.history.goBack();
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
            <Form id="myForm">
                <div className="animated fadeIn">
                    
                    <Row style={{ padding: '15px' }}>
                        <Col>
                            <Card>
                                <CardHeader>
                                    Detail Promotion
                                </CardHeader>
                                <CardBody>
                                    <Row style={{ padding: 20 }}>
                                        <Col lg="8">
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    ชื่อโปรโมชั่น :
                                                    </Col>
                                                <Col lg="10" md="10" sm="10">
                                                    <label>{this.state.promotion.promotion_header}</label>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    เงื่อนไข :
                                                    </Col>
                                                <Col lg="10" md="10" sm="10">
                                                    <label>{this.state.promotion.promotion_detail}</label>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    ประเภท :
                                                    </Col>
                                                <Col lg="10" md="10" sm="10">
                                                    <label>{this.state.promotion.menu_type_id}</label>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    โค๊ดโปรโมชั่น :
                                                    </Col>
                                                <Col lg="10" md="10" sm="10">
                                                    <label>{this.state.promotion.discount_code}</label>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    ประเภทส่วนลด :
                                                    </Col>
                                                <Col lg="10" md="10" sm="10">
                                                    <label>{this.state.promotion.promotion_type}</label>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    จำนวน :
                                                    </Col>
                                                <Col lg="10" md="10" sm="10">
                                                    {this.state.promotion.promotion_type == "เปอร์เซ็น" ?
                                                        <label>{this.state.promotion.discount_percent}</label>
                                                        : <label>{this.state.promotion.discount_price}</label>
                                                    }
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    จำนวนที่ซื้อ :
                                                    </Col>
                                                <Col lg="10" md="10" sm="10">
                                                    <label>{this.state.promotion.discount_giveaway_buy}</label>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    จำนวนที่แถม :
                                                    </Col>
                                                <Col lg="10" md="10" sm="10">
                                                    <label>{this.state.promotion.discount_giveaway}</label>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    วันที่เริ่ม :
                                                    </Col>
                                                <Col lg="10" md="10" sm="10">
                                                    <label>{this.state.promotion.startdate}</label>
                                                </Col>
                                            </Row>
                                            <Row className="center" style={{ marginBottom: 10 }}>
                                                <Col lg="2" md="2" sm="2" className="right" >
                                                    วันสิ้นสุด :
                                                    </Col>
                                                <Col lg="10" md="10" sm="10">
                                                    <label>{this.state.promotion.enddate}</label>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg="4">
                                            <FormGroup style={{ textAlign: "center" }}>
                                                <div class="form-group files">
                                                    <Col style={{ marginBottom: "15px" }}>
                                                        {imagePreview}
                                                    </Col>
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <NavLink exact to={'../../promotion/edit/' + this.state.promotion_code}>
                                        <button class="btn btn-warning btn-lg">แก้ไข</button>
                                    </NavLink>
                                    <Button variant="secondary" size="lg" onClick={this.goBack}>ย้อนกลับ</Button>
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
// }
// }
// export default connect(mapStatetoProps)(HomeView);
export default (HomeView);