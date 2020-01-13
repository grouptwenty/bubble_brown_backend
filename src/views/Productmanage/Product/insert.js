import React, { Component } from 'react';
import {
    Button,
    Table,
    Card,
    Pagination,
    PaginationLink,
    PaginationItem,
    CardHeader,
    CardFooter,
    Col,
    Row,
    CardImg,
    CardBody,
    CardTitle,
    Input,
    Label,
    Form,
    FormGroup
} from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import UnitModel from '../../../models/UnitModel'
import ProductTypeModel from '../../../models/ProductTypeModel'
import ProductModel from '../../../models/ProductModel'


const product_type_model = new ProductTypeModel
const product_model = new ProductModel
const unit_model = new UnitModel

class insertView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            product_type: [],
            refresh: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderType = this.renderType.bind(this);
        this.renderUnit = this.renderUnit.bind(this);
    }





    async componentDidMount() {

        var unit_list = await unit_model.getUnitBy()

        var product_type = await product_type_model.getProductTypeBy()
        console.log("product_type", product_type);

        this.setState({
            product_type: product_type.data,
            unit_list: unit_list.data,
        })



    }



    async handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        const date_now = new Date();
        var toDay = date_now.getFullYear() + "" + (date_now.getMonth() + 1) + "" + date_now.getDate() + "" + date_now.getTime()
        var arr = {};

        for (let name of data.keys()) {
            arr[name] = form.elements[name.toString()].value;
        }

        var product_type_id = document.getElementById("product_type_id").value
        // console.log("product_type__id",product_type__id);
        const max_code = await product_model.getProductMaxCode(product_type_id)
        // console.log("max_code",max_code);
        var product_code = 'PT' + product_type_id + max_code.data.product_code_max
        // console.log("product_code",product_code);

        arr['product_code'] = product_code
        arr['about_code'] = this.props.user.about_code

        // if (this.check(arr)) {
        var res = await product_model.insertProduct(arr);
        console.log(res)
        if (res.data) {
            swal({
                title: "สำเร็จ!",
                text: "เพิ่มสินค้าสำเร็จ",
                icon: "success",
                button: "Close",
            });
            this.props.history.push('/product-manage/product/')
        }
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
                <Row style={{ padding: '30px' }}>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                                <CardHeader>
                                    เพิ่มข้อมูลสินค้า

                            </CardHeader>
                                <CardBody>

                                    <Row>

                                        <Col lg="12">
                                            <br />
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

export default connect(mapStatetoProps)(insertView);