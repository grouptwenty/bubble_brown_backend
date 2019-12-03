import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle, Input, Label, FormGroup, CardFooter, Form, Progress } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import axios from 'axios';
import GOBALS from '../../GOBALS'

import WashingMachineModel from '../../models/WashingMachineModel';
import AddressModel from '../../models/AddressModel';
import ImgDefault from '../../assets/img/img_default.png'
import EntrepreneurModel from '../../models/EntrepreneurModel'
import LaundryModel from '../../models/LaundryModel'

const laundry_model = new LaundryModel
const entrepreneur_model = new EntrepreneurModel
const washing_wachine_model = new WashingMachineModel
const address = new AddressModel
// getLaundryByEntrepreneurCode
class WashingMachineInsert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      admin_list: [],
      amphur: '',
      dcistrict: '',
      refresh: false,
      imagePreviewUrl: '',
      entrepreneur_list: [],
      file: '',
      str_laundry_list: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }




  async componentDidMount() {

    const max_code = await washing_wachine_model.getWashingMachineMaxCode()
    const entrepreneur_list = await entrepreneur_model.getEntrepreneurBy()

    console.log(max_code);

    this.setState({
      entrepreneur_list: entrepreneur_list.data,

    })
    console.log(" P", entrepreneur_list);
    document.getElementById("washing_machine_code").value = 'WS' + max_code.data.washing_machine_code_max;
  }

  async getLaundryList(entrepreneur_code) {

    const laundry_list = await laundry_model.getLaundryByEntrepreneurCode(entrepreneur_code)
    var data_laundy = laundry_list.data
    var str_laundy = []
    console.log(laundry_list);

    for (var i = 0; i < data_laundy.length; i++) {
      str_laundy.push(
        <option value={data_laundy[i].laundry_code}>{data_laundy[i].laundry_name_th.toString()}</option>
      )
    }
    this.setState({
      str_laundry_list: str_laundy
    })

  }


  async handleSubmit(event) {

    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);

    var arr = {};

    for (let name of data.keys()) {
      arr[name] = await form.elements[name.toString()].value;
    }
    arr['addby'] = this.props.user.admin_code
    arr['washing_machine_img'] = ""

    console.log(arr)

    // console.log(this.check(arr))

    if (this.check(arr)) {

      // if (this.state.file.length != 0) {
      //   arr["product_import_logo"] = this.state.file['name']//ชื่อรูป
      //   this.onClickHandler();
      // } else {
      //   arr["product_import_logo"] = ""
      // }

      var res = await washing_wachine_model.insertWashingMachineByCode(arr);

      if (res.data) {
        swal({
          title: "Good job!",
          text: "Insert Ok",
          icon: "success",
          button: "Close",
        });
        this.props.history.push('/washing-machine/')

      } else {
        swal({
          text: "Insert Error",
          icon: "error",
          button: "Close",
        });
      }
    }
  }


  checkMimeType = (event) => {
    let files = event.target.files
    let err = [] // create empty array
    const types = ['image/png', 'image/jpeg', 'image/gif']
    for (var x = 0; x < files.length; x++) {
      if (types.every(type => files[x].type !== type)) {
        err[x] = files[x].type + ' is not a supported format\n';
        // assign message to array
      }
    };
    for (var z = 0; z < err.length; z++) { // loop create toast massage
      event.target.value = null
      toast.error(err[z])
    }
    return true;
  }

  //A
  maxSelectFile = (event) => {
    let files = event.target.files // create file object
    if (files.length > 3) {
      const msg = 'Only 3 images can be uploaded at a time'
      event.target.value = null // discard selected file
      console.log(msg)
      return false;
    }
    return true;
  }
  checkFileSize = (event) => {
    let files = event.target.files
    let size = 2000000
    let err = [];
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err[x] = files[x].type + 'is too large, please pick a smaller file\n';
      }
    };
    for (var z = 0; z < err.length; z++) {
      toast.error(err[z])
      event.target.value = null
    }
    return true;
  }

  onClickHandler = () => {
    const data = new FormData()
    for (var x = 0; x < this.state.selectedFile.length; x++) {
      data.append('file', this.state.selectedFile[x])
    }
    data.append('file', this.state.selectedFile)
    axios.post(GOBALS.URL_UPLOAD, data, {
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
        })
      },
    })
      .then(res => {
        toast.success('upload success')
      })
      .catch(err => {
        toast.error('upload fail')
      })
  }

  check(form) {
    console.log(form)

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
      // } else if (form.washing_machine_detail == "") {

      //   swal({
      //     text: "กรุณาใส่รายละเอียด / Please Enter Detail",
      //     icon: "warning",
      //     button: "Close",
      //   });
      //   return false
    } else {
      return true
    }

  }

  _handleImageChange(e) {
    e.preventDefault();
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

  render() {
    var srt_entrepreneur = []
    var data_entrepreneur = this.state.entrepreneur_list
    let { imagePreviewUrl } = this.state;
    let imagePreview = null;
    console.log("ddd", imagePreview);

    if (imagePreviewUrl) {
      imagePreview = (<img className="responsive" style={{ width: '100%' }} src={imagePreviewUrl} />);
    } else {
      imagePreview = (<img className="responsive" style={{ width: '100%' }} src={ImgDefault} />);
    }

    for (var i = 0; i < data_entrepreneur.length; i++) {
      srt_entrepreneur.push(
        <option value={data_entrepreneur[i].entrepreneur_code} >{data_entrepreneur[i].entrepreneur_name_th.toString()}</option>
      )
    }




    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <Form onSubmit={this.handleSubmit} id="myForm">
                <CardHeader>
                  เพิ่มเครื่องซักผ้า
                                    {/* <NavLink exact to={`/sale/sale-order/insert`} style={{ width: '100%' }}>
                    <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i> Add</button>
                  </NavLink> */}
                </CardHeader>
                <CardBody>
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
                              <input type="file" class="form-control" multiple onChange={(e) => this._handleImageChange(e)} />
                            </div>
                          </FormGroup>
                        </Col>
                        <Col lg="8" style={{ paddingRight: "0px", paddingLeft: "0px" }}>

                          <Col lg="12" style={{ paddingRight: "0px", paddingLeft: "0px", marginBottom: "30px" }}>
                            <Row>
                              <Col lg="6">
                                <FormGroup>
                                  <Label>รหัสเครื่องซักผ้า / Washing Machine Code </Label>
                                  <Input type="hidden" id="washing_machine_img_old" name="washing_machine_img_old" class="form-control" readOnly />
                                  <Input type="text" id="washing_machine_code" name="washing_machine_code" class="form-control" readOnly />
                                  <p id="alert_admin_code" class="help-block">Example :WS000000.</p>
                                </FormGroup>
                              </Col>
                              <Col lg="6">
                                <FormGroup>
                                  <Label>หมายเลขเครื่องซักผ้า / Washing Machine No. <font color="#F00"><b>*</b></font></Label>
                                  <Input type="text" id="washing_machine_no" name="washing_machine_no" class="form-control" />
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
                                  <Input type="text" id="washing_machine_name" name="washing_machine_name" class="form-control" />
                                  <p class="help-block">Example : เครื่องซักผ้า 1.</p>
                                </FormGroup>
                              </Col>
                              <Col lg="6">
                                <FormGroup>
                                  <Label>	แบรนด์เครื่องซักผ้า / Washing Machine Brand <font color="#F00"><b>*</b></font></Label>
                                  <Input type="text" id="washing_machine_brand" name="washing_machine_brand" class="form-control" />
                                  <p class="help-block">Example : samsung .</p>
                                </FormGroup>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg="12" style={{ paddingRight: "0px", paddingLeft: "0px", marginBottom: "30px" }}>

                            <Row>
                              <Col lg="6">
                                <FormGroup>
                                  <Label>ผู้ประกอบการ	 / Entrepreneur <font color="#F00"><b>*</b></font></Label>
                                  <Input
                                    type="select"
                                    id="admin_prefix"
                                    name="admin_prefix"
                                    class="form-control"
                                    onChange={(event) => this.getLaundryList(event.target.value)}
                                  >
                                    <option value="">Select</option>
                                    {srt_entrepreneur}
                                  </Input>
                                  <p class="help-block">Example : Revelsoft.</p>
                                </FormGroup>
                              </Col>
                              <Col lg="6">
                                <FormGroup>
                                  <Label>ร้านซักผ้า / Laundry <font color="#F00"><b>*</b></font></Label>
                                  <Input type="select" id="laundry_code" name="laundry_code" class="form-control">
                                    <option value="">Select</option>
                                    {this.state.str_laundry_list}
                                  </Input>
                                  <p class="help-block">Example : ร้านซักผ้า.</p>
                                </FormGroup>
                              </Col>
                            </Row>
                          </Col>
                        </Col>
                      </Row>
                    </Col>

                  </Row>
                  <Row lg="12" style={{ marginBottom: "30px" }}>
                    <Col lg="6">
                      <FormGroup>
                        <Label> รายละเอียด / Detail </Label>
                        <Input id="washing_machine_detail" name="washing_machine_detail" type="text" class="form-control" />
                        <p class="help-block">Example :.</p>
                      </FormGroup>
                    </Col>
                    {/* <Col lg="3">
                      <FormGroup>
                        <Label>โทรศัพท์ / Mobile </Label>
                        <Input type="text" id="admin_mobile" name="admin_mobile" class="form-control" />
                        <p class="help-block">Example : 0610243003.</p>
                      </FormGroup>
                    </Col>
                    <Col lg="3">
                      <FormGroup>
                        <Label>ยูสเซอร์ / adminname <font color="#F00"><b>*</b></font></Label>
                        <Input type="text" id="admin_username" name="admin_username" class="form-control" />
                        <p id="alert_admin_adminname" class="help-block">Example : thana.</p>
                      </FormGroup>
                    </Col> */}

                  </Row>
                </CardBody>
                <CardFooter>

                  <Link to="/admin/">
                    <Button type="buttom" size="lg" > Back </Button>
                  </Link>
                  <Button type="reset" size="lg" color="danger"> Reset</Button>
                  <Button type="submit" size="lg" color="success">Save</Button>
                </CardFooter>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStatetoProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStatetoProps)(WashingMachineInsert);