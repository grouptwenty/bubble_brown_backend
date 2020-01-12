
import React, { Component } from 'react';
import { Col, Row, Dropdown, DropdownToggle, CardImg, DropdownMenu, DropdownItem, Card, ListGroup, ListGroupItem, CustomInput, FormGroup, Input, CardBody, CardTitle, Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
// import ClickNHold from 'react-click-n-hold';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import MenuModel from '../../models/MenuModel'
import MenuTypeModel from '../../models/MenuTypeModel'
import OrderModel from '../../models/OrderModel'
import OrderListModel from '../../models/OrderListModel'
import TableModel from '../../models/TableModel'
import StockOutModel from '../../models/StockOutModel'
import OrderCencelModel from '../../models/OrderCencelModel'
import PromotionModel from '../../models/PromotionModel';

var promotion_model = new PromotionModel;
const stock_out_model = new StockOutModel
const menu_model = new MenuModel
const menutype_model = new MenuTypeModel
const order_model = new OrderModel
const order_list_model = new OrderListModel
const table_model = new TableModel
const ordercencel_model = new OrderCencelModel
var cart = [];



class OrderView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            promotion_list: [],
            tabIndex: 0,
            refresh: false

        };
        this.renderMenuby = this.renderMenuby.bind(this);
        this.renderMenuType = this.renderMenuType.bind(this);
        this.rendercart = this.rendercart.bind(this);
        this.addItemTocart = this.addItemTocart.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.rendertotal = this.rendertotal.bind(this);
        this.sumtotal = this.sumtotal.bind(this);
        this.toggle_cancel = this.toggle_cancel.bind(this);
        this.toggle_order_cancel = this.toggle_order_cancel.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.renderCencelOrder = this.renderCencelOrder.bind(this);
        this.renderPromotion = this.renderPromotion.bind(this);
        this.rendershowPromotion = this.rendershowPromotion.bind(this);
        this.showPromotion = this.showPromotion.bind(this);



    }


    async componentDidMount() {
        cart = []
        const code = this.props.match.params.code
        console.log(code);


        var menutype_list = await menutype_model.getMenuTypeBy(this.props.user)
        this.setState({
            menutype_list: menutype_list.data,
        })


        var table_list = await table_model.getTableBy()
        this.setState({
            table_list: table_list.data
        })

        this.renderMenuby()

        var promotion_list = await promotion_model.getPromotionBy();
        this.setState({
            promotion_list: promotion_list.data,
        })

        var order_Bycode = await order_model.getOrderByCode(this.props.match.params.code)

        this.setState({
            order_Bycode: order_Bycode.data
        })
        // console.log("254875",this.state.order_Bycode.promotion_header);


        if (code != undefined) {

            var order_old = await order_model.getOrderByCode(code)
            var orderlist_old = await order_list_model.getOrderListByOrderCode(code)
            console.log("order_old", order_old);
            console.log("orderlist_old", orderlist_old);

            this.setState({
                order_old: order_old.data,
                orderlist_old: orderlist_old.data
            })
            for (var i in orderlist_old.data) {

                this.addItemTocart(orderlist_old.data[i].order_list_name, orderlist_old.data[i].order_list_price_qty, orderlist_old.data[i].menu_code, orderlist_old.data[i].order_list_qty)
            }

        }


    }

    toggle_cancel() {
        this.setState(prevState => ({
            setDropdownOpen: !prevState.setDropdownOpen
        }));
    }

    toggle_order_cancel() {
        this.setState(prevState => ({
            modal_order_cancel: !prevState.modal_order_cancel
        }));
    }

    async getMenuByCode(code) {
        var menu_list = await menu_model.getMenuByCode(code)
        console.log("menulistbycode", menu_list);
        this.setState({
            menu_list: menu_list.data
        })
    }




    start(e) {
        console.log('start');
    }

    end(e, enough) {
        if (enough) {
            alert("เพิ่มลบแก้ไขจ้าาาา")
            console.log('END');
            console.log(enough ? 'Click released after enough time' : 'Click released too soon');

        }
    }

    clickNHold(e) {
        console.log('CLICK AND HOLD ');
    }


    renderMenuType() {
        if (this.state.menutype_list != undefined) {

            var type_list = []
            for (let i = 0; i < this.state.menutype_list.length; i++) {
                type_list.push(

                    <Tab onClick={this.getMenuByCode.bind(this, this.state.menutype_list[i].menu_type_id)}>
                        <label> {this.state.menutype_list[i].menu_type_name}</label>
                    </Tab>




                )
            }
            return type_list;
        }
    }
    addItem(data) {

        var name = data.menu_name;
        var price = data.menu_price;
        var code = data.menu_code;
        this.addItemTocart(name, price, code, 1)
    }

    addItemButton(data) {

        var name = data.name;
        var price = data.price;
        var code = data.code;
        this.addItemTocart(name, price, code, 1)
    }
    deleteItemButton(data) {

        var name = data.name;
        var price = data.price;
        var code = data.code;
        this.deleteItem(name, price, code, 1)
    }
    addItemTocart(name, price, code, count) {
        for (var item in cart) {
            if (cart[item].code === code) {
                cart[item].count++;
                this.setState({
                    cart: cart
                })
                return;
            }
        }

        cart.push({
            name: name,
            price: price,
            code: code,
            count: count
        });

        console.log("cart", cart);
        this.setState({
            cart: cart
        })
    }
    deleteItem(name, price, code, count) {
        for (var item in cart) {
            if (cart[item].code === code) {
                cart[item].count--;
                if (cart[item].count === 0) {
                    cart.splice(item, 1);
                }
                this.setState({
                    cart: cart
                })
                break;
            }
        }
    }
    rendercart() {
        if (this.state.cart != undefined) {
            var cart_list = []
            for (let i = 0; i < this.state.cart.length; i++) {
                cart_list.push(
                    <div>
                        <Row >
                            <Col lg="4" style={{ paddingTop: '5px' }}><div>{this.state.cart[i].name}</div></Col>
                            <Col lg="4" style={{ paddingTop: '5px', textAlign: 'center' }}><div>{this.state.cart[i].price}</div></Col>
                            <Col lg="4" style={{ paddingTop: '5px', textAlign: 'center' }}><Button onClick={this.deleteItemButton.bind(this, this.state.cart[i])}> - </Button>{this.state.cart[i].count}<Button onClick={this.addItemButton.bind(this, this.state.cart[i])}> + </Button></Col>
                        </Row>
                        <hr />
                    </div>
                )
            }
            return cart_list;
        }

    }

    rendertotal() {
        if (this.state.cart != undefined) {
            var order_total = []
            var sum = 0;
            for (let i = 0; i < this.state.cart.length; i++) {
                sum += parseFloat(this.state.cart[i].count) * parseFloat(this.state.cart[i].price)
                // console.log("..........", this.state.cart[i].count);
                // console.log("..1........", this.state.cart[i].price);
            }
            if (this.state.promotion_use_list != undefined) {
                if (this.state.promotion_use_list.discount_percent != "") {
                    var discount_price = (sum * this.state.promotion_use_list.discount_percent) / 100
                    sum = sum - discount_price
                    // console.log("sum_discount_percent", sum);
                }
                if (this.state.promotion_use_list.discount_price != "") {
                    var discount_price = sum - this.state.promotion_use_list.discount_price
                    sum = discount_price
                    // console.log("sum_discount_price", sum);
                }
            }
            if (this.props.match.params.code != undefined) {
                order_total.push(
                    <Row>
                        <Col lg="8" style={{ paddingTop: '30px' }}>
                            <label>ราคารวม</label>
                        </Col>
                        <Col lg="4" style={{ textAlign: 'center', paddingTop: '30px' }}>
                            <label>{this.state.order_old.amount}</label>
                        </Col>
                    </Row>
                )
            } else {
                order_total.push(
                    <Row>
                        <Col lg="8" style={{ paddingTop: '30px' }}>
                            <label>ราคารวม</label>
                        </Col>
                        <Col lg="4" style={{ textAlign: 'center', paddingTop: '30px' }}>
                            <label>{sum}</label>
                        </Col>
                    </Row>
                )
            }

            // console.log("3333333333", sum);
            // this.setState({
            //     sum_price: sum
            // })
            return order_total;
        }

    }

    async renderMenuby() {
        var panel = []
        if (this.state.menutype_list != undefined) {

            for (let i = 0; i < this.state.menutype_list.length; i++) {

                var menu_list = await menu_model.getMenuByCode(this.state.menutype_list[i].menu_type_id)
                this.setState({
                    menu_list: menu_list.data
                })
                var menulist = []
                for (let j = 0; j < this.state.menu_list.length; j++) {
                    menulist.push(

                        <Col lg="4">
                            {/* <ClickNHold
                            time={0.5}
                            onStart={this.start}
                            onClickNHold={this.clickNHold}
                            onEnd={this.end} > */}
                            <Card onClick={this.addItem.bind(this, this.state.menu_list[j])}>
                                {/* <CardImg top width="100%" src="/logo_bubblebrown.png" alt="Card image cap" /> */}
                                <CardBody>
                                    <CardTitle><label >{this.state.menu_list[j].menu_name}</label> </CardTitle>
                                </CardBody>
                            </Card>

                            {/* </ClickNHold> */}
                        </Col>

                    )
                }
                panel.push(

                    <TabPanel>
                        <Row>
                            {menulist}
                        </Row>

                    </TabPanel>
                )
            }
        }
        this.setState({
            x: panel
        })
    }

    renderTable() {
        if (this.state.table_list != undefined) {
            var table = []
            for (var key in this.state.table_list) {

                table.push(
                    <option value={this.state.table_list[key].table_code} >{this.state.table_list[key].table_name}</option>
                )
            }
            return table;
        }

    }

    renderPromotion() {
        if (this.state.promotion_list != undefined) {
            var promotion = []
            for (var key in this.state.promotion_list) {

                promotion.push(
                    <Col lg="4">

                        <Card
                            onClick={this.showPromotion.bind(this, this.state.promotion_list[key])}
                        >
                            {/* <CardImg top width="100%" src="/logo_bubblebrown.png" alt="Card image cap" /> */}
                            <CardBody>
                                <CardTitle><label >{this.state.promotion_list[key].promotion_header}</label> </CardTitle>
                            </CardBody>
                        </Card>

                        {/* </ClickNHold> */}
                    </Col>


                )
            }
            return promotion;
        }

    }

    showPromotion(promotion_list) {

        var promotion_list = promotion_list

        this.setState({
            promotion_use_list: promotion_list,
        })

        this.rendershowPromotion()

    }

    rendershowPromotion() {
        if (this.state.promotion_use_list != undefined) {
            // console.log("promotion_list", promotion_list);
            var show_promotion = []


            show_promotion.push(
                <Row>
                    <Col lg="6">
                        <label> {this.state.promotion_use_list.promotion_header}</label>
                    </Col>
                </Row>
            )


            return show_promotion;
        }
    }

    rendershowOldPromotion() {
        if (this.state.promotion_use_list != undefined) {
            // console.log("promotion_list", promotion_list);
            var show_promotion = []


            show_promotion.push(
                <Row>
                    <Col lg="6">
                        <label> {this.state.promotion_use_list.promotion_header}</label>
                    </Col>
                </Row>
            )


            return show_promotion;
        }
    }

    async insertOrder() {


        var order = []


        const max_code = await order_model.getOrderMaxCode()//province data
        var order_code = 'OD' + max_code.data.order_code_max
        // console.log(max_code);

        const date_now = new Date();
        var toDay = date_now.getFullYear() + "" + (date_now.getMonth() + 1) + "" + date_now.getDate() + "" + date_now.getTime();
        const data = new FormData();
        var date = Date.now();
        var order_service = document.getElementById('order_service').value
        var table_code = document.getElementById('table_code').value
        var total_sum = this.sumtotal()
        if (this.state.promotion_use_list != undefined) {
            var order = {
                'table_code': table_code,
                'order_service': order_service,
                'customer_code': 'CM001',
                'order_date': toDay,
                'order_code': order_code,
                'amount': total_sum.sum_price,
                'promotion_code': this.state.promotion_use_list.promotion_code,
                'order_total_price': total_sum.total

            }

        } else {
            var order = {
                'table_code': table_code,
                'order_service': order_service,
                'customer_code': 'CM001',
                'order_date': toDay,
                'order_code': order_code,
                'amount': total_sum.sum_price,
                'promotion_code': '',
                'order_total_price': total_sum.total
            }
        }






        const res = await order_model.insertOrder(order)
        for (var key in this.state.cart) {
            // this.state.cart[key].code
            // this.state.cart[key].count
            // this.state.cart[key].name
            // this.state.cart[key].price
            var order_list = {
                order_code: order_code,
                menu_code: this.state.cart[key].code,
                order_list_qty: this.state.cart[key].count,
                order_list_name: this.state.cart[key].name,
                order_list_price_qty: this.state.cart[key].price,
                order_list_price_sum_qty: this.state.cart[key].count * this.state.cart[key].price,
                order_list_price_sum: this.sumtotal()
            }
            const arr = await order_list_model.insertOrderList(order_list)




            if (order_list != undefined) {
                swal({
                    title: "สั่งอาหารเรียบร้อย",
                    text: "โปรดรออาหารสักครู่...",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/bill/')
            }
        }

    }

    async updateOrder() {

        var order = []

        const date_now = new Date();
        var toDay = date_now.getFullYear() + "" + (date_now.getMonth() + 1) + "" + date_now.getDate() + "" + date_now.getTime();
        const data = new FormData();
        var date = Date.now();
        var total_sum = this.sumtotal()
        var order = {
            'table_code': '01',
            'customer_code': 'CM001',
            'order_date': toDay,
            'amount': total_sum.sum_price,
            'order_code': this.props.match.params.code,
            'order_total_price': total_sum.total
        }



        const res = await order_model.updateOrderByCode(order)
        const arr = await order_list_model.deleteOrderListByCode(this.state.order_old)

        for (var key in this.state.cart) {
            // this.state.cart[key].code
            // this.state.cart[key].count
            // this.state.cart[key].name
            // this.state.cart[key].price
            var order_list = {
                order_code: this.state.order_old.order_code,
                menu_code: this.state.cart[key].code,
                order_list_qty: this.state.cart[key].count,
                order_list_name: this.state.cart[key].name,
                order_list_price_qty: this.state.cart[key].price,
                order_list_price_sum_qty: this.state.cart[key].count * this.state.cart[key].price,
                order_list_price_sum: this.sumtotal()
            }
            // console.log("===>", order_list);

            const arr = await order_list_model.insertOrderList(order_list)

            const DeleteStockOut = await stock_out_model.deleteStockOutByOrderCode(this.state.order_old)
            // console.log(DeleteStockOut);

            const stock_out = await order_model.getRecipeByMenu(this.state.cart[key].code)
            // console.log(stock_out);


            for (var key in stock_out.data) {
                var recipe = {
                    order_code: this.state.order_old.order_code,
                    menu_code: stock_out.data[key].menu_code,
                    product_code: stock_out.data[key].product_code,
                    product_qty: stock_out.data[key].qty_cal,
                    menu_qty: order_list.order_list_qty,
                    product_cost: stock_out.data[key].product_cost,
                    unit: stock_out.data[key].unit_id,
                    stock_out_date: date,

                }

                // console.log("recipe", recipe);

                const insertstockout = await stock_out_model.insertStockOutByOrder(recipe)
            }
            if (order_list != undefined) {
                swal({
                    title: "สั่งอาหารเรียบร้อย",
                    text: "โปรดรออาหารสักครู่...",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/bill/')
            }
        }

    }

    async onMenuAdd() {
        // const max_code = await table_model.getTableMaxCode()//province data
        // // console.log("max_code", max_code);

        // var table_code = 'T' + max_code.data.table_code_max
        // this.setState({
        //     table_code_add: table_code
        // })
        // this.toggle_Table_Add()
    }


    sumtotal() {
        if (this.state.cart != undefined) {
            var sum = 0;
            var total = 0;
            for (let i = 0; i < this.state.cart.length; i++) {
                sum += parseFloat(this.state.cart[i].count) * parseFloat(this.state.cart[i].price)
                total += parseFloat(this.state.cart[i].count) * parseFloat(this.state.cart[i].price)
            }
            if (this.state.promotion_use_list != undefined) {
                if (this.state.promotion_use_list.discount_percent != "") {
                    var discount_price = (sum * this.state.promotion_use_list.discount_percent) / 100
                    sum = sum - discount_price
                    // console.log("sum_discount_percent", sum);
                }
                if (this.state.promotion_use_list.discount_price != "") {
                    var discount_price = sum - this.state.promotion_use_list.discount_price
                    sum = discount_price
                    // console.log("sum_discount_price", sum);
                }
            }
            var total_sum = {
                sum_price: sum,
                total: total
            }
            // console.log("5555555555", this.state.total);
            return total_sum;
        }

    }

    async checkCancelOrder() {

        var order_cencel = await ordercencel_model.getOrderCencelBy()
        // // alert(order_cencel)
        // console.log("order_cencel", order_cencel);
        this.setState({
            order_cencel: order_cencel.data
        })
        this.toggle_order_cancel()

    }

    renderCencelOrder() {

        var order_cencel_list = []

        if (this.state.order_cencel != undefined) {
            for (var key in this.state.order_cencel) {
                order_cencel_list.push(

                    <ListGroup>
                        <ListGroupItem action>
                            <Row style={{ textAlign: 'center', fontSize: '15pt', alignItems: 'center' }}>
                                <Col lg="6" >
                                    <label>{this.state.order_cencel[key].cencel_list_name}</label>
                                </Col>
                                <Col lg="6" >

                                    <CustomInput type="radio" id={this.state.order_cencel[key].cencel_list_id} name="cencel_list_id"
                                        onClick={this.updateCencel.bind(this, this.state.order_cencel[key].cencel_list_id)}
                                    />

                                </Col>
                            </Row>

                        </ListGroupItem>
                    </ListGroup>

                )
                console.log(this.state.order_cencel[key].cencel_list_id);

            }
        }

        var cancel = []
        cancel.push(
            <Modal isOpen={this.state.modal_order_cancel} toggle={this.toggle_order_cancel} size="sm">

                <ModalBody style={{ paddingTop: '2%' }}>
                    <Row>
                        <Col lg="12">
                            <div style={{ textAlign: 'center', fontSize: '20pt' }} >โปรดเลือกเหตุผล</div>
                        </Col>
                    </Row>
                    <hr />
                    {order_cencel_list}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.toggle_order_cancel} size="lg" color="secondary" > กลับ</Button>
                    {/* <Button onClick={this.updateCencel.bind(this)} type="submit" size="lg" color="success">บันทึก</Button> */}
                </ModalFooter>
            </Modal>
        )
        return cancel;


    }




    async updateCencel(order_cencel_id) {
        console.log("order_cencel_id", order_cencel_id);


        var cencel = {
            order_cencel_id: order_cencel_id,
            order_code: this.props.match.params.code

        }

        // this.componentDidMount()
        swal({
            title: "คุณแน่ใจ ?",
            text: "คุณแน่ใจว่าต้องการยกเลิกออเดอร์",
            buttons: true,
            dangerMode: true,
        })

            .then(async (willDelete) => {
                var updare_cencel_order = await order_model.updateCencelOrder(cencel)
                const deleteStockOut = await stock_out_model.deleteStockOutByOrderCode(this.state.order_old)
                if (willDelete) {
                    swal({
                        title: "ยกเลิกออเดอร์เรียบร้อย",
                        icon: "success",
                    });
                }

                this.props.history.push('/bill/')
            });

    }


    render() {


        return (

            <Card>
                <CardBody >
                    <Row style={{ minWidth: '100%', height: '100%', minHeight: '80vh' }}>

                        <Col lg="6" style={{ overflowY: 'scroll' }}>
                            <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })} forceRenderTabPanel>
                                <TabList>
                                    {/* <Row style={{ paddingTop: '2%' }}> */}
                                    {this.renderMenuType()}
                                    {this.state.cart != undefined && this.state.cart != "" && this.props.match.params.code != undefined ? '' :
                                        <Tab><label >โปรโมชัน</label></Tab>
                                    }
                                    {/* </Row> */}
                                </TabList>
                                {this.state.x}
                                {this.state.cart != undefined && this.state.cart != "" && this.props.match.params.code != undefined ? '' :
                                    <TabPanel >
                                        <Row>
                                            {this.renderPromotion()}
                                        </Row>
                                    </TabPanel>
                                }
                            </Tabs>
                        </Col>



                        <Col lg="6" style={{ borderStyle: 'solid', borderWidth: 1, overflowY: 'scroll' }}>
                            {this.props.match.params.code == undefined ?
                                <Row style={{ padding: '2%' }}>
                                    <Col lg="4">
                                        <FormGroup>
                                            <Input type="select" id="order_service" name="order_service" class="form-control" >
                                                <option value="ทานที่ร้าน">ทานที่ร้าน</option>
                                                <option value="สั่งกลับบ้าน">สั่งกลับบ้าน</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    <Col lg="4">
                                        <FormGroup>
                                            <Input type="select" id="table_code" name="table_code" class="form-control">
                                                <option>เลือกโต๊ะ</option>
                                                {this.renderTable()}
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    {/* <Col lg="3">
                                        <FormGroup>
                                            <Input type="select" id="order_service" name="order_service" class="form-control" >
                                                <option value="ทานที่ร้าน">ทานที่ร้าน</option>
                                                <option value="สั่งกลับบ้าน">สั่งกลับบ้าน</option>
                                            </Input>
                                        </FormGroup>
                                    </Col> */}
                                </Row>
                                : ''}
                            {this.state.cart != undefined && this.state.cart != "" && this.props.match.params.code != undefined ?
                                <Row style={{ padding: '2%' }}>
                                    <Col lg="4">
                                        <label>{this.state.order_old.order_service}</label>
                                    </Col>
                                    <Col lg="6">
                                        <a>{this.state.order_old.zone_name} - {this.state.order_old.table_name}</a>
                                    </Col>
                                    <Col lg="2">
                                        <i class="fa fa-user" aria-hidden="true" style={{ color: '#515A5A', fontSize: '15px' }} /> <a>{this.state.order_old.table_amount}</a>
                                    </Col>

                                </Row>

                                : ''}
                            <Row >
                                <div style={{ paddingTop: '10px', paddingLeft: '10px', paddingBottom: '30px' }}> รายการอาหาร</div>

                            </Row>

                            {this.rendercart()}

                            {this.rendershowPromotion()}
                            {this.rendertotal()}
                            {this.state.cart != undefined && this.state.cart != "" && this.props.match.params.code == undefined ? <Row ><div style={{ paddingTop: '30px', textAlign: 'end' }}><Button onClick={this.insertOrder.bind(this)}><label>สั่งอาหาร</label></Button></div></Row> : ''}
                            {this.state.cart != undefined && this.state.cart != "" && this.props.match.params.code != undefined ? <Row ><div style={{ paddingTop: '30px', textAlign: 'end' }}><Button onClick={this.updateOrder.bind(this)}><label>แก้ไขการสั่งอาหาร</label></Button></div></Row> : ''}

                            {this.state.cart != undefined && this.state.cart != "" && this.props.match.params.code != undefined ?
                                <Row style={{ textAlign: 'end' }}>
                                    <Col lg="12">
                                        <Dropdown direction="up" isOpen={this.state.setDropdownOpen} toggle={this.toggle_cancel}>
                                            <DropdownToggle size="lg">
                                                <i class="fa fa-ellipsis-h" aria-hidden="true" style={{ color: '#515A5A' }} />
                                            </DropdownToggle>
                                            <DropdownMenu style={{ backgroundColor: '#797D7F' }}>
                                                <DropdownItem style={{ hover: '#CD6155' }}>
                                                    <Row>
                                                        <Col sm="6">
                                                            <a style={{ color: '#fff' }} > ย้ายโต๊ะ</a>
                                                        </Col>
                                                        <Col sm="6" style={{ textAlign: 'end' }}>
                                                            <i class="fa fa-arrows" aria-hidden="true" style={{ color: '#fff' }} />
                                                        </Col>
                                                    </Row>
                                                </DropdownItem>
                                                <DropdownItem style={{ hover: '#CD6155' }} onClick={this.checkCancelOrder.bind(this)} >
                                                    <Row >
                                                        <Col sm="6">
                                                            <a style={{ color: '#fff' }}  >ยกเลิกออเดอร์</a>
                                                        </Col>
                                                        <Col sm="6" style={{ textAlign: 'end' }}>
                                                            <i class="fa fa-trash-o" aria-hidden="true" style={{ color: '#fff' }} />
                                                        </Col>
                                                    </Row>
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </Col>
                                    {this.renderCencelOrder()}
                                </Row>

                                : ''}
                        </Col>
                    </Row>
                </CardBody>
            </Card>



        )
    }
}
const mapStatetoProps = (state) => {
    return {
        user: state.user,
    }
}
export default connect(mapStatetoProps)(OrderView);