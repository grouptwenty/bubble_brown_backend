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
const currentYear = new Date().getFullYear();
const fromMonth = new Date(currentYear - 5, 0);
const toMonth = new Date(currentYear, 11);

function YearMonthForm({ date, localeUtils, onChange }) {
    const months = localeUtils.getMonths();
    console.log("currentYear", currentYear + "===");

    const years = [];
    for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
        years.push(i);
    }

    const handleChange = function handleChange(e) {
        const { year, month } = e.target.form;
        onChange(new Date(year.value, month.value));
    };

    return (
        <form className="DayPicker-Caption">
            <select name="month" onChange={handleChange} value={date.getMonth()}>
                {months.map((month, i) => (
                    <option key={month} value={i}>
                        {month}
                    </option>
                ))}
            </select>
            <select name="year" onChange={handleChange} value={date.getFullYear()}>
                {years.map(year => (

                    year == currentYear ?
                        <option key={year} value={year} >
                            {year}
                        </option> :
                        <option key={year} value={year} >
                            {year}
                        </option>
                ))}
            </select>
        </form>
    );
}

class ReportSaleView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            data_day: [],
            seg: 1,
            change_date: today,
            change_month: today,
            change_year: today,
            // month: fromMonth,
            refresh: false
        };
        this.setSeg = this.setSeg.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleYearChange = this.handleYearChange.bind(this);
        // this.handleYearMonthChange = this.handleYearMonthChange.bind(this);
    }

    // handleYearMonthChange(month) {
    //     this.setState({ month });
    // }

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
            }
            data_report_sale_day.rows.push(set_row);
            i++;
        }
        this.setState({
            data_day: data_report_sale_day
        })

    }

    async handleMonthChange(month) {

        this.setState({
            change_month: month
        });

        const report_sale_month = await report_model.getReportSalesByMonth({ "payment_date": month });
        this.setState({
            report_sale_month: report_sale_month.data
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

    async handleYearChange(year) {

        this.setState({
            change_year: year
        });

        const report_sale_year = await report_model.getReportSalesByYear({ "payment_date": year });
        this.setState({
            report_sale_year: report_sale_year.data
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

        var change_date = new Date();
        const report_sale_day = await report_model.getReportSalesByDay({ "payment_date": change_date });

        // console.log("this.state.change_date ", change_date);
        this.setState({
            report_sale_day: report_sale_day.data
        })

        var change_month = new Date();
        const report_sale_month = await report_model.getReportSalesByMonth({ "payment_date": change_month });
        // console.log(report_sale_month);

        this.setState({
            report_sale_month: report_sale_month.data
        })
        // console.log("this.state.report_sale_month ", report_sale_month);

        var change_year = new Date();
        const report_sale_year = await report_model.getReportSalesByYear({ "payment_date": change_year });
        console.log("report_sale_year", report_sale_year);
        this.setState({
            report_sale_year: report_sale_year.data
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
        // console.log(data_report_list);

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
                                                        format="YYYY-MM-DD"
                                                        formatDate={formatDate}
                                                        onDayChange={this.handleDayChange.bind(this)}
                                                        value={this.state.change_date}
                                                    // inputProps = {{readOnly}}
                                                    />
                                                </FormGroup>
                                                <LineChart data={graph_sales_day_number} />
                                                <Row>
                                                    <Col lg='12'>
                                                        <div>
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
                                                <FormGroup>
                                                    <Label className="text_head"> เลือกเดือน<font color='red'><b> * </b></font></Label>
                                                    <DayPickerInput
                                                        format="YYYY-MM-DD"
                                                        formatDate={formatDate}
                                                        onDayChange={this.handleMonthChange.bind(this)}
                                                        value={this.state.change_month}
                                                    // inputProps = {{readOnly}}
                                                    />
                                                </FormGroup>
                                                <ColumnChart data={graph_sales_month_number} />
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
                                                                <TableHeaderColumn dataField='Date' headerAlign="center" dataAlign="center" dataSort>วันที่</TableHeaderColumn>
                                                                <TableHeaderColumn dataField='Time' headerAlign="center" dataAlign="center" dataSort isKey={true}>เวลา</TableHeaderColumn>
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
                                                <FormGroup>
                                                    <Label className="text_head"> เลือกปี<font color='red'><b> * </b></font></Label>
                                                    <DayPickerInput
                                                        format="YYYY-MM-DD"
                                                        formatDate={formatDate}
                                                        onDayChange={this.handleYearChange.bind(this)}
                                                        value={this.state.change_year}
                                                    // inputProps = {{readOnly}}
                                                    />

                                                </FormGroup>
                                                <BarChart data={graph_sales_year_number} />
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