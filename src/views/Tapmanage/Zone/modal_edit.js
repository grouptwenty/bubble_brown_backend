import React, { Component } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, FormText, FormFeedback } from 'reactstrap';
import 'react-day-picker/lib/style.css';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import ZoneModel from '../../../models/ZoneModel';
var zone_model = new ZoneModel;

class EditPositionModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      refresh: false,
      data: []
    }
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.SavePosition = this.SavePosition.bind(this);
    this.handleMultiChange = this.handleMultiChange.bind(this);
  }
  async componentDidMount() {
    const position = await zone_model.getPositionByCol({ 'position_code': this.props.position_code });
    // console.log('work_special_holiday', work_special_holiday);
    console.log("xxss>>>", position)

    this.setState({
      show_update_model: this.props.show_update_model,
      position_name: position.data[0].position_name,
      position_code: position.data[0].position_code
      // work_special_holiday_id: this.props.work_special_holiday_id,
      // work_special_holiday: work_special_holiday[0],
      // work_special_holiday_day_start: work_special_holiday[0].work_special_holiday_day_start,
      // work_special_holiday_day_end: work_special_holiday[0].work_special_holiday_day_end
    })
  }
  handleClose() {
    this.setState({ show_update_model: false });
    this.props.refresh();
  }
  handleShow() {
    this.setState({ show: true });
  }
  async SavePosition(event) {
    if (this.state.position_validate == 'INVALID') {
      swal("This name already exists.", {
        icon: "error",
      });
      event.preventDefault();
    } else {
      event.preventDefault();
      const form = event.target;
      // const data = new FormData(form);
      var arr = {};

      arr['position_name'] = form.elements['position_name'].value;
      arr['position_code'] = this.state.position_code;
      var data_set = {
        position_name: arr['position_name'],
      };
      var data_where = { position_code: arr['position_code'] };
      // console.log("xxx",data)
      console.log("xxx", arr)
      var res = await zone_model.updatePosition(data_set, data_where);
      if (res.query_result) {
        swal({
          title: "Good job!",
          text: "Insert Position  Ok",
          icon: "success",
          button: "Close",
        });
        this.handleClose()
      } else {
        swal({
          title: "Error !",
          text: "Insert Position Error ",
          icon: "error",
          button: "Close",
        });
      }
    }
  }
  onPositionChange(event) {
    const position_name = event.target.value;
    zone_model.getPositionByCol({ 'position_name': position_name }).then((responseJson) => {
      console.log('Positionnnn', responseJson);
      if (responseJson.data.length == 0) {
        this.setState({
          position_validate: "VALID",
        })
        console.log("VALID : ", position_name);
      } else {
        this.setState({
          position_validate: "INVALID",
          position_validate_text: "This name already exists.",
        })
        console.log("INVALID : ", position_name);
      }
      this.render();
    });
  }
  render() {
    return (
      <>
        <Modal
          size="xl"
          style={{ marginTop: "8%", marginBottom: "8%" }}
          show={this.state.show_update_model}
        >
          <Form onSubmit={this.SavePosition} id="myForm">
            <Modal.Header closeButton>
              <Modal.Title>Edit Position</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col xs="12" sm="12">
                <FormGroup row className="my-0">
                  <Col xs="12" sm="12">
                    <FormGroup>
                      <Label for="position_name">Position :</Label>
                      <Input valid={this.state.position_validate == "VALID"} invalid={this.state.position_validate == "INVALID"} name="position_name" id="position_name" defaultValue={this.state.position_name} onChange={(e) => { this.onPositionChange(e) }} placeholder="Professor" required />
                      <FormFeedback valid >You can use this name.</FormFeedback>
                      <FormFeedback invalid >{this.state.position_validate_text}</FormFeedback>
                      <FormText>Example: Professor</FormText>
                    </FormGroup>
                  </Col>
                </FormGroup>
              </Col>

            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" size="sm" color="primary">Save</Button>
              <Button variant="secondary" size="sm" onClick={this.handleClose}>
                Close
          </Button>
            </Modal.Footer>
          </Form>

        </Modal>

        {/* <Button type="button" size="sm" color="link" style={{ color: '#337ab7' }} onClick={this.handleShow}>
            <i class='fa fa-pencil-square-o' ></i>
        </Button> */}
      </>
    )
  }

  handleDayChangeStart(date) {
    this.setState({
      work_special_holiday_day_start: date
    });
  }
  handleDayChangeEnd(date) {
    this.setState({
      work_special_holiday_day_end: date
    });
  }

  handleMultiChange(option) {
    this.setState(state => {
      return {
        multiValue: option
      };
    });
  }
}

export default (EditPositionModal);





