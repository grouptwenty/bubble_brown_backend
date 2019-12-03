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
import LaundryModel from '../../models/LaundryModel'
import EntrepreneurModel from '../../models/EntrepreneurModel'
import ModelAddWashingMachine from './modelAddWashingMachine'
import ImgDefault from '../../assets/img/img_default.png'
import UploadModel from '../../models/UploadModel';

const entrepreneur_model = new EntrepreneurModel
const address_model = new AddressModel
const laundry_model = new LaundryModel
const upload_model = new UploadModel

class insertView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            province: [],
            entrepreneur: [],
            refresh: false ,
            washing_wachine :[],
            show_data:[],
            imagePreviewUrl: '',
            file: null,
            selectedFile: null,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setValueWashingWachine = this.setValueWashingWachine.bind(this);
        this.fileUpload = this.fileUpload.bind(this)
        this.onChangeHandler = this.onChangeHandler.bind(this)
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

    async componentDidMount() {

        const province = await address_model.getProvinceBy()
        const max_code = await laundry_model.getLaundryMaxCode()
        const entrepreneur = await entrepreneur_model.getEntrepreneurBy()

        document.getElementById("laundry_code").value = 'LD' + max_code.data.laundry_code_max

        this.setState({
            province: province.data, 
            entrepreneur: entrepreneur.data 

        })
    }

    async setValueWashingWachine(data){

        var tme = []
        
        // {
        //     washing_machine_code :"" ,
        //     laundry_code :"",
        //     washing_machine_name:"",
        //     washing_machine_no:"",
        //     washing_machine_generation:"",
        //     washing_machine_brand:"",
        //     washing_machine_img :"",
        //     washing_machine_detail:"",
        //     washing_machine_type :"",
        //     addby :"",
        // }

        this.setState({
            show_data: tme
        })
        
    }

    
    async getamphur(event) { 
        const id = event.target.value
        const amphur = await address_model.getAmphurInfoByProviceID(id)
        var data_amphur = amphur.data
        var data_select_amphur = [];
        for (let i = 0; i < data_amphur.length; i++) {
            data_select_amphur.push(
                <option value={data_amphur[i].amphur_id}>{data_amphur[i].amphur_name}</option>
            )
        }
        this.setState({
            amphur: data_select_amphur 
        })
    }

    async getdistrict(event) { 
        const id = event.target.value
        const district = await address_model.getDistrictInfoByAmphurID(id)
        var data_district = district.data
        var data_select_district = [];
        for (let i = 0; i < data_district.length; i++) {
            data_select_district.push(
                <option value={data_district[i].district_id}>{data_district[i].district_name}</option>
            )
        }
        this.setState({
            district: data_select_district 
        })
    }

    async getzipcode(event) { 
        const id = event.target.value
        const zipcode = await address_model.getZipcodeByDistrictID(id)
        document.getElementById("user_zipcode").value = zipcode.data.post_code 

    }

    async handleSubmit(event) {
        event.preventDefault();
        var myForm = document.getElementById('myForm')    
        const form = event.target;
        const data = new FormData(form);
        const date_now = new Date();
        var toDay = date_now.getFullYear() + "" + (date_now.getMonth() + 1) + "" + date_now.getDate() + "" + date_now.getTime()
        var arr = {};

        for (let name of data.keys()) {
            arr[name] = form.elements[name.toString()].value;
        }
        arr['addby'] = this.props.user.admin_code 
        arr['laundry_img'] =""

      
        
        if (this.check(arr)) {
            if (this.state.selectedFile != null) {
                arr['laundry_img'] = await this.fileUpload(this.state.selectedFile, 'laundry', form.elements['laundry_code'].value +"_"+toDay);
              }
            var res = await laundry_model.insertLaundryBy(arr);

              if (res.data) {
                swal({
                  title: "Good job!",
                  text: "Add laundry Ok",
                  icon: "success",
                  button: "Close",
                });
                this.props.history.push('/laundry/edit/'+arr['laundry_code'])
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


    render() {

        let entrepreneur = this.state.entrepreneur
        let entre = [];
        var washing_wachine = this.state.washing_wachine
        let { imagePreviewUrl } = this.state;
        let imagePreview = null;
    
        if (imagePreviewUrl) {
          imagePreview = (<img className="responsive" style={{ width: '100%' }} src={imagePreviewUrl} />);
        } else {
          imagePreview = (<img className="responsive" style={{ width: '100%' }} src={ImgDefault} />);
        }


        for (let i = 0; i < entrepreneur.length; i++) {
            entre.push(
                <option value={entrepreneur[i].entrepreneur_code}>{entrepreneur[i].entrepreneur_name_th}</option>
            )
        }

        let province = this.state.province
        let province_address = [];
        for (let i = 0; i < province.length; i++) {
            province_address.push(
                <option value={province[i].province_id}>{province[i].province_name}</option>
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
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                            <CardHeader>
                                เพิ่มข้อมูลร้านซักผ้า/  Insert Laundry
                                
                            </CardHeader>
                            <CardBody>

                                <Row>
                                    <Col lg="4" >
                                        <FormGroup style={{ textAlign: "center" }}>
                                            <div class="form-group files">
                                                <Col style={{ marginBottom: "15px" }}>
                                                    {imagePreview}
                                                </Col>
                                                <input type="file" class="form-control" multiple onChange={this.onChangeHandler} name="laundry_img" />
                                            </div>
                                        </FormGroup>   
                                    </Col>
                                    <Col lg="8">
                                        <br />
                                        <Row>
                                            <Col lg="6">
                                                <Label className="text_head"> รหัสร้านซักผ้า/ Laundry Code<font color='red'><b> * </b></font></Label>
                                                <Input type="hidden" id="user_profile_img" name="user_profile_img" class="form-control" readOnly ></Input>
                                                <Input type="text" id="laundry_code" name="laundry_code" class="form-control" readOnly ></Input>
                                                <p id="laundry_code" className="text_head_sub">Example : LD0001</p>
                                            </Col>
                                            <br />
                                            <Col lg="6">
                                                <Label className="text_head"> ผู้ประกอบการ/ Entrepreneur<font color='red'><b> * </b></font></Label>
                                                <Input type="select" id="entrepreneur_code" name="entrepreneur_code" class="form-control">
                                                    <option value="">Select</option>
                                                    {entre}
                                                </Input>
                                                <p id="laundry_code" className="text_head_sub">Example : revelsoft</p>
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
                                        <Input type="select" id="province_id" name="province_id" class="form-control" onChange={(event) => this.getamphur(event)}>
                                            <option value="">Select</option>
                                            {province_address}
                                        </Input>
                                        <p id="user_code" className="text_head_sub">Example : นคราชสีมา</p>
                                    </Col>
                                    <Col lg="3">
                                        <Label className="text_head"> อำเภอ / Amphur<font color='red'><b> * </b></font></Label>
                                        <Input type="select" id="amphur_id" name="amphur_id" class="form-control" onChange={(event) => this.getdistrict(event)}>
                                            <option value="">Select</option>
                                            {this.state.amphur}
                                        </Input>
                                        <p id="user_code" className="text_head_sub">Example : เมือง</p>
                                    </Col>
                                    <Col lg="3">
                                        <Label className="text_head"> ตำบล / District<font color='red'><b> * </b></font></Label>
                                        <Input type="select" id="district_id" name="district_id" class="form-control" onChange={(event) => this.getzipcode(event)}>
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
{/* 
                                <Col lg="12">
                                    <Col lg="12" style={{marginBottom:"25px"}}>
                                        <Row>
                                            <Col>
                                                <h3> รายการเครื่องซักผ้า </h3>
                                            </Col>
                                          <Col md={{ span: 4, offset: 4 }}>
                                          <ModelAddWashingMachine refresh={() => this.setState({ refresh: true })} />
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
                                        <TableHeaderColumn width="7%" dataField='washing_machine_status' dataAlign='center' >สถานะ</TableHeaderColumn>
                                        <TableHeaderColumn width="5%" dataField='queue_washing_machine' dataAlign='center'>คิว</TableHeaderColumn>
                                        <TableHeaderColumn width="10%" dataField='price' dataAlign='center' ></TableHeaderColumn>
                                    </BootstrapTable>
                                </Col> */}
                            </CardBody>
                            <CardFooter>
                                <Link to="/laundry/">
                                    <Button type="buttom" size="lg">Back</Button>
                                </Link>
                                <Button type="reset" size="lg" color="danger">Reset</Button>
                                <Button type="submit " size="lg" color="success" name="button_save" >Save</Button>
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
        washing_wachine: state.washing_wachine
    }
}

export default connect(mapStatetoProps)(insertView);