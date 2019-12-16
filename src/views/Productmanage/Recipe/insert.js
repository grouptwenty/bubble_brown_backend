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

import RecipeModel from '../../../models/RecipeModel'
import ProductModel from '../../../models/ProductModel'

const recipe_model = new RecipeModel
const product_model = new ProductModel


class insertView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            brand: [],
            machine_type: [],
            refresh: false,
            recipe: [],

        };
        // this.toggle = this.toggle.bind(this);
        this.state.filterText = "";
        //     this.state.recipes = [
        //         {
        //             id: 1,
        //             category: 'Sporting Goods',
        //             price: '49.99',
        //             qty: 12,
        //             name: 'football'
        //         }, {
        //             id: 2,
        //             category: 'Sporting Goods',
        //             price: '9.99',
        //             qty: 15,
        //             name: 'baseball'
        //         }, {
        //             id: 3,
        //             category: 'Sporting Goods',
        //             price: '29.99',
        //             qty: 14,
        //             name: 'basketball'
        //         }, {
        //             id: 4,
        //             category: 'Electronics',
        //             price: '99.99',
        //             qty: 34,
        //             name: 'iPod Touch'
        //         }, {
        //             id: 5,
        //             category: 'Electronics',
        //             price: '399.99',
        //             qty: 12,
        //             name: 'iPhone 5'
        //         }, {
        //             id: 6,
        //             category: 'Electronics',
        //             price: '199.99',
        //             qty: 23,
        //             name: 'nexus 7'
        //         }
        //     ];
    }



    async componentDidMount() {
        const code = this.props.match.params.code
        var recipe = await recipe_model.getRecipeByCode(code)
        // console.log(code);


        this.setState({
            recipe: recipe.data,

        })
        // console.log("this.state.code",this.state.code);
    }




    handleRowDel(recipe) {
        var index = this.state.recipe.indexOf(recipe);
        this.state.recipe.splice(index, 1);
        this.setState(this.state.recipe);
    };

    handleAddEvent(evt) {
        var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
        var recipe = {
            id: id,
            name: "",
            price: "",
            category: "",
            qty: 0
        }
        this.state.recipe.push(recipe);
        this.setState(this.state.recipe);

    }

    handleProductTable(evt) {
        var item = {
            id: evt.target.id,
            name: evt.target.name,
            value: evt.target.value
        };
        var recipes = this.state.recipe.slice();
        var newProducts = recipes.map(function (recipe) {

            for (var key in recipe) {
                if (key == item.name && recipe.id == item.id) {
                    recipe[key] = item.value;

                }
            }
            return recipe;
        });
        this.setState({ recipes: newProducts });
        //  console.log(this.state.recipes);
    };



    render() {

        return (
            <div>

                <ProductTable onProductTableUpdate={this.handleProductTable.bind(this)} menuCode={this.props.match.params.code} onRowAdd={this.handleAddEvent.bind(this)} onRowDel={this.handleRowDel.bind(this)} recipes={this.state.recipe} filterText={this.state.filterText} />
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

    async  insertRecipe(code) {






        var product_name = document.getElementsByName('product_name')
        var product_code = document.getElementsByName('product_code')
        var product_qty = document.getElementsByName('product_qty')
        var sell_price = document.getElementsByName('sell_price')
        var unit = document.getElementsByName('unit')
        // console.log("product_code", product_code[0].value);
        var insert = false
        if (product_name.length > 0) {
            for (let i = 0; i < product_name.length; i++) {
                if (product_name[i].value == '' || product_code[i].value == '' || product_qty[i].value == '' || sell_price[i].value == '' ||  unit[i].value == '' ) {
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
        } if (product_name.length <= 0) {
            swal({
                text: "กรุณากรอกข้อมูลให้ครบ",
                icon: "warning",
                button: "Close",
            });
        }
        if (insert) {
            var menu_code = this.props.menuCode
            // console.log(menu_code);
            const arr = await recipe_model.deleteRecipeByCode(menu_code)
            for (let i = 0; i < product_name.length; i++) {

                var recipe_list = {
                    menu_code: menu_code,
                    product_name: product_name[i].value,
                    product_code: product_code[i].value,
                    product_qty: product_qty[i].value,
                    sell_price: sell_price[i].value,
                    unit: unit[i].value,
                }



                const src = await recipe_model.insertRecipe(recipe_list)
                if (recipe_list != undefined) {
                    swal({
                        title: "จัดการสูตรเรียบร้อย",
                        icon: "success",
                        button: "Close",
                    });
                }
            }
        }
    }

    render() {
        var onProductTableUpdate = this.props.onProductTableUpdate;
        var rowDel = this.props.onRowDel;
        var filterText = this.props.filterText;
        var recipe = this.props.recipes.map(function (recipe) {

            return (<ProductRow onProductTableUpdate={onProductTableUpdate} recipe={recipe} onDelEvent={rowDel.bind(this)} key={recipe.id} />)
        });
        return (

            <div style={{ padding: '30px' }}>
                <Card>

                    <CardBody>
                        <button type="button" onClick={this.props.onRowAdd} className="btn btn-success pull-right">Add</button>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ชื่อวัตถุดิบ</th>
                                    <th>รหัสวัตถุดิบ</th>
                                    <th>จำนวน</th>
                                    <th>ราคาขาย</th>
                                    <th>หน่วย</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {recipe}

                            </tbody>

                        </table>
                    </CardBody>
                    <CardFooter>
                        <Button type="button"
                            onClick={this.insertRecipe.bind(this)}
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
    onDelEvent() {
        this.props.onDelEvent(this.props.recipe);

    }
    product_select(data) {
        this.setState({
            data: data
        })
        console.log("data", data);

    }
    render() {

        return (


            <tr className="eachRow">
                {/* <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                    "type": "menu_code",
                    value: this.props.recipe.menu_code,
                    id: this.props.recipe.menu_code
                }} /> */}

                <ModelProduct test={this.product_select.bind(this)} />
                {this.state.data == '' ?
                    <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "product_name",
                        value: this.props.recipe.product_name,
                        id: this.props.recipe.product_name,
                        readonly: true
                    }} />


                    : <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "product_name",
                        value: this.state.data.product_name,
                        id: this.state.data.product_name,
                        readonly: true
                    }} />}

                {this.state.data == '' ?
                    <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "product_code",
                        value: this.props.recipe.product_code,
                        id: this.props.recipe.product_code,
                        readonly: true
                    }} />


                    : <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "product_code",
                        value: this.state.data.product_code,
                        id: this.state.data.product_code,
                        readonly: true
                    }} />}

                {this.state.data == '' ?

                    <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "product_qty",
                        value: this.props.recipe.product_qty,
                        id: this.props.recipe.product_qty,
                        readonly: false
                    }} />


                    : <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "product_qty",
                        value: this.state.data.product_qty,
                        id: this.state.data.product_qty,
                        readonly: false
                    }} />}

                {this.state.data == '' ?

                    <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "sell_price",
                        value: this.props.recipe.sell_price,
                        id: this.props.recipe.sell_price,
                        readonly: false
                    }} />


                    : <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "sell_price",
                        value: this.state.data.sell_price,
                        id: this.state.data.sell_price,
                        readonly: false
                    }} />}

                {this.state.data == '' ?

                    <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "unit",
                        value: this.props.recipe.unit,
                        id: this.props.recipe.unit,
                        readonly: false
                    }} />

                    : <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "unit",
                        value: this.state.data.unit,
                        id: this.state.data.unit,
                        readonly: false
                    }} />}


                <td className="del-cell">
                    <input type="button" onClick={this.onDelEvent.bind(this)} value="X" className="del-btn" />
                </td>
            </tr>

        );

    }

}
class EditableCell extends React.Component {

    render() {
        return (
            <td>
                <Input type='text' name={this.props.cellData.type} id={this.props.cellData.id} Value={this.props.cellData.value} onChange={this.props.onProductTableUpdate} readOnly={this.props.cellData.readonly} />
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
        console.log("kkk");

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
                        {/* <Button onClick={this.handleSubmit.bind(this)} type="submit" size="lg" color="success">บันทึก</Button> */}
                        {/* <Button onClick={this.onDelete.bind(this, this.state.table_edit.table_code)} color="danger" size="lg" >ลบ</Button> */}
                    </ModalFooter>
                </Modal>
                <td>
                    <Button onClick={this.toggle.bind(this)}>แก้ไข</Button>
                </td>
            </>
        );

    }
}


export default (insertView);