import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';

import RepairModel from '../../models/RepairModel'
const repair_model = new RepairModel

class RepairView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            repair_list: [],
            refresh: false
        };
        this.onDelete = this.onDelete.bind(this);
    }


    async componentDidMount() {
        var repair_list = await repair_model.getRepairBy()
        console.log("repair_list", repair_list);


        this.setState({
            repair_list: repair_list.data
        })

    }

    async onDelete(code) {
        // console.log("code", code);
        swal({
            text: "คุณต้องการลบข้อมูลแจ้งซ้อม ? ",
            icon: "warning",
            buttons: true,
            dengerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const res = repair_model.deleteByCode(code)
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
        let repair_list = this.state.repair_list
        let tbody_repair = []
        let status = []

        for (let i = 0; i < repair_list.length; i++) {

            tbody_repair.push(
                <tr>
                    <td width={50}><h6 className="textcenter2">{i + 1}</h6></td>
                    <td width={100}><h6 className="textcenter2">{repair_list[i].repair_code}</h6></td>
                    <td width={150}><h6 className="textcenter2">{repair_list[i].repair_date}</h6></td>
                    <td width={150}><h6 className="textcenter2" style={{ color: repair_list[i].repair_status == "แจ้งซ่อม" ? '#dc3545' : repair_list[i].repair_status == "กำลังตรวจสอบ" ? '#0069d9' : repair_list[i].repair_status == "กำลังซ่อม" ? '#ffc107' : repair_list[i].repair_status == "ซ่อมเรียบร้อย" ? '#28a745' : '#dc3545' }}>{repair_list[i].repair_status}</h6></td>
                    <td width={110}><h6 className="textcenter2">{repair_list[i].washing_machine_name}</h6></td>
                    <td width={200}><h6 className="textcenter2">{repair_list[i].laundry_name_th}</h6></td>
                    <td width={200}><h6 className="textcenter2">{repair_list[i].user_name + "  " + repair_list[i].user_lastname}</h6></td>
                    <td width={100}>
                        <h6 className="textcenter2">

                        <NavLink exact to={`/repair/detail/` + repair_list[i].repair_code} style={{ width: '100%' }}>
                            <i class="fa fa-file-text-o" aria-hidden="true" style={{ color: 'blue', marginRight: 15 }}></i>
                            </NavLink>

                            <NavLink exact to={`/repair/update/` + repair_list[i].repair_code} style={{ width: '100%' }}>
                                <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ color: 'blue', marginRight: 10 }}></i>
                            </NavLink>

                            <Link to={`#`} onClick={this.onDelete.bind(null, repair_list[i].repair_code)}>
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
                        <h2> แจ้งซ่อมบำรุง /  Maintenance</h2>
                        <hr />
                        <br />
                        <Card>
                            <CardHeader>
                                <h4>รายการซ่อมบำรุง</h4>
                            </CardHeader>
                            <CardBody>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th>รหัสซ่อมบำรุง</th>
                                            <th>วันที่แจ้งซ่อมบำรุง</th>
                                            <th>สถานะซ่อมบำรุง</th>
                                            <th>เครื่องซักผ้า</th>
                                            <th>ร้านซักผ้า</th>
                                            <th>ผู้แจ้งซ่อม</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tbody_repair}
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
export default (RepairView);