import React, { Component } from 'react';
import { Col, Row, Container, Card, CardImg, CardText, CardBody, CardTitle, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import ClickNHold from 'react-click-n-hold';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import swal from 'sweetalert';

import MenuModel from '../../models/MenuModel'
import MenuTypeModel from '../../models/MenuTypeModel'
import OrderModel from '../../models/OrderModel'
import OrderListModel from '../../models/OrderListModel'

const menu_model = new MenuModel
const menutype_model = new MenuTypeModel
const order_model = new OrderModel
const order_list_model = new OrderListModel
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


        var menutype_list = await menutype_model.getMenuTypeBy()
        this.setState({
            menutype_list: menutype_list.data,
        })

        var menulist = await menu_model.getMenuBy()
        this.setState({
            menulist: menulist.data
        })

        var menu_list = await menu_model.getMenuByCode('MNT01')
        this.setState({
            menu_list: menu_list.data
        })
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
                    <Col style={{ borderWidth: 1, borderStyle: 'solid', height: 50, textAlign: 'center' }}>
                        <div>
                            <label style={{ margin: '15px' }} onClick={this.getMenuByCode.bind(this, this.state.menutype_list[i].menu_type_code)}>
                                {this.state.menutype_list[i].menu_type_name}
                            </label>
                        </div>
                    </Col>

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
                    <Row>
                        <Col lg="4"><div>{this.state.cart[i].name}</div></Col>
                        <Col lg="4"><div>{this.state.cart[i].price}</div></Col>

                        <Col lg="4"><Button onClick={this.deleteItemButton.bind(this, this.state.cart[i])}> - </Button>{this.state.cart[i].count}<Button onClick={this.addItemButton.bind(this, this.state.cart[i])}> + </Button></Col>
                    </Row>
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

    // var shoppingCart = (function () {
    // // =============================
    // // Private methods and propeties
    // // =============================
    // cart = [];

    // // Constructor
    // function Item(name, price, count) {
    //     this.name = name;
    //     this.price = price;
    //     this.count = count;
    // }

    // // Save cart
    // function saveCart() {
    //     sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
    // }

    // // Load cart
    // function loadCart() {
    //     cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
    // }
    // if (sessionStorage.getItem("shoppingCart") != null) {
    //     loadCart();
    // }

    async insertOrder() {

        var order = []


        const max_code = await order_model.getOrderMaxCode()//province data
        var order_code = 'OD' + max_code.data.order_code_max
        console.log(max_code);

        const date_now = new Date();
        var toDay = date_now.getFullYear() + "" + (date_now.getMonth() + 1) + "" + date_now.getDate() + "" + date_now.getTime();
        const data = new FormData();
        // data.append('table_id', '01')
        // data.append('customer_code', 'CM001')
        // data.append('order_date', toDay)
        // data.append('order_code', order_code)
        // console.log(data);
        order.push({
            'table_id': '01',
            'customer_code': 'CM001',
            'order_date': toDay,
            'order_code': order_code

        })
        console.log(order);

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
        }
        // if (res.data) {
        //     swal({
        //         title: "Good job!",
        //         text: "Add user Ok",
        //         icon: "success",
        //         button: "Close",
        //     });
        //     this.props.history.push('/order/')
        // }
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
                    {sum}
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

            <div>

                <Row style={{ minWidth: '100%', height: '100%', minHeight: '80vh' }}>
                    <Col lg="6" style={{ borderStyle: 'solid', borderWidth: 1 }}>

                        <Row style={{ minWidth: '100%' }}>
                            {this.renderMenuType()}
                        </Row>
                        <Row style={{ overflowY: 'scroll', paddingTop: '20px' }}>
                            {this.renderMenuby()}
                        </Row>
                    </Col>
                    <Col lg="6" style={{ borderStyle: 'solid', borderWidth: 1 }}>

                        <Row>
                            <div > รายการอาหาร</div>

                        </Row>

                        {this.rendercart()}
                        {this.rendertotal()}
                        {this.state.cart != undefined && this.state.cart != "" ? <Row><Button onClick={this.insertOrder.bind(this)}><label>สั่งอาหาร</label></Button></Row> : ''}


                    </Col>
                </Row>

            </div>

        )
    }
}
export default (MenuView);