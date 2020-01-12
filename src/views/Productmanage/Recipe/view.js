
import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
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
    }


    async componentDidMount() {
        const menu_list = await menu_model.getMenuBy();
        const data_menu_list = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in menu_list.data) {
            var set_row = {
                no: i,
                menu_code: menu_list.data[key].menu_code,
                menu_name: menu_list.data[key].menu_name,
            }
            data_menu_list.rows.push(set_row);
            i++;
        }
        this.setState({
            data: data_menu_list
        });
    }

    cellButton(cell, row, enumObject, rowIndex) {
        return (
            <>
                <NavLink exact to={'/product-manage/recipe/insert/' + row.menu_code}>
                    <button class="btn btn-warning">จัดการ</button>
                </NavLink>
            </>
        )
    }

    render() {
        const { data } = this.state;

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col lg='12'>
                        <Card>
                            <CardHeader>
                                จัดการสูตร
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col lg='12'>
                                        <div>
                                            <BootstrapTable
                                                ref='table'
                                                data={data.rows}
                                                striped hover pagination
                                                search={true}
                                            // className="table-overflow"

                                            >
                                                <TableHeaderColumn width={"10%"} dataField='no' headerAlign="center" dataAlign="center" dataSort isKey={true}>No</TableHeaderColumn>
                                                <TableHeaderColumn dataField='menu_name' headerAlign="center" dataAlign="center" dataSort>เมนู</TableHeaderColumn>
                                                <TableHeaderColumn width={"15%"} dataField='Action' headerAlign="center" dataAlign="center" dataFormat={this.cellButton.bind(this)}> </TableHeaderColumn>
                                            </BootstrapTable>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default (RecipeView);