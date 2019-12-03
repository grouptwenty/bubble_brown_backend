import React, { Component } from 'react';
import {
    Button,
    Table,
    Card,
    Pagination,
    PaginationLink,
    PaginationItem,
    CardHeader,
    CardFooter,
    Col,
    Row,
    CardImg,
    CardBody,
    CardTitle,
    Input,
    Label,
    Form
} from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import WashingMachineModel from '../../models/WashingMachineModel';
import ImgDefault from '../../assets/img/img_default.png'
import GOBALS from '../../GOBALS'
const washing_wachine_model = new WashingMachineModel

class detailView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            repair_detail: [],
            refresh: false,
            washing_wachine: null
        };
    }


    async componentDidMount() {

        var key = {
            washing_machine_code: this.props.match.params.code,
        }
        var washing_wachine = await washing_wachine_model.getWashingMachineBy(key)


        this.setState({
            washing_wachine: washing_wachine.data[0]
        })

    }


    render() {
        var { washing_wachine } = this.state
        var washing_machine_brand = ""
        var washing_machine_code = ""
        var washing_machine_detail = ""
        var washing_machine_generation = ""
        var washing_machine_img = ""
        var washing_machine_name = ""
        var washing_machine_no = ""
        var washing_machine_status = ""
        var washing_machine_type = ""
        var washing_machine_type_name = ""
        var entrepreneur_name_th = ""
        var laundry_name_th = ""
        var imagePreview = ""
        if (washing_wachine != null) {

            washing_machine_brand = washing_wachine.washing_machine_brand
            washing_machine_code = washing_wachine.washing_machine_code
            washing_machine_detail = washing_wachine.washing_machine_detail
            washing_machine_generation = washing_wachine.washing_machine_generation

            washing_machine_name = washing_wachine.washing_machine_name
            washing_machine_no = washing_wachine.washing_machine_no
            washing_machine_status = washing_wachine.washing_machine_status
            washing_machine_type = washing_wachine.washing_machine_type
            washing_machine_type_name = washing_wachine.washing_machine_type_name
            entrepreneur_name_th = washing_wachine.entrepreneur_name_th
            laundry_name_th = washing_wachine.laundry_name_th

            if (washing_wachine.washing_machine_img != null && washing_wachine.washing_machine_img != "") {

                imagePreview = (<img className="responsive" style={{ width: '100%' }} src={GOBALS.URL_IMG + "washing_machine/" + washing_wachine.washing_machine_img} />);


            } else {
                imagePreview = (<img className="responsive" style={{ width: '100%' }} src={ImgDefault} />);

            }

        }

        console.log(" washing_wachine :", washing_wachine);




        return (
            <div className="animated fadeIn" >
                <Row>
                    <Col>
                        <h2> รายละเอียดเครื่องซักผ้า / WashingMachine Detail</h2>
                        <hr />
                        <br />
                        <Card>
                            <CardHeader>
                                <h4>ข้อมูลเครื่องซักผ้า / WashingMachine infomation</h4>
                            </CardHeader>
                            <CardBody>

                                <Row>
                                    <Col lg="4" >
                                        <Label className="text_head"> <p>รหัสเครื่องซักผ้า</p></Label> <a style={{ marginLeft: 15, color: '#555' }}>{washing_machine_code}</a>
                                    </Col>

                                    <Col lg="4">
                                        <Label className="text_head"> <p>ชื่อเครื่องซักผ้า</p></Label><a style={{ marginLeft: 15, color: '#555' }}>{washing_machine_name}</a>
                                    </Col>

                                    <Col lg="4">
                                        <Label className="text_head"> <p>หมายเลขเครื่องซักผ้า</p></Label><a style={{ marginLeft: 15, color: '#555' }}>{washing_machine_no}</a>
                                    </Col>

                                </Row>


                                <Row>
                                    <Col lg="4">
                                        <Label className="text_head"> <p>รุ่นเครื่องซักผ้า </p></Label><a style={{ marginLeft: 30, color: '#555' }}>{washing_machine_generation}</a>
                                    </Col>
                                    <Col lg="4">
                                        <Label className="text_head"> <p>แบรนด์เครื่องซักผ้า </p></Label><a style={{ marginLeft: 45, color: '#555' }}>{washing_machine_brand}</a>
                                    </Col>
                                    <Col lg="4">
                                        <Label className="text_head"> <p>ชนิดเครื่องซักผ้า </p></Label><a style={{ marginLeft: 25, color: '#555' }}>{washing_machine_type_name}</a>
                                    </Col>
                                </Row>
                                <Col lg="12" style={{ paddingLeft: "10px" }}>
                                    <Row>
                                        <Col lg="8" style={{ paddingLeft: "0px" }}>
                                            <Row>
                                                <Col lg="6" style={{ paddingRight: "0px" }}>
                                                    <Label className="text_head"> <p>ผู้ประกอบการ </p></Label> <a style={{ marginLeft: 15, color: '#555' }}>{entrepreneur_name_th}</a>
                                                </Col>
                                                <Col lg="4" style={{ paddingLeft: "20px" }}>
                                                    <Label className="text_head"> <p>ร้านซักผ้า </p></Label><a style={{ marginLeft: 25, color: '#555' }}>{laundry_name_th}</a>
                                                </Col>

                                            </Row>
                                            <br />
                                            <Row>
                                                <Col lg="6">
                                                    <Label className="text_head"> <p>สถานะเครื่อง </p></Label><a style={{ marginLeft: 25, color: '#555' }}>{washing_machine_status}</a>
                                                </Col>
                                                <Col lg="6">
                                                    <Label className="text_head"> รายละเอียด </Label><p style={{ color: '#555', marginTop: 5 }}> {}</p>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg="4">
                                            {imagePreview}
                                        </Col>
                                    </Row>
                                </Col>
                            </CardBody>
                            <CardFooter>

                                <Button
                                    type="buttom"
                                    size="lg"
                                    onClick={() => this.props.history.goBack()}
                                >
                                    Back
                                </Button>


                            </CardFooter>
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

export default connect(mapStatetoProps)(detailView);