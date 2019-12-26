import React, { Component, useState } from 'react';
import { Nav, NavItem, Table, TabContent, TabPane, Col, Row, CardHeader, Card, Input, CardText, CardBody, CardTitle, Button, Label, FormGroup, Form, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link, NavLink } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ClickNHold from 'react-click-n-hold';
import swal from 'sweetalert';
import Swal from 'sweetalert2'
import ReactToPrint from 'react-to-print';

import OrderModel from '../../models/OrderModel'
import OrderListModel from '../../models/OrderListModel'
import ZoneModel from '../../models/ZoneModel'
import TableModel from '../../models/TableModel'
import StockOutModel from '../../models/StockOutModel'

const stock_out_model = new StockOutModel
const order_model = new OrderModel
const orderlist_model = new OrderListModel
const zone_model = new ZoneModel
const table_model = new TableModel
var QRCode = require('qrcode.react');

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
            x: [],
            recive: 0,
            charge: 0

        };

        this.onBillDetail = this.onBillDetail.bind(this);
        this.onTableEdit = this.onTableEdit.bind(this);
        this.onCheckBill = this.onCheckBill.bind(this);
        this.toggle_Bill = this.toggle_Bill.bind(this);
        this.toggle_Check_Bill = this.toggle_Check_Bill.bind(this);
        this.toggle_Table_Edit = this.toggle_Table_Edit.bind(this);
        this.toggle_Table_Add = this.toggle_Table_Add.bind(this);
        this.renderBill = this.renderBill.bind(this);
        this.renderOrderList = this.renderOrderList.bind(this);
        this.renderZoneMenu = this.renderZoneMenu.bind(this);
        this.renderTableByZone = this.renderTableByZone.bind(this);
        this.renderModalBill = this.renderModalBill.bind(this);
        this.renderModelTableEdit = this.renderModelTableEdit.bind(this);
        this.renderModelTableAdd = this.renderModelTableAdd.bind(this);
        // this.renderModelCheckBill = this.renderModelCheckBill.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.start = this.start.bind(this);
        this.download = this.download.bind(this);
        this.calculate = this.calculate.bind(this);
        this.confirm = this.confirm.bind(this);

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


    toggle_Table_Edit() {
        this.setState(prevState => ({
            modal_table_edit: !prevState.modal_table_edit

        }));
    }

    toggle_Table_Add() {
        this.setState(prevState => ({
            modal_table_add: !prevState.modal_table_add

        }));
    }

    toggle_Check_Bill() {
        this.setState(prevState => ({
            modal_check_bill: !prevState.modal_check_bill

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

        this.toggle_Table_Edit()
    }

    async onTableAdd() {
        const max_code = await table_model.getTableMaxCode()//province data
        // console.log("max_code", max_code);

        var table_code = 'T' + max_code.data.table_code_max
        this.setState({
            table_code_add: table_code
        })
        this.toggle_Table_Add()
    }

    onCheckBill(check_bill) {
        console.log("check_bill", check_bill);
        this.setState({
            check_bill: check_bill
        })
        this.toggle_Check_Bill()
    }


    async confirm(order_code) {
        Swal.fire({
            title: 'ต้องการชำระเงิน ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'กลับ'
        }).then((result) => {
            if (result.value) {

                this.Payment(order_code)
            }
        })
    }


    async Payment(order_code) {

        var date = Date.now();
        var Payment = await order_model.Payment(order_code)

        var order_list = await orderlist_model.getOrderListBy(order_code)
        for (var key in order_list.data) {
            const stock_out = await order_model.getRecipeByMenu(order_list.data[key].product_code)


            for (var i in stock_out.data) {

                var recipe = {
                    order_code: order_code,
                    menu_code: stock_out.data[i].menu_code,
                    product_code: stock_out.data[i].product_code,
                    product_qty: stock_out.data[i].qty_cal,
                    menu_qty: order_list.order_list_qty,
                    product_cost: stock_out.data[i].product_cost,
                    unit: stock_out.data[i].unit_id,
                    stock_out_date: date,

                }


                const insertstockout = await stock_out_model.insertStockOutByOrder(recipe)
            }
        }
    }


    start(order_code) {
        this.props.history.push('/order/' + order_code)
    }

    async confirmOrder(bill_order) {

        var order_list_confirm = await orderlist_model.getOrderListBy(bill_order.order_code)

        var order_list = ''
        for (var key in order_list_confirm.data) {

            order_list += '<tr>' +

                ' <td width="60%" >' + order_list_confirm.data[key].order_list_name + '</td>' +
                ' <td width="50%">' + order_list_confirm.data[key].order_list_qty + '</td>' +
                ' </tr>'

            // console.log(order_list_confirm);
        }



        console.log("order_list", order_list);

        Swal.fire({
            title: 'ต้องการรับออเดอร์ ?',
            html: '<br/>' +
                ' <Table size="lg" width="100%"> ' +
                ' <tbody>' +
                order_list +
                ' </tbody>' +
                '</Table>' +
                '<br/>',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'กลับ'
        }).then((result) => {
            if (result.value) {
                this.updateConfirmOrder(bill_order.order_code)
            }
        })
    }


    async updateConfirmOrder(order_code) {
        var order_list_confirm = await order_model.updateConfirmOrder(order_code)
        this.componentDidMount()
    }

    renderBill() {
        var bill = []
        for (let i = 0; i < this.state.bill_order.length; i++) {
            bill.push(

                <Col sm="3">

                    {/* <NavLink exact to={`/menu/` + this.state.bill_order[i].order_code } style={{ width: '100%' }}> */}
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
                        {this.state.bill_order[i].order_status != 0 ?
                            <Row >
                                <Col lg="6" >
                                    <div style={{ textAlign: 'end' }}>
                                        <Button onClick={this.onCheckBill.bind(this, this.state.bill_order[i])} color="secondary">ชำระเงิน</Button>
                                    </div>
                                </Col>
                                <Col lg="6">
                                    <div style={{ textAlign: 'start' }}>
                                        <Button onClick={this.onBillDetail.bind(this, this.state.bill_order[i].order_code)} color="secondary" >ดูบิล</Button>
                                    </div>
                                </Col>
                            </Row>
                            : <Row >
                                <Col lg="12" >
                                    <div style={{ textAlign: 'end' }}>
                                        <Button onClick={this.confirmOrder.bind(this, this.state.bill_order[i])} color="secondary">ออกบิล</Button>
                                    </div>
                                </Col>
                            </Row>}

                    </Card>
                    {/* </NavLink> */}

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
                            <Col lg="2">
                                <Button color="success" size="lg" onClick={this.onTableAdd.bind(this)}>เพิ่มโต๊ะ</Button>
                            </Col>

                        </Row>

                    </TabPanel>
                )


            }
        }
        // return panel;
        // console.log("panel",panel);

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
                        <Button color="secondary" onClick={this.toggle_Bill} style={{ width: 100, height: 40 }}>กลับ</Button>
                        <Button color="primary" onClick={this.start.bind(this, this.state.order_code_list)} style={{ width: 100, height: 40 }}>แก้ไขบิล</Button>
                    </ModalFooter>
                </Modal>
            )
            return modal_bill;
        }
    }

    async insertTable() {


        var table_code = document.getElementById('table_code').value
        var table_name = document.getElementById('table_name').value
        var table_amount = document.getElementById('table_amount').value
        var zone_id = document.getElementById('zone_id').value

        var add_table = {
            table_code: table_code,
            table_name: table_name,
            table_amount: table_amount,
            table_amount: table_amount,
            zone_id: zone_id
        }

        var res = await table_model.insertTable(add_table);

        if (add_table != undefined) {
            swal({
                title: "เพิ่มข้อมูลโต๊ะเรียบร้อย",
                icon: "success",
                button: "Close",
            });
            this.toggle_Table_Edit()
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
            this.toggle_Table_Edit()
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
                                this.toggle_Table_Edit()
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

    renderModelTableAdd() {

        let zone_add = []

        for (let i = 0; i < this.state.zone_menu.length; i++) {
            zone_add.push(
                <option value={this.state.zone_menu[i].zone_id} >{this.state.zone_menu[i].zone_name}</option>
            )
        }

        var tableadd = []
        tableadd.push(
            <Modal isOpen={this.state.modal_table_add} toggle={this.toggle_Table_Add} size="lg">
                <ModalHeader ><div style={{ textAlign: 'center', fontSize: '30px' }} >เพิ่มโต๊ะ</div></ModalHeader>
                <ModalBody style={{ paddingTop: '2%' }}>

                    <Row>
                        <Col lg="4" >
                            <FormGroup>
                                <label>รหัสโต๊ะ</label>
                                <Input type="text" id="table_code" name="table_code" class="form-control" value={this.state.table_code_add} readOnly />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="4" >
                            <FormGroup>
                                <label>ชื่อโต๊ะ</label>
                                <Input type="text" id="table_name" name="table_name" class="form-control" />
                            </FormGroup>
                        </Col>
                        <Col lg="4" >
                            <FormGroup>
                                <Label>จำนวนที่ลองรับ </Label>
                                <Input type="text" id="table_amount" name="table_amount" class="form-control" />
                            </FormGroup>
                        </Col>
                        <Col lg="4" >
                            <FormGroup>
                                <label >โซน</label>
                                <Input type="select" id="zone_id" name="zone_id" class="form-control" >
                                    <option value="">Select</option>
                                    {zone_add}
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>


                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.toggle_Table_Add} size="lg" color="secondary" > กลับ</Button>
                    <Button onClick={this.insertTable.bind(this)} type="submit" size="lg" color="success">บันทึก</Button>
                </ModalFooter>
            </Modal>

        )

        return tableadd;

    }



    renderModelTableEdit() {

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
                <Modal isOpen={this.state.modal_table_edit} toggle={this.toggle_Table_Edit} className={this.props.className} size="lg">
                    <ModalHeader ><div style={{ textAlign: 'center', fontSize: '30px' }} >{this.state.table_edit.table_name}</div></ModalHeader>
                    <ModalBody style={{ paddingTop: '5%' }}>
                        <Row>
                            <Col lg="6">
                                <Row>
                                    <Col lg="6" >
                                        <FormGroup>
                                            <label>รหัสโต๊ะ</label>
                                            <Input type="text" id="table_code" name="table_code" class="form-control" value={this.state.table_edit.table_code} readOnly />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="12" >
                                        <FormGroup>
                                            <label>ชื่อโต๊ะ</label>
                                            <Input type="text" id="table_name" name="table_name" class="form-control" defaultValue={this.state.table_edit.table_name} />
                                        </FormGroup>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col lg="12" >
                                        <FormGroup>
                                            <Label>จำนวนที่ลองรับ </Label>
                                            <Input type="text" id="table_amount" name="table_amount" class="form-control" defaultValue={this.state.table_edit.table_amount} />
                                        </FormGroup>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col lg="12" >
                                        <FormGroup>
                                            <label >โซน</label>
                                            <Input type="select" id="zone_id" name="zone_id" class="form-control" defaultValue={this.state.table_edit.zone_id}>
                                                <option value="">Select</option>
                                                {zone_edit}
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg="6">
                                <Row style={{ textAlign: 'center' }}>
                                    <Col lg="12">
                                        <div >
                                            <QRCode
                                                id={this.state.table_edit.table_code}
                                                // value={this.state.table_edit.table_code}
                                                value={this.state.table_edit.table_code}
                                                size={250}
                                                level={"H"}
                                                includeMargin={true}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{ textAlign: 'center' }}>
                                    <Col lg="12">
                                        <Button onClick={this.download.bind(this, this.state.table_edit.table_code)}> Download QR </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.toggle_Table_Edit} size="lg" color="secondary" > กลับ</Button>
                        <Button onClick={this.handleSubmit.bind(this)} type="submit" size="lg" color="success">บันทึก</Button>
                        <Button onClick={this.onDelete.bind(this, this.state.table_edit.table_code)} color="danger" size="lg" >ลบ</Button>
                    </ModalFooter>
                </Modal>

            )
        }
        return tableedit;

    }

    download(code) {
        const canvas = document.getElementById(code);
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = code + "QR.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

    }


    async calculatePayment(number) {
        console.log("number", number);

        await this.setState({
            recive: parseInt(this.state.recive + number)
        })
        this.calculate()
    }

    async calculatePaymentSet(number) {
        console.log("number", number);

        await this.setState({
            recive: parseInt(number)
        })
        this.calculate()
    }

    async  calculatePaymentDelete() {
        var array = String(this.state.recive.toString().replace(/,/g, ''));
        let strArr = [...array];

        if (strArr.length > 1) {
            strArr.splice(strArr.length - 1, 1);
            strArr = strArr.toString().replace(/,/g, '')
            console.log("strArr", strArr);
        } else {
            strArr = 0
            strArr = strArr.toString().replace(/,/g, '')
        }

        await this.setState({
            recive: Number(strArr.toString().replace(/,/g, ''))
        });
        this.calculate()
    }

    calculate() {
        var sum = 0
        sum = Number(this.state.recive) - Number(this.state.check_bill.order_total_price)
        this.setState({
            charge: Number(sum.toString().replace(/,/g, ''))
        });

        console.log("this.state.recive", this.state.recive);
        console.log("this.state.order_total_price", this.state.check_bill.order_total_price);

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
                                                    <NavLink exact to={`/order/`} style={{ width: '100%' }}>
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
                {this.state.check_bill != undefined ? <Modal isOpen={this.state.modal_check_bill} toggle={this.toggle_Check_Bill} size="lg" >
                    {/* <ModalHeader toggle={this.toggle_Check_Bill}  >
                        <Row style={{ textAlign: 'center' }}>
                            <Col lg="12">
                                <a>ชำระเงิน {this.state.check_bill.zone_name} - {this.state.check_bill.table_name}</a>
                            </Col>
                        </Row>
                    </ModalHeader> */}
                    <ModalBody >
                        <Row style={{ marginRight: '5px', marginLeft: '5px' }}>
                            <Col lg="4"  >
                                <a style={{ fontSize: '20px' }}><i class="fa fa-times" aria-hidden="true" onClick={this.toggle_Check_Bill} style={{ fontSize: '30px', color: '#909497' }} /></a>
                            </Col>
                            <Col lg="4">
                                <a style={{ textAlign: 'center', fontSize: '20px' }}>ชำระเงิน [ {this.state.check_bill.zone_name} - {this.state.check_bill.table_name} ]</a>
                            </Col>
                            <Col lg="4" style={{ textAlign: 'end' }}>
                                <ReactToPrint
                                    trigger={() => <a id='print' ><i class="fa fa-print" aria-hidden="true" style={{ fontSize: '30px', color: '#909497', }} /></a>}
                                    content={() => this.componentRef}

                                />
                                <div style={{ display: 'none' }}>
                                    <ComponentToPrint ref={el => (this.componentRef = el)} pageStyle={"@page { size: A5 portrait;}"} recive={this.state.recive} charge={this.state.charge} print_order={this.state.check_bill} />
                                </div>
                            </Col>
                        </Row>
                        <hr />
                        <br />
                        <Row>
                            <Col lg="8">
                                <Card body style={{ backgroundColor: '#F2F3F4', borderColor: '#E5E7E9' }}>
                                    <Row>

                                        <Col lg="6">
                                            <h4 > ได้รับแล้ว</h4>
                                        </Col>

                                        <Col lg="6" style={{ textAlign: 'end' }}>
                                            <h4 >ยอดชำระ</h4>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg="6">
                                            <h3 style={{ fontSize: '18px' }}><i class="fa fa-btc" aria-hidden="true" style={{ color: '#515A5A', fontSize: '18px' }} /> {Number(this.state.recive).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</h3>
                                        </Col>

                                        <Col lg="6" style={{ textAlign: 'end' }}>
                                            <h3 style={{ fontSize: '18px' }}><i class="fa fa-btc" aria-hidden="true" style={{ color: '#515A5A', fontSize: '18px' }} /> {Number(this.state.check_bill.order_total_price).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} </h3>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col lg="4" >
                                <Card body style={{ backgroundColor: '#F2F3F4', borderColor: '#E5E7E9' }}>
                                    <Row>

                                        <Col lg="12" style={{ textAlign: 'end' }}>
                                            <h4 >เงินทอน</h4>
                                        </Col>
                                    </Row>
                                    <Row>

                                        <Col lg="12" style={{ textAlign: 'end' }}>
                                            <h3 style={{ fontSize: '18px' }}><i class="fa fa-btc" aria-hidden="true" style={{ color: '#515A5A', fontSize: '18px' }} /> {Number(this.state.charge).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</h3>
                                        </Col>
                                    </Row>
                                </Card>

                            </Col>
                        </Row>
                        <Row style={{ textAlign: 'center' }}>
                            <Col lg="12" >
                                <Card body style={{ borderColor: '#E5E7E9' }}>
                                    <Row>
                                        <Col lg="4" onClick={this.calculatePaymentSet.bind(this, '100')}>
                                            <h4 style={{ fontSize: '20px', borderRight: 'groove', color: '#32EA63', borderRightColor: '#F8F9F9' }}><i class="fa fa-btc" aria-hidden="true" style={{ color: '#32EA63', fontSize: '18px' }} /> 100</h4>
                                        </Col>
                                        <Col lg="4" onClick={this.calculatePaymentSet.bind(this, '500')}>
                                            <h4 style={{ fontSize: '20px', borderRight: 'groove', color: '#32EA63', borderRightColor: '#F8F9F9' }}><i class="fa fa-btc" aria-hidden="true" style={{ color: '#32EA63', fontSize: '18px' }} /> 500</h4>
                                        </Col>
                                        <Col lg="4" onClick={this.calculatePaymentSet.bind(this, '1000')}>
                                            <h4 style={{ fontSize: '20px', color: '#32EA63' }}><i class="fa fa-btc" aria-hidden="true" style={{ color: '#32EA63', fontSize: '18px' }} /> 1000</h4>
                                        </Col>
                                    </Row>
                                </Card>

                            </Col>



                        </Row>
                        <Row style={{ marginLeft: '5px', marginRight: ' 5px', paddingTop: '5px', paddingBottom: '5px', textAlign: 'center' }}>
                            <br />
                            <br />
                            <Table bordered style={{ borderColor: '#E5E7E9' }}>

                                <tbody >

                                    <tr style={{ fontSize: '23px', color: '#909497' }}>
                                        <td onClick={this.calculatePayment.bind(this, '7')}>7</td>
                                        <td onClick={this.calculatePayment.bind(this, '8')}>8</td>
                                        <td onClick={this.calculatePayment.bind(this, '9')}>9</td>
                                        <td rowSpan='2' onClick={this.calculatePaymentDelete.bind(this)}><i class="fa fa-window-close-o" aria-hidden="true" style={{ fontSize: '30px', marginTop: '30px', color: '#909497' }} /></td>
                                    </tr>
                                    <tr style={{ fontSize: '23px', color: '#909497' }}>
                                        <td onClick={this.calculatePayment.bind(this, '4')}>4</td>
                                        <td onClick={this.calculatePayment.bind(this, '5')}>5</td>
                                        <td onClick={this.calculatePayment.bind(this, '6')}>6</td>

                                    </tr>
                                    <tr style={{ fontSize: '23px', color: '#909497' }}>
                                        <td onClick={this.calculatePayment.bind(this, '1')}>1</td>
                                        <td onClick={this.calculatePayment.bind(this, '2')}>2</td>
                                        <td onClick={this.calculatePayment.bind(this, '3')}>3</td>
                                        <td rowSpan='2'></td>
                                    </tr>
                                    <tr style={{ fontSize: '23px', color: '#909497' }}>
                                        <td onClick={this.calculatePayment.bind(this, '0')}>0</td>
                                        <td onClick={this.calculatePayment.bind(this, '00')}></td>
                                        <td onClick={this.calculatePayment.bind(this, '.')}></td>

                                    </tr>


                                </tbody>
                            </Table>
                        </Row>
                        <br />

                        <Row style={{ textAlign: 'center' }}>
                            <Col lg="12">
                                <Button outline color="success" size="lg" block style={{ borderWidth: '2px' }} onClick={this.confirm.bind(this, this.state.check_bill.order_code)} >ยืนยันการชำระเงิน</Button>
                            </Col>
                        </Row>

                        <br />
                    </ModalBody>

                </Modal> : ''}


                {this.renderModalBill()}
                {this.renderModelTableEdit()}
                {this.renderModelTableAdd()}
                {/* {this.renderModelCheckBill()} */}
            </div >
        )
    }
}



