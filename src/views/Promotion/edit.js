// import React, { Component } from 'react';
// import { Media, Button, InputGroup, Form, Input, Table, Card, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
// import { connect } from 'react-redux';
// import Select from 'react-select';
// import swal from 'sweetalert';
// import JournalModel from '../../../models/JournalModel';
// import GOBALS from '../../../GOBALS';
// import UploadModel from '../../../models/UploadModel';
// var journal_model = new JournalModel();
// var upload_model = new UploadModel();
// const month = [
//     { value: 'January', label: 'January' },
//     { value: 'February', label: 'February' },
//     { value: 'March', label: 'March' },
//     { value: 'April', label: 'April' },
//     { value: 'May', label: 'May' },
//     { value: 'June', label: 'June' },
//     { value: 'July', label: 'July' },
//     { value: 'August', label: 'August' },
//     { value: 'September', label: 'September' },
//     { value: 'October', label: 'October' },
//     { value: 'November', label: 'November' },
//     { value: 'December', label: 'December' },
// ];
// class HomeView extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             data: [],
//             refresh: false,
//             selectedFile: null,
//             file: null,
//             journal: [],
//             row_img: [],
//             fileSelected: false
//         };
//         this.onChangeHandler = this.onChangeHandler.bind(this)
//         this.SaveCoverPage = this.SaveCoverPage.bind(this)
//         this.goBack = this.goBack.bind(this);
//     }
//     goBack() {
//         this.props.history.goBack();
//     }
//     onChangeHandler = e => {
//         let reader = new FileReader();
//         let file = e.target.files[0];
//         let files = e.target.files;
//         var today = new Date();
//         var time_now = today.getTime();
//         this.setState({
//             time_now: time_now,
//         })
//         const name = time_now + "-" + file.name;
//         file = new File([file], name, { type: files.type });
//         console.log('files', file);
//         if (file != undefined) {
//             reader.onloadend = () => {
//                 this.setState({
//                     file: file,
//                     imagePreviewUrl: reader.result,
//                     selectedFile: file,

//                 });
//             }
//             reader.readAsDataURL(file);
//         }
//         this.componentDidMount();
//     }
//     async componentDidMount() {
//         var jounal_code = this.props.match.params.code;
//         const journal = await journal_model.getJournalByCol({ 'journal_code': jounal_code });
//         console.log("journal", journal.data[0])
//         this.setState({
//             journal: journal.data[0]
//         });

//         console.log("setState", this.state.journal.journal_year);
//     }
//     async fileUpload(file, page, _code) {
//         const formData = new FormData();
//         var res = file.name.split(".");
//         formData.append('_code', _code);
//         formData.append('file_type', '.' + res[res.length - 1]);
//         formData.append('upload_url', page);
//         formData.append('files', file);
//         var res_upload = await upload_model.uploadFile(formData);
//         console.log(res_upload);
//         var data_update = {
//             journal_file_path: res_upload.data[0].comment_photo_url
//         }
//         var data_where = {
//             journal_code: _code
//         }
//         var res_update = journal_model.updateCoverPage(data_update, data_where);
//         return res_upload;
//     }
//     async SaveCoverPage(event) {
//         event.preventDefault();
//         const form = event.target;
//         var arr = { addby: this.props.member.member_code };
//         arr['journal_year'] = form.elements['journal_year'].value;
//         arr['journal_vol'] = form.elements['journal_vol'].value;
//         arr['journal_no'] = form.elements['journal_no'].value;
//         arr['journal_month'] = form.elements['journal_month'].value;
//         var where = {
//             journal_code: this.props.match.params.code
//         }
//         console.log("where", where);
//         var res = await journal_model.updateCoverPage(arr, where);
//         if (res.query_result) {
//             if (this.state.imagePreviewUrl) {
//                 await upload_model.fileDelete(this.state.journal.journal_file_path);
//                 await this.fileUpload(this.state.selectedFile, 'CoverPage', this.props.match.params.code);
//             }

