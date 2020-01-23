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
        this.renderSaleDay = this.renderSaleDay.bind(this);
        this.renderCostDay = this.renderCostDay.bind(this);
        this.renderProfitDay = this.renderProfitDay.bind(this);
        this.renderSaleMonth = this.renderSaleMonth.bind(this);
        this.renderCostMonth = this.renderCostMonth.bind(this);
        this.renderProfitMonth = this.renderProfitMonth.bind(this);
        this.renderSaleYear = this.renderSaleYear.bind(this);
        this.renderCostYear = this.renderCostYear.bind(this);
        this.renderProfitYear = this.renderProfitYear.bind(this);
        this.renderTableSaleDay = this.renderTableSaleDay.bind(this);
        this.renderTableSaleMonth = this.renderTableSaleMonth.bind(this);
        this.renderTableSaleYear = this.renderTableSaleYear.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    //DAY
    async handleDayChange(date) {

        this.setState({
            change_date: date
        });
        var arr = {}
        arr['payment_date'] = date
        arr['about_code'] = this.props.user.about_code

        const report_sale_day = await report_model.getReportSalesByDay(arr);
        for (var key in report_sale_day.data) {

            var arr = {}
            arr['payment_date'] = date
            arr['payment_time'] = report_sale_day.data[key].payment_time
            arr['about_code'] = this.props.user.about_code

            var cost_sale_day = await report_model.getCostSalesByDay(arr)
            report_sale_day.data[key]['cost_sale_day'] = cost_sale_day.data.cost
        }
        this.setState({
            report_sale_day: report_sale_day.data
        })

    }

    //MONTH
    async handleStartMonthChange(start_month) {

        this.setState({
            change_start_month: start_month
        });

        // var date = { start_month: start_month, end_month: this.state.change_end_month }

        var arr = {}
        arr['start_month'] = start_month
        arr['end_month'] = this.state.change_end_month
        arr['about_code'] = this.props.user.about_code

        const report_sale_start_month = await report_model.getReportSalesByMonth(arr);

        for (var key in report_sale_start_month.data) {

            var arr = {}
            arr['payment_date'] = report_sale_start_month.data[key].month
            arr['payment_time'] = report_sale_start_month.data[key].payment_time
            arr['about_code'] = this.props.user.about_code

            var cost_sale_start_month = await report_model.getCostSalesByMonth(arr)

            report_sale_start_month.data[key]['cost_sale_month'] = cost_sale_start_month.data.cost
        }

        this.setState({
            report_sale_month: report_sale_start_month.data
        })

    }



    async handleEndMonthChange(end_month) {

        this.setState({
            change_end_month: end_month
        });
        // var date = { start_month: this.state.change_start_month, end_month: end_month }
        var arr = {}
        arr['start_month'] = this.state.change_start_month
        arr['end_month'] = end_month
        arr['about_code'] = this.props.user.about_code

        const report_sale_end_month = await report_model.getReportSalesByMonth(arr);

        for (var key in report_sale_end_month.data) {

            var arr = {}
            arr['payment_date'] = report_sale_end_month.data[key].month
            arr['payment_time'] = report_sale_end_month.data[key].payment_time
            arr['about_code'] = this.props.user.about_code

            var cost_sale_end_month = await report_model.getCostSalesByMonth(arr)

            report_sale_end_month.data[key]['cost_sale_month'] = cost_sale_end_month.data.cost
        }

        this.setState({
            report_sale_month: report_sale_end_month.data
        })
    }

    //YEAR
    async handleStartYearChange(start_year) {

        this.setState({
            change_start_year: start_year
        });

        // var date = { start_year: start_year, end_year: this.state.change_end_year }
        var arr = {}
        arr['start_year'] = start_year
        arr['end_year'] = this.state.change_end_year
        arr['about_code'] = this.props.user.about_code

        const report_sale_start_year = await report_model.getReportSalesByYear(arr);

        for (var key in report_sale_start_year.data) {
            var arr = {}
            arr['payment_date'] = report_sale_start_year.data[key].month
            arr['about_code'] = this.props.user.about_code

            var cost_sale_start_year = await report_model.getCostSalesByYear(arr)
            report_sale_start_year.data[key]['cost_sale_year'] = cost_sale_start_year.data.cost
        }
        this.setState({
            report_sale_year: report_sale_start_year.data
        })
    }

    async handleEndYearChange(end_year) {

        this.setState({
            change_end_year: end_year
        });

        // var date = { start_year: this.state.change_start_year, end_year: end_year }
        var arr = {}
        arr['start_year'] = this.state.change_start_year
        arr['end_year'] = end_year
        arr['about_code'] = this.props.user.about_code

        const report_sale_end_year = await report_model.getReportSalesByYear(arr);
        for (var key in report_sale_end_year.data) {

            var arr = {}
            arr['payment_date'] = report_sale_end_year.data[key].month
            arr['about_code'] = this.props.user.about_code

            var cost_sale_end_year = await report_model.getCostSalesByYear(arr)
            report_sale_end_year.data[key]['cost_sale_year'] = cost_sale_end_year.data.cost
        }
        this.setState({
            report_sale_year: report_sale_end_year.data
        })


    }

    async componentDidMount() {
        //DAY
        console.log("this.props.user :", this.props.user);

        var change_date = new Date();

        var arr = {}
        arr['payment_date'] = date
        arr['about_code'] = this.props.user.about_code

        const report_sale_day = await report_model.getReportSalesByDay(arr);
        for (var key in report_sale_day.data) {

            var arr = {}
            arr['payment_date'] = date
            arr['payment_time'] = report_sale_day.data[key].payment_time
            arr['about_code'] = this.props.user.about_code

            var cost_sale_day = await report_model.getCostSalesByDay(arr)
            report_sale_day.data[key]['cost_sale_day'] = cost_sale_day.data.cost
        }
        this.setState({
            report_sale_day: report_sale_day.data
        })


        //MONTH
        var change_start_month = new Date();
        var date = { start_month: this.state.change_start_month, end_month: this.state.change_end_month }

        var arr = {}
        arr['start_month'] = this.state.change_start_month
        arr['end_month'] = this.state.change_end_month
        arr['about_code'] = this.props.user.about_code

        const report_sale_start_month = await report_model.getReportSalesByMonth(arr);
        // console.log("report_sale_start_month", report_sale_start_month);

        for (var key in report_sale_start_month.data) {

            var arr = {}
            arr['payment_date'] = report_sale_start_month.data[key].month
            arr['payment_time'] = report_sale_start_month.data[key].payment_time
            arr['about_code'] = this.props.user.about_code

            var cost_sale_start_month = await report_model.getCostSalesByMonth(arr)

            report_sale_start_month.data[key]['cost_sale_month'] = cost_sale_start_month.data.cost
            // console.log("cost_sale_start_month", cost_sale_start_month);

        }
        this.setState({
            report_sale_month: report_sale_start_month.data
        })

        var change_end_month = new Date();
        const report_sale_end_month = await report_model.getReportSalesByMonth(arr);
        for (var key in report_sale_end_month.data) {
            var arr = {}
            arr['payment_date'] = report_sale_end_month.data[key].month
            arr['payment_time'] = report_sale_end_month.data[key].payment_time
            arr['about_code'] = this.props.user.about_code

            var cost_sale_end_month = await report_model.getCostSalesByMonth(arr)

            report_sale_end_month.data[key]['cost_sale_month'] = cost_sale_end_month.data.cost
        }
        this.setState({
            report_sale_month: report_sale_end_month.data
        })


        //YEAR

        var change_start_year = new Date();
        // var date = { start_year: this.state.change_start_year, end_year: this.state.change_end_year }

        var arr = {}
        arr['start_year'] = this.state.change_start_year
        arr['end_year'] = this.state.change_end_year
        arr['about_code'] = this.props.user.about_code

        const report_sale_start_year = await report_model.getReportSalesByYear(arr);
        // console.log("report_sale_start_year", report_sale_start_year);

        for (var key in report_sale_start_year.data) {

            var arr = {}
            arr['payment_date'] = report_sale_start_year.data[key].month
            arr['about_code'] = this.props.user.about_code

            var cost_sale_start_year = await report_model.getCostSalesByYear(arr)
            // console.log("cost_sale_start_year", cost_sale_start_year);

            report_sale_start_year.data[key]['cost_sale_year'] = cost_sale_start_year.data.cost
        }
        this.setState({
            report_sale_year: report_sale_start_year.data
        })

        var change_end_year = new Date();

        var arr = {}
        arr['start_year'] = this.state.change_start_year
        arr['end_year'] = this.state.change_end_year
        arr['about_code'] = this.props.user.about_code

        const report_sale_end_year = await report_model.getReportSalesByYear(arr);
        for (var key in report_sale_end_year.data) {

            var arr = {}
            arr['payment_date'] = report_sale_end_year.data[key].month
            arr['about_code'] = this.props.user.about_code

            var cost_sale_end_year = await report_model.getCostSalesByYear(arr)

            report_sale_end_year.data[key]['cost_sale_year'] = cost_sale_end_year.data.cost
        }
        this.setState({
            report_sale_year: report_sale_end_year.data
        })

    }



    //MODAL - DAY
    async onClickTableSaleDay(payment) {

        console.log("payment", payment);

        var arr = {}
        arr['payment_date'] = payment.payment_date
        arr['payment_time'] = payment.payment_time
        arr['about_code'] = this.props.user.about_code

        var sub_table_sale_day = await report_model.getTableReportSalesByDay(arr)

        for (var key in sub_table_sale_day.data) {
            var arr = {}
            arr['payment_date'] = payment.payment_date
            arr['payment_time'] = payment.payment_time
            arr['menu_code'] = sub_table_sale_day.data[key].menu_code
            arr['about_code'] = this.props.user.about_code

            var cost_table_sale_day = await report_model.getTableCostSalesByDay(arr)
            sub_table_sale_day.data[key]['cost_table_sale_day'] = cost_table_sale_day.data.cost
        }
        console.log("sub_table_sale_day", sub_table_sale_day);

        this.setState({
            sub_table_sale_day: sub_table_sale_day.data
        })
        this.toggle()
    }

    saleDayDetail() {
        var detail_sale_day = []

        // for(var x=0;x<10;x++)
        for (var key in this.state.sub_table_sale_day) {
            detail_sale_day.push(
                <tbody>
                    <tr>
                        <td>{this.state.sub_table_sale_day[key].payment_time}</td>
                        <td>{this.state.sub_table_sale_day[key].order_list_name}</td>
                        <td>{Number(this.state.sub_table_sale_day[key].perunit).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                        <td>{this.state.sub_table_sale_day[key].qty}</td>
                        <td>{Number(this.state.sub_table_sale_day[key].total_payment).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                        <td>{Number(this.state.sub_table_sale_day[key].cost_table_sale_day).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                        <td>{Number(this.state.sub_table_sale_day[key].total_payment - this.state.sub_table_sale_day[key].cost_table_sale_day).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                    </tr>
                </tbody>
            )
        }
        return detail_sale_day

    }

    //MODAL - Month
    async onClickTableSaleMonth(month) {
        console.log("month", month);
        var arr = {}
        arr['payment_date'] = month.month
        arr['about_code'] = this.props.user.about_code

        var sub_table_sale_month = await report_model.getTableReportSalesByMonth(arr)
        console.log("sub_table_sale_month", sub_table_sale_month);

        for (var key in sub_table_sale_month.data) {

            var arr = {}
            arr['payment_date'] = month.date
            arr['menu_code'] = sub_table_sale_month.data[key].menu_code
            arr['about_code'] = this.props.user.about_code

            var cost_table_sale_month = await report_model.getTableCostSalesByMonth(arr)

            sub_table_sale_month.data[key]['cost_table_sale_month'] = cost_table_sale_month.data.cost
        }
        this.setState({
            sub_table_sale_month: sub_table_sale_month.data
        })
        this.toggle()
    }

    saleMonthDetail() {
        var detail_sale_month = []

        // for(var x=0;x<10;x++)
        for (var key in this.state.sub_table_sale_month) {
            detail_sale_month.push(
                <tbody>
                    <tr>
                        {/* <td>{this.state.sub_table_sale_month[key].payment_time}</td> */}
                        <td>{this.state.sub_table_sale_month[key].order_list_name}</td>
                        <td>{this.state.sub_table_sale_month[key].qty}</td>
                        <td>{Number(this.state.sub_table_sale_month[key].total_payment).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                        <td>{Number(this.state.sub_table_sale_month[key].cost_table_sale_month).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                        <td>{Number(this.state.sub_table_sale_month[key].total_payment - this.state.sub_table_sale_month[key].cost_table_sale_month).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                    </tr>
                </tbody>
            )
        }
        return detail_sale_month

    }

    //MODAL - YEAR
    async onClickTableSaleYear(month) {
        // console.log("month", month);
        var arr = {}
        arr['payment_date'] = month.month
        arr['about_code'] = this.props.user.about_code

        var sub_table_sale_year = await report_model.getTableReportSalesByYear(arr)


        for (var key in sub_table_sale_year.data) {

            var arr = {}
            arr['payment_date'] = sub_table_sale_year.data[key].month
            arr['about_code'] = this.props.user.about_code

            var cost_table_sale_year = await report_model.getTableCostSalesByYear(arr)

            sub_table_sale_year.data[key]['cost_table_sale_year'] = cost_table_sale_year.data.cost
        }
        // console.log("sub_table_sale_year", sub_table_sale_year);
        this.setState({
            sub_table_sale_year: sub_table_sale_year.data
        })
        this.toggle()
    }

    saleYearDetail() {
        var detail_sale_year = []

        // for(var x=0;x<10;x++)
        for (var key in this.state.sub_table_sale_year) {
            detail_sale_year.push(
                <tbody>
                    <tr>
                        <td>{this.state.sub_table_sale_year[key].month}</td>
                        <td>{Number(this.state.sub_table_sale_year[key].total_payment).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                        <td>{Number(this.state.sub_table_sale_year[key].cost_table_sale_year).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                        <td>{Number(this.state.sub_table_sale_year[key].total_payment - this.state.sub_table_sale_year[key].cost_table_sale_year).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                    </tr>
                </tbody>
            )
        }
        return detail_sale_year

    }

    //DATA TABLE
    renderTableSaleDay() {
        var table_sale_day = []

        // for(var x=0;x<10;x++)
        for (var key in this.state.report_sale_day) {
            table_sale_day.push(
                <tbody>
                    <tr>
                        <td>{this.state.report_sale_day[key].payment_date}</td>
                        <td><a onClick={this.onClickTableSaleDay.bind(this, this.state.report_sale_day[key])} style={{ color: 'red' }}>{this.state.report_sale_day[key].payment_time}</a></td>
                        <td>{Number(this.state.report_sale_day[key].total_payment).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                        <td>{Number(this.state.report_sale_day[key].cost_sale_day).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                        <td>{Number(this.state.report_sale_day[key].total_payment - this.state.report_sale_day[key].cost_sale_day).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                    </tr>

                </tbody>
            )
        }
        return table_sale_day
    }

    renderTableSaleMonth() {
        var table_sale_month = []

        // for(var x=0;x<10;x++)
        for (var key in this.state.report_sale_month) {
            table_sale_month.push(
                <tbody>
                    <tr>
                        <td><a onClick={this.onClickTableSaleMonth.bind(this, this.state.report_sale_month[key])} style={{ color: 'red' }}>{this.state.report_sale_month[key].month}</a></td>
                        <td>{Number(this.state.report_sale_month[key].total_payment).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                        <td>{Number(this.state.report_sale_month[key].cost_sale_month).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                        <td>{Number(this.state.report_sale_month[key].total_payment - this.state.report_sale_month[key].cost_sale_month).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                    </tr>
                </tbody>
            )
        }
        return table_sale_month


    }

    renderTableSaleYear() {
        var table_sale_year = []

        // for(var x=0;x<10;x++)
        for (var key in this.state.report_sale_year) {
            table_sale_year.push(
                <tbody>
                    <tr>
                        <td><a onClick={this.onClickTableSaleYear.bind(this, this.state.report_sale_year[key])} style={{ color: 'red' }}>{this.state.report_sale_year[key].year}</a></td>
                        <td>{Number(this.state.report_sale_year[key].total_payment).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                        <td>{Number(this.state.report_sale_year[key].cost_sale_year).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                        <td>{Number(this.state.report_sale_year[key].total_payment - this.state.report_sale_year[key].cost_sale_year).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
                    </tr>
                </tbody>
            )
        }
        return table_sale_year
    }



    async setSeg(number) {
        // console.log("number", number);
        this.setState({ seg: number })
    }

    renderSaleDay() {
        var arr = []
        if (this.state.report_sale_day != undefined) {
            var sum = 0

            for (var key in this.state.report_sale_day) {
                sum += this.state.report_sale_day[key].total_payment
            }
            arr.push(
                <Label>{Number(sum).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Label>
            )
            return arr
        } else {
            arr.push(
                <Label>0</Label>
            )
            return arr
        }
    }
    renderCostDay() {
        var arr = []
        if (this.state.report_sale_day != undefined) {
            var sum = 0

            for (var key in this.state.report_sale_day) {
                sum += this.state.report_sale_day[key].cost_sale_day
            }
            arr.push(
                <Label>{Number(sum).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Label>
            )
            return arr
        } else {
            arr.push(
                <Label>0</Label>
            )
            return arr
        }
    }
    renderProfitDay() {
        var arr = []
        if (this.state.report_sale_day != undefined) {
            var sum = 0

            for (var key in this.state.report_sale_day) {
                sum += this.state.report_sale_day[key].total_payment - this.state.report_sale_day[key].cost_sale_day
            }
            arr.push(
                <Label>{Number(sum).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Label>
            )
            return arr
        } else {
            arr.push(
                <Label>0</Label>
            )
            return arr
        }
    }
    renderSaleMonth() {
        var arr = []
        if (this.state.report_sale_month != undefined) {
            var sum = 0

            for (var key in this.state.report_sale_month) {
                sum += this.state.report_sale_month[key].total_payment
            }
            arr.push(
                <Label>{Number(sum).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Label>
            )
            return arr
        } else {
            arr.push(
                <Label>0</Label>
            )
            return arr
        }
    }
    renderCostMonth() {
        var arr = []
        if (this.state.report_sale_month != undefined) {
            var sum = 0

            for (var key in this.state.report_sale_month) {
                sum += this.state.report_sale_month[key].cost_sale_month
            }
            arr.push(
                <Label>{Number(sum).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Label>
            )
            return arr
        } else {
            arr.push(
                <Label>0</Label>
            )
            return arr
        }
    }
    renderProfitMonth() {
        var arr = []
        if (this.state.report_sale_month != undefined) {
            var sum = 0

            for (var key in this.state.report_sale_month) {
                sum += this.state.report_sale_month[key].total_payment - this.state.report_sale_month[key].cost_sale_month
            }
            arr.push(
                <Label>{Number(sum).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Label>
            )
            return arr
        } else {
            arr.push(
                <Label>0</Label>
            )
            return arr
        }
    }

    renderSaleYear() {
        var arr = []
        if (this.state.report_sale_year != undefined) {
            var sum = 0

            for (var key in this.state.report_sale_year) {
                sum += this.state.report_sale_year[key].total_payment
            }
            arr.push(
                <Label>{Number(sum).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Label>
            )
            return arr
        } else {
            arr.push(
                <Label>0</Label>
            )
            return arr
        }
    }
    renderCostYear() {
        var arr = []
        if (this.state.report_sale_year != undefined) {
            var sum = 0

            for (var key in this.state.report_sale_year) {
                sum += this.state.report_sale_year[key].cost_sale_year
            }
            arr.push(
                <Label>{Number(sum).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Label>
            )
            return arr
        } else {
            arr.push(
                <Label>0</Label>
            )
            return arr
        }
    }
    renderProfitYear() {
        var arr = []
        if (this.state.report_sale_year != undefined) {
            var sum = 0

            for (var key in this.state.report_sale_year) {
                sum += this.state.report_sale_year[key].total_payment - this.state.report_sale_year[key].cost_sale_year
            }
            arr.push(
                <Label>{Number(sum).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Label>
            )
            return arr
        } else {
            arr.push(
                <Label>0</Label>
            )
            return arr
        }
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
                                                    backgroundColor: this.state.seg === 1 ? '#b38d4d' : '#fff',
                                                    borderColor: this.state.seg === 1 ? '#b38d4d' : '#E0E0E0',
                                                    color: this.state.seg === 1 ? '#fff' : '#000',
                                                }}
                                                first
                                                active={this.state.seg === 1 ? true : false}
                                                onClick={() => this.setSeg(1)}

                                            >
                                                วัน </Button>
                                            <Button style={{
                                                backgroundColor: this.state.seg === 2 ? '#b38d4d' : '#fff',
                                                borderColor: this.state.seg === 2 ? '#b38d4d' : '#E0E0E0',
                                                color: this.state.seg === 2 ? '#fff' : '#000',
                                            }}
                                                active={this.state.seg === 2 ? true : false}
                                                onClick={() => this.setSeg(2)}
                                            >
                                                เดือน</Button>
                                            <Button style={{
                                                backgroundColor: this.state.seg === 3 ? '#b38d4d' : '#fff',
                                                borderColor: this.state.seg === 3 ? '#b38d4d' : '#E0E0E0',
                                                color: this.state.seg === 3 ? '#fff' : '#000',
                                            }}
                                                last
                                                active={this.state.seg === 3 ? true : false}
                                                onClick={() => this.setSeg(3)}
                                            >
                                                ปี</Button>
                                        </ButtonGroup>
                                        {/* <ButtonGroup size="lg">
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
                                        </ButtonGroup> */}
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
                                                <LineChart data={graph_sales_day_number} colors={["#800517"]} />
                                                <br></br>
                                                <br></br>
                                                <Row>
                                                    <Col lg='12'>
                                                        <div>
                                                            <Row>
                                                                <Col lg='8' style={{ textAlign: 'end' }}>

                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'end', fontSize: '12pt', fontWeight: 'bold' }}>
                                                                    <Label>ยอดขายทั้งหมด :</Label>
                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'start', fontSize: '12pt', fontWeight: 'bold' }}>
                                                                    {this.renderSaleDay()}
                                                                </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col lg='8' style={{ textAlign: 'end' }}>

                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'end', fontSize: '12pt', fontWeight: 'bold' }}>
                                                                    <Label>ต้นทุนทั้งหมด :</Label>
                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'start', fontSize: '12pt', fontWeight: 'bold' }}>

                                                                    {this.renderCostDay()}
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col lg='8' style={{ textAlign: 'end' }}>

                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'end', fontSize: '12pt', fontWeight: 'bold' }}>
                                                                    <Label>กำไรทั้งหมด :</Label>
                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'start', fontSize: '12pt', fontWeight: 'bold' }}>
                                                                    {this.renderProfitDay()}
                                                                </Col>
                                                            </Row>
                                                            <br></br>
                                                            <br></br>
                                                            <Row>
                                                                <Col>
                                                                    <Table striped>
                                                                        <thead>
                                                                            <tr>
                                                                                <th>วันที่</th>
                                                                                <th>เวลา</th>
                                                                                <th>ยอดรวม</th>
                                                                                <th>ต้นทุน</th>
                                                                                <th>กำไร</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {this.renderTableSaleDay()}
                                                                    </Table>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Modal isOpen={this.state.modal} toggle={this.toggle} size="lg"  >
                                                    <ModalHeader toggle={this.toggle} ></ModalHeader>
                                                    <ModalBody >
                                                        <div>
                                                            <Table striped>
                                                                <thead>
                                                                    <tr>
                                                                        <th>เวลา</th>
                                                                        <th>เมนู</th>
                                                                        <th>ราคาต่อหน่วย</th>
                                                                        <th>จำนวน</th>
                                                                        <th>ยอดรวม</th>
                                                                        <th>ต้นทุน</th>
                                                                        <th>กำไร</th>
                                                                    </tr>
                                                                </thead>
                                                                {this.saleDayDetail()}
                                                            </Table></div>
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button color="primary" onClick={this.toggle} style={{ width: 100, height: 40 }}>OK</Button>
                                                    </ModalFooter>
                                                </Modal>
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
                                                <ColumnChart data={graph_sales_month_number} colors={["#800517"]} />
                                                <br></br>
                                                <br></br>
                                                <Row>
                                                    <Col lg='12'>
                                                        <div>
                                                            <Row>
                                                                <Col lg='8' style={{ textAlign: 'end' }}>

                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'end', fontSize: '12pt', fontWeight: 'bold' }}>
                                                                    <Label>ยอดขายทั้งหมด :</Label>
                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'start', fontSize: '12pt', fontWeight: 'bold' }}>
                                                                    {this.renderSaleMonth()}
                                                                </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col lg='8' style={{ textAlign: 'end' }}>

                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'end', fontSize: '12pt', fontWeight: 'bold' }}>
                                                                    <Label>ต้นทุนทั้งหมด :</Label>
                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'start', fontSize: '12pt', fontWeight: 'bold' }}>

                                                                    {this.renderCostMonth()}
                                                                </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col lg='8' style={{ textAlign: 'end' }}>
                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'end', fontSize: '12pt', fontWeight: 'bold' }}>
                                                                    <Label>กำไรทั้งหมด :</Label>
                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'start', fontSize: '12pt', fontWeight: 'bold' }}>
                                                                    {this.renderProfitMonth()}
                                                                </Col>

                                                            </Row>
                                                            <br></br>
                                                            <br></br>
                                                            <Row>
                                                                <Col>
                                                                    <Table striped>
                                                                        <thead>
                                                                            <tr>
                                                                                <th>วันที่</th>
                                                                                <th>ยอดรวม</th>
                                                                                <th>ต้นทุน</th>
                                                                                <th>กำไร</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {this.renderTableSaleMonth()}
                                                                    </Table>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Modal isOpen={this.state.modal} toggle={this.toggle} size="lg"  >
                                                    <ModalHeader toggle={this.toggle} ></ModalHeader>
                                                    <ModalBody >
                                                        <div>
                                                            <Table striped>
                                                                <thead>
                                                                    <tr>
                                                                        {/* <th>เวลา</th> */}
                                                                        <th>เมนู</th>
                                                                        <th>จำนวน</th>
                                                                        <th>ยอดรวม</th>
                                                                        <th>ต้นทุน</th>
                                                                        <th>กำไร</th>
                                                                    </tr>
                                                                </thead>
                                                                {this.saleMonthDetail()}
                                                            </Table></div>
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button color="primary" onClick={this.toggle} style={{ width: 100, height: 40 }}>OK</Button>
                                                    </ModalFooter>
                                                </Modal>
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
                                                <BarChart data={graph_sales_year_number} colors={["#8D38C9"]}  />
                                                <br></br>
                                                <br></br>
                                                <Row>
                                                    <Col lg='12'>
                                                        <div>
                                                            <Row>
                                                                <Col lg='8' style={{ textAlign: 'end' }}>

                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'end', fontSize: '12pt', fontWeight: 'bold' }}>
                                                                    <Label>ยอดขายทั้งหมด :</Label>
                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'start', fontSize: '12pt', fontWeight: 'bold' }}>
                                                                    {this.renderSaleYear()}
                                                                </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col lg='8' style={{ textAlign: 'end' }}>
                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'end', fontSize: '12pt', fontWeight: 'bold' }}>
                                                                    <Label>ต้นทุนทั้งหมด :</Label>
                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'start', fontSize: '12pt', fontWeight: 'bold' }}>

                                                                    {this.renderCostYear()}
                                                                </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col lg='8' style={{ textAlign: 'end' }}>
                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'end', fontSize: '12pt', fontWeight: 'bold' }}>
                                                                    <Label>กำไรทั้งหมด :</Label>
                                                                </Col>
                                                                <Col lg='2' style={{ textAlign: 'start', fontSize: '12pt', fontWeight: 'bold' }}>
                                                                    {this.renderProfitYear()}
                                                                </Col>

                                                            </Row>
                                                            <br></br>
                                                            <br></br>
                                                            <Row>
                                                                <Col>
                                                                    <Table striped>
                                                                        <thead>
                                                                            <tr>
                                                                                <th>วันที่</th>
                                                                                <th>ยอดรวม</th>
                                                                                <th>ต้นทุน</th>
                                                                                <th>กำไร</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {this.renderTableSaleYear()}
                                                                    </Table>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Modal isOpen={this.state.modal} toggle={this.toggle} size="lg" >
                                                    {/* <ModalHeader toggle={this.toggle} >ยอดขายประจำวันที่: {this.state.payment_date}</ModalHeader> */}
                                                    <ModalBody >
                                                        <div>
                                                            <Table striped>
                                                                <thead>
                                                                    <tr>
                                                                        <th>วันที่</th>
                                                                        <th>ยอดรวม</th>
                                                                        <th>ต้นทุน</th>
                                                                        <th>กำไร</th>
                                                                    </tr>
                                                                </thead>
                                                                {this.saleYearDetail()}
                                                            </Table></div>
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button color="primary" onClick={this.toggle} style={{ width: 100, height: 40 }}>OK</Button>
                                                    </ModalFooter>
                                                </Modal>
                                            </Card>
                                        }
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