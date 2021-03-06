import React, { Component } from 'react';
import { Media, Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import swal from 'sweetalert';
import GOBALS from '../../GOBALS'
import UserModel from '../../models/UserModel'
var user_model = new UserModel;
class UserView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false,
            show_update_model: false,
        };
    }

    onClickDelete(cell, row, rowIndex) {
        console.log('cell', cell);
        swal({
            title: "คุณต้องการลบข้อมูลพนักงาน?",
            text: "เมื่อลบแล้วคุณจะไม่สามารถกู้คืนข้อมูลได้!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                var set_data = {
                    user_code: row.userCode,
                }
                console.log('row', row)
                console.log('------------', set_data)
                var res = await user_model.deleteUserByCode(set_data);
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
                <NavLink exact to={'../user/detail/' + row.userCode}>
                    <button class="btn btn-primary">รายละเอียด</button>
                </NavLink>
                <NavLink exact to={'../user/update/' + row.userCode}>
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
                <img src={GOBALS.URL_IMG + "user/" + row.Img} className="img"></img>
            </>
        )
    }

    async componentDidMount() {
        const user_list = await user_model.getUserBy(this.props.user);
        console.log("user_list", user_list);

        const data_user_list = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in user_list.data) {
            var set_row = {
                userCode: user_list.data[key].user_code,
                Position: user_list.data[key].user_position,
                Name: user_list.data[key].user_firstname + " " + user_list.data[key].user_lastname,
                Email: user_list.data[key].user_email,
                Tel: user_list.data[key].user_tel,
                Img: user_list.data[key].user_image,
            }
            data_user_list.rows.push(set_row);
            i++;
        }
        this.setState({
            data: data_user_list
        })

    }

    render() {
        const { data } = this.state;
        return (
            <div className="animated fadeIn" style={{padding:'15px'}}>
                {/* <h2>พนักงาน</h2>
                <hr /> */}
                <Row>
                    <Col lg='12'>
                        <Card>
                            <CardHeader>
                                จัดการข้อมูลพนักงาน
                                <NavLink exact to={'/user/insert'} style={{ width: '100%' }}>
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
                                                {/* <TableHeaderColumn width={"15%"} dataField='Code' headerAlign="center" dataAlign="center" >Code</TableHeaderColumn> */}
                                                <TableHeaderColumn width={"15%"} dataField='Img' headerAlign="center" dataAlign="center" dataSort dataFormat={this.showPicture.bind(this)}>รูป</TableHeaderColumn>
                                                <TableHeaderColumn width={"10%"} dataField='userCode' headerAlign="center" dataAlign="center" dataSort isKey={true}>รหัสพนักงาน</TableHeaderColumn>
                                                <TableHeaderColumn width={"10%"} dataField='Position' headerAlign="center" dataAlign="center" dataSort>ตำแหน่ง</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Name' headerAlign="center" dataAlign="center" dataSort>ชื่อ-นามสกุล</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Email' headerAlign="center" dataAlign="center" dataSort>อีเมล</TableHeaderColumn>
                                                <TableHeaderColumn width={"10%"} dataField='Tel' headerAlign="center" dataAlign="center" dataSort>เบอร์โทร</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Action' headerAlign="center" dataAlign="left" dataFormat={this.cellButton.bind(this)}> </TableHeaderColumn>
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
export default connect(mapStatetoProps)(UserView);