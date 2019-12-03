import React, { Component } from 'react';
import { Col, Row, Container, Card, CardImg, CardText, CardBody, CardTitle, } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import ClickNHold from 'react-click-n-hold';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import MenuModel from '../../models/MenuModel'
import MenuTypeModel from '../../models/MenuTypeModel'

const menu_model = new MenuModel
const menutype_model = new MenuTypeModel
class MenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false

        };
        this.renderMenuby = this.renderMenuby.bind(this);
        this.renderMenuType = this.renderMenuType.bind(this);


    }


    async componentDidMount() {

        var menutype_list = await menutype_model.getMenuTypeBy()
        this.setState({
            menutype_list: menutype_list.data
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

            var menu_list = []
            for (let i = 0; i < this.state.menutype_list.length; i++) {
                menu_list.push(
                    <Col style={{ borderWidth: 1, borderStyle: 'solid', height: 50, textAlign: 'center' }}>
                        <div>
                            <label onClick={this.getMenuByCode.bind(this, this.state.menutype_list[i].menu_type_code)}>
                                {this.state.menutype_list[i].menu_type_name}
                            </label>
                        </div>
                    </Col>

                )
            }
            return menu_list;
        }
    }

    renderMenuby() {
        if (this.state.menu_list != undefined) {
            console.log("5555", this.state.menu_list);
            var menulist = []
            for (let i = 0; i < this.state.menu_list.length; i++) {
                menulist.push(
                    <Col lg="4">
                        <ClickNHold
                            time={0.5}
                            onStart={this.start}
                            onClickNHold={this.clickNHold}
                            onEnd={this.end} >
                            <Card>
                                {/* <CardImg top width="100%" src="/logo_bubblebrown.png" alt="Card image cap" /> */}
                                <CardBody>
                                    <CardTitle>{this.state.menu_list[i].menu_name} </CardTitle>
                                </CardBody>
                            </Card>

                        </ClickNHold>
                    </Col>
                )
            }
            return menulist;
        }
    }
    render() {

        if (this.state.menutype_list != undefined) {

            var menu_list = []
            for (let i = 0; i < this.state.menutype_list.length; i++) {
                menu_list.push(
                    <Col style={{ borderWidth: 1, borderStyle: 'solid', height: 50, textAlign: 'center' }}>
                        <label onClick={() => { this.renderMenuby(this.state.menutype_list.menu_type_code); }}>
                            <div style={{ marginTop: '2.5%' }}> {this.state.menutype_list[i].menu_type_name} </div>
                        </label>
                    </Col>
                )
            }
        }

        if (this.state.menu_list != undefined) {

            var menulist = []
            for (let i = 0; i < this.state.menu_list.length; i++) {
                menulist.push(
                    <Col style={{ borderWidth: 1, borderStyle: 'solid', height: 50, textAlign: 'center' }}>
                        <NavLink exact to={'dashboard'} style={{ width: '100%' }}>
                            <div style={{ marginTop: '2.5%' }}> {this.state.menu_list[i].menu_name} </div>
                        </NavLink>
                        {/* <div style={{ marginTop: '2.5%' }}> {this.state.menulist[i].menu_name} </div> */}
                    </Col>
                )
            }
        }

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




                    </Col>
                </Row>

            </div>

        )
    }
}
export default (MenuView);