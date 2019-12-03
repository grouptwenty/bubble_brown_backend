import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle, Label, Input, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import BackToTop from "react-back-to-top-button";
import AdminModel from '../../models/AdminModel';
import WashingMachineModel from '../../models/WashingMachineModel';
import swal from 'sweetalert';
import EntrepreneurModel from '../../models/EntrepreneurModel'
import LaundryModel from '../../models/LaundryModel'

const laundry_model = new LaundryModel
const entrepreneur_model = new EntrepreneurModel
const admin_model = new AdminModel
const washing_wachine_model = new WashingMachineModel

class WashingMachineView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            washing_wachine_list: [],
            refresh: false,
            entrepreneur_list: [],
            str_laundry_list: [],
        };
        this.onDelete = this.onDelete.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }




    async componentDidMount() {
        var key = {
            entrepreneur_code: "",
            laundry_code: "",
            washing_machine_status: ""
        }
        const washing_wachine = await washing_wachine_model.getWashingMachineBy(key)
        const entrepreneur_list = await entrepreneur_model.getEntrepreneurBy()

        this.setState({
            washing_wachine_list: washing_wachine.data,
            entrepreneur_list: entrepreneur_list.data,
        })

        console.log(washing_wachine);
    }

    async handleSearch(event) {

        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        var arr = {};

        for (let name of data.keys()) {
            arr[name] = await form.elements[name.toString()].value;
        }

        var washing_wachine = await washing_wachine_model.getWashingMachineBy(arr)
        console.log(washing_wachine);
        this.setState({
            washing_wachine_list: washing_wachine.data,

        })
    }

    async getLaundryList(entrepreneur_code) {

        const laundry_list = await laundry_model.getLaundryByEntrepreneurCode(entrepreneur_code)
        var data_laundy = laundry_list.data
        var str_laundy = []
        console.log(laundry_list);

        for (var i = 0; i < data_laundy.length; i++) {
            str_laundy.push(
                <option value={data_laundy[i].laundry_code}>{data_laundy[i].laundry_name_th.toString()}</option>
            )
        }
        this.setState({
            str_laundry_list: str_laundy
        })

    }

    cellButton(cell, row, enumObject, rowIndex) {
        console.log(rowIndex, "row", row.washing_machine_code);

        return (
            <>
                {/* onClick={() => this.onClickProductUpdate(cell, row, rowIndex)} */}

                <Button type="button" size="sm" color="link" style={{ color: '#337ab7' }} >
                    <i class="fa fa-file-text-o" aria-hidden="true"></i>
                </Button >

                <NavLink exact to={`/washing-machine/update/` + row.washing_machine_code} >
                    <Button type="button" size="sm" color="link" style={{ color: '#337ab7' }} >
                        <i class='fa fa-pencil-square-o' ></i>
                    </Button >
                </NavLink>

                <Button type="button" size="sm" color="link" style={{ color: 'red' }} onClick={() => this.onDelete(row.washing_machine_code)}>
                    <i class="fa fa-times" aria-hidden="true"></i>
                </Button>

            </>
        )
    }

    cellStatus(cell, row, enumObject, rowIndex) {
        return (
            <>
                <p style={{ color: row.washing_machine_status == "ว่าง" ? "#4cae4c" : "#20a8d8" }}>{row.washing_machine_status}</p>
            </>
        )
    }

    onClickProductUpdate(cell, row, rowIndex) {
        console.log('cell', cell);
        console.log('row', row);
        console.log('rowIndex', rowIndex);

        // this.props.history.push('/washing-machine/update/')

        // this.setState({
        //     show_update_model: true,
        //     affiliation_code: row.affiliation_code,
        //     faculty_code: row.faculty_code,
        //     department_code: row.department_code,
        // })
    }


    async onDelete(code) {

        swal({
            text: "ต้องการที่จะลบข้อมูลผู้ดูเเลระบบหรือไม่ ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    console.log(code);

                    // const res = admin_model.deleteAdminBy(code)
                    //     .then((req) => {

                    //         if (req.data == true) {
                    //             this.componentDidMount();
                    //             swal("success deleted!", {
                    //                 icon: "success",
                    //             });
                    //         } else {
                    //             swal("success deleted!", {
                    //                 icon: "error",
                    //             });
                    //         }
                    //     })
                }
            });

    }

    render() {
        var data_entrepreneur = this.state.entrepreneur_list
        var washing_wachine_list = this.state.washing_wachine_list
        var tbody_admin = []
        var srt_entrepreneur = []

        for (var i = 0; i < washing_wachine_list.length; i++) {

            tbody_admin.push(
                {
                    id: (i + 1),
                    washing_machine_code: washing_wachine_list[i].washing_machine_code,
                    washing_machine_name: washing_wachine_list[i].washing_machine_name,
                    entrepreneur_name_th: washing_wachine_list[i].entrepreneur_name_th,
                    laundry_name_th: washing_wachine_list[i].laundry_name_th,
                    washing_machine_status: washing_wachine_list[i].washing_machine_status,
                    queue_washing_machine: washing_wachine_list[i].queue_washing_machine,

                }
            )
        }

        for (var i = 0; i < data_entrepreneur.length; i++) {
            srt_entrepreneur.push(
                <option value={data_entrepreneur[i].entrepreneur_code} >{data_entrepreneur[i].entrepreneur_name_th.toString()}</option>
            )
        }

        console.log("sssss ", tbody_admin);


        const options = {
            page: 1,  // which page you want to show as default
            sizePerPageList: [{
                text: '20', value: 20
            }, {
                text: '40', value: 40
            }, {
                text: 'All', value: tbody_admin.length
            }], // you can change the dropdown list for size per page
            sizePerPage: 20,  // which size per page you want to locate as default
            prePage: 'Prev', // Previous page button text
            nextPage: 'Next', // Next page button text
            firstPage: 'First', // First page button text
            lastPage: 'Last', // Last page button text
            prePageTitle: 'Go to previous', // Previous page button title
            nextPageTitle: 'Go to next', // Next page button title
            firstPageTitle: 'Go to first', // First page button title
            lastPageTitle: 'Go to Last', // Last page button title
            paginationPosition: 'bottom'  // default is bottom, top and both is all available
        };

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                จัดการข้อมูลเครื่องซักผ้า
                                <NavLink exact to={`/washing-machine/insert`} style={{ width: '100%' }}>
                                    <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i> Add</button>
                                </NavLink>
                            </CardHeader>
                            <CardBody>
                                <Col lg="12" style={{ marginBottom: "30px" }}>
                                    <Form onSubmit={this.handleSearch}>
                                        <Row>
                                            <Col lg="4">
                                                <Label>ผู้ประกอบการ</Label>
                                                <Input
                                                    type="select"
                                                    id="entrepreneur_code"
                                                    name="entrepreneur_code"
                                                    class="form-control"
                                                    onChange={(event) => this.getLaundryList(event.target.value)}
                                                >
                                                    <option value="">ทั้งหมด</option>
                                                    {srt_entrepreneur}
                                                </Input>
                                                <p id="alert_admin_code" class="help-block">Example : Revelsoft.</p>
                                            </Col>
                                            <Col lg="4">
                                                <Label>ร้านซักผ้า</Label>
                                                <Input
                                                    type="select"
                                                    id="laundry_code"
                                                    name="laundry_code"
                                                    class="form-control"
                                                >
                                                    <option value="">ทั้งหมด</option>
                                                    {this.state.str_laundry_list}
                                                </Input>
                                                <p id="alert_admin_code" class="help-block">Example : ซักอบแห้ง.</p>
                                            </Col>
                                            <Col lg="4">
                                                <Label>สถานะ</Label>
                                                <Input
                                                    type="select"
                                                    id="washing_machine_status"
                                                    name="washing_machine_status"
                                                    class="form-control"
                                                >
                                                    <option value="">ทั้งหมด</option>
                                                    <option value="ว่าง">ว่าง</option>
                                                    <option value="กำลังทำงาน">กำลังทำงาน</option>
                                                </Input>
                                                <p id="alert_admin_code" class="help-block">Example : ว่าง.</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="8">
                                            </Col>
                                            <Col lg="4" style={{ textAlign: "right" }}>
                                                <Button type="submit" size="lg" color="primary">ค้นหา</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                                <Col lg="12">
                                    <BootstrapTable
                                        data={tbody_admin}
                                        pagination={true}
                                        options={options}
                                    >
                                        <TableHeaderColumn width="5%" dataField='id' dataAlign='center' isKey={true}>No.</TableHeaderColumn>
                                        <TableHeaderColumn width="10%" dataField='washing_machine_code' headerAlign='center'>รหัสเครื่องซักผ้า </TableHeaderColumn>
                                        <TableHeaderColumn width="15%" dataField='washing_machine_name' headerAlign='center'>ชื่อเครื่องซักผ้า</TableHeaderColumn>
                                        <TableHeaderColumn width="20%" dataField='entrepreneur_name_th' headerAlign='center'>ผู้ประกอบการ</TableHeaderColumn>
                                        <TableHeaderColumn width="20%" dataField='laundry_name_th' headerAlign='center'>ร้านซักผ้า</TableHeaderColumn>
                                        <TableHeaderColumn width="7%" dataField='washing_machine_status' dataAlign='center' dataFormat={this.cellStatus.bind(this)}>สถานะ</TableHeaderColumn>
                                        <TableHeaderColumn width="5%" dataField='queue_washing_machine' dataAlign='center'>คิว</TableHeaderColumn>
                                        <TableHeaderColumn width="10%" dataField='price' dataAlign='center' dataFormat={this.cellButton.bind(this)}></TableHeaderColumn>
                                    </BootstrapTable>
                                </Col>
                            </CardBody>
                        </Card>
                    </Col>
                    <BackToTop
                        // showOnScrollUp
                        showAt={150}
                        speed={1500}
                        easing="easeInOutQuint"
                    >
                        <Button type="button" size="sm" style={{ color: '#20a8d8', backgroundColor: "#20a8d8" }} >
                            <i class="fa fa-chevron-up" aria-hidden="true" style={{ color: '#fff', fontSize: "30px" }}></i>
                        </Button>
                    </BackToTop>
                </Row>
            </div >
        )
    }
}
export default (WashingMachineView);