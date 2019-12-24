import React, { Component } from 'react';
import { Media, Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Label, Row, CardImg, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import BookingModel from '../../models/BookingModel';
import swal from 'sweetalert';
var booking_model = new BookingModel;
class BookingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            booking: [],
            refresh: false,
            show_update_model: false,
        };
        this.toggle = this.toggle.bind(this);
        // this.renderDetail = this.renderDetail.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    onClickDelete(cell, row, rowIndex) {
        console.log('cell', cell);
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                var set_data = {
                    booking_code: row.booking_code,
                }
                console.log('------------', set_data)
                var res = await booking_model.deleteBooking(set_data);
                if (res.query_result) {
                    swal("Poof! Your imaginary file has been deleted!", {
                        icon: "success",
                    });
                } else {
                    swal("deleted Fail", {
                        icon: "error",
                    });
                }
                this.componentDidMount();
            }
        });
        console.log('row', row);
        console.log('rowIndex', rowIndex);
    }
    cellButton(cell, row, enumObject, rowIndex) {
        return (
            <>
                <button class="btn btn-primary" onClick={() => this.onBookingDetail(row.booking_code)}>Detail</button>
                <NavLink exact to={'../booking/edit/' + row.booking_code}>
                    <button class="btn btn-warning">Edit</button>
                </NavLink>
                <button class="btn btn-danger" onClick={() => this.onClickDelete(cell, row, rowIndex)}>Cancel</button>
            </>
        )
    }
    showPicture(cell, row, enumObject, rowIndex) {
        console.log(">>>>>>>>>>>>>>>>>>>>", row.Picture);

        var url = "http://localhost:3003/" + row.Picture;
        return (
            <>
                <img src={url} className="img"></img>
            </>
        )
    }
    async componentDidMount() {
        const booking_list = await booking_model.getBookingBy();
        const data_booking_list = {
            rows: []
        }
        var i = 1;
        for (var key in booking_list.data) {
            var set_row = {
                booking_code: booking_list.data[key].booking_code,
                table_code: booking_list.data[key].table_code,
                name: booking_list.data[key].booking_firstname + " " + booking_list.data[key].booking_lastname,
                booking_tel: booking_list.data[key].booking_tel,
                booking_date: booking_list.data[key].booking_date,
            }
            data_booking_list.rows.push(set_row);
            i++;
        }
        this.setState({
            data: data_booking_list,
        });
    }

    async onBookingDetail(booking_code) {
        var booking = await booking_model.getBookingByCode(booking_code)
        console.log("booking :", booking);

        this.setState({
            booking: booking.data,
            name: booking.data.booking_firstname + " " + booking.data.booking_lastname,
            booking_code: booking.data.booking_code
        })
        console.log(booking);
        this.toggle()
    }

    render() {
        const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>;
        const { data } = this.state;
        return (
            <div className="animated fadeIn">
                <h2>Booking</h2>
                <hr />
                <Row>
                    <Col lg='12'>
                        <Card>
                            <CardHeader>
                                Booking
                                <NavLink exact to={'../Booking/insert'} style={{ width: '100%' }}>
                                    <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i> Add</button>
                                </NavLink>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col lg='12'>
                                        <div>
                                            <BootstrapTable
                                                ref='table'
                                                data={data.rows}
                                                striped hover pagination
                                                search={true}
                                            >
                                                <TableHeaderColumn width={"15%"} dataField='booking_code' headerAlign="center" dataAlign="center" dataSort isKey={true}>รหัสการจอง</TableHeaderColumn>
                                                <TableHeaderColumn width={"10%"} dataField='table_code' headerAlign="center" dataAlign="center" dataSort>โต๊ะ</TableHeaderColumn>
                                                <TableHeaderColumn width={"20%"} dataField='name' headerAlign="center" dataAlign="center" dataSort>ชื่อ - นามสกุล</TableHeaderColumn>
                                                <TableHeaderColumn width={"10%"} dataField='booking_tel' headerAlign="center" dataAlign="center" dataSort>เบอร์โทร</TableHeaderColumn>
                                                <TableHeaderColumn width={"10%"} dataField='booking_date' headerAlign="center" dataAlign="center" dataSort>วันที่</TableHeaderColumn>
                                                <TableHeaderColumn width={"25%"} dataField='Action' headerAlign="center" dataAlign="center" dataFormat={this.cellButton.bind(this)}></TableHeaderColumn>
                                            </BootstrapTable>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Modal isOpen={this.state.modal} toggle={this.toggle}  >
                    <ModalHeader toggle={this.toggle} >รหัสการจอง : {this.state.booking_code}</ModalHeader>
                    <ModalBody >
                        <Row>
                            <Col>
                                <Row className="center" style={{ marginBottom: 10 }}>
                                    <Col lg="3" md="3" sm="3" className="right" >
                                        หมายเลขโต๊ะ :
                                    </Col>
                                    <Col lg="2" md="2" sm="2">
                                        <label>{this.state.booking.table_code}</label>
                                    </Col>
                                    <Col lg="3" md="3" sm="3" className="right" >
                                        จำนวนคน :
                                    </Col>
                                    <Col lg="2" md="2" sm="2">
                                        <label>{this.state.booking.booking_amount}</label>
                                    </Col>
                                </Row>
                                <Row className="center" style={{ marginBottom: 10 }}>
                                    <Col lg="3" md="3" sm="3" className="right" >
                                        วันที่จอง :
                                    </Col>
                                    <Col lg="5" md="7" sm="5">
                                        <label>{this.state.booking.booking_date}</label>
                                    </Col>
                                </Row>
                                <Row className="center" style={{ marginBottom: 10 }}>
                                    <Col lg="3" md="3" sm="3" className="right" >
                                        ชื่อ-นามสกุล :
                                    </Col>
                                    <Col lg="5" md="7" sm="5">
                                        <label>{this.state.name}</label>
                                    </Col>
                                </Row>
                                <Row className="center" style={{ marginBottom: 10 }}>
                                    <Col lg="3" md="3" sm="3" className="right" >
                                        อีเมล์ :
                                    </Col>
                                    <Col lg="5" md="5" sm="5">
                                        <label>{this.state.booking.booking_email}</label>
                                    </Col>
                                </Row>
                                <Row className="center" style={{ marginBottom: 10 }}>
                                    <Col lg="3" md="3" sm="3" className="right" >
                                        เบอร์โทร :
                                    </Col>
                                    <Col lg="5" md="5" sm="5">
                                        <label>{this.state.booking.booking_tel}</label>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle} style={{ width: 100, height: 40 }}>OK</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default (BookingView);