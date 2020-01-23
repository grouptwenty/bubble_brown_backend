import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, FormGroup, CardHeader, CardFooter, Col, Row, CardImg, CardBody, CardTitle, Input, Label, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link, } from 'react-router-dom';
import { fonts } from 'pdfmake/build/pdfmake';
import swal from 'sweetalert';
import GOBALS from '../../GOBALS'

import AboutModel from '../../models/AboutModel'

const about_model = new AboutModel

class editView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            province: [],
            imagePreviewUrl: '',
            file: '',
            refresh: false,
            about_img_old: null,
            about_password_old: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goBack = this.goBack.bind(this);
    }
    goBack() {
        this.props.history.goBack();
    }


    async componentDidMount() {
        const about_data = await about_model.getAboutBy();
        console.log("about_data :", about_data);

        this.setState({
            about: about_data.data
        })

    }

    renderAbout() {
        if (this.state.about != undefined) {
            let about_list = []

            for (let i = 0; i < this.state.about.length; i++) {
                about_list.push(
                    <option value={this.state.about[i].about_code}>{this.state.about[i].about_name_th}</option>
                )
            }
            return about_list;
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        var arr = {};

        for (let name of data.keys()) {
            arr[name] = form.elements[name.toString()].value;
        }
        console.log("arr :", arr);

        var res = await about_model.updateAboutMainBranchByCode(arr);
        //   console.log(res)
        if (res.data) {
            swal({
                title: "Good job!",
                text: "update about Ok",
                icon: "success",
                button: "Close",
            });
        // this.props.history.push('/about/')
        }
    }

    render() {

        return (
            <div className="animated fadeIn" style={{padding:'15px'}}>
                <Row>
                    <Col>
                        <Card>
                            <Form onSubmit={this.handleSubmit} id="myForm">
                                <CardHeader>
                                    ตั้งค่าสาขาหลัก
                                </CardHeader>
                                <CardBody>

                                    <Row className="center" style={{ marginBottom: 10 }}>
                                        <Col lg="2" md="2" sm="2" className="right" >
                                            สาขาหลัก :
                                                    </Col>
                                        <Col lg="5" md="5" sm="5">
                                            <Input type="select" id="about_code" name="about_code" class="form-control" >
                                                <option value="">Select</option>
                                                {this.renderAbout()}
                                            </Input>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <Button variant="secondary" size="lg" onClick={this.goBack}>ย้อนกลับ</Button>
                                    <Button type="reset" size="lg" color="danger">Reset</Button>
                                    <Button type="submit " size="lg" color="success">Save</Button>
                                </CardFooter>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div >
        )
    }
}

const mapStatetoProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStatetoProps)(editView);