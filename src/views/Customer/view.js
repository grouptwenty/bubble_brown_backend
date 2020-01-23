import React, { Component } from 'react';
import { Media, Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import swal from 'sweetalert';
import GOBALS from '../../GOBALS'
import CustomerModel from '../../models/CustomerModel'
var customer_model = new CustomerModel;
class CustomerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false,
            show_update_model: false,
        };
    }

    onClickDelete(cell, row, rowIndex) {
        console.log('cell', cell);
        swal({
            title: "คุณต้องการลบข้อมูลลูกค้า?",
            text: "เมื่อลบแล้วคุณจะไม่สามารถกู้คืนข้อมูลได้!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                var set_data = {
                    customer_code: row.customerCode,
                }
                console.log('row',row)
                console.log('------------', set_data)
                var res = await customer_model.deleteCustomerByCode(set_data);
                if (res.query_result) {
                    swal("ลบข้อมูลสำเร็จ!", {
                        icon: "success",
                    });
                } else {
                    swal("ลบข้อมูลไม่สำเร็จ!", {
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
                {/* <NavLink exact to={'/customer/detail/' + row.customerCode}>
                    <button class="btn btn-primary">รายละเอียด</button>
                </NavLink> */}
                <NavLink exact to={'/customer/update/' + row.customerCode}>
                    <button class="btn btn-warning">แก้ไข</button>
                </NavLink>
                <button class="btn btn-danger" onClick={() => this.onClickDelete(cell, row, rowIndex)}>ลบ</button>
            </>
        )
    }

    showPicture(cell, row, enumObject, rowIndex) {
        console.log(">>>>>>>>>>>>>>>>>>>>", row.Picture);

        // var url = "http://localhost:3006/" + row.Picture;
        return (
            <>
                <img src={GOBALS.URL_IMG + "customer/" + row.Img} className="img"></img>
            </>
        )
    }

    async componentDidMount() {
        const customer_list = await customer_model.getCustomerBy(this.props.user)
        console.log("customer_list", customer_list);

        const data_customer_list = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in customer_list.data) {
            var set_row = {
                customerCode: customer_list.data[key].customer_code,
                Name: customer_list.data[key].customer_name,
                Id: customer_list.data[key].customer_id,
                Email: customer_list.data[key].customer_email,
                Tel: customer_list.data[key].customer_tel,
                Img: customer_list.data[key].customer_image
            }
            data_customer_list.rows.push(set_row);
            i++;
        }
        this.setState({
            data: data_customer_list
        })
        
    }
 
    render() {
        const { data } = this.state;
        return (
            <div className="animated fadeIn" style={{padding:'15px'}}>
                <Row>
                    <Col lg='12'>
                        <Card>
                            <CardHeader>
                                จัดการข้อมูลลูกค้า
                                <NavLink exact to={'/customer/insert'} style={{ width: '100%' }}>
                                    <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i> เพิ่ม</button>
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
                                            // className="table-overflow"
                                            >
                                                {/* <TableHeaderColumn width={"15%"} dataField='Code' headerAlign="center" dataAlign="center" >Code</TableHeaderColumn> */}
                                                {/* <TableHeaderColumn dataField='Img' headerAlign="center" dataAlign="center" dataSort dataFormat={this.showPicture.bind(this)}>Picture</TableHeaderColumn> */}
                                                <TableHeaderColumn dataField='Img' headerAlign="center" dataAlign="center"dataSort dataFormat={this.showPicture.bind(this)}>รูป</TableHeaderColumn>
                                                <TableHeaderColumn dataField='customerCode' headerAlign="center" dataAlign="center" dataSort isKey={true}>รหัสลูกค้า</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Name' headerAlign="center" dataAlign="center" dataSort>ชื่อ-นามสกุล</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Id' headerAlign="center" dataAlign="center" dataSort>ไอดี</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Email' headerAlign="center" dataAlign="center" dataSort>อีเมล</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Tel' headerAlign="center" dataAlign="center" dataSort>เบอร์โทร</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Action' headerAlign="center" dataAlign="center" dataFormat={this.cellButton.bind(this)}> </TableHeaderColumn>
                                            </BootstrapTable>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
const mapStatetoProps = (state) => {
    return {
        user: state.user,
    }
}
export default connect(mapStatetoProps)(CustomerView);