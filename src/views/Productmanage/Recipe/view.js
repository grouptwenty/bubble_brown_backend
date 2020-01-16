
import React, { Component } from 'react';
import { Button, Table, Card, Pagination, ButtonGroup, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import swal from 'sweetalert';

import MenuModel from '../../../models/MenuModel'
import MenuTypeModel from '../../../models/MenuTypeModel'

const menutype_model = new MenuTypeModel
const menu_model = new MenuModel
class RecipeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false
        };
        this.renderMenuType = this.renderMenuType.bind(this);
        this.getMenutByType = this.getMenutByType.bind(this);
    }


    async componentDidMount() {
        var menutype_list = await menutype_model.getMenuTypeBy(this.props.user)

        this.setState({
            menutype_list: menutype_list.data
        })

        const menu_list = await menu_model.getMenuByType(1);
        console.log("menu_list55555",menu_list);
        
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

    renderMenuType() {
        if (this.state.menutype_list != undefined) {
            var menu_type_list = []

            for (var key in this.state.menutype_list) {
                menu_type_list.push(
                    // <option value={this.state.product_type[key].product_type_id} >{this.state.product_type[key].product_type_name}</option>
                    <Button outline color="primary"  onClick={this.getMenutByType.bind(this,this.state.menutype_list[key].menu_type_id)}>{this.state.menutype_list[key].menu_type_name}</Button>                        
                )
            }
            return menu_type_list;
        }
    }

    async getMenutByType(code) {

        //   console.log("this.state.product_type[key].product_type_name",code);

          const menu_list = await menu_model.getMenuByType(code);
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
                <Row style={{ padding: '15px' }}>
                    <Col lg='12'>
                        <Card>
                            <CardHeader>
                                จัดการสูตร
                            </CardHeader>
                            <CardBody>
                            <Row style={{textAlign:'end',paddingBottom:'20px'}}>
                                    
                                    <Col lg="12">
                                        <ButtonGroup >
                                        {this.renderMenuType()}
                                        </ButtonGroup>
                                    </Col>
                                </Row>
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
const mapStatetoProps = (state) => {
    return {
        user: state.user,
    }
}
export default connect(mapStatetoProps)(RecipeView);