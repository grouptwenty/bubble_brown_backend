import React, { Component } from 'react';
import {
    Button,
    Col,
    Row,
    Input,
    Card,
    CardBody,
    CardFooter,
    Modal, ModalBody, ModalFooter, ListGroup, ListGroupItem, CardHeader, Table, Label, FormGroup, ModalHeader
} from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import StockModel from '../../../models/StockModel'

const stock_model = new StockModel


class detailView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            brand: [],
            machine_type: [],
            refresh: false,
            stock: [],

        };
        this.renderStockOrder = this.renderStockOrder.bind(this)
        this.toggle_StockEdit = this.toggle_StockEdit.bind(this);
        this.renderModalEdit = this.renderModalEdit.bind(this);
        this.onEditStock = this.onEditStock.bind(this);
        // this.updateStock = this.updateStock.bind(this);
    }

    async componentDidMount() {
        const code = this.props.match.params.code
        var stock_order = await stock_model.getStockByProduct(code)
        // console.log(stock_order);


        this.setState({
            stock_order: stock_order.data,

        })

    }


    toggle_StockEdit() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    async onEditStock(stock_id) {

        var stock_set = await stock_model.getStockByCode(stock_id)

        this.setState({
            stock_set: stock_set.data
        })

        console.log(stock_set);

        this.toggle_StockEdit()

    }

    // async  updateStock(stock_id) {

    //    document.getElementsById('stock_qty').value

    //     console.log(stock_qty);


    //     var stock_list = {
    //         stock_qty: stock_qty.value,
    //     }



    //     // const src = await stock_model.insertStock(stock_list)
    //     // if (stock_list != undefined) {
    //     //     swal({
    //     //         title: "จัดการสูตรเรียบร้อย",
    //     //         icon: "success",
    //     //         button: "Close",
    //     //     });
    //     //     this.toggle_StockEdit()
    //     // }
    // }



    renderModalEdit() {
        if (this.state.stock_set != undefined) {
            var modal_edit = []
            // console.log(this.state.order_code_list);

            modal_edit.push(
                <Modal isOpen={this.state.modal} toggle={this.toggle_StockEdit} size="lg" >
                    {/* <ModalHeader toggle={this.toggle} close={closeBtn}>Order : {this.state.order_code_list}</ModalHeader> */}

                    <ModalBody >
                        <Row style={{ textAlign: 'center' }}>
                            <Col lg="6">
                                <label style={{ fontSize: '18px' }} > วันนำเข้า : {this.state.stock_set.stock_date} </label>
                            </Col>
                            <Col lg="6" >
                                <label style={{ fontSize: '18px' }}> เวลานำเข้า : {this.state.stock_set.stock_time}</label>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col lg="6">
                                <label style={{ fontSize: '13px' }} > รหัสวัตถุดิบ</label>
                                <Input type='text' id='product_code' name='product_code' defaultValue={this.state.stock_set.product_code} readOnly></Input>
                            </Col>
                            <Col lg="6">
                                <label style={{ fontSize: '13px' }} > วัตถุดิบ</label>
                                <Input type='text' id='product_name' name='product_name' defaultValue={this.state.stock_set.product_name} readOnly></Input>
                            </Col>
                        </Row>
                        <br />

                        <Row>
                            <Col lg="6">
                                <label style={{ fontSize: '13px' }} > ต้นทุน</label>
                                <Input type='text' id='stock_cost' name='stock_cost' defaultValue={this.state.stock_set.stock_cost} readOnly></Input>
                            </Col>

                            <Col lg="6">
                                <label style={{ fontSize: '13px' }} > จำนวน</label>
                                <Input type='text' id='stock_qty' name='stock_qty' defaultValue={this.state.stock_set.stock_qty} ></Input>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle_StockEdit} style={{ width: 100, height: 40 }}>กลับ</Button>
                        {/* <Button color="primary" onClick={this.updateStock.bind(this, this.state.stock_set.stock_id)} style={{ width: 100, height: 40 }}>แก้ไข</Button> */}
                    </ModalFooter>
                </Modal>
            )
            return modal_edit;
        }
    }

    renderStockOrder() {
        if (this.state.stock_order != undefined) {
            var stock_order_list = []
            for (let i = 0; i < this.state.stock_order.length; i++) {

                stock_order_list.push(

                    <tr>
                        <td>{this.state.stock_order[i].stock_date}</td>
                        <td>{this.state.stock_order[i].stock_time}</td>
                        <td>{this.state.stock_order[i].product_code}</td>
                        <td>{this.state.stock_order[i].product_name}</td>
                        <td style={{ textAlign: 'end' }}>{this.state.stock_order[i].stock_qty}</td>
                        <td style={{ textAlign: 'end' }}>{this.state.stock_order[i].stock_cost}</td>
                        <td style={{ textAlign: 'center' }}>
                            <Button color="info"
                             onClick={this.onEditStock.bind(this, this.state.stock_order[i].stock_id)}
                             >แก้ไข</Button>{' '}
                            <Button color="danger">ลบ</Button>{' '}
                        </td>
                    </tr>


                )
            }
            return stock_order_list;
        }

    }



    render() {


        return (

            <div>

                <Row style={{ padding: '30px' }}>
                    <Col>
                        <Card>
                            <CardBody>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th >วันนำเข้า</th>
                                            <th>เวลานำเข้า</th>
                                            <th>รหัสวัตถุดิบ</th>
                                            <th>วัตถุดิบ</th>
                                            <th style={{ textAlign: 'end' }}>จำนวน</th>
                                            <th style={{ textAlign: 'end' }}>ต้นทุน</th>
                                            <th style={{ textAlign: 'center' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderStockOrder()}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                        {this.renderModalEdit()}
                    </Col>
                </Row>
            </div>
        );

    }
}


export default (detailView);