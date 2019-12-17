
import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';

import MenuModel from '../../../models/MenuModel'

const menu_model = new MenuModel
class RecipeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false
        };
        this.renderMenu = this.renderMenu.bind(this);
    }


    async componentDidMount() {
        var menu_list = await menu_model.getMenuBy()
        // console.log(menu_list);

        this.setState({
            menu_list: menu_list.data
        })

    }

    renderMenu() {
        if (this.state.menu_list != undefined) {
            var tbody_menu_list = []

            for (let i = 0; i < this.state.menu_list.length; i++) {

                tbody_menu_list.push(
                    <tr>
                        <td width={5}><h6 className="textcenter3">{i + 1}</h6></td>
                        <td width={150}><h6 className="textcenter3">{this.state.menu_list[i].menu_name}</h6></td>

                        <td width={5}>
                            <h6 className="textcenter3">
                                <NavLink exact to={`/product-manage/recipe/insert/` + this.state.menu_list[i].menu_code} style={{ width: '100%' }}>
                                <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ color: 'blue', marginRight: 30 }}></i>
                            </NavLink>
                            </h6>
                        </td>
                    </tr>
                )

            }
            return tbody_menu_list;
        }
    }
    render() {



        return (
            <div className="animated fadeIn">
                <Row style={{ padding: '30px' }}>
                    <Col>
                        <Card>
                            <CardHeader style={{ textAlign: 'center' }}>
                                จัดการสูตร
                            </CardHeader>
                            <CardBody>
                                <Table responsive bordered>
                                    <Table hover>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>เมนู</th>
                                                <th>จัดการสูตร</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderMenu()}
                                        </tbody>
                                    </Table>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default (RecipeView);