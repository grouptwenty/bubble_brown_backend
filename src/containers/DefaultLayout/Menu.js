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
                name: 'เมนู',
                url: '/menu/',
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
                name: 'โต๊ะอาหาร / โซน',
                url: '/table/',
                icon: 'icon-list',
            },

            // {
            //     name: 'ผู้ประกอบการ',
            //     url: '/entrepreneur/',
            //     icon: 'icon-briefcase',
            // },

            // {
            //     name: 'ร้านซักผ้า',
            //     url: '/laundry/',
            //     icon: 'icon-basket',
            // },
            // {
            //     name: 'จัดการข้อมูลเครื่องซักผ้า',
            //     url: '/machine-manage/',
            //     icon: 'icon-pencil',
            //     children: [
            //         {
            //             name: 'แบรนด์เครื่องซักผ้า',
            //             url: '/machine-manage/machine-brand',
            //         },
            //         {
            //             name: 'รุ่นเครื่องซักผ้า',
            //             url: '/machine-manage/machine-generation',
            //         },
            //         {
            //             name: 'ประเภทเครื่อง',
            //             url: '/machine-manage/machine-type',
            //         },
            //         {
            //             name: 'โปรเเกรมการซัก',
            //             url: '/machine-manage/machine-program',
            //         },
            //     ],
            // },
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