
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
        // this.onDelete = this.onDelete.bind(this);
    }


    async componentDidMount() {
        var user_list = await user_model.getUserBy()
        console.log("user_list", user_list);

        this.setState({
            user_list: user_list.data
        })

    }

    // async onDelete(code) {
    //     // console.log("code", code);
    //     swal({
    //         text: "คุณต้องการลบข้อมูลลูกค้า ? ",
    //         icon: "warning",
    //         buttons: true,
    //         dengerMode: true,
    //     })
    //         .then((willDelete) => {
    //             if (willDelete) {
    //                 const res = user_model.deleteUserByCode(code)
    //                     .then((req) => {
    //                         if (req.data == true) {
    //                             this.componentDidMount();

    //                             swal("success Deleted! ", {
    //                                 icon: "success",

    //                             });
    //                             this.componentDidMount()
    //                         } else {
    //                             swal("success Deleted! ", {
    //                                 icon: "error",

    //                             });
    //                         }

    //                     })

    //             }

    //         });

    // }

    render() {
        let user_list = this.state.user_list
        let tbody_user = []

        for (let i = 0; i < user_list.length; i++) {

            tbody_user.push(
                <tr>
                    <td><h6 className="textcenter3">{i + 1}</h6></td>
                    <td><h6 className="textcenter3">{user_list[i].user_code}</h6></td>
                    <td><h6 className="textcenter3">{user_list[i].user_position}</h6></td>
                    <td><h6 className="textcenter3">{user_list[i].user_firstname +" "+ user_list[i].user_lastname}</h6></td>
                    <td><h6 className="textcenter3">{user_list[i].user_email}</h6></td>
                    <td><h6 className="textcenter3">{user_list[i].user_tel}</h6></td>


                    {<td width={100}>
                        {/* <h6 className="textcenter3">
                            <NavLink exact to={`/user/update/` + user_list[i].user_code} style={{ width: '100%' }}>
                                <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ color: 'blue', marginRight: 30 }}></i>
                            </NavLink>
                            <Link to={`#`} onClick={this.onDelete.bind(null, user_list[i].user_code)}>
                                <i class="fa fa-times" aria-hidden="true" style={{ color: 'red' }}></i>
                            </Link>
                        </h6> */}
                    </td>}
                </tr>
            )

        }

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
                                            <th>ลำดับ</th>
                                            <th>รหัสพนักงาน</th>
                                            <th>ตำแหน่ง</th>
                                            <th>ชื่อ-นามสกุล</th>
                                            <th>อีเมล</th>
                                            <th>เบอร์โทร</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tbody_user}
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