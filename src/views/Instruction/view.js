import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, Label, Input, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';

import InstructionModel from '../../models/InstructionModel'
const instruction_model = new InstructionModel

class InstructionView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            instruction_list: [],
            refresh: false
        };
        this.onDelete = this.onDelete.bind(this);

    }

   

    async componentDidMount() {
        var instruction_list = await instruction_model.getInstructionBy()
        // console.log("contact_list", contact_list);
        this.setState({
            instruction_list: instruction_list.data
        })
    }


    async onDelete(code) {
        // console.log("code", code);
        swal({
            text: "คุณต้องการลบข้อมูลวิธีการใช้งาน  ? ",
            icon: "warning",
            buttons: true,
            dengerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const res = instruction_model.deleteByCode(code)
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
        let instruction_list = this.state.instruction_list
        let tbody_instruc = []

        for (let i = 0; i < instruction_list.length; i++) {

            tbody_instruc.push(
                <tr>
                    <td width={50}><h6 className="textcenter2">{i + 1}</h6></td>
                    <td width={300}><h6 style={{marginTop:10}}>{instruction_list[i].instruction_title_th}</h6></td>
                    <td width={300}><h6 style={{marginTop:10}}>{instruction_list[i].instruction_description_th}</h6></td>
                    <td width={80}>
                        <h6 className="textcenter2">
                            <NavLink exact to={`/instruction/update/` + instruction_list[i].instruction_code} style={{ width: '100%' }}>
                                <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ color: 'blue', marginRight: 15 }}></i>
                            </NavLink>
                            <Link to={`#`} onClick={this.onDelete.bind(null, instruction_list[i].instruction_code)}>
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
                                จัดการข้อมูลวิธีการใช้งาน /  Instruction Management
                                <NavLink exact to={`/instruction/insert`} style={{ width: '100%' }}>
                                <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i> Add</button>
                                </NavLink>
                            </CardHeader>
                            <CardBody>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th>หัวข้อ</th>
                                            <th>รายละเอียด</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tbody_instruc}
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

export default (InstructionView);