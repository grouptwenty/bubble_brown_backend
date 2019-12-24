
import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';
import StockModel from '../../../models/StockModel'
import ProductModel from '../../../models/ProductModel'
const stock_model = new StockModel

const product_model = new ProductModel
class RecipeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false
        };
        this.renderProductList = this.renderProductList.bind(this);
        this.calculatQty = this.calculatQty.bind(this);
    }


    async componentDidMount() {

        var stock = await stock_model.getProductBy()

        for (var key in stock.data) {
            var stock_in = await stock_model.getSumStockInBy(stock.data[key])
            var stock_out = await stock_model.getSumStockOutBy(stock.data[key])
            var sum_stock_in = 0
            var sum_stock_out = 0
            for (var i in stock_in.data) {
                sum_stock_in += this.calculatQty(stock_in.data[i].stock_in,stock_in.data[i].unit)
                
            }
            for (var i in stock_out.data) {
                sum_stock_out += this.calculatQty(stock_out.data[i].stock_out,stock_out.data[i].unit)
            }
            stock.data[key].sum_stock_in = sum_stock_in
            stock.data[key].sum_stock_out = sum_stock_out

        }
        console.log("stock.data",stock.data);
        
        this.setState({
            stock: stock.data,
        })

    }

    calculatQty(qty, unit_id) {
        console.log("qty", qty);
        console.log("unit_id", unit_id);

        var unit = ''
        if (unit_id == 2) {
            unit = qty
        } else if (unit_id == 3) {
            unit = qty * 1000
        } else if (unit_id == 4) {
            unit = qty
        } else if (unit_id == 5) {
            unit = qty * 1000

        }
        return unit
    }

    renderProductList() {
        if (this.state.stock != undefined) {
            let stock_list = []
            for (let i = 0; i < this.state.stock.length; i++) {

                // var check_stock_out = this.calculatQty(this.state.stock[i].sum_stock_out, this.state.stock[i].unit_id)


                stock_list.push(
                    <tr>

                        <td ><h6 >{this.state.stock[i].product_name}</h6></td>
                        <td ><h6 className="textcenter3">{this.state.stock[i].product_code}</h6></td>
                        <td ><h6 className="textcenter3">{this.state.stock[i].sum_stock_in} ({this.state.stock[i].sum_stock_in - this.state.stock[i].sum_stock_out})</h6></td>
                        <td ><h6 style={{ textAlign: 'end' }}>{Number(this.state.stock[i].product_price).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</h6></td>
                        <td ><h6 className="textcenter3">{this.state.stock[i].product_cost}</h6></td>

                        <td >
                            < h6 className="textcenter3">
                                <NavLink exact to={`/product-manage/stock-in/stock-in-order/` + this.state.stock[i].product_code} style={{ width: '100%' }}>
                                    <Button >รายการสต๊อกเข้า</Button>
                                </NavLink>
                            </ h6>
                        </td>
                    </tr>

                )
            } return stock_list;
        }
    }


    render() {



        return (
            <div className="animated fadeIn">

                <Row style={{ padding: '30px' }}>
                    <Col>
                        <Card>
                            <CardHeader style={{ textAlign: 'center' }}>
                                จัดการสต๊อก - เข้า
                                <NavLink exact to={`/product-manage/stock-in/insert/`} style={{ width: '100%' }}>
                                    <button class="btn btn-primary btn-lg float-right boottom-header" name="add_stock">
                                        <i class="fa fa-plus" ></i>
                                        Add
                                    </button>
                                </NavLink>
                            </CardHeader>
                            <CardBody>
                                <table className="table table-bordered">
                                    <thead style={{ textAlign: 'center' }}>
                                        <tr>
                                            <th>วัตถุดิบ</th>
                                            <th>รหัสวัตถุดิบ</th>
                                            <th>คงเหลือ</th>
                                            <th>ราคา</th>
                                            <th>ต้นทุน</th>
                                            <th>#</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderProductList()}
                                    </tbody>
                                </table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default (RecipeView);