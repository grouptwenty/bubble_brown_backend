import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ProductTypeModel from '../../../models/ProductTypeModel';
import ModalInsert from './modal_insert'
import ModalEdit from './modal_edit'
import swal from 'sweetalert';
var product_type_model = new ProductTypeModel;
class ProductTypeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false,
            show_update_model: false,
        };
    }
    onClickProductUpdate(cell, row, rowIndex) {
        console.log('cell', cell);
        console.log('row', row);
        console.log('rowIndex', rowIndex);
        this.setState({
            show_update_model: true,
            product_type_id: row.product_type_id,
        })
    }
    onClickDelete(cell, row, rowIndex) {
        console.log('cell', cell);
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                var set_data = {
                    product_type_id: row.product_type_id,
                    // member_code: this.props.member.member_code
                }
                var res = await product_type_model.deleteProductTypeByCode(set_data);
                if (res.query_result) {
                    swal("Poof! Your imaginary file has been deleted!", {
                        icon: "success",
                    });
                } else {
                    swal("deleted Fail", {
                        icon: "error",
                    });
                }
                this.componentDidMount();
            }
        });
        // console.log('row', row);
        // console.log('rowIndex', rowIndex);
    }
    cellButton(cell, row, enumObject, rowIndex) {
        return (
            <>
                <button class="btn btn-warning" onClick={() => this.onClickProductUpdate(cell, row, rowIndex)}>Edit</button >
                <button class="btn btn-danger" onClick={() => this.onClickDelete(cell, row, rowIndex)}>Delete</button>
            </>
        )
    }
    async componentDidMount() {
        const product_type_list = await product_type_model.getProductTypeBy(this.props.user);
        const data_product_type_list = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in product_type_list.data) {
            var set_row = {
                no: i,
                name: product_type_list.data[key].product_type_name,
                product_type_id: product_type_list.data[key].product_type_id,
            }
            data_product_type_list.rows.push(set_row);
            i++;
        }
        this.setState({
            data: data_product_type_list
        });

        // console.log("69+++", data_product_type_list);
    }
    render() {
        const { data } = this.state;
        return (
            <div className="animated fadeIn">
                
                <Row style={{ padding: '15px' }}>
                    <Col lg='12'>
                        <Card>
                            <CardHeader>
                                ProductType List
                                <ModalInsert refresh={() => this.componentDidMount()} />
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col lg='12'>
                                        <div>
                                            <BootstrapTable
                                                ref='table'
                                                data={data.rows}
                                                striped hover pagination
                                                search={true}>
                                                <TableHeaderColumn dataField='no' width="20%" headerAlign="center" dataAlign="center" dataSort isKey={true}>No</TableHeaderColumn>
                                                <TableHeaderColumn dataField='name' headerAlign="center" dataAlign="center" dataSort>Name</TableHeaderColumn>
                                                <TableHeaderColumn dataField='edit' width="20%" headerAlign="center" dataAlign="center" dataFormat={this.cellButton.bind(this)}>Edit</TableHeaderColumn>
                                            </BootstrapTable>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    {this.state.show_update_model == true ?
                        <ModalEdit
                            refresh={() => { this.setState({ show_update_model: false, refresh: !this.setState.refresh }); this.componentDidMount(); }}
                            show_update_model={this.state.show_update_model}
                            product_type_id={this.state.product_type_id}
                        /> : <></>
                    }
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
export default connect(mapStatetoProps)(ProductTypeView);
