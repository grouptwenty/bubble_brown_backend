
import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';

import CustomerModel from '../../models/CustomerModel'
const customer_model = new CustomerModel

class CustomerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            customer_list: [],
            refresh: false
        };
        this.onDelete = this.onDelete.bind(this);
        this.renderCustomer = this.renderCustomer.bind(this);
    }


    async componentDidMount() {
        var customer_list = await customer_model.getCustomerBy()
        console.log("customer_list", customer_list);

        this.setState({
            customer_list: customer_list.data
        })
        
    }

    async onDelete(code) {
        // console.log("code", code);
        swal({
            text: "คุณต้องการลบข้อมูลลูกค้า ? ",
            icon: "warning",
            buttons: true,
            dengerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const res = customer_model.deleteCustomerByCode(code)
                        .then((req) => {
                            if (req.data == true) {
                                this.componentDidMount();
                                swal("success Deleted! ", {
                                    icon: "success",

                                });
                                // this.componentDidMount()
                            } else {
                                swal("success Deleted! ", {
                                    icon: "error",

                                });
                            }

                        })

                }

            });

    }
 
    renderCustomer(){
        let tbody_customer = []

        for (let i = 0; i < this.state.customer_list.length; i++) {

            tbody_customer.push(
                <tr>
                    <td><h6 className="textcenter3">{i + 1}</h6></td>
                    <td><h6 className="textcenter3">{this.state.customer_list[i].customer_code}</h6></td>
                    <td><h6 className="textcenter3">{this.state.customer_list[i].customer_name}</h6></td>
                    <td><h6 className="textcenter3">{this.state.customer_list[i].customer_id}</h6></td>
                    <td><h6 className="textcenter3">{this.state.customer_list[i].customer_email}</h6></td>
                    <td><h6 className="textcenter3">{this.state.customer_list[i].customer_phone}</h6></td>

                    {<td width={100}>
                        <h6 className="textcenter3">
                            <NavLink exact to={`/customer/update/` + this.state.customer_list[i].customer_code} style={{ width: '100%' }}>
                                <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ color: 'blue', marginRight: 30 }}></i>
                            </NavLink>
                            <Link to={`#`} onClick={this.onDelete.bind(null, this.state.customer_list[i].customer_code)}>
                                <i class="fa fa-times" aria-hidden="true" style={{ color: 'red' }}></i>
                            </Link>
                        </h6>
                    </td>}
                </tr>
            )

        }
        return tbody_customer;
    }

    render() {
    
       

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                จัดการข้อมูลลูกค้า
                                <NavLink exact to={`/customer/insert`} style={{ width: '100%' }}>
                                    <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i>   เพิ่ม</button>
                                </NavLink>
                            </CardHeader>
                            <CardBody>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th>รหัสลูกค้า</th>
                                            <th>ชื่อลูกค้า</th>
                                            <th>ไอดีไลน์</th>
                                            <th>อีเมล</th>
                                            <th>เบอร์โทร</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderCustomer()}
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
export default (CustomerView);