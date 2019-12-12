import React, { Component } from 'react';
import { Button, Table, Card, Modal, ModalHeader, ModalBody, ModalFooter, Col, Row, CardImg, CardBody, CardTitle, Input, Label, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import GOBALS from '../../GOBALS'
// import ImgDefault from '../../assets/img/img_default.png'
// import UploadModel from '../../models/UploadModel';

import TableModel from '../../models/TableModel'
const table_model = new TableModel


class editView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],

            refresh: false,
        };
        // this.handleSubmit = this.handleSubmit.bind(this);

        this.toggle_Table = this.toggle_Table.bind(this);
        this.renderModelEdit = this.renderModelEdit.bind(this);

    }


    async componentDidMount() {

        const code = this.props.match.params.code
        const table_edit = await table_model.getTableByCode(code)
        console.log("table_edit", table_edit);
        this.setState({
            table_edit: table_edit.data
        })

        this.toggle_Table()
    }



    toggle_Table() {
        this.setState(prevState => ({
            modal_table: !prevState.modal_table

        }));
    }


    renderModelEdit() {

        if (this.state.table_edit != undefined) {
            var tableedit = []
            tableedit.push(
                <Modal isOpen={this.state.modal_table} toggle={this.toggle_Table} className={this.props.className} size="lg" >

                    <ModalBody >
                        <Form id="myForm">
                            <Row>
                                <Col lg="6">
                                    <Row>
                                        <Col >
                                            <Label>รหัสผู้ดูเเลระบบ / Admin Code </Label>
                                            <Input type="text" id="table_code" name="table_code" class="form-control" value={this.state.table_edit.table_code} />

                                            <Label className="text_head"> table_name<font color='red'><b> * </b></font></Label>
                                            <Input type="text" id="table_name" name="table_name" class="form-control" ></Input>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col >
                                            <Label className="text_head"> zone_id <font color='red'><b> * </b></font></Label>
                                            <Input type="text" id="zone_id" name="zone_id" class="form-control" ></Input>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg="6">

                                    <Row>
                                        <Col >
                                            <Label className="text_head"> ชื่อ แบรนด์ / Brand <font color='red'><b> * </b></font></Label>
                                            <Input type="text" id="table_amount" name="table_amount" class="form-control" ></Input>
                                        </Col>
                                    </Row>
                                </Col>

                            </Row>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle_Table} style={{ width: 100, height: 40 }}>OK</Button>
                    </ModalFooter>
                </Modal>

            )
        }
        return tableedit;

    }


    render() {


        return (
            <div className="animated fadeIn">
                {this.renderModelEdit()}
            </div >
        )
    }
}

const mapStatetoProps = (state) => {
    return {

    }
}

export default connect(mapStatetoProps)(editView);