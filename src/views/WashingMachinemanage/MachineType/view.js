
import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';

import WashingMachineTypeModel from '../../../models/WashingMachineTypeModel'
const type_model = new WashingMachineTypeModel

class MachineTypeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            type_list: [],
            refresh: false
        };
        this.onDelete = this.onDelete.bind(this);
    }


    async componentDidMount() {
        var type_list = await type_model.getWashingMachineTypeBy()
        // console.log("generation_list", generation_list);

        this.setState({
            type_list: type_list.data
        })

    }

    async onDelete(code) {
        // console.log("code", code);
        swal({
            text: "คุณต้องการลบข้อมูลประเภทเครื่อง ? ",
            icon: "warning",
            buttons: true,
            dengerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const res = type_model.deleteByCode(code)
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
        let type_list = this.state.type_list
        let tbody_type = []

        for (let i = 0; i < type_list.length; i++) {

            tbody_type.push(
                <tr>
                    <td style={{width:100}}><h6 className="textcenter3">{i + 1}</h6></td>
                    <td ><h6 className="textcenter3">{type_list[i].washing_machine_type_code}</h6></td>
                    <td ><h6 className="textcenter3">{type_list[i].washing_machine_type_name}</h6></td>
                   
                    <td style={{width:100}}>
                        <h6 className="textcenter3">
                            <NavLink exact to={`/machine-manage/machine-type/update/` + type_list[i].washing_machine_type_code} style={{ width: '100%' }}>
                            <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ color: 'blue', marginRight: 20 }}></i>
                            </NavLink>

                            <Link to={`#`} onClick={this.onDelete.bind(null, type_list[i].washing_machine_type_code)}>
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
                                จัดการข้อมูลประเภทเครื่อง / Machine Type Management
                                <NavLink exact to={`/machine-manage/machine-type/insert`} style={{ width: '100%' }}>
                                <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i> Add</button>
                                </NavLink>
                            </CardHeader>
                            <CardBody>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th>รหัสประเภท</th>
                                            <th>ประเภท</th>
                                            <th ></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tbody_type}
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
export default (MachineTypeView);