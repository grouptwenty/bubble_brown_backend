import React, { Component } from 'react';
import { Button, Table, Card, ButtonGroup, CardText, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle, Label, FormGroup, Form, Input } from 'reactstrap';
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
import moment from 'moment'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

var report_model = new ReportModel;
var today = new Date();

class ReportSaleView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            data_day: [],
            seg: 1,
            change_date: today,
            change_start_month: today,
            change_end_month: today,
            change_start_year: today,
            change_end_year: today,
            // month: fromMonth,
            refresh: false
        };
        this.setSeg = this.setSeg.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.handleStartMonthChange = this.handleStartMonthChange.bind(this);
        this.handleEndMonthChange = this.handleEndMonthChange.bind(this);
        this.handleStartYearChange = this.handleStartYearChange.bind(this);
        this.handleEndYearChange = this.handleEndYearChange.bind(this);
    }

    //DAY
    async handleDayChange(date) {

        this.setState({
            change_date: date
        });

        const report_sale_day = await report_model.getReportSalesByDay({ "payment_date": date });
        this.setState({
            report_sale_day: report_sale_day.data
        })

        const data_report_sale_day = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in this.state.report_sale_day) {
            var set_row = {
                Date: this.state.report_sale_day[key].payment_date,
                Time: this.state.report_sale_day[key].payment_time,
                Total: this.state.report_sale_day[key].total_payment,
                Sum: this.state.report_sale_day[key].sum_total
            }
            data_report_sale_day.rows.push(set_row);
            i++;
        }
        this.setState({
            data_day: data_report_sale_day
        })

    }

    //MONTH
    async handleStartMonthChange(start_month) {

        this.setState({
            change_start_month: start_month
        });

        var date = { start_month: start_month, end_month: this.state.change_end_month }
        const report_sale_start_month = await report_model.getReportSalesByMonth(date);

        this.setState({
            report_sale_month: report_sale_start_month.data
        })

        const data_report_sale_month = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in this.state.report_sale_month) {
            var set_row = {
                Date: this.state.report_sale_month[key].month,
                Time: this.state.report_sale_month[key].payment_time,
                Total: this.state.report_sale_month[key].total_payment,
            }
            data_report_sale_month.rows.push(set_row);
            i++;
        }
        this.setState({
            data_month: data_report_sale_month
        })

    }

    async handleEndMonthChange(end_month) {

        this.setState({
            change_end_month: end_month
        });
        var date = { start_month: this.state.change_start_month, end_month: end_month }
        const report_sale_end_month = await report_model.getReportSalesByMonth(date);
        this.setState({
            report_sale_month: report_sale_end_month.data
        })

        const data_report_sale_month = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in this.state.report_sale_month) {
            var set_row = {
                Date: this.state.report_sale_month[key].month,
                Time: this.state.report_sale_month[key].payment_time,
                Total: this.state.report_sale_month[key].total_payment,
            }
            data_report_sale_month.rows.push(set_row);
            i++;
        }
        this.setState({
            data_month: data_report_sale_month
        })
    }

    //YEAR
    async handleStartYearChange(start_year) {

        this.setState({
            change_start_year: start_year
        });

        var date = { start_year: start_year, end_year: this.state.change_end_year }
        const report_sale_start_year = await report_model.getReportSalesByYear(date);
        this.setState({
            report_sale_year: report_sale_start_year.data
        })

        const data_report_sale_year = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in this.state.report_sale_year) {
            var set_row = {
                Date: this.state.report_sale_year[key].year,
                Total: this.state.report_sale_year[key].total_payment,
            }
            data_report_sale_year.rows.push(set_row);
            i++;
        }
        this.setState({
            data_year: data_report_sale_year
        })

    }

    async handleEndYearChange(end_year) {

        this.setState({
            change_end_year: end_year
        });

        var date = { start_month: this.state.change_start_year, end_year: end_year }
        const report_sale_end_year = await report_model.getReportSalesByYear(date);
        this.setState({
            report_sale_year: report_sale_end_year.data
        })

        const data_report_sale_year = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in this.state.report_sale_year) {
            var set_row = {
                Date: this.state.report_sale_year[key].year,
                Total: this.state.report_sale_year[key].total_payment,
            }
            data_report_sale_year.rows.push(set_row);
            i++;
        }
        this.setState({
            data_year: data_report_sale_year
        })

    }

    async componentDidMount() {
        //DAY
        var change_date = new Date();
        const report_sale_day = await report_model.getReportSalesByDay({ "payment_date": change_date });

        // console.log("this.state.change_date ", change_date);
        this.setState({
            report_sale_day: report_sale_day.data
        })

        const data_report_sale_day = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in this.state.report_sale_day) {
            var set_row = {
                Date: this.state.report_sale_day[key].payment_date,
                Time: this.state.report_sale_day[key].payment_time,
                Total: this.state.report_sale_day[key].total_payment,
            }
            data_report_sale_day.rows.push(set_row);
            i++;
        }
        this.setState({
            data_day: data_report_sale_day
        })
        // console.log(data_report_list);


        //MONTH
        var change_start_month = new Date();
        var date = { start_month: this.state.change_start_month, end_month: this.state.change_end_month }
        const report_sale_start_month = await report_model.getReportSalesByMonth(date);

        this.setState({
            report_sale_month: report_sale_start_month.data
        })

        var change_end_month = new Date();
        const report_sale_end_month = await report_model.getReportSalesByMonth(date);

        this.setState({
            report_sale_month: report_sale_end_month.data
        })

        const data_report_sale_month = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in this.state.report_sale_month) {
            var set_row = {
                Date: this.state.report_sale_month[key].month,
                Time: this.state.report_sale_month[key].payment_time,
                Total: this.state.report_sale_month[key].total_payment,
            }
            data_report_sale_month.rows.push(set_row);
            i++;
        }
        this.setState({
            data_month: data_report_sale_month
        })



        //YEAR

        var change_start_year = new Date();
        var date = { start_year: this.state.change_start_year, end_year: this.state.change_end_year }
        const report_sale_start_year = await report_model.getReportSalesByYear(date);

        this.setState({
            report_sale_year: report_sale_start_year.data
        })

        var change_end_year = new Date();
        const report_sale_end_year = await report_model.getReportSalesByYear(date);

        this.setState({
            report_sale_year: report_sale_end_year.data
        })

        const data_report_sale_year = {
            rows: []
        }
        var i = 1;
        // for(var x=0;x<10;x++)
        for (var key in this.state.report_sale_year) {
            var set_row = {
                Date: this.state.report_sale_year[key].year,
                Total: this.state.report_sale_year[key].total_payment,
            }
            data_report_sale_year.rows.push(set_row);
            i++;
        }
        this.setState({
            data_year: data_report_sale_year
        })
    }


    async setSeg(number) {
        // console.log("number", number);
        this.setState({ seg: number })
    }


    render() {
        const { data_day } = this.state
        const { data_month } = this.state
        const { data_year } = this.state

        //DAY
        var graph_sales_day_list = []
        var graph_sales_day_number = {}
        var report_day = {}
        if (this.state.report_sale_day !== undefined) {
            for (var key in this.state.report_sale_day) {
                report_day[this.state.report_sale_day[key].payment_time] = this.state.report_sale_day[key].total_payment
                graph_sales_day_list.push(parseFloat(this.state.report_sale_day[key].total_payment))
                graph_sales_day_number = report_day
                // console.log('graph_sales_day_number', graph_sales_day_number);

            }
        }

        //MONTH
        var graph_sales_month_list = []
        var graph_sales_month_number = {}
        var report_month = {}
        if (this.state.report_sale_month !== undefined) {
            for (var key in this.state.report_sale_month) {
                report_month[this.state.report_sale_month[key].month] = this.state.report_sale_month[key].total_payment
                graph_sales_month_list.push(parseFloat(this.state.report_sale_month[key].total_payment))
                graph_sales_month_number = report_month
            }
        }

        //YEAR
        var graph_sales_year_list = []
        var graph_sales_year_number = {}
        var report_year = {}
        if (this.state.report_sale_year !== undefined) {
            for (var key in this.state.report_sale_year) {
                report_year[this.state.report_sale_year[key].year] = this.state.report_sale_year[key].total_payment
                graph_sales_year_list.push(parseFloat(this.state.report_sale_year[key].total_payment))
                graph_sales_year_number = report_year
            }
        }

        return (

            <div className="animated fadeIn" style={{ margin: '20px' }}>
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col lg="12">
                                        <ButtonGroup size="lg">
                                            <Button
                                                style={{
                                                    backgroundColor: this.state.seg === 1 ? '#81D4FA' : '#fff',
                                                    borderColor: this.state.seg === 1 ? '#80DEEA' : '#E0E0E0',
                                                }}
                                                first
                                                active={this.state.seg === 1 ? true : false}
                                                onClick={() => this.setSeg(1)}

                                            >
                                                วัน </Button>
                                            <Button style={{
                                                backgroundColor: this.state.seg === 2 ? '#81D4FA' : '#fff',
                                                borderColor: this.state.seg === 2 ? '#80DEEA' : '#E0E0E0',
                                            }}
                                                active={this.state.seg === 2 ? true : false}
                                                onClick={() => this.setSeg(2)}
                                            >
                                                เดือน</Button>
                                            <Button style={{
                                                backgroundColor: this.state.seg === 3 ? '#81D4FA' : '#fff',
                                                borderColor: this.state.seg === 3 ? '#80DEEA' : '#E0E0E0',
                                            }}
                                                last
                                                active={this.state.seg === 3 ? true : false}
                                                onClick={() => this.setSeg(3)}
                                            >
                                                ปี</Button>
                                        </ButtonGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="12" style={{ textAlign: 'centers', paddingTop: '10px' }}>

                                        {this.state.seg === 1 &&

                                            <Card body>

                                                <CardTitle><h3>รายงานยอดขายรายวัน</h3></CardTitle>
                                                <FormGroup>
                                                    <Label className="text_head"> เลือกวันที่<font color='red'><b> * </b></font></Label>
                                                    <DayPickerInput
                                                        format="DD/MM/YYYY"
                                                        formatDate={formatDate}
                                                        onDayChange={this.handleDayChange.bind(this)}
                                                        value={this.state.change_date}
                                                    // inputProps = {{readOnly}}
                                                    />
                                                </FormGroup>
                                                <br></br>
                                                <LineChart data={graph_sales_day_number} />
                                                <br></br>
                                                <br></br>
                                                <Row>
                                                    <Col lg='12'>
                                                        <div>
                                                            {/* ยอดขายทั้งหมด :
                                                            <label>{this.state.report_sale_day.sum_total}</label> */}
                                                            <BootstrapTable
                                                                ref='table'
                                                                data={data_day.rows}
                                                                striped hover pagination
                                                                search={true}
                                                            // className="table-overflow"
                                                            >
                                                                {/* <TableHeaderColumn dataField='Img' headerAlign="center" dataAlign="center" dataSort dataFormat={this.showPicture.bind(this)}>รูป</TableHeaderColumn> */}
                                                                <TableHeaderColumn dataField='Date' headerAlign="center" dataAlign="center" dataSort>วันที่</TableHeaderColumn>
                                                                <TableHeaderColumn dataField='Time' headerAlign="center" dataAlign="center" dataSort isKey={true}>เวลา</TableHeaderColumn>
                                                                <TableHeaderColumn dataField='Total' headerAlign="center" dataAlign="center" dataSort>ราคารวม</TableHeaderColumn>
                                                            </BootstrapTable>
                                                        </div>
                                                    </Col>
                                                </Row>

                                            </Card>

                                        }

                                        {this.state.seg === 2 &&

                                            <Card body>
                                                <CardTitle><h3>รายงานยอดขายรายเดือน</h3></CardTitle>
                                                <Row>
                                                    <Col lg='6'>
                                                        <FormGroup>
                                                            <Label className="text_head"> เริ่ม<font color='red'><b> * </b></font></Label>
                                                            <DayPickerInput
                                                                format="DD/MM/YYYY"
                                                                formatDate={formatDate}
                                                                onDayChange={this.handleStartMonthChange.bind(this)}
                                                                value={this.state.change_start_month}
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
                                                                onDayChange={this.handleEndMonthChange.bind(this)}
                                                                value={this.state.change_end_month}
                                                            // inputProps = {{readOnly}}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <br></br>
                                                <ColumnChart data={graph_sales_month_number} />
                                                <br></br>
                                                <br></br>
                                                <Row>
                                                    <Col lg='12'>
                                                        <div>
                                                            <BootstrapTable
                                                                ref='table'
                                                                data={data_month.rows}
                                                                striped hover pagination
                                                                search={true}
                                                            // className="table-overflow"
                                                            >
                                                                {/* <TableHeaderColumn dataField='Img' headerAlign="center" dataAlign="center" dataSort dataFormat={this.showPicture.bind(this)}>รูป</TableHeaderColumn> */}
                                                                <TableHeaderColumn dataField='Date' headerAlign="center" dataAlign="center" dataSort isKey={true}>วันที่</TableHeaderColumn>
                                                                <TableHeaderColumn dataField='Time' headerAlign="center" dataAlign="center" dataSort>เวลา</TableHeaderColumn>
                                                                <TableHeaderColumn dataField='Total' headerAlign="center" dataAlign="center" dataSort>ราคารวม</TableHeaderColumn>
                                                            </BootstrapTable>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        }

                                        {this.state.seg === 3 &&

                                            <Card body>
                                                <CardTitle><h3>รายงานยอดขายรายปี</h3></CardTitle>
                                                <Row>
                                                    <Col lg='6'>
                                                        <FormGroup>
                                                            <Label className="text_head"> เริ่ม<font color='red'><b> * </b></font></Label>
                                                            <DayPickerInput
                                                                format="DD/MM/YYYY"
                                                                formatDate={formatDate}
                                                                onDayChange={this.handleStartYearChange.bind(this)}
                                                                value={this.state.change_start_year}
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
                                                                onDayChange={this.handleEndYearChange.bind(this)}
                                                                value={this.state.change_end_year}
                                                            // inputProps = {{readOnly}}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <br></br>
                                                <BarChart data={graph_sales_year_number} />
                                                <br></br>
                                                <br></br>
                                                <Row>
                                                    <Col lg='12'>
                                                        <div>
                                                            <BootstrapTable
                                                                ref='table'
                                                                data={data_year.rows}
                                                                striped hover pagination
                                                                search={true}
                                                            // className="table-overflow"
                                                            >
                                                                {/* <TableHeaderColumn dataField='Img' headerAlign="center" dataAlign="center" dataSort dataFormat={this.showPicture.bind(this)}>รูป</TableHeaderColumn> */}
                                                                <TableHeaderColumn dataField='Date' headerAlign="center" dataAlign="center" dataSort isKey={true}>เดือน</TableHeaderColumn>
                                                                <TableHeaderColumn dataField='Total' headerAlign="center" dataAlign="center" dataSort>ราคารวม</TableHeaderColumn>
                                                            </BootstrapTable>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        }
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

export default (ReportSaleView);