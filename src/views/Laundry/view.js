import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';

import LaundryModel from '../../models/LaundryModel'
const laundry_model = new LaundryModel

class LaundryView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            laundry_list: [],
            refresh: false
        };
        this.onDelete = this.onDelete.bind(this);
    }


    async componentDidMount() {
        var laundry_list = await laundry_model.getLaundryBy()
        console.log("laundry_list",laundry_list);
        this.setState({
            laundry_list: laundry_list.data
        })
    }

    async onDelete(code) {
        // console.log("code", code);
        swal({
            text: "คุณต้องการลบข้อมูลร้านซักผ้า ? ",
            icon: "warning",
            buttons: true,
            dengerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const res = laundry_model.deleteByCode(code)
                        .then((req) => {
                            if (req.data == true) {
                                this.componentDidMount();
                                swal("success Deleted! ", {
                                    icon: "success",

                                });
                            } else {
                                swal("success Deleted! ", {
                                    icon: "error",

                                });
                            }

                        })

                }

            });

    }

    render() {
        let laundry_list = this.state.laundry_list
        let tbody_laundry = []

        for (let i = 0; i < laundry_list.length; i++) {

            tbody_laundry.push(
                <tr>
                    <td width={50}><h6 className="textcenter2">{i + 1}</h6></td>
                    <td width={100}><h6 className="textcenter2">{laundry_list[i].laundry_code}</h6></td>
                    <td width={240}><h6 className="textcenter2">{laundry_list[i].laundry_name_th}</h6></td>
                    <td width={240}><h6 className="textcenter2">{laundry_list[i].entrepreneur_name_th}</h6></td>
                    <td width={80}>
                        <h6 className="textcenter2">
                            <NavLink exact to={`/laundry/edit/` + laundry_list[i].laundry_code} style={{ width: '100%' }}>
                                <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ color: 'blue', marginRight: 15 }}></i>
                            </NavLink>
                            <Link to={`#`} onClick={this.onDelete.bind(null, laundry_list[i].laundry_code)}>
                                <i class="fa fa-times" aria-hidden="true" style={{ color: 'red' }}></i>
                            </Link>
                        </h6>
                    </td>
                </tr>
            )

        }
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                จัดการข้อมูลร้านซักผ้า /  Laundry Management
                                <NavLink exact to={`/laundry/insert`} style={{ width: '100%' }}>
                                <button class="btn btn-primary btn-lg float-right boottom-header" name="add_laundry"><i class="fa fa-plus"></i> Add</button>
                                </NavLink>
                            </CardHeader>
                            <CardBody>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th>รหัสร้านซักผ้า</th>
                                            <th>ชื่อร้านซักผ้า</th>
                                            <th>ผู้ประกอบการ</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tbody_laundry}
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

export default (LaundryView);