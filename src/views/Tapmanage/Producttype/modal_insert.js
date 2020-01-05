import React, { Component } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, FormFeedback, FormText } from 'reactstrap';
import 'react-day-picker/lib/style.css';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import ProductTypeModel from '../../../models/ProductTypeModel';
var product_type_model = new ProductTypeModel;

class InsertProductTypeModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      refresh: false,
      data: []
    }
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.SaveProductType = this.SaveProductType.bind(this);
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
  async SaveProductType(event) {
    if (this.state.product_type_validate == 'INVALID') {
      swal("This name already exists.", {
        icon: "error",
      });
      event.preventDefault();
    } else {
      event.preventDefault();
      const form = event.target;
      var arr = {};

      arr['product_type_name'] = form.elements['product_type_name'].value;
      // console.log("xxx",data)
      console.log("xxx", arr)
      var res = await product_type_model.insertProductType(arr);
      if (res.query_result) {
        swal({
          title: "Good job!",
          text: "Insert ProductType  Ok",
          icon: "success",
          button: "Close",
        });
        this.handleClose()
      } else {
        swal({
          title: "Error !",
          text: "Insert ProductType Error ",
          icon: "error",
          button: "Close",
        });
      }
    }
  }
  onProductTypeChange(event) {
    const product_type_name = event.target.value;
    product_type_model.getProductTypeByCol({ 'product_type_name': product_type_name }).then((responseJson) => {
      console.log('ProductTypennn', responseJson);
      if (responseJson.data.length == 0) {
        this.setState({
          product_type_validate: "VALID",
        })
        console.log("VALID : ", product_type_name);
      } else {
        this.setState({
          product_type_validate: "INVALID",
          product_type_validate_text: "This name already exists.",
        })
        console.log("INVALID : ", product_type_name);
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
          <Form onSubmit={this.SaveProductType} id="myForm">
            <Modal.Header closeButton>
              <Modal.Title>Add ProductType</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col xs="12" sm="12">
                <FormGroup row className="my-0">
                  <Col xs="12" sm="12">
                    <FormGroup>
                      <Label for="product_type_name">ProductType :</Label>
                      <Input valid={this.state.product_type_validate == "VALID"} invalid={this.state.product_type_validate == "INVALID"} name="product_type_name" id="product_type_name" onChange={(e) => { this.onProductTypeChange(e) }} placeholder="Professor" required />
                      <FormFeedback valid >You can use this name.</FormFeedback>
                      <FormFeedback invalid >{this.state.product_type_validate_text}</FormFeedback>
                      <FormText>Example: Professor</FormText>
                    </FormGroup>
                  </Col>
                </FormGroup>
              </Col>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" className="btn-success btn-md" color="primary">Save</Button>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
          </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        <button class="btn float-right btn-success btn-md" onClick={this.handleShow}><i class="fa fa-plus"></i> Add</button>
      </>
    )
  }
}
// const mapStatetoProps = (state) => {
//   return {
//     member: state.member,
//   }
// }
// export default connect(mapStatetoProps)(InsertProductTypeModal);
export default (InsertProductTypeModal);





