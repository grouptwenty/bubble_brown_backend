import React, { Component } from 'react';
import { Media, Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import AboutModel from '../../models/AboutModel';
import swal from 'sweetalert';
import GOBALS from '../../GOBALS'
import ImgDefault from '../../assets/img/img_default.png'
var about_model = new AboutModel;
class AboutView extends Component {
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
            title: "คุณต้องการลบข้อมูลสาขานี้?",
            text: "เมื่อลบแล้วคุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                var set_data = {
                    about_code: row.about_code,
                }
                console.log('------------', set_data)
                var res = await about_model.deleteAbout(set_data);
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
                <NavLink exact to={'../about/detail/' + row.about_code}>
                    <button class="btn btn-primary">รายละเอียด</button>
                </NavLink>
                <NavLink exact to={'../about/update/' + row.about_code}>
                    <button class="btn btn-warning">แก้ไข</button>
                </NavLink>
                <button class="btn btn-danger" onClick={() => this.onClickDelete(cell, row, rowIndex)}>ยกเลิก</button>
            </>
        )
    }
    showPicture(cell, row, enumObject, rowIndex) {
        console.log(">>>>>>>>>>>>>>>>>>>>", row.Picture);

        // var url = "http://localhost:3006/" + row.Picture;
        return (
            <>

                <img src={row.Picture != "" && row.Picture != null ? GOBALS.URL_IMG + "about/" + row.Picture : ImgDefault} className="img"></img>
            </>
        )
    }
    async componentDidMount() {
        const about_list = await about_model.getAboutBy();
        const data_about_list = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in about_list.data) {
            var set_row = {
                about_code: about_list.data[key].about_code,
                Picture: about_list.data[key].about_img,
                about_name: about_list.data[key].about_name_th,
                about_tel: about_list.data[key].about_tel,

            }
            data_about_list.rows.push(set_row);
            i++;
        }
        this.setState({
            data: data_about_list
        });

    }
    render() {


        const { data } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col lg='12'>
                        <Card>
                            <CardHeader>
                                โปรโมชั่น
                                <NavLink exact to={'../About/editbranch'} style={{ width: '100%' }}>
                                    <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i> ตั้งต่าสาชาหลัก</button>
                                </NavLink>
                                <NavLink exact to={'../About/insert'} style={{ width: '100%' }}>
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
                                                <TableHeaderColumn dataField='about_code' headerAlign="center" dataAlign="center" dataSort isKey={true}>โปรโมชั่น</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Picture' headerAlign="center" dataAlign="center" dataSort dataFormat={this.showPicture.bind(this)}>รูป</TableHeaderColumn>
                                                <TableHeaderColumn dataField='about_name' headerAlign="center" dataAlign="center" dataSort>ชื่อร้าน</TableHeaderColumn>
                                                <TableHeaderColumn dataField='about_tel' headerAlign="center" dataAlign="center" dataSort>เบอร์โทร</TableHeaderColumn>
                                                <TableHeaderColumn width={"20%"} dataField='Action' headerAlign="center" dataAlign="left" dataFormat={this.cellButton.bind(this)}> </TableHeaderColumn>
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

export default (AboutView);