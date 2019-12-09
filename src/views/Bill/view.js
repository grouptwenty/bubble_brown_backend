import React, { Component } from 'react';
import { Col, Row, CardHeader, Card, Nav, NavItem, CardText, CardBody, CardTitle, Button, Label, TabContent, TabPane, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { NavLink, Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ClickNHold from 'react-click-n-hold';

import OrderModel from '../../models/OrderModel'
import OrderListModel from '../../models/OrderListModel'
import ZoneModel from '../../models/ZoneModel'
import TableModel from '../../models/TableModel'

const order_model = new OrderModel
const orderlist__model = new OrderListModel
const zone_model = new ZoneModel
const table_model = new TableModel
class BillView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            bill_order: [],
            order_list: [],
            zone_menu: [],
            table_list: [],
            useState: 0,
            refresh: false

        };
        this.renderBill = this.renderBill.bind(this);
        this.onBillDetail = this.onBillDetail.bind(this);
        this.renderOrderList = this.renderOrderList.bind(this);
        this.toggle_Bill = this.toggle_Bill.bind(this);
        this.renderZoneMenu = this.renderZoneMenu.bind(this);
        this.renderTableByZone = this.renderTableByZone.bind(this);
        this.renderModalBill = this.renderModalBill.bind(this);
    }


    async componentDidMount() {

        var bill_order = await order_model.getOrderBy()
        var zone_menu = await zone_model.getZoneBy()
        var table_list = await table_model.getTableByCode(1)

        this.setState({
            bill_order: bill_order.data,
            zone_menu: zone_menu.data,
            table_list: table_list.data,
        })



    }

    async getTableByCode(code) {
        var table_list = await table_model.getTableByCode(code)
        console.log("menulistbycode", table_list);
        this.setState({
            table_list: table_list.data
        })
    }


    toggle_Bill() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    async onBillDetail(order_code) {
        var order_list = await orderlist__model.getOrderListBy(order_code)

        this.setState({
            order_list: order_list.data,
            order_code_list: order_code.data
        })

        this.toggle_Bill()

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

    renderZoneMenu() {
        var zone = []
        for (let i = 0; i < this.state.zone_menu.length; i++) {
            zone.push(
                <Tab onClick={this.getTableByCode.bind(this, this.state.zone_menu[i].zone_id)}>
                    <label>{this.state.zone_menu[i].zone_name}</label>
                </Tab>

            )
        }
        return zone;
    }

    start(e) {
        console.log('START');
    }
    end(e, enough) {
        console.log('END');
        console.log(enough ? alert('show') : 'Click released too soon');
    }
    clickNHold(e) {
        console.log('CLICK AND HOLD');
    }
    renderTableByZone() {
        console.log("this.state.table_list", this.state.table_list);

        var table = []
        if (this.state.table_list != undefined) {
            for (let i = 0; i < this.state.table_list.length; i++) {
                table.push(
                    <Col lg="2">
                        <ClickNHold
                            time={0.5}
                            onStart={this.start}
                            onClickNHold={this.clickNHold}
                            onEnd={this.end} >
                            <Button color="secondary" size="lg" active>{this.state.table_list[i].table_name}</Button>

                        </ClickNHold>
                    </Col>
                    // <div style={{ overflowY: 'scroll' }}>
                    //     <label>{this.state.table_list[i].table_name}</label>
                    // </div>


                )
            }
            console.log("table", table);

            return table;
        }
    }


    renderModalBill() {
        const closeBtn = <button className="close" onClick={this.toggle_Bill}>&times;</button>;
        var modal_bill = []

        modal_bill.push(
            <Modal isOpen={this.state.modal} toggle={this.toggle_Bill} className={this.props.className} >
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
                    <Button color="primary" onClick={this.toggle_Bill} style={{ width: 100, height: 40 }}>OK</Button>
                </ModalFooter>
            </Modal>
        )
        return modal_bill;
    }

    render() {




        return (

            <div style={{ padding: '10px' }}>
                <Card>

                    <CardBody style={{ padding: '5px' }}>

                        <Tabs >
                            <TabList>
                                <Tab style={{ fontSize: '20px' }}> บิล</Tab>
                                <Tab style={{ fontSize: '20px' }}>โต๊ะอาหาร</Tab>
                            </TabList>
                            <TabPanel >
                                <Row style={{ padding: '1%', overflowY: 'scroll' }}>
                                    <Col sm="3" >
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
                            </TabPanel>
                            <TabPanel>
                                <Tabs>
                                    <TabList>

                                        {this.renderZoneMenu()}

                                    </TabList>



                                </Tabs>
                            </TabPanel>
                        </Tabs>
                        <Row style={{ textAlign: 'center' }}>
                            {this.renderTableByZone()}
                        </Row>
                    </CardBody>
                </Card>
                {this.renderModalBill()}
                
            </div >
        )
    }
}
export default (BillView);