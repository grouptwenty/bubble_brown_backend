import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import Spinner from '../../../assets/components/spinner/Spinner'

class View extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            admin_list: [],
            refresh: false,
            loading: false,
        };
    }


    async componentDidMount() {

        this.setState({
            loading: true
        })

    }



    render() {

        const { loading } = this.state;
        return (
            <div className="animated fadeIn" style={{ backgroundColor: "#fff", backgroundSize: "cover", height: "100vh" }} >
                <Row>
                    <Col lg="12" lg="12" >
                        {loading == true ? <Spinner /> : ""}
                    </Col>
                </Row>
            </div>
        )
    }
}
export default (View);