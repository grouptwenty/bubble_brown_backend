import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import AdminModel from '../../models/AdminModel';

const admin_model = new AdminModel 

class HomeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            admin_list:[],
            refresh: false
        };
    }


    async componentDidMount() {


       
    }



    render() {


        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                             
                                {/* <NavLink exact to={`/sale/sale-order/insert`} style={{ width: '100%' }}>
                                    <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i> Add</button>
                                </NavLink> */}
                            </CardHeader>
                            <CardBody>
                            
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default (HomeView);