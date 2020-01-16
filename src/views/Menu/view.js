import React, { Component } from 'react';
import { Media, Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ImgDefault from '../../assets/img/img_default.png'
import swal from 'sweetalert';
import GOBALS from '../../GOBALS'
import MenuModel from '../../models/MenuModel'
import MenuTypeModel from '../../models/MenuTypeModel'

var menu_model = new MenuModel

class MenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            menu_list: [],
            refresh: false,
            show_update_model: false
        };
    }

    onClickDelete(cell, row, rowIndex) {
        console.log('cell', cell);
        swal({
            title: "คุณต้องการลบเมนู?",
            text: "เมื่อลบแล้วคุณจะไม่สามารถกู้คืนข้อมูลได้!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                var set_data = {
                    menu_code: row.menuCode,
                }
                console.log('row', row)
                console.log('------------', set_data)
                var res = await menu_model.deleteMenuByCode(set_data);
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

    cellButton(cell, row, enumObject, rowIndex) {
        return (
            <>
                <NavLink exact to={'../menu/update/' + row.menuCode}>
                    <button class="btn btn-warning">แก้ไข</button>
                </NavLink>
                <button class="btn btn-danger" onClick={() => this.onClickDelete(cell, row, rowIndex)}>ลบ</button>
            </>
        )
    }

    showPicture(cell, row, enumObject, rowIndex) {
        console.log(">>>>>>>>>>>>>>>>>>>>", row.Picture);

        // var url = "http://localhost:3006/" + row.Picture;
        return (
            <>
                <img src={row.Img != "" && row.Img != null ? GOBALS.URL_IMG + "menu/" + row.Img : ImgDefault} className="img"></img>

            </>
        )
    }

    async componentDidMount() {
        var menu_list = await menu_model.getMenuBy(this.props.user)
        console.log("this.props.user", this.props.user);
        const data_menu_list = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in menu_list.data) {
            var set_row = {
                menuCode: menu_list.data[key].menu_code,
                Type: menu_list.data[key].menu_type_name,
                Name: menu_list.data[key].menu_name,
                Price: menu_list.data[key].menu_price,
                Img: menu_list.data[key].menu_image,
            }
            data_menu_list.rows.push(set_row);
            i++;
        }

        this.setState({
            data: data_menu_list
        })

    }

    render() {
        const { data } = this.state;
        return (
            <div className="animated fadeIn">
                <Row style={{ padding: '15px' }}>
                    <Col lg='12'>
                        <Card>
                            <CardHeader>
                                จัดการเมนู
                                <NavLink exact to={'../menu/insert'} style={{ width: '100%' }}>
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
                                                <TableHeaderColumn dataField='Img' headerAlign="center" dataAlign="center" dataSort dataFormat={this.showPicture.bind(this)}>รูป</TableHeaderColumn>
                                                <TableHeaderColumn dataField='menuCode' headerAlign="center" dataAlign="center" dataSort isKey={true}>รหัสเมนู</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Type' headerAlign="center" dataAlign="center" dataSort>ประเภท</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Name' headerAlign="center" dataAlign="center" dataSort>ชื่อเมนู</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Price' headerAlign="center" dataAlign="center" dataSort>ราคา</TableHeaderColumn>
                                                {/* <TableHeaderColumn dataField='Img' headerAlign="center" dataAlign="center"dataSort dataFormat={this.showPicture.bind(this)}>รูป</TableHeaderColumn> */}
                                                <TableHeaderColumn dataField='Action' headerAlign="center" dataAlign="center" dataFormat={this.cellButton.bind(this)}> </TableHeaderColumn>
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
export default connect(mapStatetoProps)(MenuView);