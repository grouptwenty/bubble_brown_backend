
import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';

import WashingMachineProgramModel from '../../../models/WashingMachineProgramModel'
const program_model = new WashingMachineProgramModel

class MachineProgamView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            program_list: [],
            refresh: false
        };
        this.onDelete = this.onDelete.bind(this);
    }


    async componentDidMount() {
        var program_list = await program_model.getWashingMachineProgramBy()
        // console.log("generation_list", generation_list);

        this.setState({
            program_list: program_list.data
        })

    }

    async onDelete(code) {
        // console.log("code", code);
        swal({
            text: "คุณต้องการลบข้อมูลโปรแกรม ? ",
            icon: "warning",
            buttons: true,
            dengerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const res = program_model.deleteByCode(code)
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
        let program_list = this.state.program_list
        let tbody_program = []

        for (let i = 0; i < program_list.length; i++) {

            tbody_program.push(
                <tr>
                    <td ><h6 className="textcenter3">{i + 1}</h6></td>
                    <td ><h6 className="textcenter3">{program_list[i].program_code}</h6></td>
                    <td ><h6 className="textcenter3">{program_list[i].program_name}</h6></td>
                    <td ><h6 className="textcenter3">{program_list[i].program_price}</h6></td>
                    <td ><h6 className="textcenter3">{program_list[i].description}</h6></td>
                    <td ><h6 className="textcenter3">{program_list[i].program_time + ' ' + 'นาที'}</h6></td>
                    <td ><h6 className="textcenter3">{program_list[i].washing_machine_generation_name}</h6></td>

                    <td >
                        <h6 className="textcenter3">
                            <NavLink exact to={`/machine-manage/machine-program/update/` + program_list[i].program_code} style={{ width: '100%' }}>
                                <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ color: 'blue', marginRight: 30 }}></i>
                            </NavLink>

                            <Link to={`#`} onClick={this.onDelete.bind(null, program_list[i].program_code)}>
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
                                จัดการข้อมูลโปรแกรม / Program Management
                                <NavLink exact to={`/machine-manage/machine-program/insert`} style={{ width: '100%' }}>
                                    <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i> Add</button>
                                </NavLink>
                            </CardHeader>
                            <CardBody>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th>รหัสโปรแกรม</th>
                                            <th>โปรแกรม</th>
                                            <th>ราคา</th>
                                            <th>รายละเอียด</th>
                                            <th>เวลา</th>
                                            <th>รุ่น</th>
                                            <th ></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tbody_program}
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
export default (MachineProgamView);