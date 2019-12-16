import React, { Component } from 'react';
import { Col, Row, Container, Card, CardImg, CardText, FormGroup, Input, CardBody, CardTitle, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
// import ClickNHold from 'react-click-n-hold';
import swal from 'sweetalert';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import MenuModel from '../../models/MenuModel'
import MenuTypeModel from '../../models/MenuTypeModel'
import OrderModel from '../../models/OrderModel'
import OrderListModel from '../../models/OrderListModel'
import TableModel from '../../models/TableModel'

const menu_model = new MenuModel
const menutype_model = new MenuTypeModel
const order_model = new OrderModel
const order_list_model = new OrderListModel
const table_model = new TableModel
var cart = [];
class MenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false

        };
        this.renderMenuby = this.renderMenuby.bind(this);
        this.renderMenuType = this.renderMenuType.bind(this);
        this.rendercart = this.rendercart.bind(this);
        this.addItemTocart = this.addItemTocart.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.rendertotal = this.rendertotal.bind(this);
        this.sumtotal = this.sumtotal.bind(this);


    }


    async componentDidMount() {
        cart = []
        const code = this.props.match.params.code
        console.log(code);

        var menutype_list = await menutype_model.getMenuTypeBy()
        this.setState({
            menutype_list: menutype_list.data,
        })

        var menulist = await menu_model.getMenuBy()
        this.setState({
            menulist: menulist.data
        })

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
                    <div>
                        {/* <TabList>
                            <Tab onClick={this.getMenuByCode.bind(this, this.state.menutype_list[i].menu_type_code)}> {this.state.menutype_list[i].menu_type_name}</Tab>
                        </TabList> */}
                        <Col onClick={this.getMenuByCode.bind(this, this.state.menutype_list[i].menu_type_code)} style={{ borderRightStyle: 'ridge', pading: '0px' }}>
                            <label style={{ margin: '15px' }} >
                                {this.state.menutype_list[i].menu_type_name}
                            </label>
                        </Col>
                    </div>

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



    renderMenuby() {
        if (this.state.menu_list != undefined) {
            console.log("5555", this.state.menu_list);
            var menulist = []
            for (let i = 0; i < this.state.menu_list.length; i++) {
                menulist.push(
                    <Col lg="4">
                        {/* <ClickNHold
                            time={0.5}
                            onStart={this.start}
                            onClickNHold={this.clickNHold}
                            onEnd={this.end} > */}
                        <Card onClick={this.addItem.bind(this, this.state.menu_list[i])}>
                            {/* <CardImg top width="100%" src="/logo_bubblebrown.png" alt="Card image cap" /> */}
                            <CardBody>
                                <CardTitle><label >{this.state.menu_list[i].menu_name}</label> </CardTitle>
                            </CardBody>
                        </Card>

                        {/* </ClickNHold> */}
                    </Col>
                )
            }
            return menulist;
        }
    }



    async insertOrder() {

        var order = []


        const max_code = await order_model.getOrderMaxCode()//province data
        var order_code = 'OD' + max_code.data.order_code_max
        console.log(max_code);

        const date_now = new Date();
        var toDay = date_now.getFullYear() + "" + (date_now.getMonth() + 1) + "" + date_now.getDate() + "" + date_now.getTime();
        const data = new FormData();
        var order_service = document.getElementById('order_service').value
        var order = {
            'table_code': '01',
            'order_service': order_service,
            'customer_code': 'CM001',
            'order_date': toDay,
            'order_code': order_code,
            'order_total_price': this.sumtotal()
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
                this.props.history.push('/menu/')
            }
        }

    }

    async updateOrder() {

        var order = []

        const date_now = new Date();
        var toDay = date_now.getFullYear() + "" + (date_now.getMonth() + 1) + "" + date_now.getDate() + "" + date_now.getTime();
        const data = new FormData();

        var order_service = document.getElementById('order_service').value
        var order = {
            'table_code': '01',
            'order_service': order_service,
            'customer_code': 'CM001',
            'order_date': toDay,
            'order_code': this.props.match.params.code,
            'order_total_price': this.sumtotal()
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
            const arr = await order_list_model.insertOrderList(order_list)
            if (order_list != undefined) {
                swal({
                    title: "สั่งอาหารเรียบร้อย",
                    text: "โปรดรออาหารสักครู่...",
                    icon: "success",
                    button: "Close",
                });
            }
        }

    }

    rendertotal() {
        if (this.state.cart != undefined) {
            var order_total = []
            var sum = 0;
            for (let i = 0; i < this.state.cart.length; i++) {
                sum += parseFloat(this.state.cart[i].count) * parseFloat(this.state.cart[i].price)
                console.log("..........", this.state.cart[i].count);
                console.log("..1........", this.state.cart[i].price);
            }
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
            console.log("3333333333", sum);
            // this.setState({
            //     sum_price: sum
            // })
            return order_total;
        }

    }
    sumtotal() {
        if (this.state.cart != undefined) {
            var sum = 0;
            for (let i = 0; i < this.state.cart.length; i++) {
                sum += parseFloat(this.state.cart[i].count) * parseFloat(this.state.cart[i].price)
            }
            console.log("3333333333", sum);
            this.setState({
                sum_price: sum
            })
            return sum;
        }

    }

    render() {


        return (

            <div style={{ padding: '10px' }}>
                <Card>
                    <CardBody style={{ padding: '5px' }}>
                        <Row style={{ minWidth: '100%', height: '100%', minHeight: '80vh' }}>

                            <Col lg="6">
                                <Row style={{ paddingTop: '2%' }}>
                                    {this.renderMenuType()}
                                </Row>
                                <hr />
                                {/* <TabPanel > */}
                                <Row style={{ paddingTop: '5%', overflowY: 'scroll', }}>
                                    {this.renderMenuby()}
                                </Row>
                                {/* </TabPanel>
                                </Tabs> */}
                            </Col>



                            <Col lg="6" style={{ borderStyle: 'solid', borderWidth: 1, overflowY: 'scroll' }}>
                                <Row style={{ padding: '2%' }}>
                                    <Col lg="3">
                                        <FormGroup>
                                            <Input type="select" id="order_service" name="order_service" class="form-control" >
                                                <option value="ทานที่ร้าน">ทานที่ร้าน</option>
                                                <option value="สั่งกลับบ้าน">สั่งกลับบ้าน</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>


                                </Row>
                                <Row >
                                    <div style={{ paddingTop: '10px', paddingLeft: '10px', paddingBottom: '30px' }}> รายการอาหาร</div>

                                </Row>

                                {this.rendercart()}

                                {this.rendertotal()}
                                {this.state.cart != undefined && this.state.cart != "" && this.props.match.params.code == undefined ? <Row ><div style={{ paddingTop: '30px', textAlign: 'end' }}><Button onClick={this.insertOrder.bind(this)}><label>สั่งอาหาร</label></Button></div></Row> : ''}
                                {this.state.cart != undefined && this.state.cart != "" && this.props.match.params.code != undefined ? <Row ><div style={{ paddingTop: '30px', textAlign: 'end' }}><Button onClick={this.updateOrder.bind(this)}><label>แก้ไขการสั่งอาหาร</label></Button></div></Row> : ''}


                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>

        )
    }
}
export default (MenuView);