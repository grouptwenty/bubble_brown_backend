import React, { Component } from 'react';
export default class MenuComponent {
    constructor(props) {
    }
    renderMenu() {
        var value = []
        // value.push({
        //     title: true,
        //     name: 'Home',
        //     wrapper: {
        //         element: '',
        //         attributes: {}
        //     },
        //     class: 'nav-dropdown'
        // })

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
                icon: 'icon-pencil',
                children: [
                    {
                        name: 'สินค้า',
                        url: '/product-manage/product',
                    },
                    {
                        name: 'จัดการสูตร',
                        url: '/product-manage/recipe',
                    },
                    {
                        name: 'สต๊อกเข้า',
                        url: '/product-manage/stock-in',
                    },
                    // {
                    //     name: 'สต๊อกออก',
                    //     // url: '/product-manage/stock-out',
                    // },
                ],
            },
            {
                name: 'จัดการแท็บ',
                url: '/tap-manage/',
                icon: 'icon-pencil',
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
                    // {
                    //     name: 'สต๊อกเข้า',
                    //     url: '/product-manage/stock-in',
                    // },
                    // {
                    //     name: 'สต๊อกออก',
                    //     // url: '/product-manage/stock-out',
                    // },
                ],
            },

            {
                name: 'ลูกค้า',
                url: '/customer/',
                icon: 'icon-briefcase',
            },
            {
                name: 'พนักงาน',
                url: '/user/',
                icon: 'icon-briefcase',
            },

            {
                name: 'จองโต๊ะ',
                url: '/booking/',
                icon: 'icon-pencil',
            },

            {
                name: 'รายงาน',
                url: '/dashboard/',
                icon: 'icon-pencil',
            },
            // {

            // {
            //     name: 'รายการเครื่องซักผ้าแจ้งเสีย',
            //     url: '/repair/',
            //     icon: 'icon-wrench',
            // },

            // {
            //     name: 'ข่าวสาร',
            //     url: '/news/',
            //     icon: 'icon-book-open',
            // },

            // {
            //     name: 'ติดต่อเรา',
            //     url: '/contact/',
            //     icon: 'icon-speech',
            // },


            // {
            //     name: 'เกี่ยวกับเรา',
            //     url: '/about/',
            //     icon: 'icon-info',
            // },

            // {
            //     name: 'วิธีใช้งาน',
            //     url: '/instruction/',
            //     icon: 'icon-screen-tablet',
            // },

            // {
            //     name: 'ตั้งค่า',
            //     url: '/setting/',
            //     icon: 'icon-settings',
            // },

            // {
            //     name: 'สิทธิ์การใช้งาน',
            //     url: '/license/',
            //     icon: 'icon-list',
            // },

            // {
            //     name: 'รายงาน ',
            //     url: '/report',
            //     icon: 'icon-list',
            // },

            // {
            //     name: 'เงื่อนไข',
            //     url: '/agreement',
            //     icon: 'icon-list',
            // },


        ]

        return value;
    }



}