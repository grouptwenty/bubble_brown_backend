import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import AdminModel from '../../models/AdminModel';
import swal from 'sweetalert';
const admin_model = new AdminModel

class HomeView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            admin_list: [],
            refresh: false
        };
        this.onDelete = this.onDelete.bind(this);

    }




    async componentDidMount() {

        var admin_list = await admin_model.getAdminby()

        this.setState({
            admin_list: admin_list.data
        })


    }


    async onDelete(code) {
        console.log(this.props);


        swal({
            text: "ต้องการที่จะลบข้อมูลผู้ดูเเลระบบหรือไม่ ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {

                    const res = admin_model.deleteAdminBy(code)
                        .then((req) => {

                            if (req.data == true) {
                                this.componentDidMount();
                                swal("success deleted!", {
                                    icon: "success",
                                });
                            } else {
                                swal("success deleted!", {
                                    icon: "error",
                                });
                            }
                        })

                }
            });

    }

    render() {

        var admin_list = this.state.admin_list
        var tbody_admin = []

        for (var i = 0; i < admin_list.length; i++) {

            tbody_admin.push(
                <tr>
                    <td >{(i + 1)}</td>
                    <td >{admin_list[i].admin_code}</td>
                    <td >{admin_list[i].admin_name + " " + admin_list[i].admin_lastname}</td>
                    <td >{admin_list[i].admin_email}</td>
                    <td >{admin_list[i].admin_mobile}</td>

                    <td>
                        <NavLink exact to={`/admin/update/` + admin_list[i].admin_code} >
                            <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ color: 'blue', marginRight: 10 }}></i>
                        </NavLink>

                        <Link to={`#`} onClick={this.onDelete.bind(null, admin_list[i].admin_code)} >
                            <i class="fa fa-times" aria-hidden="true" style={{ color: 'red' }}></i>
                        </Link >

                    </td>
                </tr>
            )
        }

        // console.log(admin_list);


        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                จัดการข้อมูลผู้ดูเเลระบบ /
                                <NavLink exact to={`/admin/insert`} style={{ width: '100%' }}>
                                    <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i> Add</button>
                                </NavLink>
                            </CardHeader>
                            <CardBody>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th>รหัสผู้ดูเเล</th>
                                            <th>ชื่อ - นามสกุล</th>
                                            <th>อีเมล</th>
                                            <th>โทรศัพท์</th>

                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tbody_admin}
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
export default (HomeView);