import React from 'react';

const HomeAdmin = React.lazy(() => import('./views/Admin'));
const Order = React.lazy(() => import('./views/Order'));
const Bill = React.lazy(() => import('./views/Bill'));
const Promotion = React.lazy(() => import('./views/Promotion'));
const Table = React.lazy(() => import('./views/Table'));
const Recipe = React.lazy(() => import('./views/Productmanage/Recipe'))
const Stock = React.lazy(() => import('./views/Productmanage/Stock'))
const Product = React.lazy(() => import('./views/Productmanage/Product'))
const Customer = React.lazy(() => import('./views/Customer'))
const User = React.lazy(() => import('./views/User'))
const Menu = React.lazy(() => import('./views/Menu'))
const Booking = React.lazy(() => import('./views/Booking'));
const ReportSale = React.lazy(() => import('./views/Report/ReportSale'));
const ReportSaleType = React.lazy(() => import('./views/Report/ReportSaleType'));
const ReportBestSale = React.lazy(() => import('./views/Report/ReportBestSale'));
const Menutype = React.lazy(() => import('./views/Tapmanage/Menutype'));
const Producttype = React.lazy(() => import('./views/Tapmanage/Producttype'));
const Zone = React.lazy(() => import('./views/Tapmanage/Zone'));
const About = React.lazy(() => import('./views/About'));





const routes = [
    { path: '/admin/', name: 'Admin', component: HomeAdmin },
    { path: '/order/', name: 'order', component: Order },
    { path: '/bill/', name: 'Bill', component: Bill },
    { path: '/promotion/', name: 'Promotion', component: Promotion },
    { path: '/table/', name: 'Table', component: Table },
    { path: '/product-manage/recipe', name: 'Recipe', component: Recipe },
    { path: '/product-manage/stock-in', name: 'Stock', component: Stock },
    { path: '/product-manage/product', name: 'Product', component: Product },
    { path: '/tap-manage/menu_type', name: 'Menutype', component: Menutype },
    { path: '/tap-manage/product_type', name: 'Product', component: Producttype },
    { path: '/tap-manage/zone', name: 'Zone', component: Zone },
    { path: '/customer/', name: 'Customer', component: Customer },
    { path: '/user/', name: 'User', component: User },
    { path: '/menu/', name: 'Menu', component: Menu },
    { path: '/booking/', name: 'Booking', component: Booking },
    { path: '/report/report_sale/', name: 'ReportSale', component: ReportSale },
    { path: '/report/report_sale_type/', name: 'ReportSaleType', component: ReportSaleType },
    { path: '/report/report_best_sale/', name: 'ReportBestSale', component: ReportBestSale },
    { path: '/about/', name: 'about', component: About },
]
export default routes;