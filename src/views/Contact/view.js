import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, Label, Input, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';

import ContactModel from '../../models/ContactModel'
const contact_model = new ContactModel

class ContactView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contact: [],
            modal: false,
            data: [],
            contact_list: [],
            refresh: false
        };
        this.onDelete = this.onDelete.bind(this);
        this.onDetail = this.onDetail.bind(this);

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }


    async componentDidMount() {
        var contact_list = await contact_model.getContactBy()
        // console.log("contact_list", contact_list);
        this.setState({
            contact_list: contact_list.data
        })
    }

    async onDetail(val_contact) {
        this.setState({
            contact: val_contact
        })

        console.log("val_contact", val_contact);
        console.log("contact", this.state.contact);
        this.toggle()

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
                    const res = contact_model.deleteByCode(code)
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
        let contact_list = this.state.contact_list
        let tbody_contact = []
        const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>;


        for (let i = 0; i < contact_list.length; i++) {

            tbody_contact.push(
                <tr>
                    <td width={50}><h6 className="textcenter2">{i + 1}</h6></td>
                    <td width={200}><h6 className="textcenter2">{contact_list[i].contact_name}</h6></td>
                    <td width={240}><h6 className="textcenter2">{contact_list[i].contact_message}</h6></td>
                    <td width={50}>
                        <h6 className="textcenter2">
                            <Link to={`#`} onClick={this.onDetail.bind(this, contact_list[i])}>
                                <i class="fa fa-eye" aria-hidden="true" style={{ color: '#515A5A', marginRight: 12 }}></i>
                            </Link>
                        </h6>
                    </td>

                    <td width={50}>
                        <h6 className="textcenter2">
                            <Link to={`#`} onClick={this.onDelete.bind(null, contact_list[i].contact_code)}>
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
                                จัดการข้อมูลติดต่อเรา /  Connect Management

                            </CardHeader>
                            <CardBody>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th>ชื่อผู้ติดต่อ</th>
                                            <th>ข้อความ</th>
                                            <th>อ่าน</th>
                                            <th>ลบ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tbody_contact}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} >
                    <ModalHeader toggle={this.toggle} close={closeBtn}>ข้อมูลติดต่อ</ModalHeader>
                    <ModalBody >
                        <Row>
                            <Col lg="6" >
                                <Label className="text_head"> จากคุณ : </Label>
                                <Input type="text" value={this.state.contact.contact_name} readOnly class="form-control"></Input>

                            </Col>
                            <Col lg="6">
                                <Label className="text_head"> เมื่อ : </Label>
                                <Input type="text" value={this.state.contact.adddate} readOnly class="form-control"></Input>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col lg="6">
                                <Label className="text_head"> อีเมล : </Label>
                                <Input type="text" value={this.state.contact.contact_email} readOnly class="form-control"></Input>
                            </Col>
                            <Col lg="6">
                                <Label className="text_head"> เบอร์ : </Label>
                                <Input type="text" value={this.state.contact.contact_phone} readOnly class="form-control"></Input>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col lg="12" >
                                <Label className="text_head"> ข้อความ : </Label>
                                <textarea style={{ height: 150 }} value={this.state.contact.contact_message} type="text" class="form-control" readOnly></textarea>
                            </Col>
                        </Row>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle} style={{ width:100,height:40 }}>OK</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default (ContactView);