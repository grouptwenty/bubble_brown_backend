import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle, Input, Label, FormGroup, CardFooter, Form, Progress } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import axios from 'axios';
import GOBALS from '../../GOBALS'
import UploadModel from '../../models/UploadModel';
import AdminModel from '../../models/AdminModel';
import AddressModel from '../../models/AddressModel';
import ImgDefault from '../../assets/img/img_default.png'
var md5 = require("md5");

const admin_model = new AdminModel
const address = new AddressModel
const upload_model = new UploadModel()

class AdminInsert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      admin_list: [],
      province_list: [],
      amphur: '',
      dcistrict: '',
      refresh: false,
      imagePreviewUrl: '',
      file: null,
      selectedFile: null,
      admin_img_old: "",
      admin_password_old: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setVal = this.setVal.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
    this.onDeleteImg = this.onDeleteImg.bind(this)
  }




  async componentDidMount() {
    const code = this.props.match.params.code
    const province_list = await address.getProvinceBy();
    const admin_data = await admin_model.getAdminbyCode(code)
    console.log("props = >", admin_data);
    this.setState({
      province_list: province_list.data,
      admin_list: admin_data.data
    })
    this.setVal(admin_data.data)


  }


  async setVal(data) {
    // console.log(" P", data);

    document.getElementById('admin_code').value = data.admin_code
    document.getElementById('admin_prefix').value = data.admin_prefix
    document.getElementById('admin_name').value = data.admin_name
    document.getElementById('admin_lastname').value = data.admin_lastname
    document.getElementById('admin_email').value = data.admin_email
    document.getElementById('admin_mobile').value = data.admin_mobile
    document.getElementById('admin_username').value = data.admin_username
    document.getElementById('admin_password').value = data.admin_password

    if (data.province_id != null) {
      document.getElementById('province_id').value = data.province_id
      await this.getAmphur(data.province_id)
      document.getElementById('amphur_id').value = data.amphur_id
      await this.getDistrict(data.amphur_id)
      document.getElementById('district_id').value = data.district_id
      document.getElementById("admin_zipcode").value = data.admin_zipcode;
    }

    if (data.admin_img != null) {
      console.log("null ", data.admin_img);

      document.getElementById('admin_img_old').value = data.admin_img
      this.setState({
        admin_img_old: data.admin_img
      })
    }

    await this.setState({
      admin_password_old: data.admin_password
    })
  }


  async fileUpload(file, page, _code) {

    const formData = new FormData();
    var res = file.name.split(".");
    formData.append('_code', _code);
    formData.append('file_type', '.' + res[res.length - 1]);
    formData.append('upload_url', page);
    formData.append('files', file);

    var res_upload = await upload_model.uploadImages(formData);
    var arr = {};

    // for (let name of formData.keys()) {
    //   console.log("LLL => ", name.toString()); 
    // }

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
  ///------------------------------------------------- Address ---------------------------------------------------------------------//
  async getAmphur(event) {

    const id = event
    const amphur = await address.getAmphurInfoByProviceID(id);
    var data_select_amphur = amphur.data
    var str_amphur = [];
    for (var i = 0; i < data_select_amphur.length; i++) {
      str_amphur.push(
        <option value={data_select_amphur[i].amphur_id}>{data_select_amphur[i].amphur_name.toString()}</option>
      )
    }
    this.setState({
      amphur: str_amphur
    })
  }

  async getDistrict(event) {
    const id = event
    const dcistrict = await address.getDistrictInfoByAmphurID(id);
    const data_select_dcistrict = dcistrict.data
    var str_dcistrict = [];
    for (var i = 0; i < data_select_dcistrict.length; i++) {
      str_dcistrict.push(
        <option value={data_select_dcistrict[i].district_id} >{data_select_dcistrict[i].district_name.toString()}</option>
      )
    }
    this.setState({
      dcistrict: str_dcistrict
    })
  }


  async getZipCode(event) {
    const id = event
    const data_user_zipcode = await address.getZipcodeByDistrictID(id);
    document.getElementById("admin_zipcode").value = data_user_zipcode.data.post_code;
    console.log("id = ", data_user_zipcode);
  }



  ///------------------------------------------------- Save ---------------------------------------------------------------------//


  async handleSubmit(event) {

    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const date_now = new Date();
    var toDay = date_now.getFullYear() + "" + (date_now.getMonth() + 1) + "" + date_now.getDate() + "" + date_now.getTime()

    var arr = {};

    for (let name of data.keys()) {
      arr[name] = await form.elements[name.toString()].value;
    }

    // arr['admin_password'] = await md5(arr['admin_password']);
    arr['updateby'] = this.props.user.admin_code
    // console.log(arr['admin_password'] == this.state.admin_password_old);
    // console.log(this.state.admin_password_old);
    // console.log(arr['admin_password']);
    // arr['admin_img'] = await this.fileUpload(this.state.selectedFile, 'admin', form.elements['admin_code'].value + "_" + toDay);

    console.log(" arr['admin_img'] ", arr['admin_img']);


    if (this.check(arr)) {

      if (this.state.selectedFile != null) {

        if (arr['admin_img_old'] != "" && arr['admin_img_old'] != null) {
          var req = await upload_model.deleteImages(arr['admin_img_old'], "admin")
        }
        arr['admin_img'] = await this.fileUpload(this.state.selectedFile, 'admin', form.elements['admin_code'].value + "_" + toDay);

      } else {

        arr['admin_img'] = arr['admin_img_old']

      }
      if (arr['admin_password'] != this.state.admin_password_old) {
        arr['admin_password'] = await md5(arr['admin_password']);
      }
      var res = await admin_model.updateAdminBy(arr);

      if (res.data) {
        swal({
          title: "Good job!",
          text: "Insert Ok",
          icon: "success",
          button: "Close",
        });
        this.props.history.push('/admin/')

      } else {
        swal({
          text: "Insert Error",
          icon: "error",
          button: "Close",
        });
      }
    }
  }
  onDeleteImg = (images_name) => {

    const formData = new FormData();
    formData.append('images_name', images_name)
    upload_model.deleteImages(formData)


    return true;
  }
  //-------------------------------------------------------- Upload ----------------------------------------------------------------------//
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
  //----------------------------------------------------------------- check -----------------------------------------------------------------------------------//

  check(form) {

    if (form.admin_code == "") {

      swal({
        text: "กรุณาใส่รหัสพนักงาน / Please Enter Employee Code",
        icon: "warning",
        button: "Close",
      });

      return false
    } else if (form.admin_prefix == "") {
      swal({
        text: "กรุณาใส่คำนำหน้าชื่อ / Please Enter Prename",
        icon: "warning",
        button: "Close",
      });
      return false
    } else if (form.admin_name == "") {

      swal({
        text: "กรุณาใส่ชื่อ / Please Enter Name",
        icon: "warning",
        button: "Close",
      });
      return false
    } else if (form.admin_lastname == "") {

      swal({
        text: "กรุณาใส่นามสกุล / Please Enter Lastname",
        icon: "warning",
        button: "Close",
      });
      return false
    } else if (form.admin_username == "") {

      swal({
        text: "กรุณาใส่ยูสเซอร์ / Please Enter Username",
        icon: "warning",
        button: "Close",
      });
      return false
    } else if (form.admin_password == "") {

      swal({
        text: "กรุณาใส่รหัสผ่าน / Please Enter Password",
        icon: "warning",
        button: "Close",
      });
      return false
    } else if (form.admin_address == "") {

      swal({
        text: "กรุณาใส่ที่อยู่ / Please Enter Address",
        icon: "warning",
        button: "Close",
      });
      return false
    } else if (form.province_id == "") {

      swal({
        text: "กรุณาใส่จังหวัด / Please Enter Province",
        icon: "warning",
        button: "Close",
      });
      return false
    } else if (form.amphur_id == "") {
      swal({
        text: "กรุณาใส่อำเภอ / Please Enter Amphur",
        icon: "warning",
        button: "Close",
      });
      return false
    } else if (form.district_id == "") {

      swal({
        text: "กรุณาใส่ตำบล / Please Enter Distict",
        icon: "warning",
        button: "Close",
      });
      return false
    } else if (form.admin_zipcode == "") {

      swal({
        text: "กรุณาใส่เลขไปรษณีย์ / Please Enter Zipcode",
        icon: "warning",
        button: "Close",
      });
      return false
    } else {
      return true
    }

  }
  //---------------------------------------------------------- Select Img ----------------------------------------------------------------------------------***

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

  //----------------------------------------------------------------------------------------------------------------------------------------------------------------

  render() {
    var srt_province = []
    var data_province = this.state.province_list
    let { imagePreviewUrl } = this.state;
    let imagePreview = null;


    if (imagePreviewUrl) {
      imagePreview = (<img className="responsive" style={{ width: '100%' }} src={imagePreviewUrl} />);
    } else {
      imagePreview = (<img className="responsive" style={{ width: '100%' }} src={ImgDefault} />);
    }

    if (this.state.admin_img_old != null && this.state.admin_img_old != undefined && this.state.admin_img_old != "" && !imagePreviewUrl) {
      imagePreview = (<img className="responsive" style={{ width: '100%' }} src={GOBALS.URL_IMG + "admin/" + this.state.admin_img_old} />);

    }



    for (var i = 0; i < data_province.length; i++) {
      srt_province.push(
        <option value={data_province[i].province_id} >{data_province[i].province_name.toString()}</option>
      )
    }




    return (
      <div className="animated fadeIn">
        {/* <img className="responsive" style={{ width: '100%' }} src={GOBALS.URL_IMG+"admin/A0002.jpg"} /> */}
        <Row>
          <Col>
            <Card>
              <Form onSubmit={this.handleSubmit} id="myForm">
                <CardHeader>
                  เเก้ไขผู้ดูเเลระบบ
                                    {/* <NavLink exact to={`/sale/sale-order/insert`} style={{ width: '100%' }}>
                                        <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i> Add</button>
                                    </NavLink> */}
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg="12" style={{ marginBottom: "30px" }}>
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
                            <FormGroup>
                              <Label>รหัสผู้ดูเเลระบบ / Admin Code </Label>
                              <Input type="hidden" id="admin_img_old" name="admin_img_old" class="form-control" readOnly />
                              <Input type="text" id="admin_code" name="admin_code" class="form-control" readOnly />
                              <p id="alert_admin_code" class="help-block">Example : A0001.</p>
                            </FormGroup>
                          </Col>

                          <Col lg="12" style={{ paddingRight: "0px", paddingLeft: "0px" }}>
                            <Row>
                              <Col lg="3">
                                <FormGroup>
                                  <Label>คำนำหน้าชื่อ / Prename <font color="#F00"><b>*</b></font></Label>
                                  <Input type="select" id="admin_prefix" name="admin_prefix" class="form-control">
                                    <option value="">Select</option>
                                    <option value="นาย">นาย</option>
                                    <option value="นาง">นาง</option>
                                    <option value="นางสาว">นางสาว</option>
                                  </Input>
                                  <p class="help-block">Example : นาย.</p>
                                </FormGroup>
                              </Col>
                              <Col lg="4">
                                <FormGroup>
                                  <Label>ชื่อ / Name <font color="#F00"><b>*</b></font></Label>
                                  <Input type="text" id="admin_name" name="admin_name" class="form-control" />
                                  <p class="help-block">Example : วินัย.</p>
                                </FormGroup>
                              </Col>
                              <Col lg="4">
                                <FormGroup>
                                  <Label>นามสกุล / Lastname <font color="#F00"><b>*</b></font></Label>
                                  <Input type="text" id="admin_lastname" name="admin_lastname" class="form-control" />
                                  <p class="help-block">Example : ชาญชัย.</p>
                                </FormGroup>
                              </Col>
                            </Row>
                          </Col>
                        </Col>
                      </Row>
                    </Col>

                  </Row>
                  <Row lg="12" style={{ marginBottom: "30px" }}>
                    <Col lg="3">
                      <FormGroup>
                        <Label> อีเมล์ / Email </Label>
                        <Input id="admin_email" name="admin_email" type="email" class="form-control" />
                        <p class="help-block">Example : admin@arno.co.th.</p>
                      </FormGroup>
                    </Col>
                    <Col lg="3">
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
                    </Col>
                    <Col lg="3">
                      <FormGroup>
                        <Label>รหัสผ่าน / Password <font color="#F00"><b>*</b></font></Label>
                        <Input id="admin_password" name="admin_password" type="password" class="form-control" />
                        <p id="alert_admin_password" class="help-block">Example : thanaadmin.</p>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row lg="12" style={{ marginBottom: "30px" }}>
                    <Col lg="3">
                      <FormGroup>
                        <Label>จังหวัด / Province <font color="#F00"><b>*</b></font> </Label>
                        <Input
                          type="select"
                          id="province_id"
                          name="province_id"
                          data-live-search="true"
                          class="form-control select"
                          onChange={(event) => this.getAmphur(event.target.value)}
                        >
                          <option value="">Select</option>
                          {srt_province}
                        </Input>
                        <p class="help-block">Example : นครราชสีมา.</p>
                      </FormGroup>
                    </Col>

                    <Col lg="3">
                      <FormGroup>
                        <Label>อำเภอ / Amphur <font color="#F00"><b>*</b></font> </Label>
                        <Input
                          type="select"
                          id="amphur_id"
                          name="amphur_id"
                          data-live-search="true"
                          class="form-control select"
                          onChange={(event) => this.getDistrict(event.target.value)}
                        >
                          <option value="">Select</option>
                          {this.state.amphur}
                        </Input>
                        <p class="help-block">Example : เมือง.</p>
                      </FormGroup>
                    </Col>

                    <Col lg="3">
                      <FormGroup>
                        <Label>ตำบล / Distict <font color="#F00"><b>*</b></font> </Label>
                        <Input
                          type="select"
                          id="district_id"
                          name="district_id"
                          data-live-search="true"
                          class="form-control select"
                          onChange={(event) => this.getZipCode(event.target.value)}
                        >
                          <option value="">Select</option>
                          {this.state.dcistrict}
                        </Input>
                        <p class="help-block">Example : ในเมือง.</p>
                      </FormGroup>
                    </Col>

                    <Col lg="3">
                      <FormGroup>
                        <Label>เลขไปรษณีย์ / Zipcode <font color="#F00"><b>*</b></font> </Label>
                        <input id="admin_zipcode" name="admin_zipcode" type="text" class="form-control" readOnly />
                        <p class="help-block">Example : 30000.</p>
                      </FormGroup>
                    </Col>
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

export default connect(mapStatetoProps)(AdminInsert);