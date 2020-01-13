import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import swal from 'sweetalert';

import ProductModel from '../../../models/ProductModel'

const product_model = new ProductModel
class ProductView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false
        };
    }


    async componentDidMount() {

        const product_list = await product_model.getProductBy(this.props.user);
        const data_product_list = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in product_list.data) {
            var set_row = {
                no: i,
                product_code: product_list.data[key].product_code,
                product_name: product_list.data[key].product_name,

            }
            data_product_list.rows.push(set_row);
            i++;
        }
        this.setState({
            data: data_product_list
        });

    }

    cellButton(cell, row, enumObject, rowIndex) {
        return (
            <>
                <NavLink exact to={'/product-manage/product/update/' + row.product_code}>
                    <button class="btn btn-warning">แก้ไข</button>
                </NavLink>
                <button class="btn btn-danger" onClick={() => this.onClickDelete(cell, row, rowIndex)}>ยกเลิก</button>
            </>
        )
    }

    onClickDelete(cell, row, rowIndex) {
        console.log('cell', cell);
        swal({
            title: "คุณต้องการลบข้อมูลสินค้า ?",
            text: "เมื่อลบแล้วคุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                var set_data = {
                    product_code: row.product_code,
                }
                console.log('------------', set_data)
                var res = await product_model.deleteByCode(set_data);
                if (res.query_result) {
                    swal("ลบข้อมูลสำเร็จ!", {
                        icon: "success",
                    });
                } else {
                    swal("ลบข้อมูลไม่สำเร็จ!", {
                        icon: "error",
                    });
                }
                this.componentDidMount();
            }
        });
        console.log('row', row);
        console.log('rowIndex', rowIndex);
    }

    render() {
        const { data } = this.state;

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col lg='12'>
                        <Card>
                            <CardHeader>
                                จัดการสินค้า
                                <NavLink exact to={'/product-manage/product/insert/'} style={{ width: '100%' }}>
                                    <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i> เพิ่ม</button>
                                </NavLink>
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
                                                <TableHeaderColumn dataField='no' headerAlign="center" dataAlign="center" dataSort isKey={true}>No</TableHeaderColumn>
                                                <TableHeaderColumn dataField='product_code' headerAlign="center" dataAlign="center" dataSort>รหัสสินค้า</TableHeaderColumn>
                                                <TableHeaderColumn dataField='product_name' headerAlign="center" dataAlign="center" dataSort>สินค้า</TableHeaderColumn>
                                                <TableHeaderColumn width={"20%"} dataField='Action' headerAlign="center" dataAlign="left" dataFormat={this.cellButton.bind(this)}> </TableHeaderColumn>
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
const mapStatetoProps = (state) => {
    return {
        user: state.user,
    }
}
export default connect(mapStatetoProps)(ProductView);