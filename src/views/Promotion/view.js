import React, { Component } from 'react';
import { Media, Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import PromotionModel from '../../models/PromotionModel';
import swal from 'sweetalert';
import GOBALS from '../../GOBALS'
import ImgDefault from '../../assets/img/img_default.png'
var promotion_model = new PromotionModel;
class PromotionView extends Component {
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
            title: "คุณต้องการลบข้อมูลโปรโมชั่น?",
            text: "เมื่อลบแล้วคุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                var set_data = {
                    promotion_code: row.promotion_code,
                }
                console.log('------------', set_data)
                var res = await promotion_model.deletePromotion(set_data);
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
                <NavLink exact to={'../promotion/detail/' + row.promotion_code}>
                    <button class="btn btn-primary">รายละเอียด</button>
                </NavLink>
                <NavLink exact to={'../promotion/edit/' + row.promotion_code}>
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

                <img src={ row.Picture != "" && row.Picture != null ? GOBALS.URL_IMG + "promotion/" + row.Picture : ImgDefault} className="img"></img>
            </>
        )
    }
    async componentDidMount() {
        const promotion_list = await promotion_model.getPromotionBy();
        const data_promotion_list = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in promotion_list.data) {
            var set_row = {
                promotion_code: promotion_list.data[key].promotion_code,
                Type: promotion_list.data[key].menu_type_name,
                Header: promotion_list.data[key].promotion_header,
                Detail: promotion_list.data[key].promotion_detail,
                Picture: promotion_list.data[key].promotion_image,
                Start: promotion_list.data[key].startdate,
                End: promotion_list.data[key].enddate,

            }
            data_promotion_list.rows.push(set_row);
            i++;
        }
        this.setState({
            data: data_promotion_list
        });

    }
    render() {

        
        const { data } = this.state;
        return (
            <div className="animated fadeIn">
                {/* <h2>Promotion</h2>
                <hr /> */}
                <Row>
                    <Col lg='12'>
                        <Card>
                            <CardHeader>
                                โปรโมชั่น
                                <NavLink exact to={'../Promotion/insert'} style={{ width: '100%' }}>
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
                                                <TableHeaderColumn dataField='Picture' headerAlign="center" dataAlign="center" dataSort dataFormat={this.showPicture.bind(this)}>รูป</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Header' headerAlign="center" dataAlign="center" dataSort isKey={true}>โปรโมชั่น</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Detail' headerAlign="center" dataAlign="center" dataSort>รายละเอียด</TableHeaderColumn>
                                                <TableHeaderColumn width={"10%"} dataField='Type' headerAlign="center" dataAlign="center" dataSort>ประเภท</TableHeaderColumn>
                                                <TableHeaderColumn width={"10%"} dataField='Start' headerAlign="center" dataAlign="center" dataSort>วันที่เริ่ม</TableHeaderColumn>
                                                <TableHeaderColumn width={"10%"} dataField='End' headerAlign="center" dataAlign="center" dataSort>หมดเขต</TableHeaderColumn>
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

export default (PromotionView);