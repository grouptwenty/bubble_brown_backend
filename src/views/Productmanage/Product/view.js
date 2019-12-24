
import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
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
        this.renderProduct = this.renderProduct.bind(this);
          this.onDelete = this.onDelete.bind(this);
    }


    async componentDidMount() {
        var product = await product_model.getProductBy()
        // console.log(menu_list);

        this.setState({
            product: product.data
        })

    }


        async onDelete(code) {
        // console.log("code", code);
        swal({
            text: "คุณต้องการลบข้อมูลสินค้า ? ",
            icon: "warning",
            buttons: true,
            dengerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const res = product_model.deleteByCode(code)
                        .then((req) => {
                            if (req.data == true) {
                                this.componentDidMount();
                                swal("success Deleted! ", {
                                    icon: "success",

                                });
                            
                            } else {
                                swal("success Deleted! ", {
                                    icon: "error",

                                });
                            }

                        })

                }

            });

    }


    renderProduct() {
        if (this.state.product != undefined) {
            var product_list = []

            for (let i = 0; i < this.state.product.length; i++) {

                product_list.push(
                    <tr>
                        <td width={5}><h6 className="textcenter3"></h6></td>
                        <td width={150}><h6 className="textcenter3">{this.state.product[i].product_code}</h6></td>
                        <td width={150}><h6 className="textcenter3">{this.state.product[i].product_name}</h6></td>

                        <td width={5}>
                            <h6 className="textcenter3">
                                <NavLink exact to={`/product-manage/product/update/` + this.state.product[i].product_code} style={{ width: '100%' }}>
                                    <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ color: 'blue', marginRight: 30 }}></i>
                                </NavLink>

                                <Link to={`#`} onClick={this.onDelete.bind(null, this.state.product[i].product_code)}>
                                    <i class="fa fa-times" aria-hidden="true" style={{ color: 'red' }}></i>
                                </Link>
                            </h6>
                        </td>
                    </tr>
                )

            }
            return product_list;
        }
    }
    render() {



        return (
            <div className="animated fadeIn">
                <Row style={{ padding: '30px' }}>
                    <Col>
                        <Card>
                            <CardHeader style={{ textAlign: 'center' }}>
                                จัดการสินค้า
                                <NavLink exact to={'/product-manage/product/insert/'} style={{ width: '100%' }}>
                                    <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i> Add</button>
                                </NavLink>
                            </CardHeader>
                            <CardBody>
                                <Table responsive bordered>
                                    <Table hover>
                                        <thead>
                                            <tr style={{ textAlign: 'center' }}>
                                                <th>#</th>
                                                <th>รหัสสินค้า</th>
                                                <th>สินค้า</th>
                                                <th>#</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderProduct()}
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
export default (ProductView);