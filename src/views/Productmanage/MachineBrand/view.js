
import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';

import WashingMachineBrandModel from '../../../models/WashingMachineBrandModel'
const brand_model = new WashingMachineBrandModel

class MachineBrandView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            brand_list: [],
            refresh: false
        };
        this.onDelete = this.onDelete.bind(this);
    }


    async componentDidMount() {
        var brand_list = await brand_model.getWashingMachineBrandBy()
        // console.log("brand_list", brand_list);

        this.setState({
            brand_list: brand_list.data
        })

    }

    async onDelete(code) {
        // console.log("code", code);
        swal({
            text: "คุณต้องการลบข้อมูลแบรนด์ ? ",
            icon: "warning",
            buttons: true,
            dengerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const res = brand_model.deleteByCode(code)
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
        let brand_list = this.state.brand_list
        let tbody_brand = []

        for (let i = 0; i < brand_list.length; i++) {

            tbody_brand.push(
                <tr>
                    <td width={20}><h6 className="textcenter3">{i + 1}</h6></td>
                    <td width={50}><h6 className="textcenter3">{brand_list[i].washing_machine_brand_code}</h6></td>
                    <td width={80}><h6 className="textcenter3">{brand_list[i].washing_machine_brand_name}</h6></td>
                    <td width={100}><h6 className="textcenter3">{brand_list[i].washing_machine_brand_detail}</h6></td>

                    <td width={20}>
                        <h6 className="textcenter3">
                            <NavLink exact to={`/machine-manage/machine-brand/update/` + brand_list[i].washing_machine_brand_code} style={{ width: '100%' }}>
                            <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ color: 'blue', marginRight: 30 }}></i>
                            </NavLink>

                            <Link to={`#`} onClick={this.onDelete.bind(null, brand_list[i].washing_machine_brand_code)}>
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
                                จัดการข้อมูลแบรนด์ /  Brand Management
                                <NavLink exact to={`/machine-manage/machine-brand/insert`} style={{ width: '100%' }}>
                                <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i> Add</button>
                                </NavLink>
                            </CardHeader>
                            <CardBody>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th>รหัสแบรนด์</th>
                                            <th>ชื่อแบรนด์</th>
                                            <th>รายละเอียด</th>
                                            <th ></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tbody_brand}
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
export default (MachineBrandView);