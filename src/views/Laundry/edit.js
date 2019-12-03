import React, { Component } from 'react';
import { Button, 
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
    Form ,
    FormGroup
} from 'reactstrap';

import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import AddressModel from '../../models/AddressModel'
import EntrepreneurModel from '../../models/EntrepreneurModel'
import LaundryModel from '../../models/LaundryModel'
import WashingMachineModel from '../../models/WashingMachineModel';
import ModelAddWashingMachine from './modelAddWashingMachine'
import ModelUpdateWashingMachine from './modelUpdateWashingMachine'
import ImgDefault from '../../assets/img/img_default.png'
import UploadModel from '../../models/UploadModel';
import GOBALS from '../../GOBALS'

const address_model = new AddressModel
const entrepreneur_model = new EntrepreneurModel
const laundry_model = new LaundryModel
const washing_wachine_model = new WashingMachineModel
const upload_model = new UploadModel()

class editView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            province: [],//province data
            entrepreneur:[],
            refresh: false,
            washing_wachine_list: [],
            laundry_data:[],
            imagePreviewUrl: '',
            file: null,
            selectedFile: null,
            laundry_img_old:""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setval = this.setval.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
        this.cellButton= this.cellButton.bind(this)
        
    }
//-------------------------------------------------------------------------- Upload Img //-------------------------------------------------------------
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

//--------------------------------------------------------------------------------------------------------------------------------------------------------//
    async componentDidMount() {
        const code = this.props.match.params.code
        var key = {
            entrepreneur_code: "",
            laundry_code: code,
            washing_machine_status: ""
        }
       
        const washing_wachine = await washing_wachine_model.getWashingMachineBy(key)
        const province = await address_model.getProvinceBy()//province data
        const laundry_data = await laundry_model.getLaundryByCode(code)
        const entrepreneur = await entrepreneur_model.getEntrepreneurBy()//province data
        console.log("laundry_data.data",laundry_data.data);

        this.setState({
            province: province.data, //ตัวที่เอาไปใช้ province
            entrepreneur: entrepreneur.data, //ตัวที่เอาไปใช้ province
            washing_wachine_list: washing_wachine.data,
            laundry_data:laundry_data.data
        })
        this.setval(laundry_data.data)

    }


    async setval(data) { //setdata edit
        document.getElementById('laundry_code').value = data.laundry_code
        document.getElementById('entrepreneur_code').value = data.entrepreneur_code
        document.getElementById('laundry_name_th').value = data.laundry_name_th
        document.getElementById('laundry_name_en').value = data.laundry_name_en
        document.getElementById('laundry_tel').value = data.laundry_tel

        if (data.province_id != null) {
            await this.getamphur(data.province_id)
            await this.getdistrict(data.amphur_id)

            document.getElementById('province_id').value = data.province_id
            document.getElementById('amphur_id').value = data.amphur_id
            document.getElementById('district_id').value = data.district_id
            document.getElementById('user_zipcode').value = data.user_zipcode
        }
        if (data.laundry_img != null) {
      
            document.getElementById('laundry_img_old').value = data.laundry_img
            this.setState({
                laundry_img_old : data.laundry_img
            })
          }
    }


    //------------------------------------------------------------------------------------------------------------------------------------------------------------//

    async getamphur(event) { //amphur data
        const id = event
        const amphur = await address_model.getAmphurInfoByProviceID(id)
        var data_amphur = amphur.data
        var data_select_amphur = [];
        for (let i = 0; i < data_amphur.length; i++) {
            data_select_amphur.push(
                <option value={data_amphur[i].amphur_id}>{data_amphur[i].amphur_name}</option>
            )
        }
        this.setState({
            amphur: data_select_amphur //ตัวที่เอาไปใช้ amphur
        })
    }

    async getdistrict(event) { //district data
        const id = event
        const district = await address_model.getDistrictInfoByAmphurID(id)
        var data_district = district.data
        var data_select_district = [];
        for (let i = 0; i < data_district.length; i++) {
            data_select_district.push(
                <option value={data_district[i].district_id}>{data_district[i].district_name}</option>
            )
        }
        this.setState({
            district: data_select_district //ตัวที่เอาไปใช้ district

        })
    }

    async getzipcode(event) { //zipcode data
        const id = event
        const zipcode = await address_model.getZipcodeByDistrictID(id)
        // console.log("zipcode", zipcode);
        document.getElementById("user_zipcode").value = zipcode.data.post_code //ให้ตัวแปล zipcode ใช้ data.post_code ที่มาจากดาต้าเบส

    }
