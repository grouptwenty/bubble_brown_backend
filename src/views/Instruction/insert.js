import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem,FormGroup, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Input, Label, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';

import ImgDefault from '../../assets/img/img_default.png'
import UploadModel from '../../models/UploadModel';


import InstructionModel from '../../models/InstructionModel'
const instruction_model = new InstructionModel
const upload_model = new UploadModel()

class insertView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            imagePreviewUrl: '',
            file: null,
            selectedFile: null,
            refresh: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this)

    }


    async componentDidMount() {

        
        const max_code = await instruction_model.getInstructionMaxCode()
        
  
        console.log("max_code", max_code);

        document.getElementById("instruction_code").value = 'IST' + max_code.data.instruction_code_max

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
        arr['addby'] = this.props.user.admin_code 

        if (this.state.selectedFile != null) {
            arr['instruction_img'] = await this.fileUpload(this.state.selectedFile, 'instruction', form.elements['instruction_code'].value+"_"+toDay);
        } 
        // console.log(this.check(arr))
        if (this.check(arr)) {
            var res = await instruction_model.insertInstructionBy(arr);
            //   console.log(res)
              if (res.data) {
                swal({
                  title: "Good job!",
                  text: "Add Instruction Ok",
                  icon: "success",
                  button: "Close",
                });
                this.props.history.push('/instruction/')
              }
        }
    }

    check(form) {
        console.log("form", form);

        if (form.instruction_code == '') {
            swal({
                text: "กรุณากรอก  รหัสวิธีใช้งาน / Instruction Code",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.instruction_title_th == '') {
            swal({
                text: "หัวข้อ (TH)",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.instruction_title_en == '') {
            swal({
                text: "หัวข้อ (EN)",
                icon: "warning",
                button: "close",
            });
            return false
        } else if (form.instruction_description_th == '') {
            swal({
                text: "กรุณากรอก รายละเอียด (TH)",
                icon: "warning",
                button: "close",
            });
            return false
    
        } else if (form.instruction_description_en == '') {
            swal({
                text: "กรุณากรอก รายละเอียด (EN)",
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
        console.log("ddd", imagePreviewUrl);


        if (imagePreviewUrl) {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={imagePreviewUrl} />);
        } else {
            imagePreview = (<img className="responsive" style={{ width: '100%' }} src={ImgDefault} />);
        }

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                            <CardHeader>
                                เพิ่มข้อมูลวิธีการใช้งาน/  Insert Instruction
                                
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
                                            <Col lg="6">
                                                <Label className="text_head"> รหัสวิธีใช้งาน/ Instruction Code<font color='red'><b> * </b></font></Label>
                                                <Input type="hidden" id="user_profile_img" name="user_profile_img" class="form-control" readOnly ></Input>
                                                <Input type="text" id="instruction_code" name="instruction_code" class="form-control" readOnly ></Input>
                                                <p id="instruction_code" className="text_head_sub">Example : IST01</p>
                                            </Col>
                                            <br />
                                            
                                        </Row>
                                        <br />
                                        <Row>
                                            <Col lg="6">
                                                <Label className="text_head"> หัวข้อ (TH)<font color='red'><b> * </b></font></Label>
                                                <Input type="text" id="instruction_title_th" name="instruction_title_th" class="form-control" style={{height:50}}></Input>
                                           
                                            </Col>
                                            <Col lg="6">
                                                <Label className="text_head"> หัวข้อ (EN)<font color='red'><b> * </b></font></Label>
                                                <Input type="text" id="instruction_title_en" name="instruction_title_en" class="form-control" style={{height:50}} ></Input>
                                             
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <br />
                                <hr />
                               
                                <Row>
                                    <Col lg="6">
                                        <Label className="text_head"> รายละเอียด (TH)<font color='red'><b> * </b></font> </Label>
                                        <textarea type="text" id="instruction_description_th" name="instruction_description_th" class="form-control" style={{height:200}} ></textarea>
                                    </Col>
                                    <Col lg="6">
                                        <Label className="text_head"> รายละเอียด (EN) <font color='red'><b> * </b></font></Label>
                                        <textarea type="text" id="instruction_description_en" name="instruction_description_en" class="form-control"  style={{height:200}}></textarea>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter>
                                <Link to="/instruction/">
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

export default connect(mapStatetoProps)(insertView);