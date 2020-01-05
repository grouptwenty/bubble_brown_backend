import React, { Component } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, FormText, FormFeedback } from 'reactstrap';
import 'react-day-picker/lib/style.css';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import MenuTypeModel from '../../../models/MenuTypeModel';
var menu_type_model = new MenuTypeModel;

class EditMenuTypeModal extends Component {
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
    const menu_type = await menu_type_model.getMenuTypeByCol({ 'menu_type_id': this.props.menu_type_id });
    console.log("xxss>>>", menu_type)

    this.setState({
      show_update_model: this.props.show_update_model,
      menu_type_name: menu_type.data[0].menu_type_name,
      menu_type_id: menu_type.data[0].menu_type_id
    })
  }
  handleClose() {
    this.setState({ show_update_model: false });
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
      // const data = new FormData(form);
      var arr = {};

      arr['menu_type_name'] = form.elements['menu_type_name'].value;
      arr['menu_type_id'] = this.state.menu_type_id;
      var data_set = {
        menu_type_name: arr['menu_type_name'],
      };
      var data_where = { menu_type_id: arr['menu_type_id'] };
      // console.log("xxx",data)
      console.log("xxx", arr)
      var res = await menu_type_model.updateMenuType(data_set, data_where);
      if (res.query_result) {
        swal({
          title: "Good job!",
          text: "Insert MenuType  Ok",
          icon: "success",
          button: "Close",
        });
        this.handleClose()
      } else {
        swal({
          title: "Error !",
          text: "Insert MenuType Error ",
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
          size="xl"
          style={{ marginTop: "8%", marginBottom: "8%" }}
          show={this.state.show_update_model}
        >
          <Form onSubmit={this.SaveMenuType} id="myForm">
            <Modal.Header closeButton>
              <Modal.Title>Edit MenuType</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col xs="12" sm="12">
                <FormGroup row className="my-0">
                  <Col xs="12" sm="12">
                    <FormGroup>
                      <Label for="menu_type_name">MenuType :</Label>
                      <Input valid={this.state.menu_type_validate == "VALID"} invalid={this.state.menu_type_validate == "INVALID"} name="menu_type_name" id="menu_type_name" defaultValue={this.state.menu_type_name} onChange={(e) => { this.onMenuTypeChange(e) }} placeholder="Professor" required />
                      <FormFeedback valid >You can use this name.</FormFeedback>
                      <FormFeedback invalid >{this.state.menu_type_validate_text}</FormFeedback>
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
}

export default (EditMenuTypeModal);





