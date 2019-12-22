
import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';

import UserModel from '../../models/UserModel'
const user_model = new UserModel

class UserView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            user_list: [],
            refresh: false
        };
        this.onDelete = this.onDelete.bind(this);
        this.renderUser = this.renderUser.bind(this);

    }


    async componentDidMount() {
        var user_list = await user_model.getUserBy()
        console.log("user_list", user_list);

        this.setState({
            user_list: user_list.data
        })

    }

    async onDelete(code) {
    
        swal({
            text: "คุณต้องการลบข้อมูลพนักงาน ? ",
            icon: "warning",
            buttons: true,
            dengerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const res = user_model.deleteUserByCode(code)
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
                    console.log("code", code);
            }
        });
    }

    renderUser() {
        let tbody_user = []

        for (let i = 0; i < this.state.user_list.length; i++) {

            tbody_user.push(
                <tr>
                    <td><h6 className="textcenter3">{i + 1}</h6></td>
                    <td><h6 className="textcenter3">{this.state.user_list[i].user_code}</h6></td>
                    <td><h6 className="textcenter3">{this.state.user_list[i].user_position}</h6></td>
                    <td><h6 className="textcenter3">{this.state.user_list[i].user_firstname + " " + this.state.user_list[i].user_lastname}</h6></td>
                    <td><h6 className="textcenter3">{this.state.user_list[i].user_email}</h6></td>
                    <td><h6 className="textcenter3">{this.state.user_list[i].user_tel}</h6></td>


                    {<td width={100}>
                        <h6 className="textcenter3">
                            <NavLink exact to={`/user/update/` + this.state.user_list[i].user_code} style={{ width: '100%' }}>
                                <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ color: 'blue', marginRight: 30 }}></i>
                            </NavLink>
                            <Link to={`#`} onClick={this.onDelete.bind(null, this.state.user_list[i].user_code)}>
                                <i class="fa fa-times" aria-hidden="true" style={{ color: 'red' }}></i>
                            </Link>
                        </h6>
                    </td>}
                </tr>
            )

        }
    return tbody_user;
}

    render (){
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                จัดการข้อมูลพนักงาน
                                <NavLink exact to={`/user/insert`} style={{ width: '100%' }}>
                                    <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i>  เพิ่ม</button>
                                </NavLink>
                            </CardHeader>
                            <CardBody>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th className="textcenter3">ลำดับ</th>
                                            <th className="textcenter3">รหัสพนักงาน</th>
                                            <th className="textcenter3">ตำแหน่ง</th>
                                            <th className="textcenter3">ชื่อ-นามสกุล</th>
                                            <th className="textcenter3">อีเมล</th>
                                            <th className="textcenter3">เบอร์โทร</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderUser()}
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
export default (UserView);