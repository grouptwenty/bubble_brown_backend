import React, { Component } from 'react';
import { Button, Table, Card, Pagination, PaginationLink, PaginationItem, CardHeader, Col, Row, CardImg, CardBody, CardTitle } from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import swal from 'sweetalert';
import GOBALS from '../../GOBALS'
import ImgDefault from '../../assets/img/default-user.png'

import NewsModel from '../../models/NewsModel'
const news_model = new NewsModel

class NewsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            news_list: [],
            refresh: false
        };
        this.onDelete = this.onDelete.bind(this);
    }


    async componentDidMount() {
        var news_list = await news_model.getNewsBy()
        console.log("news_list", news_list);
        this.setState({
            news_list: news_list.data
        })
    }

    async onDelete(code) {
        // console.log("code", code);
        swal({
            text: "คุณต้องการลบข้อมูลข่าวสาร ? ",
            icon: "warning",
            buttons: true,
            dengerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const res = news_model.deleteByCode(code)
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
        let news_list = this.state.news_list
        let tbody_news = []

        for (let i = 0; i < news_list.length; i++) {

            tbody_news.push(
                <tr>
                    <td width={50}><h6 className="textcenter2">{i + 1}</h6></td>
                    <td width={250}><img src={news_list[i].news_img != "" && news_list[i].news_img != null ? GOBALS.URL_IMG + "news/" + news_list[i].news_img : ImgDefault} className="imgCircel " /></td>
                    <td width={200}><h6>{news_list[i].news_title}</h6></td>
                    <td width={220}><h6 className="text-overflow">{news_list[i].news_description}</h6></td>
                    <td width={350}><h6 className="text-overflow">{news_list[i].news_detail}</h6></td>
                    <td width={80}>
                        <h6 className="textcenter2">
                            <NavLink exact to={`/news/update/` + news_list[i].news_code} style={{ width: '100%' }}>
                                <i class="fa fa-pencil-square-o" aria-hidden="true" style={{ color: 'blue', marginRight: 10 }}></i>
                            </NavLink>
                            <Link to={`#`} onClick={this.onDelete.bind(null, news_list[i].news_code)}>
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
                                จัดการข้อมูลข่าวสาร /  News Management
                                <NavLink exact to={`/news/insert`} style={{ width: '100%' }}>
                                    <button class="btn btn-primary btn-lg float-right boottom-header"><i class="fa fa-plus"></i> Add</button>
                                </NavLink>
                            </CardHeader>
                            <CardBody>
                                <Table responsive bordered>
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th></th>
                                            <th>พาดหัวข่าว</th>
                                            <th>บทย่อ</th>
                                            <th>เนื้อหาข่าว</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tbody_news}
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

export default (NewsView);