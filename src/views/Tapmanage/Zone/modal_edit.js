import React, { Component } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, FormText, FormFeedback } from 'reactstrap';
import 'react-day-picker/lib/style.css';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import ZoneModel from '../../../models/ZoneModel';
var zone_model = new ZoneModel;

class EditZoneModal extends Component {
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
    const zone = await zone_model.getZoneByCol({ 'zone_id': this.props.zone_id });
    console.log("xxss>>>", zone)

    this.setState({
      show_update_model: this.props.show_update_model,
      zone_name: zone.data[0].zone_name,
      zone_id: zone.data[0].zone_id
    })
  }
  handleClose() {
    this.setState({ show_update_model: false });
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
      // const data = new FormData(form);
      var arr = {};

      arr['zone_name'] = form.elements['zone_name'].value;
      arr['zone_id'] = this.state.zone_id;
      var data_set = {
        zone_name: arr['zone_name'],
      };
      var data_where = { zone_id: arr['zone_id'] };
      // console.log("xxx",data)
      console.log("xxx", arr)
      var res = await zone_model.updateZone(data_set, data_where);
      if (res.query_result) {
        swal({
        
          text: "แก้ไขโซนสำเร็จ !",
          icon: "success",
          button: "ปิด",
        });
        this.handleClose()
      } else {
        swal({
          title: "มีบางอย่างผิดพลาด !",
          text: "แก้ไขโซนไม่สำเร็จ ",
          icon: "error",
          button: "ปิด",
        });
      }
    }
  }
  onZoneChange(event) {
    const zone_name = event.target.value;
    zone_model.getZoneByCol({ 'zone_name': zone_name }).then((responseJson) => {
      console.log('Zonennn', responseJson);
      if (responseJson.data.length == 0) {
        this.setState({
          zone_validate: "VALID",
        })
        console.log("VALID : ", zone_name);
      } else {
        this.setState({
          zone_validate: "INVALID",
          zone_validate_text: "This name already exists.",
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
          show={this.state.show_update_model}
        >
          <Form onSubmit={this.SaveZone} id="myForm">
            <Modal.Header closeButton>
              <Modal.Title>แก้ไขโซน</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col xs="12" sm="12">
                <FormGroup row className="my-0">
                  <Col xs="12" sm="12">
                    <FormGroup>
                      <Label for="zone_name">โซน</Label>
                      <Input valid={this.state.zone_validate == "VALID"} invalid={this.state.zone_validate == "INVALID"} name="zone_name" id="zone_name" defaultValue={this.state.zone_name} onChange={(e) => { this.onZoneChange(e) }} required />
                      <FormFeedback valid >You can use this name.</FormFeedback>
                      <FormFeedback invalid >{this.state.zone_validate_text}</FormFeedback>
                      <FormText>Example: Professor</FormText>
                    </FormGroup>
                  </Col>
                </FormGroup>
              </Col>

            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" size="md" color="success">บันทึก</Button>
              <Button variant="secondary" size="md" onClick={this.handleClose}>
                ปิด
          </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    )
  }
}

export default (EditZoneModal);





