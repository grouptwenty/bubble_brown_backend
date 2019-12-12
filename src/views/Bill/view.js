import React, { Component, useState } from 'react';
import { Nav, NavItem, TabContent, TabPane, Col, Row, CardHeader, Card, Input, CardText, CardBody, CardTitle, Button, Label, FormGroup, Form, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link, NavLink } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ClickNHold from 'react-click-n-hold';
import swal from 'sweetalert';
import OrderModel from '../../models/OrderModel'
import OrderListModel from '../../models/OrderListModel'
import ZoneModel from '../../models/ZoneModel'
import TableModel from '../../models/TableModel'

const order_model = new OrderModel
const orderlist_model = new OrderListModel
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
            tabIndex: 0,
            refresh: false,
            x: []

        };
        this.renderBill = this.renderBill.bind(this);
        this.onBillDetail = this.onBillDetail.bind(this);
        this.onTableEdit = this.onTableEdit.bind(this);
        this.renderOrderList = this.renderOrderList.bind(this);
        this.toggle_Bill = this.toggle_Bill.bind(this);
        this.renderZoneMenu = this.renderZoneMenu.bind(this);
        this.renderTableByZone = this.renderTableByZone.bind(this);
        this.renderModalBill = this.renderModalBill.bind(this);
        this.toggle_Table = this.toggle_Table.bind(this);
        this.renderModelEdit = this.renderModelEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);

    }


    async componentDidMount() {

        var bill_order = await order_model.getOrderBy()
        var zone_menu = await zone_model.getZoneBy()


        this.setState({
            bill_order: bill_order.data,
            zone_menu: zone_menu.data,

        })
        this.renderTableByZone()
    }



    async getTableByZoneCode(code) {
        var table_list = await table_model.getTableByZoneCode(code)
        // console.log("menulistbycode", table_list);
        this.setState({
            table_list: table_list.data
        })
    }


    toggle_Bill() {
        this.setState(prevState => ({
            modal_bill: !prevState.modal_bill
        }));
    }


    toggle_Table() {
        this.setState(prevState => ({
            modal_table: !prevState.modal_table

        }));
    }


    async onBillDetail(order_code) {
        var order_list = await orderlist_model.getOrderListBy(order_code)

        this.setState({
            order_list: order_list.data,
            order_code_list: order_code
        })

        this.toggle_Bill()

    }

    async onTableEdit(table_code) {

        const table_edit = await table_model.getTableByCode(table_code)
        this.setState({
            table_edit: table_edit.data
        })

        this.toggle_Table()
    }







    renderBill() {
        var bill = []
        for (let i = 0; i < this.state.bill_order.length; i++) {
            bill.push(
                <Col sm="3">
                    <NavLink  to={`/menu/` + this.state.bill_order[i].order_code } style={{ width: '100%' }}>
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
                    </NavLink>
                </Col>

            )
        }
        return bill;
    }

    renderOrderList() {
        var Bill_order_list = []
        for (let i = 0; i < this.state.order_list.length; i++) {
            Bill_order_list.push(

                <ul class="list-group">
                    <li class="list-group-item list-group-item-action">
                        <Row>
                            <Col lg="4">
                                <Label className="text_head" >{this.state.order_list[i].order_list_name}  </Label>
                            </Col>
                            <Col lg="4" style={{ textAlign: 'center' }}>
                                <Label className="text_head" > {this.state.order_list[i].order_list_qty} </Label>

                            </Col>
                            <Col lg="4" style={{ textAlign: 'center' }}>
                                <Label className="text_head" > {this.state.order_list[i].order_list_price_sum_qty} </Label>

                            </Col>
                        </Row>
                    </li>
                </ul>

            )
        }
        return Bill_order_list;
    }

    renderZoneMenu() {
        var zone = []
        for (let i = 0; i < this.state.zone_menu.length; i++) {
            zone.push(
                <Tab onClick={this.getTableByZoneCode.bind(this, this.state.zone_menu[i].zone_id)}>
                    <label>{this.state.zone_menu[i].zone_name}</label>
                </Tab>

            )
        }
        return zone;
    }


    async renderTableByZone() {
        // console.log("this.state.table_list", this.state.table_list);
        var panel = []
        // console.log();
        if (this.state.zone_menu != undefined) {
            console.log('hi', this.state.zone_menu.length);

            for (let i = 0; i < this.state.zone_menu.length; i++) {
                console.log('55555555');

                var table_list = await table_model.getTableByZoneCode(this.state.zone_menu[i].zone_id)
                this.setState({
                    table_list: table_list.data
                })

                var table = []
                for (let j = 0; j < this.state.table_list.length; j++) {

                    table.push(

                        <Col lg="2" >

                            <ClickNHold
                                time={0.5}
                                // onStart={this.start}

                                onClickNHold={this.onTableEdit.bind(this, this.state.table_list[j].table_code)}
                            // onEnd={this.onTableEdit.bind(this, this.state.table_list[i].table_id)}
                            >
                                <Button color="secondary" size="lg" active>{this.state.table_list[j].table_name}</Button>

                            </ClickNHold>
                        </Col>


                    )
                }

                panel.push(

                    <TabPanel>
                        <Row>
                            {table}
                        </Row>
                    </TabPanel>
                )


            }
        }
        // return panel;
        console.log(panel);

        this.setState({
            x: panel
        })
    }



    renderModalBill() {

        const closeBtn = <button className="close" onClick={this.toggle_Bill}>&times;</button>;
        var modal_bill = []
        // console.log(this.state.order_code_list);
        if (this.state.order_code_list != undefined) {
            modal_bill.push(
                <Modal isOpen={this.state.modal_bill} toggle={this.toggle_Bill} className={this.props.className} >
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
    }

    async handleSubmit() {


        var table_code = document.getElementById('table_code').value
        var table_name = document.getElementById('table_name').value
        var table_amount = document.getElementById('table_amount').value
        var zone_id = document.getElementById('zone_id').value

        var edit_table = {
            table_code: table_code,
            table_name: table_name,
            table_amount: table_amount,
            table_amount: table_amount,
            zone_id: zone_id
        }

        var res = await table_model.updateTebleBy(edit_table);

        if (edit_table != undefined) {
            swal({
                title: "แก้ไขข้อมูลโต๊ะเรียบร้อย",
                icon: "success",
                button: "Close",
            });
            this.toggle_Table()
        }

    }

    async onDelete(code) {
        alert(this.state.tabIndex)
        swal({
            text: "ต้องการลบข้อมูลโต๊ะ ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {

                    const res = table_model.deleteByCode(code)
                        .then((req) => {

                            if (req.data == true) {
                                swal("success deleted!", {
                                    icon: "success",
                                });
                                this.toggle_Table()
                                alert(this.state.tabIndex)
                            } else {
                                swal("success deleted!", {
                                    icon: "error",
                                });
                            }
                        })

                }
            });

    }

    renderModelEdit() {

        let zone_edit = []
        if (this.state.table_edit != undefined) {
            for (let i = 0; i < this.state.zone_menu.length; i++) {
                zone_edit.push(
                    <option value={this.state.zone_menu[i].zone_id} selected={this.state.table_edit.zone_id == this.state.zone_menu[i].zone_name ? true : false}>{this.state.zone_menu[i].zone_name}</option>
                )
            }
        }
        if (this.state.table_edit != undefined) {
            var tableedit = []
            tableedit.push(
                <Modal style={{ textAlign: 'center', fontSize: '30px' }} isOpen={this.state.modal_table} toggle={this.toggle_Table} className={this.props.className} size="lg">
                    <ModalHeader ><div style={{ textAlign: 'center', fontSize: '30px' }} >{this.state.table_edit.table_name}</div></ModalHeader>
                    <ModalBody style={{ paddingTop: '5%' }}>
                        <Row>
                            <Col lg="6">
                                <Row>
                                    <Col lg="12" >
                                        <FormGroup>
                                            <Input type="text" id="table_code" name="table_code" class="form-control" value={this.state.table_edit.table_code} readOnly />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="6" >
                                        <FormGroup>
                                            <Input type="text" id="table_name" name="table_name" class="form-control" defaultValue={this.state.table_edit.table_name} />
                                        </FormGroup>
                                    </Col>
                                    <Col lg="6" >
                                        <FormGroup>
                                            <Input type="text" id="table_amount" name="table_amount" class="form-control" defaultValue={this.state.table_edit.table_amount} />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg="6">
                                <Row>
                                    <Col lg="12">
                                        <div>รูปปปป</div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="6">
                                <Row>
                                    <Col lg="12">
                                        <FormGroup>
                                            <Input type="select" id="zone_id" name="zone_id" class="form-control" defaultValue={this.state.table_edit.zone_id}>
                                                <option value="">Select</option>
                                                {zone_edit}
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.toggle_Table} size="lg" color="secondary" > กลับ</Button>
                        <Button onClick={this.handleSubmit.bind(this)} type="submit" size="lg" color="success">บันทึก</Button>
                        <Button onClick={this.onDelete.bind(this, this.state.table_edit.table_code)} color="danger" size="lg" >ลบ</Button>
                    </ModalFooter>
                </Modal>

            )
        }
        return tableedit;

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
                                <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })} forceRenderTabPanel>
                                    <TabList>

                                        {this.renderZoneMenu()}

                                    </TabList>
                                    {this.state.x}
                                    {/* {this.renderTableByZone()} */}

                                </Tabs>
                            </TabPanel>
                        </Tabs>

                    </CardBody>
                </Card>
                {this.renderModalBill()}
                {this.renderModelEdit()}
            </div >
        )
    }
}
export default (BillView);