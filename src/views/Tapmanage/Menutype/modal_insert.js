import React, { Component } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, FormFeedback, FormText } from 'reactstrap';
import 'react-day-picker/lib/style.css';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import MenuTypeModel from '../../../models/MenuTypeModel';
var menu_type_model = new MenuTypeModel;

class InsertPositionModal extends Component {
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

  }
  handleClose() {
    this.setState({ show: false });
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
      var arr = { addby: this.props.member.member_code };

      arr['position_name'] = form.elements['position_name'].value;
      // console.log("xxx",data)
      console.log("xxx", arr)
      var res = await menu_type_model.insertPosition(arr);
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
    menu_type_model.getPositionByCol({ 'position_name': position_name }).then((responseJson) => {
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
          show={this.state.show}
        >
          <Form onSubmit={this.SavePosition} id="myForm">
            <Modal.Header closeButton>
              <Modal.Title>Add Position</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col xs="12" sm="12">
                <FormGroup row className="my-0">
                  <Col xs="12" sm="12">
                    <FormGroup>
                      <Label for="position_name">Position :</Label>
                      <Input valid={this.state.position_validate == "VALID"} invalid={this.state.position_validate == "INVALID"} name="position_name" id="position_name" onChange={(e) => { this.onPositionChange(e) }} placeholder="Professor" required />
                      <FormFeedback valid >You can use this name.</FormFeedback>
                      <FormFeedback invalid >{this.state.position_validate_text}</FormFeedback>
                      <FormText>Example: Professor</FormText>
                    </FormGroup>
                  </Col>
                </FormGroup>
              </Col>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" className="btn-success" color="primary">Save</Button>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
          </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        <button class="btn float-right btn-success" onClick={this.handleShow}><i class="fa fa-plus"></i> Add</button>
      </>
    )
  }

  // handleDayChangeStart(date) {
  //   this.setState({
  //     work_special_holiday_day_start: date
  //   });
  // }
  // handleDayChangeEnd(date) {
  //   this.setState({
  //     work_special_holiday_day_end: date
  //   });
  // }

  handleMultiChange(option) {
    this.setState(state => {
      return {
        multiValue: option
      };
    });
  }
}
const mapStatetoProps = (state) => {
  return {
    member: state.member,
  }
}
export default connect(mapStatetoProps)(InsertPositionModal);





