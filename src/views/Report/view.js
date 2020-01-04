import React, { Component } from 'react';
import { Button, Table, Card, ButtonGroup, CardText, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';
class ReportView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            seg: 1,
            refresh: false
        };
        this.setSeg = this.setSeg.bind(this);

    }


    async componentDidMount() {

    }

    async setSeg(number) {
        console.log("number", number);

        this.setState({ seg: number })
    }




    render() {

        return (

                <div className="animated fadeIn" style={{ margin: '20px'}}>
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
                                                    <CardTitle>รายงานยอดขาย</CardTitle>
                                                    <CardText>วันนนนน</CardText>
                                                </Card>

                                            }

                                            {this.state.seg === 2 &&

                                                <Card body>
                                                    <CardTitle>รายงานยอดขาย</CardTitle>
                                                    <CardText>เดือนนนน</CardText>
                                                </Card>
                                            }

                                            {this.state.seg === 3 &&

                                                <Card body>
                                                    <CardTitle>รายงานยอดขาย</CardTitle>
                                                    <CardText>ปี</CardText>
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

export default (ReportView);