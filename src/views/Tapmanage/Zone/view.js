import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ZoneModel from '../../../models/ZoneModel';
import ModalInsert from './modal_insert'
import ModalEdit from './modal_edit'
import swal from 'sweetalert';
var zone_model = new ZoneModel;
class ZoneView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refresh: false,
            show_update_model: false,
        };
    }
    onClickZoneUpdate(cell, row, rowIndex) {
        console.log('cell', cell);
        console.log('row', row);
        console.log('rowIndex', rowIndex);
        this.setState({
            show_update_model: true,
            zone_id: row.zone_id,
        })
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
                    zone_id: row.zone_id,
                    // member_code: this.props.member.member_code
                }
                var res = await zone_model.deleteZoneByCode(set_data);
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
        // console.log('row', row);
        // console.log('rowIndex', rowIndex);
    }
    cellButton(cell, row, enumObject, rowIndex) {
        return (
            <>
                <button class="btn btn-warning" onClick={() => this.onClickZoneUpdate(cell, row, rowIndex)}>Edit</button >
                <button class="btn btn-danger" onClick={() => this.onClickDelete(cell, row, rowIndex)}>Delete</button>
            </>
        )
    }
    async componentDidMount() {
        const zone_list = await zone_model.getZoneBy();
        const data_zone_list = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in zone_list.data) {
            var set_row = {
                no: i,
                name: zone_list.data[key].zone_name,
                zone_id: zone_list.data[key].zone_id,
            }
            data_zone_list.rows.push(set_row);
            i++;
        }
        this.setState({
            data: data_zone_list
        });

        // console.log("69+++", data_zone_list);
    }
    render() {
        const { data } = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col lg='12'>
                        <Card>
                            <CardHeader>
                                ZONE
                                <ModalInsert refresh={() => this.componentDidMount()} />
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col lg='12'>
                                        <div>
                                            <BootstrapTable
                                                ref='table'
                                                data={data.rows}
                                                striped hover pagination
                                                search={true}>
                                                <TableHeaderColumn dataField='no' width="20%" headerAlign="center" dataAlign="center" dataSort isKey={true}>No</TableHeaderColumn>
                                                <TableHeaderColumn dataField='name' headerAlign="center" dataAlign="center" dataSort>Name</TableHeaderColumn>
                                                <TableHeaderColumn dataField='edit' width="20%" headerAlign="center" dataAlign="center" dataFormat={this.cellButton.bind(this)}>Edit</TableHeaderColumn>
                                            </BootstrapTable>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    {this.state.show_update_model == true ?
                        <ModalEdit
                            refresh={() => { this.setState({ show_update_model: false, refresh: !this.setState.refresh }); this.componentDidMount(); }}
                            show_update_model={this.state.show_update_model}
                            zone_id={this.state.zone_id}
                        /> : <></>
                    }
                </Row>
            </div>
        )
    }
}
// const mapStatetoProps = (state) => {
//     return {
//         member: state.member,
//     }
// }
// export default connect(mapStatetoProps)(PositionView);
export default (ZoneView);