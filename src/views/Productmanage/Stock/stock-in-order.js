import React, { Component } from 'react';
import {
    Button,
    Col,
    Row,
    Input,
    Card,
    CardBody,
    CardFooter,
    Modal, ModalBody, ModalFooter, ListGroup, ListGroupItem, CardHeader
} from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import StockModel from '../../../models/StockModel'

const stock_model = new StockModel


class detailView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            brand: [],
            machine_type: [],
            refresh: false,
            stock: [],

        };

    }

    async componentDidMount() {
        const code = this.props.match.params.code
        var stock_order = await stock_model.getStockByProduct(code)
        console.log(stock_order);


        // this.setState({
        //     stock: stock.data,

        // })
        // console.log("this.state.code",this.state.code);
    }




    render() {


        return (

       <div>
55555555555
       </div>
        );

    }
}


export default (detailView);