class ComponentToPrint extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],


        };

        this.rederFormPrint = this.rederFormPrint.bind(this);


    }
    async componentDidMount() {
        var code = this.props.print_order.order_code

        var print_order_list = await orderlist_model.getOrderListBy(code)



        this.setState({
            print_order_list: print_order_list.data
        })

    }
    rederFormPrint() {
        if (this.state.print_order_list != undefined) {
            var print = []
            for (var key in this.state.print_order_list) {
                print.push(
                    <tr >
                        <th style={{ fontSize: '26pt', fontFamily: 'Kanit-ExtraLight' }}><label >{this.state.print_order_list[key].order_list_name}</label></th>
                        <td ><a style={{ fontSize: '26pt', fontFamily: 'Kanit-ExtraLight' }}>{this.state.print_order_list[key].order_list_price_qty}</a></td>

                    </tr>

                )

            }
            return print;
        }

    }


    render() {


        return (
            <div style={{ margin: '20px' }}>
                <Row style={{ textAlign: 'center' }}>
                    <Col lg="12">
                        <label style={{ fontSize: '26pt', fontFamily: 'Kanit-ExtraLight' }}>Bubble Brown Cafe</label>
                    </Col>
                </Row>

                <table style={{ width: '100%' }}>

                    <tbody>
                        <tr>
                            <th style={{ fontSize: '26pt', fontFamily: 'Kanit-Thin' }}>รายการสินค้า</th>
                        </tr>

                        {this.rederFormPrint()}

                        <tr>
                            <th style={{ fontSize: '26pt', fontFamily: 'Kanit-Light' }}>ยอดรวม</th>
                            <td style={{ fontSize: '26pt', fontFamily: 'Kanit-Light' }}>{Number(this.props.print_order.order_total_price).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>

                        </tr>
                        <tr>
                            <th style={{ fontSize: '26pt', fontFamily: 'Kanit-ExtraLight' }}>เงินสด</th>
                            <td style={{ fontSize: '26pt', fontFamily: 'Kanit-ExtraLight' }}>{Number(this.props.recive).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>

                        </tr>
                        <tr>
                            <th style={{ fontSize: '26pt', fontFamily: 'Kanit-ExtraLight' }}>ทอน</th>
                            <td style={{ fontSize: '26pt', fontFamily: 'Kanit-ExtraLight' }}>{Number(this.props.charge).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>

                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
export default (BillView);