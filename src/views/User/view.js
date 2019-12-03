import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, Container } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';
import GOBALS from '../../GOBALS'
import ImgDefault from '../../assets/img/default-user.png'

import MenuTypeModel from '../../models/MenuTypeModel'

const menutype_model = new MenuTypeModel
class HomeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            menutype_list: [],
            refresh: false

        };
        this.renderMenuType = this.renderMenuType.bind(this);
    }


    async componentDidMount() {
        var menutype_list = await menutype_model.getMenuTypeBy()
        console.log("menutype_list", menutype_list);
        this.setState({
            menutype_list: menutype_list.data
        })
    }


    renderMenuType() {
        console.log("5555", this.state.menutype_list);
        if (this.state.menutype_list != undefined) {
            console.log("5555", this.state.menutype_list);

            var menu_list = []
            for (let i = 0; i < this.state.menutype_list.length; i++) {
                menu_list.push(
                    <Col>
                        <div> {this.state.menutype_list[i].menu_type_name} </div>
                    </Col>

                )
            }

        }
    }

    render() {
        const renderMenuType = this.renderMenuType
        if (this.state.menutype_list != undefined) {
            console.log("5555", this.state.menutype_list);

            var menu_list = []
            for (let i = 0; i < this.state.menutype_list.length; i++) {
                menu_list.push(
                    <Col>
                        <div> {this.state.menutype_list[i].menu_type_name} </div>
                    </Col>

                )
            }

        }
        return (

            <div>

                <Row style={{ minWidth: '100%', paddingTop: '5%', paddingBottom: '5%' }}>
                    <Col lg="4">

                    </Col>
                    <Col lg="4">
                        <div> โซน A - โต๊ะ 1 </div>
                    </Col>
                    <Col lg="4">
                        <div> เรียกพนักงาน</div>
                    </Col>


                </Row>
                <Row style={{ minWidth: '100%', paddingTop: '2%', paddingBottom: '2%' }}>
                    {menu_list}
                </Row>

                <Row style={{ minWidth: '100%' }}>
                    <Col lg="6">
                        <div> รูปเมนู</div>
                    </Col>
                    <Col lg="6">
                        <div> รายการอาหาร</div>
                    </Col>
                </Row>
            </div>

        )
    }
}
export default (HomeView);