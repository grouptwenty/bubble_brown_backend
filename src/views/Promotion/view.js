import React, { Component } from 'react';
import { Media, Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import PromotionModel from '../../models/PromotionModel';
import swal from 'sweetalert';
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
    // onClickUpdate(cell, row, rowIndex) {
    //     console.log('cell', cell);
    //     console.log('row', row);
    //     console.log('rowIndex', rowIndex);
    //     this.setState({
    //         promotion_code: row.promotion_code,
    //     })
    //     // this.props.history.push('/admin/coverpage/');
    // }
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
                    promotion_code: row.promotion_code,
                }
                console.log('------------', set_data)
                var res = await promotion_model.deletePromotion(set_data);
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
                <NavLink exact to={'Promotion/edit/' + row.promotion_code}>
                    <button class="btn btn-warning">Edit</button>
                </NavLink>
                <button class="btn btn-danger" onClick={() => this.onClickDelete(cell, row, rowIndex)}>Delete</button>
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
        const promotion_list = await promotion_model.getPromotionBy();
        const data_promotion_list = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in promotion_list.data) {
            var set_row = {
                pCode: promotion_list.data[key].promotion_code,
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
                <h2>Promotion</h2>
                <hr />
                <Row>
                    <Col lg='12'>
                        <Card>
                            <CardHeader>
                                Promotion
                                <NavLink exact to={'../Promotion/insert'} style={{ width: '100%' }}>
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
                                                // className="table-overflow"

                                            >
                                                {/* <TableHeaderColumn width={"15%"} dataField='Code' headerAlign="center" dataAlign="center" >Code</TableHeaderColumn> */}
                                                {/* <TableHeaderColumn dataField='Picture' headerAlign="center" dataAlign="center"dataSort dataFormat={this.showPicture.bind(this)}>Picture</TableHeaderColumn> */}
                                                <TableHeaderColumn dataField='Header' headerAlign="center" dataAlign="center" dataSort isKey={true}>Header</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Detail' headerAlign="center" dataAlign="center" dataSort>Detail</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Type' headerAlign="center" dataAlign="center" dataSort>Type</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Start' headerAlign="center" dataAlign="center" dataSort>Startdate</TableHeaderColumn>
                                                <TableHeaderColumn dataField='End' headerAlign="center" dataAlign="center" dataSort>Enddate</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Action' headerAlign="center" dataAlign="center" dataFormat={this.cellButton.bind(this)}>Action</TableHeaderColumn>
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