//             swal({
//                 title: "Good job!",
//                 text: "Insert Position  Ok",
//                 icon: "success",
//                 button: "Close",
//             });
//             this.props.history.push('/admin/coverpage');
//         } else {
//             swal({
//                 title: "Error !",
//                 text: "Insert Position Error ",
//                 icon: "error",
//                 button: "Close",
//             });
//         }
//     }
//     render() {
//         let { imagePreviewUrl } = this.state;
//         let $imagePreview = null;
//         if (imagePreviewUrl) {
//             $imagePreview = (<img className="Imgesupload" style={{ width: '100%' }} src={imagePreviewUrl} />);
//         } else {
//             $imagePreview = (<img className="Imgesupload" style={{ width: '100%' }} src={GOBALS.URL_IMG + this.state.journal.journal_file_path} />);
//         }
//         return (
//             <Form onSubmit={this.SaveCoverPage} id="myForm">
//                 <div className="animated fadeIn">
//                     <h2>Cover Page</h2>
//                     <hr />
//                     <Row>
//                         <Col>
//                             <Card>
//                                 <CardHeader>
//                                     Insert Coverpage
//                                 </CardHeader>
//                                 <CardBody>
//                                     <Row style={{ padding: 20 }}>
//                                         <Col llg="12">
//                                             <Row className="center" style={{ marginBottom: 10 }}>
//                                                 <Col lg="2" md="2" sm="2" className="right" >
//                                                     Year :
//                                                     </Col>
//                                                 <Col lg="4" md="4" sm="4">
//                                                     <Input placeholder="Suranaree university of Technology" type="text" id={"journal_year"} name={"journal_year"} defaultValue={this.state.journal.journal_year} required />
//                                                 </Col>
//                                                 <Col lg="6" md="6" sm="6">
//                                                 </Col>
//                                             </Row>
//                                             <Row className="center" style={{ marginBottom: 10 }}>
//                                                 <Col lg="2" md="2" sm="2" className="right" >
//                                                     Month :
//                                                     </Col>
//                                                 <Col lg="4" md="4" sm="4">
//                                                     {this.state.journal.journal_month ?
//                                                         <Select options={month} value={{ value: this.state.journal.journal_month, label: this.state.journal.journal_month }} name={"journal_month"} />
//                                                         : null}
//                                                 </Col>
//                                                 <Col lg="6" md="6" sm="6">
//                                                 </Col>
//                                             </Row>
//                                             <Row className="center" style={{ marginBottom: 10 }}>
//                                                 <Col lg="2" md="2" sm="2" className="right" >
//                                                     Volume :
//                                                     </Col>
//                                                 <Col lg="4" md="4" sm="4">
//                                                     <Input placeholder="Suranaree university of Technology" type="text" id={"journal_vol"} name={"journal_vol"} defaultValue={this.state.journal.journal_vol} required />
//                                                 </Col>
//                                                 <Col lg="6" md="6" sm="6">
//                                                 </Col>
//                                             </Row>
//                                             <Row className="center" style={{ marginBottom: 10 }}>
//                                                 <Col lg="2" md="2" sm="2" className="right" >
//                                                     Number :
//                                                     </Col>
//                                                 <Col lg="4" md="4" sm="4">
//                                                     <Input placeholder="15" type="text" id={"journal_no"} name={"journal_no"} defaultValue={this.state.journal.journal_no} required />
//                                                 </Col>
//                                                 <Col lg="6" md="6" sm="6">
//                                                 </Col>
//                                             </Row>
//                                             <Row className="center" style={{ marginBottom: 10 }}>
//                                                 <Col lg="2" md="2" sm="2" className="right">
//                                                     Cover Page :
//                                                 </Col>
//                                                 <Col lg="5" md="5" sm="5">
//                                                     <Input type="file" name="file" onChange={this.onChangeHandler} />
//                                                 </Col>
//                                                 <Col lg="5" md="5" sm="5">
//                                                 </Col>
//                                             </Row>
//                                             {/* {this.state.row_img} */}
//                                             <Row>
//                                                 <Col lg="2" md="2" sm="2" className="right"></Col>
//                                                 <Col lg="5" md="5" sm="5">
//                                                     {$imagePreview}
//                                                 </Col>
//                                                 <Col lg="5" md="5" sm="5"></Col>
//                                             </Row>
//                                             <Row className="center" style={{ marginTop: '5%' }}>
//                                                 <Button className="btn btn-success" type="submit" color="primary">Save</Button>
//                                                 <Button variant="secondary" onClick={this.goBack}>Close</Button>
//                                             </Row>
//                                         </Col>
//                                     </Row>
//                                 </CardBody>
//                             </Card>
//                         </Col>
//                     </Row>
//                 </div>
//             </Form>
//         )
//     }
// }
// const mapStatetoProps = (state) => {
//     return {
//         member: state.member,
//     }
// }
// export default connect(mapStatetoProps)(HomeView);