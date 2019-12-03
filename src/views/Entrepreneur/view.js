import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';
import GOBALS from '../../GOBALS'
import ImgDefault from '../../assets/img/default-user.png'
import EntrepreneurModel from '../../models/EntrepreneurModel'

const entrepreneur_model = new EntrepreneurModel

class EntrepreneurView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            entrepreneur_list: [],
            refresh: false
        };
        this.onDelete = this.onDelete.bind(this);
    }


    async componentDidMount() {
        var entrepreneur_list = await entrepreneur_model.getEntrepreneurBy()
        // console.log("entrepreneur_list", entrepreneur_list);

        this.setState({
            entrepreneur_list: entrepreneur_list.data
        })
    }

    async onDelete(code) {
        // console.log("code", code);
        swal({
            text: "คุณต้องการลบข้อมูลผู้ประกอบการ ? ",
            icon: "warning",
            buttons: true,
            dengerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const res = entrepreneur_model.deleteByCode(code)
                        .then((req) => {
                            if (req.data == true) {
                                this.componentDidMount();
                                swal("success Deleted! ", {
                                    icon: "success",

                                });
                            } else {
                                swal("success Deleted! ", {
                                    icon: "error",

                                });
                            }

                        })

                }

            });

    }

    render() {
        let entrepreneur_list = this.state.entrepreneur_list
        let tbody_entre = []

        for (let i = 0; i < entrepreneur_list.length; i++) {

            tbody_entre.push(
                <tr>
                    <td width={50}><h6 className="textcenter2">{i + 1}</h6></td>
                    <td width={100}><h6 className="textcenter2">{entrepreneur_list[i].entrepreneur_code}</h6></td>
                    <td width={240}><h6 className="textcenter2"><img src={entrepreneur_list[i].entrepreneur_img != "" && entrepreneur_list[i].entrepreneur_img != null ? GOBALS.URL_IMG + "entrepreneur/" + entrepreneur_list[i].entrepreneur_img : ImgDefault} className="imgCircel" /></h6></td>
                    <td width={240}><h6 className="textcenter2">{entrepreneur_list[i].entrepreneur_name_en}</h6></td>
                    <td width={330}><h6 className="textcenter2">{entrepreneur_list[i].entrepreneur_address}</h6></td>
                    <td width={80}>
                        <h6 className="textcenter2">
                            <NavLink exact to={`/entrepreneur/update/` + entrepreneur_list[i].entrepreneur_code} style={{ width: '100%' }}>
                                <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ color: 'blue', marginRight: 15 }}></i>
                            </NavLink>
                            <Link to={`#`} onClick={this.onDelete.bind(null, entrepreneur_list[i].entrepreneur_code)}>
                                <i class="fa fa-times" aria-hidden="true" style={{ color: 'red' }}></i>
                            </Link>
                        </h6>
                    </td>
                </tr>
            )

        }
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                จัดการข้อมูลผู้ประกอบการ /  Entrepreneur Management
                                <NavLink exact to={`/entrepreneur/insert`} style={{ width: '100%' }}>
                                    <button class="btn btn-primary btn-lg float-right boottom-header" name="add_entrepreneur">
                                        <i class="fa fa-plus" ></i>
                                        Add
                                    </button>
                                </NavLink>
                            </CardHeader>
                            <CardBody>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th>รหัสลูกค้า</th>
                                            <th></th>
                                            <th>ชื่อผู้ประกอบการ</th>
                                            <th>ที่อยู่</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tbody_entre}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default (EntrepreneurView);