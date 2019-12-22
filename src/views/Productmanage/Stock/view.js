
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
    }


    async componentDidMount() {
      
        var stock = await stock_model.getSumStockBy()
  

        this.setState({
            stock: stock.data,
        })
       
        

    }

    renderProductList() {
        if (this.state.stock != undefined) {
            let stock_list = []
            for (let i = 0; i < this.state.stock.length; i++) {
                stock_list.push(
                    <tr>

                        <td ><h6 >{this.state.stock[i].product_name}</h6></td>
                        <td ><h6 className="textcenter3">{this.state.stock[i].product_code}</h6></td>
                <td ><h6 className="textcenter3">{this.state.stock[i].sum_stock} ({this.state.stock[i].sum_stock - this.state.stock[i].sum_stock_out})</h6></td>
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