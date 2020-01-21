import React, { Component } from 'react';
import { connect } from 'react-redux';
export default class MenuComponent {
    constructor(props) {
    }
    renderMenu(user) {
        console.log("userrrr", user);

        var value = []
        if (user.user_position == 'แอดมิน' || user.user_position == 'เจ้าของร้าน') {
            value = [
                {
                    title: true,
                    name: 'Bubble Brown Coffee',
                    wrapper: {
                        element: '',
                        attributes: {}
                    },
                    class: ''
                },
                {
                    name: 'จองโต๊ะ',
                    url: '/booking/',
                    icon: 'icon-list',
                },
                {
                    name: 'สั่งอาหาร',
                    url: '/order/',
                    icon: 'icon-list',
                },
                {
                    name: 'บิล',
                    url: '/bill/',
                    icon: 'icon-list',
                },
                {
                    name: 'โปรโมชัน  ',
                    url: '/promotion/',
                    icon: 'icon-list',
                },

                {
                    name: 'เมนู  ',
                    url: '/menu/',
                    icon: 'icon-list',
                },

                {
                    name: 'จัดการข้อมูลสินค้า',
                    url: '/product-manage/',
                    icon: 'icon-list',
                    children: [
                        {
                            name: 'สินค้า',
                            url: '/product-manage/product',
                        },
                        {
                            name: 'สต๊อกเข้า',
                            url: '/product-manage/stock-in',
                        },
                        {
                            name: 'จัดการสูตร',
                            url: '/product-manage/recipe',
                        },
                    ],
                },
                {
                    name: 'จัดการแท็บ',
                    url: '/tap-manage/',
                    icon: 'icon-list',
                    children: [
                        {
                            name: 'แท็บประเภทเมนู',
                            url: '/tap-manage/menu_type',
                        },
                        {
                            name: 'แท็บประเภทสินค้า',
                            url: '/tap-manage/product_type',
                        },
                        {
                            name: 'แท็บโซน',
                            url: '/tap-manage/zone',
                        },
                    ],
                },

                {
                    name: 'ลูกค้า',
                    url: '/customer/',
                    icon: 'icon-list',
                },
                {
                    name: 'พนักงาน',
                    url: '/user/',
                    icon: 'icon-list',
                },
                {
                    name: 'รายงาน',
                    url: '/report/',
                    icon: 'icon-list',
                    children: [
                        {
                            name: 'รายงานยอดขาย',
                            url: '/report/report_sale',
                        },
                        {
                            name: 'รายงานยอดขายตามประเภท',
                            url: '/report/report_sale_type',
                        },
                        {
                            name: 'รายงานเมนูขายดี',
                            url: '/report/report_best_sale/',
                        },
                    ],
                },
                {
                    name: 'แก้ไขข้อมูลส่วนตัว',
                    url: '/about/',
                    icon: 'icon-pencil',
                },
            ]
        } else {
            value = [
                {
                    title: true,
                    name: 'Bubble Brown Coffee',
                    wrapper: {
                        element: '',
                        attributes: {}
                    },
                    class: ''
                },
                {
                    name: 'สั่งอาหาร',
                    url: '/order/',
                    icon: 'icon-list',
                },
                {
                    name: 'บิล',
                    url: '/bill/',
                    icon: 'icon-list',
                },
                {
                    name: 'จองโต๊ะ',
                    url: '/booking/',
                    icon: 'icon-pencil',
                },
            ]
        }
        return value;
    }

}

const mapStatetoProps = (state) => {
    return {
        user: state.user
    }
}
connect(mapStatetoProps)