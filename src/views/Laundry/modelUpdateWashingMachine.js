import React, { Component } from 'react';
import {
    Button,
    Table,
    Card,
    Pagination,
    PaginationLink,
    PaginationItem,
    CardHeader,
    Col,
    Row,
    CardImg,
    CardBody,
    CardTitle,
    FormGroup,
    Input,
    Label,
    Form

} from 'reactstrap';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import AdminModel from '../../models/AdminModel';
import WashingMachineModel from '../../models/WashingMachineModel';
import AddressModel from '../../models/AddressModel';
import ImgDefault from '../../assets/img/img_default.png'
import EntrepreneurModel from '../../models/EntrepreneurModel'
import LaundryModel from '../../models/LaundryModel'
import swal from 'sweetalert';
import UploadModel from '../../models/UploadModel';
import GOBALS from '../../GOBALS'

const laundry_model = new LaundryModel
const entrepreneur_model = new EntrepreneurModel
const washing_wachine_model = new WashingMachineModel
const admin_model = new AdminModel
const upload_model = new UploadModel
class ModelAddWashingMachine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            admin_list: [],
            refresh: false,
            show: false,
            imagePreviewUrl: '',
            entrepreneur_list: [],
            file: '',
            str_laundry_list: [],
            washing_machine_code: "",
            laundry_data: null,
            entrepreneur_code: "",
            washing_machine_brand: "",
            washing_machine_detail: "",
            washing_machine_generation: "",
            washing_machine_img: "",
            washing_machine_img_old: "",
            washing_machine_name: "",
            washing_machine_no: "",
            washing_machine_status: "",
            washing_machine_type: "",
            entrepreneur_code: "",
            laundry_code: ""

        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.appDataByRedux = this.appDataByRedux.bind(this);
        this.refreshModel = this.refreshModel.bind(this);
        this.fileUpload = this.fileUpload.bind(this)
    }


    async componentDidMount() {
        const code = this.props.washing_machine_code
        var data = {
            washing_machine_code: code
        }

        const entrepreneur_list = await entrepreneur_model.getEntrepreneurBy()
        const laundry = await washing_wachine_model.getWashingMachineBy(data)
        const laundry_data = await laundry.data[0]
        await this.getLaundryList(laundry_data.entrepreneur_code)

        this.setState({
            entrepreneur_list: entrepreneur_list.data,
            washing_machine_code: this.props.washing_machine_code,
            washing_machine_detail: laundry_data.washing_machine_detail,
            washing_machine_generation: laundry_data.washing_machine_generation,
            washing_machine_img_old: laundry_data.washing_machine_img,
            washing_machine_name: laundry_data.washing_machine_name,
            washing_machine_no: laundry_data.washing_machine_no,
            washing_machine_status: laundry_data.washing_machine_status,
            washing_machine_type: laundry_data.washing_machine_type,
            washing_machine_brand: laundry_data.washing_machine_brand,
            entrepreneur_code: laundry_data.entrepreneur_code,
            laundry_code: laundry_data.laundry_code,
        })
    }

    async getLaundryList(entrepreneur_code) {

        const laundry_list = await laundry_model.getLaundryByEntrepreneurCode(entrepreneur_code)
        var data_laundy = laundry_list.data
        var str_laundy = []

        for (var i = 0; i < data_laundy.length; i++) {
            str_laundy.push(
                <option value={data_laundy[i].laundry_code}>{data_laundy[i].laundry_name_th.toString()}</option>
            )
        }
        this.setState({
            str_laundry_list: str_laundy
        })
    }


    async refreshModel() {
        this.setState({
            laundry_data: this.props.laundry
        })
    }

    async appDataByRedux() {
        var data = this.props.washing_machine
    }

    async handleSubmit(event) {
        event.preventDefault();

        var myFormModal = document.getElementById('myFormModal')
        const form = myFormModal;
        const data = new FormData(form);
        const date_now = new Date();
        var toDay = date_now.getFullYear() + "" + (date_now.getMonth() + 1) + "" + date_now.getDate() + "" + date_now.getTime()

        var arr = {};

        for (let name of data.keys()) {
            arr[name] = await form.elements[name.toString()].value;
        }

        arr['updateby'] = this.props.updateby
        arr['washing_machine_img'] = ""
        arr['washing_machine_code'] = this.state.washing_machine_code
        if (this.check(arr)) {

            if (this.state.selectedFile != null) {
                if (this.state.instruction_img_old != "" && this.state.instruction_img_old != null) {
                    var req = await upload_model.deleteImages(this.state.washing_machine_img_old, "washing_machine")
                    console.log("Delect :" + req);
                }
                arr['washing_machine_img'] = await this.fileUpload(this.state.selectedFile, 'washing_machine', form.elements['washing_machine_code'].value + "_" + toDay);
            } else {
                arr['washing_machine_img'] = this.state.washing_machine_img_old
            }


            var res = await washing_wachine_model.updateWashingMachineByCode(arr);
            if (res.data) {
                swal({
                    title: "Good job!",
                    text: "Insert Ok",
                    icon: "success",
                    button: "Close",
                });
                this.props.onReset();
                this.handleClose()
            } else {
                swal({
                    text: "Insert Error",
                    icon: "error",
                    button: "Close",
                });
            }
        }
    }

    check(form) {

        if (form.washing_machine_code == "") {

            swal({
                text: "กรุณาใส่รหัสเครื่องซักผ้า / Please Enter Washing Machine Code",
                icon: "warning",
                button: "Close",
            });

            return false
        } else if (form.washing_machine_no == "") {
            swal({
                text: "กรุณาใส่หมายเลขเครื่องซักผ้า / Please Enter Washing Machine No.",
                icon: "warning",
                button: "Close",
            });
            return false
        } else if (form.washing_machine_name == "") {

            swal({
                text: "กรุณาใส่ชื่อครื่องซักผ้า / Please Enter Washing Machine Name",
                icon: "warning",
                button: "Close",
            });
            return false
        } else if (form.washing_machine_brand == "") {

            swal({
                text: "กรุณาใส่แบรนด์เครื่องซักผ้า / Please Enter Washing Machine Brand",
                icon: "warning",
                button: "Close",
            });
            return false
        } else if (form.laundry_code == "") {

            swal({
                text: "กรุณาใส่ร้านซักผ้า / Please Enter Username",
                icon: "warning",
                button: "Close",
            });
            return false
        } else {
            return true
        }
    }
    async fileUpload(file, page, _code) {
        const formData = new FormData();
        var res = file.name.split(".");
        formData.append('_code', _code);
        formData.append('file_type', '.' + res[res.length - 1]);
        formData.append('upload_url', page);
        formData.append('files', file);
        var res_upload = await upload_model.uploadImages(formData);

        return res_upload.data.photo_url;
    }

    onChangeHandler = event => {
        let reader = new FileReader();
        let file = event.target.files[0];

        if (file != undefined) {
            reader.onloadend = () => {
                this.setState({
                    selectedFile: file,
                    loaded: 0,
                    imagePreviewUrl: reader.result,
                });
            }
            reader.readAsDataURL(file)
        }
    }


    handleClose() {
        this.setState({ show: false });
        this.props.refresh();

    }

    handleShow() {
        this.componentDidMount()
        this.refreshModel()
        this.setState({ show: true });
        this.props.onReset();
    }


    render() {
        let entrepreneur = this.state.entrepreneur_list
        var srt_entrepreneur = []
        var laundry_data = this.state.laundry_data
        var laundry_list = []
        let { imagePreviewUrl } = this.state;
        let imagePreview = null;


        if (imagePreviewUrl) {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={imagePreviewUrl} />);
        } else {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={ImgDefault} />);
        }

        if (this.state.washing_machine_img_old != null && this.state.washing_machine_img_old != undefined && this.state.washing_machine_img_old != "" && !imagePreviewUrl) {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={GOBALS.URL_IMG + "washing_machine/" + this.state.washing_machine_img_old} />);
        }

        if (laundry_data != null) {
            srt_entrepreneur.push(
                <option value={laundry_data.entrepreneur_code} >{laundry_data.entrepreneur_name_th.toString()}</option>
            )

            laundry_list.push(
                <option value={laundry_data.laundry_code}>{laundry_data.laundry_name_th.toString()}</option>
            )
        }
        for (let i = 0; i < entrepreneur.length; i++) {
            srt_entrepreneur.push(
                <option value={entrepreneur[i].entrepreneur_code}>{entrepreneur[i].entrepreneur_name_th}</option>
            )
        }


        return (
            <>
                <Modal
                    size="lg"
                    style={{ marginTop: "3%", marginBottom: "8%", marginLeft: "3%", marginRight: "8%" }}
                    show={this.state.show}
                >
                    <Form id="myFormModal">
                        {/* onSubmit={this.handleSubmit} */}
                        <Modal.Header closeButton>
                            <Modal.Title>เเก้ไขเครื่องซักผ้า</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <Col xs="12" sm="12">
                                <Row>
                                    <Col lg="12" >
                                        <Row>
                                            <Col lg="4">
                                                <FormGroup style={{ textAlign: "center" }}>
                                                    <div class="form-group files">
                                                        <Col style={{ marginBottom: "15px" }}>
                                                            {imagePreview}
                                                        </Col>
                                                        {/* <ToastContainer />
                            <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded, 2)}%</Progress> */}
                                                        <input type="file" class="form-control" multiple onChange={(e) => this.onChangeHandler(e)} />
                                                    </div>
                                                </FormGroup>
                                            </Col>
                                            <Col lg="8" style={{ paddingRight: "0px", paddingLeft: "0px" }}>

                                                <Col lg="12" style={{ paddingRight: "0px", paddingLeft: "0px", marginBottom: "30px" }}>
                                                    <Row>
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label>รหัสเครื่องซักผ้า / Washing Machine Code </Label>
                                                                <Input
                                                                    type="hidden"
                                                                    id="washing_machine_img_old"
                                                                    name="washing_machine_img_old"
                                                                    class="form-control"
                                                                    defaultValue={this.state.washing_machine_img_old}
                                                                    readOnly
                                                                />
                                                                <Input
                                                                    type="text"
                                                                    id="washing_machine_code"
                                                                    name="washing_machine_code"
                                                                    class="form-control"
                                                                    defaultValue={this.state.washing_machine_code}
                                                                    readOnly
                                                                />
                                                                <p id="alert_admin_code" class="help-block">Example :WS000000.</p>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label>หมายเลขเครื่องซักผ้า / Washing Machine No. <font color="#F00"><b>*</b></font></Label>
                                                                <Input
                                                                    type="text"
                                                                    id="washing_machine_no"
                                                                    name="washing_machine_no"
                                                                    class="form-control"
                                                                    defaultValue={this.state.washing_machine_no}
                                                                />
                                                                <p class="help-block">Example : 1 </p>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Col>

                                                <Col lg="12" style={{ paddingRight: "0px", paddingLeft: "0px", marginBottom: "30px" }}>
                                                    <Row>
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label>ชื่อครื่องซักผ้า / Washing Machine Name <font color="#F00"><b>*</b></font></Label>
                                                                <Input
                                                                    type="text"
                                                                    id="washing_machine_name"
                                                                    name="washing_machine_name"
                                                                    class="form-control"
                                                                    defaultValue={this.state.washing_machine_name}
                                                                />
                                                                <p class="help-block">Example : เครื่องซักผ้า 1.</p>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label>	รุ่นเครื่องซักผ้า / Washing Machine Generation <font color="#F00"><b>*</b></font></Label>
                                                                <Input
                                                                    type="text"
                                                                    id="washing_machine_generation"
                                                                    name="washing_machine_generation"
                                                                    class="form-control"
                                                                    defaultValue={this.state.washing_machine_generation}
                                                                />
                                                                <p class="help-block">Example : TX-0000001 .</p>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col lg="12" style={{ paddingRight: "0px", paddingLeft: "0px", marginBottom: "30px" }}>

                                                    <Row>
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label>	แบรนด์เครื่องซักผ้า / Washing Machine Brand <font color="#F00"><b>*</b></font></Label>
                                                                <Input
                                                                    type="text"
                                                                    id="washing_machine_brand"
                                                                    name="washing_machine_brand"
                                                                    class="form-control"
                                                                    defaultValue={this.state.washing_machine_brand}
                                                                />
                                                                <p class="help-block">Example : samsung .</p>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col lg="6">
                                                            <FormGroup>
                                                                <Label>ชนิดเครื่องซักผ้า /  Washing Machine Type <font color="#F00"><b>*</b></font></Label>
                                                                <Input type="select"
                                                                    id="washing_machine_type"
                                                                    name="washing_machine_type"
                                                                    class="form-control"
                                                                    defaultValue={this.state.washing_machine_type}
                                                                >
                                                                    <option value="">Select</option>
                                                                </Input>
                                                                <p class="help-block">Example : เครื่องซักผ้าฝาหน้า.</p>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row lg="12" style={{ marginBottom: "30px" }}>

                                    <Col lg="4">
                                        <Label>ผู้ประกอบการ	 / Entrepreneur <font color="#F00"><b>*</b></font></Label>
                                        {this.state.entrepreneur_code != "" ?
                                            <Input
                                                type="select"
                                                id="entrepreneur_code"
                                                name="entrepreneur_code"
                                                class="form-control"
                                                defaultValue={this.state.entrepreneur_code}
                                            >
                                                <option value="" >select</option>
                                                {srt_entrepreneur}
                                            </Input>
                                            : ""
                                        }
                                        <p class="help-block">Example : Revelsoft.</p>
                                    </Col>
                                    <Col lg="4">
                                        <FormGroup>
                                            <Label>ร้านซักผ้า / Laundry <font color="#F00"><b>*</b></font></Label>
                                            {this.state.laundry_code != "" ?
                                                <Input
                                                    type="select"
                                                    id="laundry_code"
                                                    name="laundry_code"
                                                    class="form-control"
                                                    defaultValue={this.state.laundry_code}
                                                >

                                                    {this.state.str_laundry_list}
                                                </Input>
                                                : ""
                                            }
                                            <p class="help-block">Example : ร้านซักผ้า.</p>
                                        </FormGroup>
                                    </Col>
                                    <Col lg="4">
                                        <FormGroup>
                                            <Label>สถานะเครื่อง / Washing Machine Status <font color="#F00"><b>*</b></font></Label>
                                            {this.state.washing_machine_status != "" ?
                                                <Input
                                                    type="select"
                                                    id="washing_machine_status"
                                                    name="washing_machine_status"
                                                    class="form-control"
                                                    defaultValue={this.state.washing_machine_status}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="กำลังทำงาน">กำลังทำงาน</option>
                                                    <option value="ว่าง">ว่าง</option>
                                                </Input>
                                                : ""}
                                            <p class="help-block">Example : ร้านซักผ้า.</p>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row lg="12">
                                    <Col lg="12">
                                        <FormGroup>
                                            <Label> รายละเอียด / Detail </Label>
                                            <Input id="washing_machine_detail" name="washing_machine_detail" type="text" class="form-control" va />
                                            <p class="help-block">Example :.</p>
                                        </FormGroup>
                                    </Col>
                                </Row>

                            </Col>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" size="sm" onClick={this.handleClose}>Close</Button>
                            <Button type="button" size="sm" color="success" onClick={this.handleSubmit} >Save</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>

                <Button
                    type="button"
                    size="sm"
                    color="link"
                    style={{ color: '#337ab7' }}
                    onClick={this.handleShow}
                >
                    <i class='fa fa-pencil-square-o' ></i>
                </Button >

            </>
        )
    }
}

const mapStatetoProps = (state) => {
    return {
    }
}
const mapDispatchtoProps = (dispatch) => {
    return {
        setWashingMachine: (data) => {
            dispatch({
                type: "setWashingMachine",
                payload: data
            })
        },
        clearWashingMachine: () => {
            dispatch({
                type: "clearWashingMachine",

            })
        },
    }
}
export default connect(mapStatetoProps, mapDispatchtoProps)(ModelAddWashingMachine);