import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Input, Label, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import { formatDate, parseDate, } from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import ProductTypeModel from '../../../models/ProductTypeModel'
import ProductModel from '../../../models/ProductModel'
import UnitModel from '../../../models/UnitModel'


const product_type_model = new ProductTypeModel
const product_model = new ProductModel
const unit_model = new UnitModel

class updateView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            product_type: [],
            refresh: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setval = this.setval.bind(this);
        this.renderType = this.renderType.bind(this);
        this.renderUnit = this.renderUnit.bind(this);
    }




    async componentDidMount() {
        const code = this.props.match.params.code
        var arr = {}
        arr['product_code'] = code
        arr['about_code'] = this.props.user.about_code
        console.log(code);

        var product = await product_model.getProductByCode(arr)
        var unit_list = await unit_model.getUnitBy()
        var product_type = await product_type_model.getProductTypeBy(arr)

        this.setState({
            product_type: product_type.data,
            unit_list: unit_list.data,
        })

        console.log(product.data);


        this.setval(product.data)

    }


    async setval(data) {
        document.getElementById('product_code').value = data.product_code
        document.getElementById('product_name').value = data.product_name
        document.getElementById('unit_id').value = data.unit_id
        document.getElementById('product_type_id').value = data.product_type_id
        document.getElementById('product_minimum').value = data.product_minimum

    }

    async handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);

        var arr = {};

        for (let name of data.keys()) {
            arr[name] = form.elements[name.toString()].value;
        }
        arr['about_code'] = this.props.user.about_code
        var res = await product_model.updateProduct(arr);
        console.log(res)
        // if (res.data) {
        swal({
            title: "Good job!",
            text: "Update Brand Ok",
            icon: "success",
            button: "Close",
        });
        this.props.history.push('/product-manage/product/')
        // }
        // }
    }

    renderUnit() {

        var unit = []
        for (var key in this.state.unit_list) {
            unit.push(

                <option value={this.state.unit_list[key].unit_id}>{this.state.unit_list[key].unit_name}</option>
            )

        }
        return unit;

    }


    renderType() {

        let type = []
        for (let i = 0; i < this.state.product_type.length; i++) {
            type.push(
                <option value={this.state.product_type[i].product_type_id}>{this.state.product_type[i].product_type_name}</option>
            )

        }
        return type;
    }


    render() {
        return (
            <div className="animated fadeIn">
                <Row style={{ padding: '15px' }}>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                                <CardHeader>
                                    แก้ไขข้อมูลสินค้า

                            </CardHeader>
                                <CardBody>
                                    <Row>

                                        <Col lg="12">
                                            <br />
                                            <Row>
                                                <Col lg="4">
                                                    <Label className="text_head"> รหัสสินค้า<font color='red'><b> * </b></font></Label>
                                                    <Input type="text" id="product_code" name="product_code" class="form-control" readOnly ></Input>
                                                    {/* <p id="product_code" className="text_head_sub">Example : WMB001</p> */}
                                                </Col>


                                            </Row>
                                            <br />
                                            <Row>
                                                <Col lg="6">
                                                    <Label className="text_head"> ชื่อสินค้า<font color='red'><b> * </b></font></Label>
                                                    <Input type="text" id="product_name" name="product_name" class="form-control" autocomplete="off"></Input>
                                                    {/* <p id="washing_machine_brand_name" className="text_head_sub">Example : SAMSUNG</p> */}
                                                </Col>
                                                <Col lg="6">
                                                    <Label className="text_head"> จุดสั่งซื้อ <font color='red'><b> * </b></font></Label>
                                                    <Input type="text" id="product_minimum" name="product_minimum" class="form-control" autocomplete="off"></Input>
                                                    {/* <p id="washing_machine_brand_name" className="text_head_sub">Example : SAMSUNG</p> */}
                                                </Col>

                                            </Row>
                                            <br />
                                            <Row>
                                                <Col lg="6">
                                                    <Label className="text_head"> ประเภทสินค้า <font color='red'><b> * </b></font></Label>
                                                    <Input type="select" id="product_type_id" name="product_type_id" class="form-control" >
                                                        <option value="">Select</option>
                                                        {this.renderType()}
                                                    </Input>
                                                </Col>
                                                <Col lg="6">
                                                    <Label className="text_head"> หน่วยสินค้า <font color='red'><b> * </b></font></Label>
                                                    <Input type="select" id="unit_id" name="unit_id" class="form-control" >
                                                        <option value="">Select</option>
                                                        {this.renderUnit()}
                                                    </Input>
                                                </Col>

                                            </Row>

                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <Link to="/product-manage/product/">
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

export default connect(mapStatetoProps)(updateView);