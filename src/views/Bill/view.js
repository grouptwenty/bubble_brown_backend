import React, { Component } from 'react';
import { Col, Row, CardHeader, Card, CardImg, CardText, CardBody, CardTitle, Button, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import ClickNHold from 'react-click-n-hold';
import swal from 'sweetalert';

import OrderModel from '../../models/OrderModel'
import OrderListModel from '../../models/OrderListModel'

const order_model = new OrderModel
const orderlist__model = new OrderListModel

class BillView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            bill_order: [],
            order_list: [],
            refresh: false

        };
        this.renderBill = this.renderBill.bind(this);
        this.onBillDetail = this.onBillDetail.bind(this);
        this.renderOrderList = this.renderOrderList.bind(this);
        this.toggle = this.toggle.bind(this);
    }


    async componentDidMount() {

        var bill_order = await order_model.getOrderBy()
        // console.log("bill_order", bill_order);

        this.setState({
            bill_order: bill_order.data,
        })


    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    async onBillDetail(order_code) {
        var order_list = await orderlist__model.getOrderListBy(order_code)
        this.setState({
            order_list: order_list.data,
            order_code_list: order_code
        })

        // console.log("order_list", order_list);
        // console.log("order_code55555", order_code);
        this.toggle()

    }

    renderBill() {
        var bill = []
        for (let i = 0; i < this.state.bill_order.length; i++) {
            bill.push(
                <Col sm="3">
                    <Card body outline color="success">
                        <Row style={{ borderBottomStyle: 'ridge' }}>
                            <Col sm="6">
                                <CardTitle style={{ textAlign: 'center', fontSize: '23px' }}>โต๊ะ {this.state.bill_order[i].table_id}</CardTitle>
                            </Col>
                            <Col sm="6">
                                <CardTitle style={{ textAlign: 'center', fontSize: '23px' }}>
                                    <i class="fa fa-user" aria-hidden="true" style={{ color: '#515A5A', fontSize: '20px' }}></i> 2</CardTitle>
                            </Col>
                        </Row>

                        <CardText>
                            <Row style={{ paddingTop: "15px ", borderBottomStyle: 'ridge' }}>
                                <Col sm="6">
                                    <CardTitle style={{ textAlign: 'center', fontSize: '18px', }}>ยอด</CardTitle>
                                </Col>
                                <Col sm="6">
                                    <CardTitle style={{ textAlign: 'center', fontSize: '18px' }}>
                                        <label>{this.state.bill_order[i].order_total_price}</label> <i class="fa fa-btc" aria-hidden="true" style={{ color: '#515A5A', fontSize: '18px' }}></i>
                                    </CardTitle>
                                </Col>
                            </Row>
                        </CardText>
                        <Row >
                            <Col lg="6" >
                                <div style={{ textAlign: 'end' }}>
                                    <Button color="secondary">ชำระเงิน</Button>
                                </div>
                            </Col>
                            <Col lg="6">
                                <div style={{ textAlign: 'start' }}>
                                    <Button onClick={this.onBillDetail.bind(this, this.state.bill_order[i].order_code)} color="secondary" >ดูบิล</Button>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>

            )
        }
        return bill;
    }

    renderOrderList() {
        var Bill_order_list = []
        for (let i = 0; i < this.state.order_list.length; i++) {
            Bill_order_list.push(

                <Row>
                    <Col lg="4">
                        <Label className="text_head" > {this.state.order_list[i].order_list_name} </Label>
                    </Col>
                    <Col lg="4" style={{ textAlign: 'center' }}>
                        <Label className="text_head" > {this.state.order_list[i].order_list_qty} </Label>

                    </Col>
                    <Col lg="4" style={{ textAlign: 'center' }}>
                        <Label className="text_head" > {this.state.order_list[i].order_list_price_sum_qty} </Label>

                    </Col>

                </Row>

            )
        }
        return Bill_order_list;
    }
    render() {

        const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>;


        return (
            <div>
                <Row style={{ padding: '3%' }}>
                    <Col sm="3">
                        <Card outline color="secondary">
                            <CardHeader style={{ textAlign: 'center', }}>เพิ่มบิล</CardHeader>
                            <CardBody>
                                <CardText style={{ textAlign: 'center' }}>
                                    <NavLink exact to={`/menu/`} style={{ width: '100%' }}>
                                        <i class="fa fa-plus-square-o" aria-hidden="true" style={{ color: '#515A5A', fontSize: '50px' }}></i>
                                    </NavLink>
                                </CardText>
                            </CardBody>
                        </Card>

                    </Col>

                    {this.renderBill()}

                </Row>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} >
                    <ModalHeader toggle={this.toggle} close={closeBtn}>Order : {this.state.order_code_list}</ModalHeader>
                    <ModalBody >
                       
                        <Row>
                            <Col lg="4">
                                <Label  > รายการ </Label>
                            </Col>
                            <Col lg="4" style={{ textAlign: 'center' }}>
                                <Label > จำนวน</Label>

                            </Col>
                            <Col lg="4" style={{ textAlign: 'center' }}>
                                <Label > ราคา </Label>

                            </Col>

                        </Row>
                        <br />
                        {this.renderOrderList()}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle} style={{ width: 100, height: 40 }}>OK</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
export default (BillView);