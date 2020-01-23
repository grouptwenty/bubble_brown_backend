import React, { Component } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, FormText, FormFeedback } from 'reactstrap';
import 'react-day-picker/lib/style.css';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import ProductTypeModel from '../../../models/ProductTypeModel';
var product_type_model = new ProductTypeModel;

class EditProductTypeModal extends Component {
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
    const product_type = await product_type_model.getProductTypeByCol({ 'product_type_id': this.props.product_type_id });
    console.log("xxss>>>", product_type)

    this.setState({
      show_update_model: this.props.show_update_model,
      product_type_name: product_type.data[0].product_type_name,
      product_type_id: product_type.data[0].product_type_id
    })
  }
  handleClose() {
    this.setState({ show_update_model: false });
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
      // const data = new FormData(form);
      var arr = {};

      arr['product_type_name'] = form.elements['product_type_name'].value;
      arr['product_type_id'] = this.state.product_type_id;
      var data_set = {
        product_type_name: arr['product_type_name'],
      };
      var data_where = { product_type_id: arr['product_type_id'] };
      // console.log("xxx",data)
      console.log("xxx", arr)
      var res = await product_type_model.updateProductType(data_set, data_where);
      if (res.query_result) {
        swal({
       
          text: "แก้ไขประเภทสินค้าสำเร็จ !",
          icon: "success",
          button: "Close",
        });
        this.handleClose()
      } else {
        swal({
          title: "มีบางอย่างผิดพลาด",
          text: "แก้ไขประเภทสินค้าไม่สำเร็จ !",
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
          show={this.state.show_update_model}
        >
          <Form onSubmit={this.SaveProductType} id="myForm">
            <Modal.Header closeButton>
              <Modal.Title>แก้ไขประเภทสินค้า</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col xs="12" sm="12">
                <FormGroup row className="my-0">
                  <Col xs="12" sm="12">
                    <FormGroup>
                      <Label for="product_type_name">ประเภทสินค้า</Label>
                      <Input valid={this.state.product_type_validate == "VALID"} invalid={this.state.product_type_validate == "INVALID"} name="product_type_name" id="product_type_name" defaultValue={this.state.product_type_name} onChange={(e) => { this.onProductTypeChange(e) }} placeholder="Professor" required />
                      <FormFeedback valid >You can use this name.</FormFeedback>
                      <FormFeedback invalid >{this.state.product_type_validate_text}</FormFeedback>
                      <FormText>Example: Professor</FormText>
                    </FormGroup>
                  </Col>
                </FormGroup>
              </Col>

            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" size="md" color="primary">บันทึก</Button>
              <Button variant="secondary" size="md" onClick={this.handleClose}>
                ปิด
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

export default (EditProductTypeModal);





