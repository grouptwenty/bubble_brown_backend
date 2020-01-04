import React, { Component } from 'react';
import {
    Button,
    Col,
    Row,
    Input,
    Card,
    CardBody,
    CardFooter,
    Modal, ModalBody, ModalFooter, ListGroup, ListGroupItem, CardHeader
} from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import StockModel from '../../../models/StockModel'
import ProductModel from '../../../models/ProductModel'
import UnitModel from '../../../models/UnitModel'

const unit_model = new UnitModel
const stock_model = new StockModel
const product_model = new ProductModel


class insertView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            brand: [],
            machine_type: [],
            refresh: false,
            stock: [],

        };

    }



    async componentDidMount() {


    }



    handleRowDel(stock) {
        var index = this.state.stock.indexOf(stock);
        this.state.stock.splice(index, 1);
        this.setState(this.state.stock);
    };

    handleAddEvent(evt) {
        var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
        var stock = {
            id: id,
            name: "",
            price: "",
            category: "",
            qty: 0
        }
        this.state.stock.push(stock);
        this.setState(this.state.stock);

    }

    handleProductTable(evt) {
        var item = {
            id: evt.target.id,
            name: evt.target.name,
            value: evt.target.value
        };
        var stocks = this.state.stock.slice();
        var newProducts = stocks.map(function (stock) {

            for (var key in stock) {
                if (key == item.name && stock.id == item.id) {
                    stock[key] = item.value;

                }
            }
            return stock;
        });
        this.setState({ stocks: newProducts });
        //  console.log(this.state.stocks);
    };



    render() {

        return (
            <div>

                <ProductTable history={this.props.history} onProductTableUpdate={this.handleProductTable.bind(this)} menuCode={this.props.match.params.code} onRowAdd={this.handleAddEvent.bind(this)} onRowDel={this.handleRowDel.bind(this)} stocks={this.state.stock} filterText={this.state.filterText} />
            </div>
        );

    }

}
class SearchBar extends React.Component {
    handleChange() {
        this.props.onUserInput(this.refs.filterTextInput.value);
    }
    render() {
        return (
            <div>

                <input type="text" placeholder="Search..." value={this.props.filterText} ref="filterTextInput" onChange={this.handleChange.bind(this)} />

            </div>

        );
    }

}

