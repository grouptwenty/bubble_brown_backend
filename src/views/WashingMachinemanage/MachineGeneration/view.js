
import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';

import WashingMachineGenerationModel from '../../../models/WashingMachineGenerationModel'
const generation_model = new WashingMachineGenerationModel

class MachineGenerationView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            generation_list: [],
            refresh: false
        };
        this.onDelete = this.onDelete.bind(this);
    }


    async componentDidMount() {
        var generation_list = await generation_model.getWashingMachineGenerationBy()
        console.log("generation_list", generation_list);

        this.setState({
            generation_list: generation_list.data
        })

    }

    async onDelete(code) {
        // console.log("code", code);
        swal({
            text: "คุณต้องการลบข้อมูลรุ่น ? ",
            icon: "warning",
            buttons: true,
            dengerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const res = generation_model.deleteByCode(code)
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
        let generation_list = this.state.generation_list
        let tbody_generation = []

        for (let i = 0; i < generation_list.length; i++) {

            tbody_generation.push(
                <tr>
                    <td width={20}><h6 className="textcenter3">{i + 1}</h6></td>
                    <td width={50}><h6 className="textcenter3">{generation_list[i].washing_machine_generation_code}</h6></td>
                    <td width={80}><h6 className="textcenter3">{generation_list[i].washing_machine_generation_name}</h6></td>
                    <td width={100}><h6 className="textcenter3">{generation_list[i].washing_machine_brand_name}</h6></td>
                    <td width={100}><h6 className="textcenter3">{generation_list[i].washing_machine_type_name}</h6></td>

                    <td width={20}>
                        <h6 className="textcenter3">
                            <NavLink exact to={`/machine-manage/machine-generation/update/` + generation_list[i].washing_machine_generation_code} style={{ width: '100%' }}>
                            <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ color: 'blue', marginRight: 30 }}></i>
                            </NavLink>

                            <Link to={`#`} onClick={this.onDelete.bind(null, generation_list[i].washing_machine_generation_code)}>
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
                                จัดการข้อมูลรุ่น / Generation Management
                                <NavLink exact to={`/machine-manage/machine-generation/insert`} style={{ width: '100%' }}>
                                <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i> Add</button>
                                </NavLink>
                            </CardHeader>
                            <CardBody>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th>รหัสรุ่น</th>
                                            <th>ชื่อรุ่น</th>
                                            <th>แบรนด์</th>
                                            <th>ประเภท</th>
                                            <th ></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tbody_generation}
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
export default (MachineGenerationView);