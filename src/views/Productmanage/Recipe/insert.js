import React, { Component } from 'react';
import {
    Button,
    Col,
    Row,
    Input,
    Card,
    CardBody,
    CardFooter,
    Modal, ModalBody, ModalFooter, ListGroup, ListGroupItem, ButtonGroup
} from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import RecipeModel from '../../../models/RecipeModel'
import ProductModel from '../../../models/ProductModel'
import UnitModel from '../../../models/UnitModel'
import ProductTypeModel from '../../../models/ProductTypeModel'

const product_type_model = new ProductTypeModel
const unit_model = new UnitModel
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

        this.state.filterText = "";

    }



    async componentDidMount() {
        const code = this.props.match.params.code
        var arr = {}
        arr['menu_code'] = code
        arr['about_code'] = this.props.user.about_code

        var recipe = await recipe_model.getRecipeByCode(arr)

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

                <ProductTable user={this.props.user} history={this.props.history} onProductTableUpdate={this.handleProductTable.bind(this)} menuCode={this.props.match.params.code} onRowAdd={this.handleAddEvent.bind(this)} onRowDel={this.handleRowDel.bind(this)} recipes={this.state.recipe} filterText={this.state.filterText} />
                {/* <ModelProduct user={this.props.user} /> */}
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
        this.renderProductRow = this.renderProductRow.bind(this)
    }

    componentDidMount() {

        this.setState({
            user: this.props.user
        })
    }

    calculatQty(qty, unit_id) {
        var unit = ''
        if (unit_id == 1) {
            unit = qty
        } else if (unit_id == 2) {
            unit = qty * 1000
        } else if (unit_id == 3) {
            unit = qty
        } else if (unit_id == 4) {
            unit = qty * 1000

        }
        return unit
    }

    async  insertRecipe(code) {

        var product_name = document.getElementsByName('product_name')
        var product_code = document.getElementsByName('product_code')
        var product_qty = document.getElementsByName('product_qty')
        var unit_id = document.getElementsByName('unit_id')

        var insert = false
        if (product_name.length > 0) {
            for (let i = 0; i < product_name.length; i++) {
                if (product_name[i].value == '' || product_code[i].value == '' || product_qty[i].value == '' || unit_id[i].value == '') {
                    swal({
                        text: "กรุณากรอกข้อมูลให้ครบ",
                        icon: "warning",
                        button: "ปิด",
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
                button: "ปิด",
            });
        }
        if (insert) {
            var menu_code = this.props.menuCode
            var src
            // console.log(menu_code);
            const arr = await recipe_model.deleteRecipeByCode(menu_code)
            for (let i = 0; i < product_name.length; i++) {
                var qty_cal = this.calculatQty(product_qty[i].value, unit_id[i].value)
                var recipe_list = {
                    menu_code: menu_code,
                    product_name: product_name[i].value,
                    product_code: product_code[i].value,
                    product_qty: product_qty[i].value,
                    unit_id: unit_id[i].value,
                    qty_cal: qty_cal,
                    about_code: this.props.user.about_code
                }

                console.log("recipe_list ====>", recipe_list);
                src = await recipe_model.insertRecipe(recipe_list)
                // const price_qty = await stock_model.getStockByPriceQty(recipe_list)
                // console.log("price_qty", price_qty);
            }

            if (src != undefined) {
                swal({
                    title: "จัดการสูตรเรียบร้อย",
                    icon: "success",
                    button: "ปิด",
                });
                this.props.history.push('/product-manage/recipe/')
            }
        }
    }
    renderProductRow(recipe) {
        var onProductTableUpdate = this.props.onProductTableUpdate;
        var rowDel = this.props.onRowDel;
        var filterText = this.props.filterText;

        return (<ProductRow user={this.props.user} onProductTableUpdate={onProductTableUpdate} recipe={recipe} onDelEvent={rowDel.bind(this)} key={recipe.id} />)

    }
    render() {

        var recipe = this.props.recipes.map(this.renderProductRow);
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
                                    <th>ปริมาณ</th>
                                    <th>หน่วย</th>
                                    {/* <th>ต้นทุน</th> */}
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {recipe}
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



    async componentDidMount() {
        var unit_list = await unit_model.getUnitBy()



        this.setState({
            unit_list: unit_list.data,

        })
        // console.log("this.state.code",this.state.code);
    }

    onDelEvent() {
        this.props.onDelEvent(this.props.recipe);

    }
    product_select(data) {
        this.setState({
            data: data
        })
        // console.log("data", data);

    }


    render() {

        return (


            <tr className="eachRow">
                {/* <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                    "type": "menu_code",
                    value: this.props.recipe.menu_code,
                    id: this.props.recipe.menu_code
                }} /> */}

                <ModelProduct user={this.props.user} test={this.product_select.bind(this)} />
                {this.state.data == '' ?
                    <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "product_name",
                        value: this.props.recipe.product_name,
                        id: this.props.recipe.product_name,
                        readonly: true,
                        types: 'text'
                    }} />


                    : <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "product_name",
                        value: this.state.data.product_name,
                        id: this.state.data.product_name,
                        readonly: true,
                        types: 'text'
                    }} />}

                {this.state.data == '' ?
                    <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "product_code",
                        value: this.props.recipe.product_code,
                        id: this.props.recipe.product_code,
                        readonly: true,
                        types: 'text'
                    }} />


                    : <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "product_code",
                        value: this.state.data.product_code,
                        id: this.state.data.product_code,
                        readonly: true,
                        types: 'text'
                    }} />}

                {this.state.data == '' ?

                    <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "product_qty",
                        value: this.props.recipe.product_qty,
                        id: this.props.recipe.product_qty,
                        readonly: false,
                        types: 'text',
                        textAlign: 'end'
                    }} />


                    : <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "product_qty",
                        value: this.state.data.product_qty,
                        id: this.state.data.product_qty,
                        readonly: false,
                        types: 'text',
                        textAlign: 'end'
                    }} />}


                {this.state.data == '' ?

                    <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "unit_id",
                        value: this.props.recipe.unit_id,
                        id: this.props.recipe.unit_id,
                        readonly: false,
                        types: 'select',
                        data: this.state.unit_list
                    }} />

                    : <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                        type: "unit_id",
                        value: this.state.data.unit_id,
                        id: this.state.data.unit_id,
                        readonly: false,
                        types: 'select',
                        data: this.state.unit_list
                    }} />}




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
                        <option Value={this.props.cellData.data[key].unit_id}>{this.props.cellData.data[key].unit_name}</option>
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
                    <Input type='select' name={this.props.cellData.type} onChange={this.props.onProductTableUpdate} readOnly={this.props.cellData.readonly} >
                        <option Value="">Select</option>
                        {this.renderUnit()}
                    </Input>
                    : <Input type='text' name={this.props.cellData.type} style={{ textAlign: this.props.cellData.textAlign }} Value={this.props.cellData.value} onChange={this.props.onProductTableUpdate} readOnly={this.props.cellData.readonly} />
                }

            </td>
        );

    }
}
class ModelProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product_type: [],
            modal: false
        }
        this.renderProductList = this.renderProductList.bind(this);
        // this.renderProductType = this.renderProductType.bind(this);
        this.getProductByType = this.getProductByType.bind(this);
    }

    async componentDidMount() {
        var product = await product_model.getProductBy(this.props.user)

        // var product = await product_model.getProductBy(this.props.user)

        const product_type = await product_type_model.getProductTypeBy(this.props.user)

        console.log("this.props.user55", this.props.user);
        this.setState({
            product: product.data,
            product_type: product_type.data
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

    renderProductType() {
        if (this.state.product_type != undefined) {

            var type_list = []
            for (var key in this.state.product_type) {
                type_list.push(
                    // <option value={this.state.product_type[key].product_type_id} >{this.state.product_type[key].product_type_name}</option>
                    <Button outline color="primary" onClick={this.getProductByType.bind(this, this.state.product_type[key].product_type_id)} >{this.state.product_type[key].product_type_name}</Button>

                )
            }
            return type_list;
        }
    }

    renderProductList() {
        if (this.state.product != undefined) {
            let product_list = []
            for (let i = 0; i < this.state.product.length; i++) {
                product_list.push(

                    <ListGroupItem onClick={this.toggle2.bind(this, this.state.product[i])}>
                        <Row style={{ fontSize: '15px', }}>
                            <Col lg="12">
                                {this.state.product[i].product_name}
                            </Col>
                        </Row>
                    </ListGroupItem>

                )
            } return product_list;
        }
    }

    async getProductByType(code) {

        //   console.log("this.state.product_type[key].product_type_name",code);
        const product = await product_model.getProductByType(code)
        this.setState({
            product: product.data
        });

        if (this.state.product != undefined) {
            let product_list = []
            for (let i = 0; i < this.state.product.length; i++) {
                product_list.push(

                    <ListGroupItem onClick={this.toggle2.bind(this, this.state.product[i])}>
                        <Row style={{ fontSize: '15px', }}>
                            <Col lg="12">
                                {this.state.product[i].product_name}
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
                        <Row style={{ textAlign: "end", paddingBottom: '10px' }}>
                            <Col lg="12">

                                <ButtonGroup >
                                    {this.renderProductType()}
                                    <Button outline color="primary" onClick={this.componentDidMount.bind(this)}>ทั้งหมด</Button>
                                </ButtonGroup>
                            </Col>

                        </Row>

                        <ListGroup className="vc" ref="iScroll" style={{ height: "420px", overflow: "auto", }}>

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
const mapStatetoProps = (state) => {
    return {
        user: state.user,
    }
}

export default connect(mapStatetoProps)(insertView)