//-------------------------------------------------------------------------------------------------------------------------------------------------------------//

    async handleSubmit(event) {
        event.preventDefault();

        const form = document.getElementById('myForm')
        const data = new FormData(form);
        const date_now = new Date();
        var toDay = date_now.getFullYear() + "" + (date_now.getMonth() + 1) + "" + date_now.getDate() + "" + date_now.getTime()
        var arr = {};

        for (let name of data.keys()) {
            arr[name] = form.elements[name.toString()].value;
        }
        arr['updateby'] = this.props.user.admin_code //เรียกใช้ addby ที่เป็นคนเพิ่มข้อมูล

        if (this.check(arr)) {

            if (this.state.selectedFile != null) {
                
                if (arr['laundry_img_old'] != "" && arr['laundry_img_old'] != null) {
                    var req = await upload_model.deleteImages(arr['laundry_img_old'], "laundry")
                    console.log("Delect :" + req);
                }
                
                arr['laundry_img'] = await this.fileUpload(this.state.selectedFile, 'laundry', form.elements['laundry_code'].value+"_"+toDay);
              } else {
                arr['laundry_img'] = arr['laundry_img_old']
              }
              
            var res = await laundry_model.updateLaundryBy(arr);

            if (res.data) {
                swal({
                    title: "Good job!",
                    text: "Update Laundry Ok",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/laundry/')
            }
        }
    }

    check(form) {

        if (form.laundry_code == '') {
            swal({
                text: "กรุณากรอก รหัสร้านซักผ้า/ Laundry Code",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.entrepreneur_code == '') {
            swal({
                text: "กรุณากรอก ผู้ประกอบการ/ Entrepreneur",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.laundry_name_th == '') {
            swal({
                text: "กรุณากรอก ชื่อ / th",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.laundry_name_en == '') {
            swal({
                text: "กรุณากรอก ชื่อ / EN",
                icon: "warning",
                button: "close",
            });
            return false
    
        } else if (form.province_id == '') {
            swal({
                text: "กรุณากรอก จังหวัด / Province",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.amphur_id == '') {
            swal({
                text: "กรุณากรอก อำเภอ / Amphur",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.district_id == '') {
            swal({
                text: "กรุณากรอก ตำบล / District",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.user_zipcode == '') {
            swal({
                text: "กรุณากรอก รหัสไปรษณีย์ / Zipcode",
                icon: "warning",
                button: "close",
            });
            return false
        } else {
            return true
        }

    }

    cellButton(cell, row, enumObject, rowIndex) {
       

        return (
            <>

                <NavLink exact to={`/washing-machine/detail/` + row.washing_machine_code} >
                    <Button type="button" size="sm" color="link" style={{ color: '#337ab7' }} >
                        <i class="fa fa-file-text-o" aria-hidden="true"></i>
                    </Button >
                </NavLink>
                <ModelUpdateWashingMachine 
                    refresh={() => this.setState({ refresh: true })} 
                    onReset={()=> this.onReset()}
                    washing_machine_code={row.washing_machine_code}
                    updateby={this.props.user.admin_code}
                />

                <Button type="button" size="sm" color="link" style={{ color: 'red' }} onClick={() => this.onDelete(row.washing_machine_code)}>
                    <i class="fa fa-times" aria-hidden="true"></i>
                </Button>

            </>
        )
    }

    cellStatus(cell, row, enumObject, rowIndex) {
        return (
            <>
                <p style={{ 
                    color: row.washing_machine_status == "ออนไลน์" ? "#4cae4c" 
                    :row.washing_machine_status == "ออฟไลน์"? "#f86c6b" 
                    :"#ffc107"
                    }}>{row.washing_machine_status}</p>
            </>
        )
    }

    onReset(){
        // console.log("Test");
        this.componentDidMount()
        
    }

    onUpdate =(data)=> {



    }

    render() {

        let province = this.state.province
        let province_address = [];
        var washing_wachine_list = this.state.washing_wachine_list
        var washing_wachine = []

        let { imagePreviewUrl } = this.state;
        let imagePreview = null;


        if (imagePreviewUrl) {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={imagePreviewUrl} />);
        } else {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={ImgDefault} />);
        }

        if (this.state.laundry_img_old != null && this.state.laundry_img_old != undefined && this.state.laundry_img_old != "" && !imagePreviewUrl) {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={GOBALS.URL_IMG + "laundry/" + this.state.laundry_img_old} />);
        }

        for (var i = 0; i < washing_wachine_list.length; i++) {

            washing_wachine.push(
                {
                    id: (i + 1),
                    washing_machine_code: washing_wachine_list[i].washing_machine_code,
                    washing_machine_name: washing_wachine_list[i].washing_machine_name,
                    washing_machine_generation: washing_wachine_list[i].washing_machine_generation,
                    washing_machine_brand: washing_wachine_list[i].washing_machine_brand,
                    washing_machine_status: washing_wachine_list[i].washing_machine_status,
                    queue_washing_machine: washing_wachine_list[i].queue_washing_machine,

                }
            )
        }

        for (let i = 0; i < province.length; i++) {
            province_address.push(
                <option value={province[i].province_id}>{province[i].province_name}</option>
            )
        }

        let entrepreneur = this.state.entrepreneur
        let entre = [];
        for (let i = 0; i < entrepreneur.length; i++) {
            entre.push(
                <option value={entrepreneur[i].entrepreneur_code}>{entrepreneur[i].entrepreneur_name_th}</option>
            )
        }


        const options = {
            page: 1,  // which page you want to show as default
            sizePerPageList: [{
                text: '20', value: 20
            }, {
                text: '40', value: 40
            }, {
                text: 'All', value: washing_wachine.length
            }], // you can change the dropdown list for size per page
            sizePerPage: 20,  // which size per page you want to locate as default
            prePage: 'Prev', // Previous page button text
            nextPage: 'Next', // Next page button text
            firstPage: 'First', // First page button text
            lastPage: 'Last', // Last page button text
            prePageTitle: 'Go to previous', // Previous page button title
            nextPageTitle: 'Go to next', // Next page button title
            firstPageTitle: 'Go to first', // First page button title
            lastPageTitle: 'Go to Last', // Last page button title
            paginationPosition: 'bottom'  // default is bottom, top and both is all available
        };

        // console.log("laundry_data + > ",this.state.laundry_data);
        
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <Form id="myForm">
                            <CardHeader>
                                แก้ไขข้อมูลร้านซักผ้า /  Edit Laundry
                                
                            </CardHeader>
                            <CardBody>

                                <Row>
                                    <Col lg="4" >
                                        <FormGroup style={{ textAlign: "center" }}>
                                            <div class="form-group files">
                                                <Col style={{ marginBottom: "15px" }}>
                                                    {imagePreview}
                                                </Col>
                                                <input type="file" class="form-control" multiple onChange={(e) => this.onChangeHandler(e)} />
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col lg="8">
                                        <br />
                                        <Row>
                                            <Col lg="6">
                                                <Label className="text_head"> รหัสร้านซักผ้า/ Laundry Code<font color='red'><b> * </b></font></Label>
                                                <Input type="hidden" id="laundry_img_old" name="laundry_img_old" class="form-control" readOnly ></Input>
                                                <Input type="text" id="laundry_code" name="laundry_code" class="form-control" readOnly value={this.state.laundry_code} ></Input>
                                                <p id="laundry_code_" className="text_head_sub">Example : LD0001</p>
                                            </Col>
                                            <br />
                                            <Col lg="6">
                                                <Label className="text_head"> ผู้ประกอบการ/ Entrepreneur<font color='red'><b> * </b></font></Label>
                                                <Input type="select" id="entrepreneur_code" name="entrepreneur_code" class="form-control">
                                                    <option value="">Select</option>
                                                    {entre}
                                                </Input>
                                                <p id="laundry_code_" className="text_head_sub">Example : revelsoft</p>
                                            </Col>
                                        </Row>
                                        <br />
                                        <Row>
                                            <Col lg="6">
                                                <Label className="text_head"> ชื่อ (ไทย)/ Name (Th)<font color='red'><b> * </b></font></Label>
                                                <Input type="text" id="laundry_name_th" name="laundry_name_th" class="form-control" autocomplete="off"></Input>
                                                <p id="laundry_name_th" className="text_head_sub">Example : revelsoft</p>
                                            </Col>
                                            <Col lg="6">
                                                <Label className="text_head"> ชื่อ (อังกฤษ)/ Name (En)<font color='red'><b> * </b></font></Label>
                                                <Input type="text" id="laundry_name_en" name="laundry_name_en" class="form-control"  ></Input>
                                                <p id="laundry_name_en" className="text_head_sub">Example : thailand</p>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <br />
                                <hr />
                                <br />
                                <Row>
                                    <Col lg="4">
                                        <Label className="text_head"> หมายเลขโทรศัพท์ </Label>
                                        <Input type="text" id="laundry_tel" name="laundry_tel" class="form-control"  ></Input>
                                        <p id="laundry_tel" className="text_head_sub">Example : 044-001-494</p>
                                    </Col>

                                </Row>

                                <Row>
                                    <Col lg="3">
                                        <Label className="text_head"> จังหวัด / Province<font color='red'><b> * </b></font></Label>
                                        <Input type="select" id="province_id" name="province_id" class="form-control" onChange={(event) => this.getamphur(event.target.value)}>
                                            <option value="">Select</option>
                                            {province_address}
                                        </Input>
                                        <p id="user_code" className="text_head_sub">Example : นคราชสีมา</p>
                                    </Col>
                                    <Col lg="3">
                                        <Label className="text_head"> อำเภอ / Amphur<font color='red'><b> * </b></font></Label>
                                        <Input type="select" id="amphur_id" name="amphur_id" class="form-control" onChange={(event) => this.getdistrict(event.target.value)}>
                                            <option value="">Select</option>
                                            {this.state.amphur}
                                        </Input>
                                        <p id="user_code" className="text_head_sub">Example : เมือง</p>
                                    </Col>
                                    <Col lg="3">
                                        <Label className="text_head"> ตำบล / District<font color='red'><b> * </b></font></Label>
                                        <Input type="select" id="district_id" name="district_id" class="form-control" onChange={(event) => this.getzipcode(event.target.value)}>
                                            <option value="">Select</option>
                                            {this.state.district}
                                        </Input>
                                        <p id="user_code" className="text_head_sub">Example : ในเมือง</p>
                                    </Col>
                                    <Col lg="3">
                                        <Label className="text_head"> รหัสไปรษณีย์ / Zipcode<font color='red'><b> * </b></font></Label>
                                        <Input type="text" id="user_zipcode" name="user_zipcode" class="form-control" readOnly ></Input>
                                        <p id="user_code" className="text_head_sub">Example : 30000</p>
                                    </Col>
                                </Row>
                                <br />
                                <hr />
                                <br />
                                <Col lg="12">
                                <Col lg="12" style={{marginBottom:"25px"}}>
                                        <Row>
                                            <Col>
                                                <h3> รายการเครื่องซักผ้า </h3>
                                            </Col>
                                          <Col md={{ span: 4, offset: 4 }}>
                                                {this.state.laundry_data != [] ? 

                                                <ModelAddWashingMachine 
                                                    refresh={() => this.setState({ refresh: true })} 
                                                    laundry={this.state.laundry_data}
                                                    admin_code={this.props.user.admin_code}     
                                                    onReset={()=> this.onReset()}
                                                />
                                                :""
                                           }
                                            </Col>
                                        </Row>
                                    </Col>
                                    
                                    <BootstrapTable
                                        data={washing_wachine}
                                        pagination={true}
                                        options={options}
                                    >
                                        <TableHeaderColumn width="5%" dataField='id' dataAlign='center' isKey={true}>No.</TableHeaderColumn>
                                        <TableHeaderColumn width="10%" dataField='washing_machine_code' headerAlign='center'>รหัสเครื่องซักผ้า </TableHeaderColumn>
                                        <TableHeaderColumn width="15%" dataField='washing_machine_name' headerAlign='center'>ชื่อเครื่องซักผ้า</TableHeaderColumn>
                                        <TableHeaderColumn width="15%" dataField='washing_machine_generation' headerAlign='center'>รุ่น</TableHeaderColumn>
                                        <TableHeaderColumn width="15%" dataField='washing_machine_brand' headerAlign='center'>แบรนด์</TableHeaderColumn>
                                        <TableHeaderColumn width="7%" dataField='washing_machine_status' dataAlign='center' dataFormat={this.cellStatus.bind(this)}>สถานะ</TableHeaderColumn>
                                        <TableHeaderColumn width="5%" dataField='queue_washing_machine' dataAlign='center'>คิว</TableHeaderColumn>
                                        <TableHeaderColumn width="10%" dataField='price' dataAlign='center' dataFormat={this.cellButton.bind(this)}></TableHeaderColumn>
                                    </BootstrapTable>
                                </Col>
                            </CardBody>
                            <CardFooter>
                                <Link to="/laundry/">
                                    <Button type="buttom" size="lg">Back</Button>
                                </Link>
                                <Button type="reset" size="lg" color="danger">Reset</Button>
                                <Button type="button" size="lg" color="success"  onClick={this.handleSubmit} >Save</Button>
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