class ProductTable extends React.Component {
    constructor(props) {
        super(props);
        this.calculatQty = this.calculatQty.bind(this)

    }
    calculatQty(qty, unit_id) {
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

    async  insertStock(code) {

        var product_code = document.getElementsByName('product_code')
        var stock_qty = document.getElementsByName('stock_qty')
        var stock_price = document.getElementsByName('stock_price')
        var unit_id = document.getElementsByName('unit_id')
        // var stock_cost = document.getElementsByName('stock_cost')
        var date = Date.now();

        //     // console.log("product_code", product_code[0].value);
        var insert = false
        if (product_code.length > 0) {
            for (let i = 0; i < product_code.length; i++) {
                if (product_code[i].value == '' || stock_qty[i].value == '' || stock_price[i].value == '') {
                    swal({
                        text: "กรุณากรอกข้อมูลให้ครบ",
                        icon: "warning",
                        button: "Close",
                    });
                    insert = false
                    break;
                }
                insert = true
            }
        } if (product_code.length <= 0) {
            swal({
                text: "กรุณากรอกข้อมูลให้ครบ",
                icon: "warning",
                button: "Close",
            });
        }
        if (insert) {
            for (let i = 0; i < product_code.length; i++) {
                var stock_qty_cal = this.calculatQty(stock_qty[i].value, unit_id[i].value)
                // console.log("stock_qty_cal", stock_qty_cal);

                var stock_list = {
                    // stock_cost: stock_cost[i].value,
                    stock_qty: stock_qty[i].value,
                    product_code: product_code[i].value,
                    stock_price: stock_price[i].value,
                    unit_id: unit_id[i].value,
                    stock_date: date,
                    stock_qty_cal: stock_qty_cal

                }
                // console.log("stock_list", stock_list);

                const src = await stock_model.insertStock(stock_list)
                const price_qty = await stock_model.getStockByPriceQty(stock_list)
                // console.log("price_qty", price_qty);

                const product_qty = await product_model.updateProductCost(price_qty.data)


            }
            if (stock_list != undefined) {
                swal({
                    title: "จัดการสูตรเรียบร้อย",
                    icon: "success",
                    button: "Close",
                });
                this.props.history.push('/product-manage/stock-in/')

            }
        }
    }

    render() {
        var onProductTableUpdate = this.props.onProductTableUpdate;
        var rowDel = this.props.onRowDel;
        var filterText = this.props.filterText;
        var stock = this.props.stocks.map(function (stock) {

            return (<ProductRow onProductTableUpdate={onProductTableUpdate} stock={stock} onDelEvent={rowDel.bind(this)} key={stock.id} />)
        });
        return (

            <div style={{ padding: '30px' }}>
                <Card>

                    <CardBody>

                        <table className="table table-bordered"  >
                            <thead style={{ textAlign: 'center' }}>
                                <tr>
                                    <th>#</th>
                                    <th>ชื่อวัตถุดิบ</th>
                                    <th>รหัสวัตถุดิบ</th>
                                    <th>ราคาซื้อ</th>
                                    <th>ปริมาณ</th>
                                    <th>หน่วย</th>
                                    {/* <th>ต้นทุน</th> */}
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {stock}
                            </tbody>
                            <tbody>
                                <tr style={{ textAlign: 'center' }}>
                                    <td colSpan="7">

                                        <i class="fa fa-plus" aria-hidden="true" style={{ color: 'red', fontSize: '23px' }} />
                                        <label onClick={this.props.onRowAdd} style={{ color: 'red', fontSize: '18px' }}> เพิ่มรายการ</label>

                                    </td>

                                </tr>
                            </tbody>
                        </table>
                    </CardBody>
                    <CardFooter>
                        <Button type="button"
                            onClick={this.insertStock.bind(this)}
                            color="success">บันทึก</Button>
                    </CardFooter>
                </Card>

            </div>
        );

    }

}

class ProductRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false,


        };
    }

    async componentDidMount() {
        var unit_list = await unit_model.getUnitBy()
        // console.log("unit_list", unit_list);


        this.setState({
            unit_list: unit_list.data,

        })
    }

    onDelEvent() {
        this.props.onDelEvent(this.props.stock);

    }
    product_select(data) {
        this.setState({
            data: data
        })
        // console.log("data454564654", data);

    }
    render() {

        return (


            <tr className="eachRow">
                {/* <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                    "type": "menu_code",
                    value: this.props.stock.menu_code,
                    id: this.props.stock.menu_code
                }} /> */}

                <ModelProduct test={this.product_select.bind(this)} />


                <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                    type: "product_name",
                    value: this.state.data.product_name,
                    id: this.state.data.product_name,
                    readonly: true
                }} />

                <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                    type: "product_code",
                    value: this.state.data.product_code,
                    id: this.state.data.product_code,
                    readonly: true
                }} />

                <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                    type: "stock_price",
                    value: this.state.data.stock_price,
                    id: this.state.data.stock_price,
                    readonly: false,
                    textAlign: 'end'
                }} />

                <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                    type: "stock_qty",
                    value: this.state.data.stock_qty,
                    id: this.state.data.stock_qty,
                    readonly: false,
                    textAlign: 'end'
                }} />

                <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                    type: "unit_id",
                    value: this.state.data.unit_id,
                    id: this.state.data.unit_id,
                    readonly: false,
                    types: 'select',
                    data: this.state.unit_list
                }} />

                {/* <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                    type: "stock_cost",
                    value: this.state.data.stock_cost,
                    id: this.state.data.stock_cost,
                    readonly: false
                }} /> */}




                <td className="del-cell">
                    <i class="fa fa-times" aria-hidden="true" style={{ color: 'red', fontSize: '23px' }} onClick={this.onDelEvent.bind(this)} />
                    {/* <input type="button" onClick={this.onDelEvent.bind(this)} value="X" className="del-btn" /> */}
                </td>
            </tr>

        );

    }

}
class EditableCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false,


        };
        this.renderUnit = this.renderUnit.bind(this);
    }


    renderUnit() {
        if (this.props.cellData.data != undefined) {
            var unit = []
            for (var key in this.props.cellData.data) {
                if (this.props.cellData.data[key].unit_id == this.props.cellData.value) {
                    unit.push(
                        <option selected='true' Value={this.props.cellData.data[key].unit_id} >{this.props.cellData.data[key].unit_name}</option>
                    )
                } else {
                    unit.push(
                        <option Value={this.props.cellData.data[key].unit_id} >{this.props.cellData.data[key].unit_name}</option>
                    )
                }

            }
            return unit;
        }

    }

    render() {
        return (
            <td>

                {this.props.cellData.types == 'select' ?
                    <Input type='select' name={this.props.cellData.type}  onChange={this.props.onProductTableUpdate} readOnly={this.props.cellData.readonly} >
                        <option Value="">Select</option>
                        {this.renderUnit()}
                    </Input>
                    : <Input type='text' name={this.props.cellData.type} style={{ textAlign: this.props.cellData.textAlign }} id={this.props.cellData.id} Value={this.props.cellData.value} onChange={this.props.onProductTableUpdate} readOnly={this.props.cellData.readonly} />
                }

            </td>
        );

    }
}
class ModelProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        }
        this.renderProductList = this.renderProductList.bind(this);
    }

    async componentDidMount() {

        var product = await product_model.getProductBy()
        console.log(product);

        this.setState({
            product: product.data
        })

    }


    toggle2(product) {
        this.props.test(product)
        this.toggle()
    }
    toggle() {
        // console.log("kkk");

        this.setState({
            modal: !this.state.modal
        })
    }

    renderProductList() {
        if (this.state.product != undefined) {
            let product_list = []
            for (let i = 0; i < this.state.product.length; i++) {
                product_list.push(

                    <ListGroupItem onClick={this.toggle2.bind(this, this.state.product[i])}>
                        <Row style={{ fontSize: '15px', textAlign: 'center' }}>
                            <Col lg="6">
                                {this.state.product[i].product_name}
                            </Col>
                            <Col lg="6">
                                {this.state.product[i].product_type_name}
                            </Col>
                        </Row>
                    </ListGroupItem>

                )
            } return product_list;
        }
    }
    render() {


        return (

            <>
                <Modal
                    isOpen={this.state.modal}
                    // toggle={this.toggle}
                    className={this.props.className} size="lg">
                    <ModalBody style={{ paddingTop: '5%' }}>
                        <ListGroup>
                            <ListGroupItem color="warning" style={{ fontSize: '20px', textAlign: 'center' }}>
                                <Row>
                                    <Col lg="6">
                                        <label>วัตถุดิบ</label>
                                    </Col>
                                    <Col lg="6">
                                        <label>ประเภท</label>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                            {this.renderProductList()}
                        </ListGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.toggle2.bind(this)} size="lg" color="secondary" > กลับ</Button>
                    </ModalFooter>
                </Modal>
                <td>
                    <Button
                        onClick={this.toggle.bind(this)}
                    >แก้ไข</Button>
                </td>
            </>
        );

    }
}


export default (insertView);