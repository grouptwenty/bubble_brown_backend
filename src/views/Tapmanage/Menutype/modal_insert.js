import React, { Component } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, FormFeedback, FormText } from 'reactstrap';
import 'react-day-picker/lib/style.css';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import MenuTypeModel from '../../../models/MenuTypeModel';
var menu_type_model = new MenuTypeModel;

class InsertMenuTypeModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      refresh: false,
      data: []
    }
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.SaveMenuType = this.SaveMenuType.bind(this);
  }
  async componentDidMount() {

  }
  handleClose() {
    this.setState({ show: false });
    this.props.refresh();
  }
  handleShow() {
    this.setState({ show: true });
  }
  async SaveMenuType(event) {
    if (this.state.menu_type_validate == 'INVALID') {
      swal("This name already exists.", {
        icon: "error",
      });
      event.preventDefault();
    } else {
      event.preventDefault();
      const form = event.target;
      var arr = {};

      arr['menu_type_name'] = form.elements['menu_type_name'].value;
      arr['about_code'] = this.props.user.about_code;
      // console.log("xxx",data)
      console.log("xxx", arr)
      var res = await menu_type_model.insertMenuType(arr);
      if (res.query_result) {
        swal({
         
          text: "เพิ่มประเภทเมนูสำเร็จ !",
          icon: "success",
          button: "Close",
        });
        this.handleClose()
      } else {
        swal({
          title: "มีบางอย่างผิดพลาด",
          text: "เพิ่มประเภทเมนูสำเร็จ !",
          icon: "error",
          button: "Close",
        });
      }
    }
  }
  onMenuTypeChange(event) {
    const menu_type_name = event.target.value;
    menu_type_model.getMenuTypeByCol({ 'menu_type_name': menu_type_name }).then((responseJson) => {
      console.log('MenuTypennn', responseJson);
      if (responseJson.data.length == 0) {
        this.setState({
          menu_type_validate: "VALID",
        })
        console.log("VALID : ", menu_type_name);
      } else {
        this.setState({
          menu_type_validate: "INVALID",
          menu_type_validate_text: "This name already exists.",
        })
        console.log("INVALID : ", menu_type_name);
      }
      this.render();
    });
  }
  render() {
    return (
      <>
        <Modal
          size="sm"
          style={{ marginTop: "8%", marginBottom: "8%" }}
          show={this.state.show}
        >
          <Form onSubmit={this.SaveMenuType} id="myForm">
            <Modal.Header closeButton>
              <Modal.Title>เพิ่มแท็บประเภทเมนู</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col xs="12" sm="12">
                <FormGroup row className="my-0">
                  <Col xs="12" sm="12">
                    <FormGroup>
                      <Label for="menu_type_name">ประเภทเมนู</Label>
                      <Input valid={this.state.menu_type_validate == "VALID"} invalid={this.state.menu_type_validate == "INVALID"} name="menu_type_name" id="menu_type_name" onChange={(e) => { this.onMenuTypeChange(e) }} required />
                      <FormFeedback valid >You can use this name.</FormFeedback>
                      <FormFeedback invalid >{this.state.menu_type_validate_text}</FormFeedback>
                      <FormText>Example: Professor</FormText>
                    </FormGroup>
                  </Col>
                </FormGroup>
              </Col>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" className="btn-success btn-md" color="primary">บันทึก</Button>
              <Button variant="secondary" onClick={this.handleClose}>
                กลับ
          </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        <button class="btn float-right btn-success btn-md" onClick={this.handleShow}><i class="fa fa-plus"></i> เพิ่ม</button>
      </>
    )
  }
}
const mapStatetoProps = (state) => {
  return {
    user: state.user,
  }
}
export default connect(mapStatetoProps)(InsertMenuTypeModal);





