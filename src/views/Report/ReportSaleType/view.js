import React, { Component } from 'react';
import { Button, Table, Card, ButtonGroup, CardText, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle, Label, FormGroup, Form, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import Select from 'react-select';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';
import ReactChartkick, { LineChart, PieChart, ColumnChart, BarChart } from 'react-chartkick'
import Chart from 'chart.js'
import GOBALS from '../../../GOBALS'
import ReportModel from '../../../models/ReportModel';
import { formatDate, parseDate, } from 'react-day-picker/moment';
// import DayPicker from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import moment, { months } from 'moment'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import MenuModel from '../../../models/MenuModel'
import MenuTypeModel from '../../../models/MenuTypeModel'

const menutype_model = new MenuTypeModel
const menu_model = new MenuModel

var report_model = new ReportModel;
var today = new Date();

class ReportSaleView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            data_date: [],
            seg: 1,
            change_start_date: today,
            change_end_date: today,
            // month: fromMonth,
            refresh: false
        };
        // this.renderMenuType = this.renderMenuType.bind(this);
        // this.getTableReportSalesByType = this.getTableReportSalesByType.bind(this);
        this.setSeg = this.setSeg.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
    }

    //DATE
    async handleStartDateChange(start_date) {
        // console.log("this.state.report_sale_type :", this.state.report_sale_type);

        this.setState({
            change_start_date: start_date
        });
        var arr = {}
        arr['start_date'] = start_date
        arr['end_date'] = this.state.change_end_date
        // arr['menu_type_id'] = '1'

        const report_sale_type_start_date = await report_model.getReportSalesByType(arr);

        this.setState({
            report_sale_type: report_sale_type_start_date.data
        })
    }

    async handleEndDateChange(end_date) {

        this.setState({
            change_end_date: end_date
        });
        // var date = { start_date: this.state.change_start_date, end_date: end_date }
        var arr = {}
        arr['start_date'] = this.state.change_start_date
        arr['end_date'] = end_date
        // arr['menu_type_id'] = '1'
        const report_sale_type_end_date = await report_model.getReportSalesByType(arr);
        this.setState({
            report_sale_type: report_sale_type_end_date.data
        })
    }

    async componentDidMount() {

        //DATE
        var change_start_date = new Date();
        var date = { start_date: this.state.change_start_date, end_date: this.state.change_end_date }
        const report_sale_type_start_date = await report_model.getReportSalesByType(date);

        this.setState({
            report_sale_type: report_sale_type_start_date.data
        })


        var change_end_date = new Date();
        const report_sale_type_end_date = await report_model.getReportSalesByType(date);

        this.setState({
            report_sale_type: report_sale_type_end_date.data
        })

        //MENU
        var menutype_list = await menutype_model.getMenuTypeBy(this.props.user)
        console.log("menutype_list", menutype_list);


        this.setState({
            menutype_list: menutype_list.data
        })

        const sale_type_list = await report_model.getReportSalesByType(this.props.user)

        const data_sale_type_list = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in sale_type_list.data) {
            var set_row = {
                Type: sale_type_list.data[key].menu_type_name,
                Name: sale_type_list.data[key].order_list_name,
                Perunit: sale_type_list.data[key].perunit,
                Qty: sale_type_list.data[key].qty,
                Total: sale_type_list.data[key].perunit * sale_type_list.data[key].qty,

            }
            data_sale_type_list.rows.push(set_row);
            i++;
        }
        this.setState({
            data: data_sale_type_list
        });
    }

    // async getTableReportSalesByType(code) {

    //     console.log("code", code);

    //     const sale_type_list = await report_model.getReportSalesByType(code)
    //     console.log("sale_type_list", sale_type_list);

    //     const data_sale_type_list = {
    //         rows: []
    //     }
    //     var i = 1;
    //     // for(var x=0;x<10;x++)
    //     for (var key in sale_type_list.data) {
    //         var set_row = {
    //             Type: sale_type_list.data[key].menu_type_name,
    //             Name: sale_type_list.data[key].order_list_name,
    //             Perunit: sale_type_list.data[key].perunit,
    //             Qty: sale_type_list.data[key].qty,
    //             Total: Number(sale_type_list.data[key].perunit * sale_type_list.data[key].qty).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),

    //         }
    //         data_sale_type_list.rows.push(set_row);
    //         i++;
    //     }
    //     this.setState({
    //         data: data_sale_type_list
    //     });
    // }

    // renderMenuType() {
    //     if (this.state.menutype_list != undefined) {
    //         var menu_type_list = []

    //         for (var key in this.state.menutype_list) {
    //             menu_type_list.push(
    //                 // <option value={this.state.product_type[key].product_type_id} >{this.state.product_type[key].product_type_name}</option>
    //                 <Button outline color="primary" onClick={
    //                     this.renderTableSaleType.bind(this, this.state.menutype_list[key].menu_type_id)}>{this.state.menutype_list[key].menu_type_name}</Button>
    //             )
    //         }
    //         return menu_type_list;
    //     }
    // }

    // DATA TABLE
    renderTableSaleType() {
        var table_sale_type = []

        // for(var x=0;x<10;x++)
        for (var key in this.state.report_sale_type) {
            table_sale_type.push(
                <tbody>
                    <tr>
                        <td>{this.state.report_sale_type[key].menu_type_name}</td>
                        <td>{this.state.report_sale_type[key].order_list_name}</td>
                        <td>{this.state.report_sale_type[key].perunit}</td>
                        <td>{this.state.report_sale_type[key].qty}</td>
                        <td>{Number(this.state.report_sale_type[key].perunit * this.state.report_sale_type[key].qty).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                    </tr>

                </tbody>
            )
        }
        return table_sale_type
    }


    async setSeg(number) {
        // console.log("number", number);
        this.setState({ seg: number })
    }


    render() {
        const { data_date } = this.state
        const { data } = this.state

        var graph_sales_type_list = []
        var graph_sales_type_number = {}
        var report_sales_type = {}
        if (this.state.report_sale_type !== undefined) {
            for (var key in this.state.report_sale_type) {
                report_sales_type[this.state.report_sale_type[key].menu_type_name] = this.state.report_sale_type[key].qty
                graph_sales_type_list.push(parseFloat(this.state.report_sale_type[key].qty))
                graph_sales_type_number = report_sales_type

            }
        }

        return (

            <div className="animated fadeIn" style={{ margin: '20px' }}>
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col lg="12" style={{ textAlign: 'centers', paddingTop: '10px' }}>
                                        <Card body>
                                            <CardTitle><h3>รายงานยอดขายตามประเภท</h3></CardTitle>
                                            <Row>
                                                <Col lg='6'>
                                                    <FormGroup>
                                                        <Label className="text_head"> เริ่ม<font color='red'><b> * </b></font></Label>
                                                        <DayPickerInput
                                                            format="DD/MM/YYYY"
                                                            formatDate={formatDate}
                                                            onDayChange={this.handleStartDateChange.bind(this)}
                                                            value={this.state.change_start_date}
                                                        // inputProps = {{readOnly}}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg='6'>
                                                    <FormGroup>
                                                        <Label className="text_head"> สิ้นสุด<font color='red'><b> * </b></font></Label>
                                                        <DayPickerInput
                                                            format="DD/MM/YYYY"
                                                            formatDate={formatDate}
                                                            onDayChange={this.handleEndDateChange.bind(this)}
                                                            value={this.state.change_end_date}
                                                        // inputProps = {{readOnly}}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <br></br>
                                            <PieChart data={graph_sales_type_number} />
                                            <br></br>
                                            {/* <br></br>
                                            <Row style={{ textAlign: 'end', paddingBottom: '20px' }}>
                                                <Col lg="12">
                                                    <ButtonGroup >
                                                        {this.renderMenuType()}
                                                    </ButtonGroup>
                                                </Col>
                                            </Row>
                                            <br></br> */}
                                            <Row>
                                                <Col lg='12'>
                                                    <div>
                                                        <br></br>
                                                        <Row>
                                                            <Col>
                                                                <Table striped>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>ประเภท</th>
                                                                            <th>เมนู</th>
                                                                            <th>ราคาต่อหน่วย</th>
                                                                            <th>จำนวน</th>
                                                                            <th>ราคารวม</th>
                                                                        </tr>
                                                                    </thead>
                                                                    {this.renderTableSaleType()}
                                                                </Table>
                                                            </Col>
                                                        </Row>

                                                        {/* <BootstrapTable
                                                            ref='table'
                                                            data={data.rows}
                                                            striped hover pagination
                                                            search={true}
                                                        // className="table-overflow"
                                                        >
                                                            <TableHeaderColumn dataField='Type' headerAlign="center" dataAlign="center" dataSort isKey={true}>ประเภท</TableHeaderColumn>
                                                            <TableHeaderColumn dataField='Name' headerAlign="center" dataAlign="center" dataSort>เมนู</TableHeaderColumn>
                                                            <TableHeaderColumn dataField='Perunit' headerAlign="center" dataAlign="center" dataSort>ราคาต่อหน่วย</TableHeaderColumn>
                                                            <TableHeaderColumn dataField='Qty' headerAlign="center" dataAlign="center" dataSort>จำนวน</TableHeaderColumn>
                                                            <TableHeaderColumn dataField='Total' headerAlign="center" dataAlign="center" dataSort>ราคารวม</TableHeaderColumn>
                                                        </BootstrapTable> */}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row >
            </div >

        )
    }
}
const mapStatetoProps = (state) => {
    return {
        user: state.user,
    }
}
export default connect(mapStatetoProps)(ReportSaleView);
