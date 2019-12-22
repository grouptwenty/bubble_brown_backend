
import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';
import MenuModel from '../../models/MenuModel'
import MenuTypeModel from '../../models/MenuTypeModel'

const menu_model = new MenuModel
const menu_type_model = new MenuTypeModel

class MenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            menu_list: [],
            menu_type: [],
            refresh: false
        };
        this.onDelete = this.onDelete.bind(this);
        this.renderMenu = this.renderMenu.bind(this);

    }


    async componentDidMount() {
        var menu_list = await menu_model.getMenuBy()
        // console.log("menu_list", menu_list);
        this.setState({
            menu_list: menu_list.data
        })
        
    }

    async onDelete(code) {
        // console.log("code", code);
        swal({
            text: "คุณต้องการลบเมนู ? ",
            icon: "warning",
            buttons: true,
            dengerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const res = menu_model.deleteMenuByCode(code)
                        .then((req) => {
                            if (req.data == true) {
                                this.componentDidMount();
                                swal("success Deleted! ", {
                                    icon: "success",

                                });
                                // this.componentDidMount()
                            } else {
                                swal("success Deleted! ", {
                                    icon: "error",

                                });
                            }

                        })

                }

            });

    }

    async getMenuByCode(code) {
        var menu_list = await menu_model.getMenuByCode(code)
        // console.log("menulistbycode", menu_list);
        this.setState({
            menu_list: menu_list.data
        })
    }

    renderMenu() {
        let tbody_menu = []

        for (let i = 0; i < this.state.menu_list.length; i++) {

            tbody_menu.push(
                <tr>
                    <td><h6 className="textcenter3">{i + 1}</h6></td>
                    <td><h6 className="textcenter3">{this.state.menu_list[i].menu_code}</h6></td>
                    {/* <td><h6 className="textcenter3">{this.state.menu_list[i].menu_id}</h6></td> */}
                    <td><h6 className="textcenter3">{this.state.menu_list[i].menu_type_name}</h6></td>
                    <td><h6 className="textcenter3">{this.state.menu_list[i].menu_name}</h6></td>
                    {/* <td><h6 className="textcenter3">{this.state.menu_list[i].menu_image}</h6></td> */}
                    <td><h6 className="textcenter3">{this.state.menu_list[i].menu_price}</h6></td>

                    {<td width={100}>
                        <h6 className="textcenter3">
                            <NavLink exact to={`/menu/update/` + this.state.menu_list[i].menu_code} style={{ width: '100%' }}>
                                <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ color: 'blue', marginRight: 30 }}></i>
                            </NavLink>
                            <Link to={`#`} onClick={this.onDelete.bind(null, this.state.menu_list[i].menu_code)}>
                                <i class="fa fa-times" aria-hidden="true" style={{ color: 'red' }}></i>
                            </Link>
                        </h6>
                    </td>}
                </tr>
            )

        }
        return tbody_menu;
    }

    render() {


        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                จัดการเมนู
                                <NavLink exact to={`/menu/insert`} style={{ width: '100%' }}>
                                    <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i>   เพิ่ม</button>
                                </NavLink>
                            </CardHeader>
                            <CardBody>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th className="textcenter3">ลำดับ</th>
                                            <th className="textcenter3">รหัสเมนู</th>
                                            <th className="textcenter3">ประเภท</th> 
                                            <th className="textcenter3">ชื่อ</th>
                                            {/* <th className="textcenter3">รูปภาพ</th> */}
                                            <th className="textcenter3">ราคา</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderMenu()}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default (MenuView);