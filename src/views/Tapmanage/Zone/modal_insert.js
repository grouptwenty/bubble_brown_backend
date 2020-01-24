import React, { Component } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, FormFeedback, FormText } from 'reactstrap';
import 'react-day-picker/lib/style.css';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import ZoneModel from '../../../models/ZoneModel';
var zone_model = new ZoneModel;

class InsertZoneModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      refresh: false,
      data: []
    }
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.SaveZone = this.SaveZone.bind(this);
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
  async SaveZone(event) {
    if (this.state.zone_validate == 'INVALID') {
      swal("ชื่อนี้มีการใช้งานแล้ว.", {
        icon: "error",
      });
      event.preventDefault();
    } else {
      event.preventDefault();
      const form = event.target;
      var arr = {};
      arr['zone_name'] = form.elements['zone_name'].value;
      arr['about_code'] = this.props.user.about_code;
      // console.log("xxx",data)
      console.log("xxx", arr)
      var res = await zone_model.insertZone(arr);
      if (res.query_result) {
        swal({
        
          text: "เพิ่มโซนสำเร็จ !",
          icon: "success",
          button: "ปิด",
        });
        this.handleClose()
      } else {
        swal({
          title: "มีบางอย่างผิดพลาด !",
          text: "เพิ่มโซนไม่สำเร็จ ",
          icon: "error",
          button: "ปิด",
        });
      }
    }
  }
  onZoneChange(event) {
    const zone_name = event.target.value;
    zone_model.getZoneByCol({ 'zone_name': zone_name }).then((responseJson) => {
      console.log('Zoneee', responseJson);
      if (responseJson.data.length == 0) {
        this.setState({
          zone_validate: "VALID",
        })
        console.log("VALID : ", zone_name);
      } else {
        this.setState({
          zone_validate: "INVALID",
          zone_validate_text: "ชื่อนี้มีการใช้งานแล้ว.",
        })
        console.log("INVALID : ", zone_name);
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
          <Form onSubmit={this.SaveZone} id="myForm">
            <Modal.Header closeButton>
              <Modal.Title>เพิ่มโซน</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col xs="12" sm="12">
                <FormGroup row className="my-0">
                  <Col xs="12" sm="12">
                    <FormGroup>
                      <Label for="zone_name">โซน :</Label>
                      <Input valid={this.state.zone_validate == "VALID"} invalid={this.state.zone_validate == "INVALID"} name="zone_name" id="zone_name" onChange={(e) => { this.onZoneChange(e) }}  required />
                      <FormFeedback valid >You can use this name.</FormFeedback>
                      <FormFeedback invalid >{this.state.zone_validate_text}</FormFeedback>
                      <FormText>Example: Professor</FormText>
                    </FormGroup>
                  </Col>
                </FormGroup>
              </Col>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" className="btn-success btn-md" color="primary">บันทึก</Button>
              <Button variant="secondary" onClick={this.handleClose}>
                ยกเลิก
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
export default connect(mapStatetoProps)(InsertZoneModal);





